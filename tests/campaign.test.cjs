const test = require('node:test'), assert = require('node:assert/strict');
const c = require('./load-module.cjs')('app/lib/campaign.ts');
const plain = value => JSON.parse(JSON.stringify(value));
const query = content => new URLSearchParams({ utm_source: 'linkedin', utm_medium: 'organic_social', utm_campaign: 'nouveau_wharf', utm_content: content }).toString();
const now = 1800000000000;

test('Every planned personal/company post resolves to its own account and publication', () => {
  for (const [account, prefix, count] of [['profil_jacques', 'p', 12], ['page_wharf', 'e', 6]]) {
    for (let n = 1; n <= count; n++) {
      const publication = prefix + String(n).padStart(2, '0');
      const content = `${account}_${publication}`;
      assert.equal(c.campaignContent(query(content)), content);
      assert.deepEqual(plain(c.campaignEventData({ content, at: now }, now)), { source: 'linkedin', medium: 'organic_social', campaign: 'nouveau_wharf', account, publication });
    }
  }
  for (const content of ['profil_jacques', 'page_wharf']) assert.equal(c.campaignContent(query(content)), content);
});

test('Unrecognised, mismatched and duplicate parameters cannot become campaign data', () => {
  for (const content of ['private@example.com', 'profil_jacques_e01', 'page_wharf_p01', 'profil_jacques_p00', 'profil_jacques_p13', 'page_wharf_e07', 'profil_jacques_p01-secret', 'https://private/token']) {
    assert.equal(c.campaignContent(query(content)), null);
  }
  const valid = query('profil_jacques_p01');
  for (const invalid of ['', valid.replace('linkedin', 'google'), valid.replace('organic_social', 'email'), valid.replace('nouveau_wharf', 'private'), valid + '&utm_content=page_wharf_e01', valid + '&utm_source=private']) assert.equal(c.campaignContent(invalid), null);
});

test('Unrelated query data and untrusted stored properties never enter the payload', () => {
  const content = c.campaignContent(query('page_wharf_e03') + '&email=private%40example.com&message=secret&token=private');
  const record = c.readCampaign(JSON.stringify({ content, at: now, visitSent: false, email: 'private@example.com', url: '/contact?token=secret', account: 'spoofed' }), now);
  assert.deepEqual(plain(record), { content: 'page_wharf_e03', at: now, visitSent: false });
  assert.deepEqual(plain(c.campaignEventData(record, now)), { source: 'linkedin', medium: 'organic_social', campaign: 'nouveau_wharf', account: 'page_wharf', publication: 'e03' });
});

test('Attribution survives an unmarked internal navigation and reload without another arrival', () => {
  const landing = c.resolveCampaign('profil_jacques_p04', null, now);
  const sent = { ...landing, visitSent: true };
  const restored = c.readCampaign(JSON.stringify(sent), now + 1000);
  assert.deepEqual(plain(c.resolveCampaign(null, restored, now + 2000)), plain(sent));
  assert.deepEqual(plain(c.resolveCampaign('profil_jacques_p04', restored, now + 3000)), plain(sent));
});

test('A different marked post replaces attribution and requires one new arrival event', () => {
  const previous = { content: 'profil_jacques_p01', at: now, visitSent: true };
  assert.deepEqual(plain(c.resolveCampaign('page_wharf_e02', previous, now + 1000)), { content: 'page_wharf_e02', at: now + 1000, visitSent: false });
});

test('Expired, future, malformed and fabricated records lose attribution', () => {
  for (const value of [null, 'broken', '{}', JSON.stringify({ content: 'page_wharf_e01', at: now + 1 }), JSON.stringify({ content: 'page_wharf_e01', at: now - c.CAMPAIGN_MAX_AGE }), JSON.stringify({ content: 'private', at: now }), JSON.stringify({ content: 'page_wharf_e01', at: 'secret' })]) assert.equal(c.readCampaign(value, now), null);
  const expired = { content: 'page_wharf_e01', at: now - c.CAMPAIGN_MAX_AGE, visitSent: true };
  assert.deepEqual(plain(c.campaignEventData(expired, now)), {});
  assert.equal(c.resolveCampaign(null, expired, now), null);
  assert.deepEqual(plain(c.resolveCampaign('page_wharf_e01', expired, now)), { content: 'page_wharf_e01', at: now, visitSent: false });
});
