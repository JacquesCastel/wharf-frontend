const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const file = path.resolve(__dirname, '../app/lib/project-editorial.ts');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context, { filename: file });
const { CAFE_PROJECT_ID, getProjectEditorial } = context.exports;
const paragraph = text => ({ __component: 'bloc.texte-bloc', contenu: [{ type: 'paragraph', children: [{ type: 'text', text }] }] });

test('enrichment is restricted to the known project and leaves the CMS record intact', () => {
  const source = { documentId: CAFE_PROJECT_ID, publishedAt: '2025-11-10', contenu: [paragraph('un texte pour voir')] };
  const before = JSON.stringify(source);
  const enriched = getProjectEditorial(source);
  assert.ok(enriched.summary.includes('autopromotion'));
  assert.equal(enriched.videoUrl, 'https://www.youtube-nocookie.com/embed/3crnc6Hr4vk');
  assert.equal(JSON.stringify(source), before);
  assert.equal(getProjectEditorial({ ...source, documentId: 'different-project' }), undefined);
});

test('completed CMS copy takes precedence, including content nested in a link', () => {
  assert.equal(getProjectEditorial({ documentId: CAFE_PROJECT_ID, contenu: [paragraph('La fiche écrite dans le CMS.')] }), undefined);
  const linkText = { __component: 'bloc.texte-bloc', contenu: [{ type: 'paragraph', children: [{ type: 'link', url: '/work', children: [{ type: 'text', text: 'Une vraie présentation' }] }] }] };
  assert.equal(getProjectEditorial({ documentId: CAFE_PROJECT_ID, contenu: [paragraph('un texte pour voir'), linkText] }), undefined);
});
