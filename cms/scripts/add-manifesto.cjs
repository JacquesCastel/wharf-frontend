// Add only this page's missing text blocks, preserving all existing CMS edits.
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const project = process.cwd();
const req = require('node:module').createRequire(path.join(project, 'package.json'));
const { createStrapi } = req('@strapi/strapi');
const uid = 'api::site-page.site-page';
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const backup = process.argv[3];
assert.ok(backup, 'Provide a private backup path');
assert.ok(Object.keys(input).length && Object.keys(input).every(key => key.startsWith('manifesto-')));
assert.ok(Object.values(input).every(item => typeof item.label === 'string' && typeof item.value === 'string' && item.value.trim()), 'Non-empty text and label required');
const contract = req(path.join(project, 'dist/src/data/page-copy.json'));
assert.ok(Object.keys(input).every(key => key in contract.global.texts), 'Install the updated page-copy contract before importing manifesto texts');
const clean = entry => ({ nom: entry.nom, slug: entry.slug, seoTitle: entry.seoTitle, seoDescription: entry.seoDescription, texts: entry.texts.map(({ repere, libelle, texte }) => ({ repere, libelle, texte })) });
(async () => {
  const app = await createStrapi({ appDir: project, distDir: path.join(project, 'dist') }).load();
  try {
    const docs = app.documents(uid);
    const published = await docs.findFirst({ filters: { slug: 'global' }, status: 'published', populate: ['texts'] });
    assert.ok(published, 'Published global page required');
    const draft = await docs.findOne({ documentId: published.documentId, status: 'draft', populate: ['texts'] });
    assert.ok(draft, 'Draft global page required');
    const existing = new Map(published.texts.map(item => [item.repere, item]));
    const missing = Object.entries(input).filter(([key]) => !existing.has(key));
    if (!missing.length) { console.log('MANIFESTO_TEXTS_ALREADY_PRESENT'); return; }
    const texts = [...clean(published).texts, ...missing.map(([repere, item]) => ({ repere, libelle: item.label, texte: item.value }))];
    const expected = { ...clean(published), texts };
    const backupContent = { documentId: published.documentId, ...clean(published) };
    const stagedByThisScript = JSON.stringify(clean(draft)) === JSON.stringify(expected);
    if (stagedByThisScript) {
      assert.deepEqual(JSON.parse(fs.readFileSync(backup, 'utf8')), backupContent, 'Only resume this exact backed-up update');
    } else {
      assert.deepEqual(clean(draft), clean(published), 'Unpublished CMS edits exist; preserve them and stop');
      fs.writeFileSync(backup, JSON.stringify(backupContent, null, 2), { mode: 0o600, flag: 'wx' });
      await docs.update({ documentId: draft.documentId, data: { texts } });
    }
    await docs.publish({ documentId: draft.documentId });
    const after = await docs.findOne({ documentId: draft.documentId, status: 'published', populate: ['texts'] });
    assert.deepEqual(clean(after), expected, 'Published content must exactly match additive update');
    console.log('MANIFESTO_TEXTS_PUBLISHED', missing.length);
  } finally { await app.destroy(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
