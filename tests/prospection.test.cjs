const test = require('node:test'), assert = require('node:assert/strict');
const { mkdtemp, rm } = require('node:fs/promises'), os = require('node:os'), path = require('node:path');
const load = require('./load-module.cjs');
const { ProspectStore, emailAddress } = load('app/lib/prospection.ts');
async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'wharf-prospection-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const store = new ProspectStore(dir);
  const contact = (email = 'buyer@example.com', date = '2026-10-14') => store.addContact({ name: 'Test', company: 'Example', role: 'Communication', email, source: 'https://example.com/team', collectedAt: date, qualified: true }, date + 'T09:00:00Z');
  return { store, contact };
}
test('Rejects multi-recipient and header-injection addresses', () => {
  for (const value of ['one@example.com,two@example.com', 'one@example.com\r\nBcc:other@example.com', 'Name <one@example.com>']) assert.throws(() => emailAddress(value));
});
test('Concurrent reservations produce one attempt and preserve the same message ID', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const message = await store.saveDraft({ contactId: id, subject: 'A useful idea', body: 'Hello Test.' });
  const results = await Promise.allSettled([store.reserve(message, 'contact@bywharf.com', '2026-10-14T10:00:00Z'), store.reserve(message, 'contact@bywharf.com', '2026-10-14T10:00:00Z')]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal((await store.snapshot()).messages[0].status, 'sending');
});
test('Opposition blocks a saved draft and prevents re-importing the email', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'A useful idea', body: 'Hello Test.' });
  await store.setStatus(id, 'opposed');
  await assert.rejects(store.reserve(draft, 'contact@bywharf.com'), /exclu/);
  await assert.rejects(contact(), /opposition/);
});
test('Daily cap is durable and shared by separate store instances', async t => {
  const { store, contact } = await fixture(t);
  for (let i = 0; i < 4; i++) {
    const id = await contact('buyer' + i + '@example.com');
    const draft = await store.saveDraft({ contactId: id, subject: 'A useful idea', body: 'Hello Test.' });
    if (i < 3) { await store.reserve(draft, 'contact@bywharf.com', '2026-10-14T10:00:00Z'); await store.finish(draft, true, '2026-10-14T10:00:00Z'); }
    else await assert.rejects(store.reserve(draft, 'contact@bywharf.com', '2026-10-14T11:00:00Z'), /trois emails/);
  }
});
test('Follow-ups use working days, and do not skip the first message', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const first = await store.saveDraft({ contactId: id, subject: 'Original subject', body: 'Hello Test.' });
  await store.reserve(first, 'contact@bywharf.com', '2026-10-14T10:00:00Z'); await store.finish(first, true, '2026-10-14T10:00:00Z');
  const second = await store.saveDraft({ contactId: id, subject: 'Follow-up', body: 'A further idea.' });
  await assert.rejects(store.reserve(second, 'contact@bywharf.com', '2026-10-20T10:00:00Z'), /pas encore due/);
  const sent = await store.reserve(second, 'contact@bywharf.com', '2026-10-21T10:00:00Z');
  assert.equal(sent.subject, 'Re: Original subject'); assert.equal(sent.references.length, 1);
  await store.finish(second, true, '2026-10-21T10:00:00Z');
  const third = await store.saveDraft({ contactId: id, subject: 'Last note', body: 'Thank you.' });
  await assert.rejects(store.reserve(third, 'contact@bywharf.com', '2026-10-28T10:00:00Z'), /pas encore due/);
  await store.reserve(third, 'contact@bywharf.com', '2026-10-29T10:00:00Z'); await store.finish(third, true);
  await assert.rejects(store.saveDraft({ contactId: id, subject: 'Fourth', body: 'More.' }), /terminée/);
});
test('Preview adds source, legal identity and opposition without tracking', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'Idea', body: 'Hello Test.' });
  const preview = await store.preview(draft, 'https://bywharf.com');
  assert.match(preview.text, /SIREN 513 572 883/); assert.match(preview.text, /https:\/\/example.com\/team/);
  assert.match(preview.text, /desinscription\/[a-f0-9]{64}/);
  assert.doesNotMatch(preview.text, /<img|utm_/);
  assert.equal(Object.hasOwn((await store.snapshot()).contacts[0], 'token'), false);
});
test('Replies stop relances and uncertain SMTP outcomes cannot be retried', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'Idea', body: 'Hello Test.' });
  await store.reserve(draft, 'contact@bywharf.com', '2026-10-14T10:00:00Z'); await store.finish(draft, false);
  await assert.rejects(store.reserve(draft, 'contact@bywharf.com'), /déjà été traité/);
  await assert.rejects(store.saveDraft({ contactId: id, subject: 'Retry', body: 'More.' }), /vérifié manuellement/);
  await store.setStatus(id, 'replied');
  await assert.rejects(store.saveDraft({ contactId: id, subject: 'Retry', body: 'More.' }), /exclu/);
});
test('SMTP is disabled until both explicit configuration gates are enabled', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'Idea', body: 'Hello Test.' });
  let sent = 0;
  const { sendDraft } = load('app/lib/gandi-mail.ts', { 'app/lib/prospection.ts': { ...load('app/lib/prospection.ts'), prospectStore: store } });
  await assert.rejects(sendDraft(draft, '', { store, env: {}, send: async () => { sent++; return { accepted: [] }; } }), /désactivé/);
  assert.equal(sent, 0); assert.equal((await store.snapshot()).messages[0].status, 'draft');
});
test('Authenticated API denies clients and cross-origin writes before touching data', async () => {
  let touched = false;
  const overrides = {
    'next-auth': { getServerSession: async () => ({ user: { role: 'client' } }) },
    'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
    'app/lib/auth.ts': { authOptions: {} },
    'app/lib/prospection.ts': { ProspectError: class extends Error {}, prospectStore: { snapshot() { touched = true; } } },
    'app/lib/gandi-mail.ts': { mailSettings() {}, sendDraft() { touched = true; } },
  };
  assert.equal((await load('app/api/prospection/route.ts', overrides).GET()).status, 403);
  overrides['next-auth'] = { getServerSession: async () => ({ user: { role: 'admin' } }) };
  const req = { headers: new Headers({ origin: 'https://other.example' }), nextUrl: new URL('https://bywharf.com/api/prospection') };
  assert.equal((await load('app/api/prospection/route.ts', overrides).POST(req)).status, 403);
  assert.equal(touched, false);
});
test('Scanner GET cannot register an opposition; POST is required', async () => {
  let touched = false;
  class Response { constructor(body, options) { this.body = body; Object.assign(this, options); } }
  const route = load('app/desinscription/[token]/route.ts', {
    'next/server': { NextResponse: Response },
    'app/lib/prospection.ts': { prospectStore: { unsubscribe() { touched = true; } } },
  });
  const token = 'a'.repeat(64);
  const get = await route.GET({}, { params: Promise.resolve({ token }) });
  assert.match(get.body, /form method="post"/); assert.equal(touched, false);
});

test('Changed draft cannot be sent from an older preview', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'First version', body: 'Hello Test.' });
  const preview = await store.preview(draft, 'https://bywharf.com');
  await store.saveDraft({ contactId: id, subject: 'Edited by another tab', body: 'Different message.' });
  await assert.rejects(store.reserve(draft, 'contact@bywharf.com', '2026-10-14T10:00:00Z', preview.reviewHash), /a changé/);
  assert.equal((await store.snapshot()).messages[0].status, 'draft');
});

test('Fake SMTP acceptance is recorded once; repeat send does not call transport', async t => {
  const { store, contact } = await fixture(t); const id = await contact();
  const draft = await store.saveDraft({ contactId: id, subject: 'An idea', body: 'Hello Test.' });
  const preview = await store.preview(draft, 'https://bywharf.com');
  let calls = 0;
  const { sendDraft } = load('app/lib/gandi-mail.ts');
  const options = { store, env: { GANDI_SMTP_USER: 'contact@bywharf.com', GANDI_SMTP_PASSWORD: 'test-only-not-a-credential', PROSPECTION_SEND_ENABLED: 'true', PROSPECTION_NOTICE_READY: 'true' }, send: async mail => {
    calls++; assert.equal(mail.to, 'buyer@example.com'); assert.equal(mail.text, preview.text); return { accepted: ['buyer@example.com'] };
  } };
  await sendDraft(draft, preview.reviewHash, options);
  await assert.rejects(sendDraft(draft, preview.reviewHash, options), /déjà été traité/);
  assert.equal(calls, 1); assert.equal((await store.snapshot()).messages[0].status, 'accepted');
});
