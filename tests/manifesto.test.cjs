const { test } = require('node:test');
const assert = require('node:assert/strict');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');
const seed = require('../app/lib/page-copy.json').global.texts;
const text = key => seed[key].value;
const page = overrides => load('app/manifeste/page.tsx', {
  'app/lib/cms-content.ts': { getPageCopy: async () => ({ text: key => overrides?.[key] ?? text(key) }) },
  'app/components/ScrollMotion.tsx': () => null,
});

test('manifesto preserves CMS paragraph boundaries and escapes text without executing markup', async () => {
  const { default: Page } = page({
    'manifesto-section-1-title': 'Un titre révisé dans le CMS',
    'manifesto-section-1-text': '<script>unsafe()</script>\n\nDeuxième paragraphe & sa suite.',
  });
  const html = renderToStaticMarkup(await Page());
  assert.ok(html.includes('&lt;script&gt;unsafe()&lt;/script&gt;'));
  assert.ok(!html.includes('<script>unsafe()'));
  assert.ok(html.includes('<p>Deuxième paragraphe &amp; sa suite.</p>'));
  assert.match(html, /id="savoir-qui-l-on-est"[^>]*>Un titre révisé dans le CMS<\/h2>/);
  assert.ok(html.includes('href="#savoir-qui-l-on-est"'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.equal((html.match(/<h2\b/g) || []).length, 13);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor));
});

test('manifesto metadata uses CMS edits and remains a canonical WebPage outside the blog', async () => {
  const { default: Page, generateMetadata } = page({ 'manifesto-seo-title': 'Titre édité | Wharf' });
  const metadata = await generateMetadata();
  assert.equal(metadata.title.absolute, 'Titre édité | Wharf');
  assert.equal(metadata.alternates.canonical, 'https://bywharf.com/manifeste');
  assert.equal(metadata.robots.index, true);
  const html = renderToStaticMarkup(await Page());
  const schemas = Array.from(html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g), match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'WebPage' && schema.url === metadata.alternates.canonical));
  assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'));
  assert.ok(!schemas.some(schema => schema['@type'] === 'BlogPosting'));
});
