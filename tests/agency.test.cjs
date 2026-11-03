const { test } = require('node:test');
const assert = require('node:assert/strict');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');
const seed = require('../app/lib/page-copy.json').global.texts;
const { publicMenuLinks } = load('app/lib/public-navigation.ts');

test('agency follows the manifesto once in either menu without changing CMS input or other links', () => {
  const input = Object.freeze([
    { id: 7, label: 'Notre agence', url: '/agence/' },
    { id: 1, label: 'WE', url: '/we' },
    { id: 8, label: 'Doublon', url: '/agence' },
    { id: 2, label: 'MANIFESTE', url: '/manifeste' },
    { id: 3, label: 'WORK', url: '/work' },
    { id: 4, label: 'Contact', url: '/contact/' },
  ]);
  const before = JSON.stringify(input);
  const links = publicMenuLinks(input);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(Array.from(links, link => link.url), ['/we', '/manifeste', '/agence/', '/work', '/insights']);
  assert.equal(links[2].label, 'Notre agence');
  const defaults = publicMenuLinks([]);
  assert.deepEqual(Array.from(defaults, link => link.url), ['/we', '/manifeste', '/agence', '/work', '/you', '/insights']);
});

const page = edits => load('app/agence/page.tsx', {
  'app/lib/cms-content.ts': { getPageCopy: async () => ({ text: key => edits?.[key] ?? seed[key].value }) },
  'app/components/ScrollMotion.tsx': () => null,
});

test('agency renders CMS paragraphs and escapes edits while keeping the real collaboration model', async () => {
  const { default: Page } = page({ 'agency-regard-text': '<script>unsafe()</script>\n\nUne autre idée & sa suite.' });
  const html = renderToStaticMarkup(await Page());
  assert.ok(html.includes('&lt;script&gt;unsafe()&lt;/script&gt;'));
  assert.ok(!html.includes('<script>unsafe()'));
  assert.ok(html.includes('<p>Une autre idée &amp; sa suite.</p>'));
  assert.ok(html.includes('professionnels indépendants'));
  assert.ok(html.includes('Je porte la direction du projet'));
  assert.ok(html.includes('coécrit aux Éditions Kawa'));
  assert.ok(html.includes('href="https://postgenius.network/"'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = Array.from(html.matchAll(/\bid="([^"]+)"/g), match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!html.includes('Photo réelle à sélectionner'));
  assert.ok(!html.includes('Au café du commerce'));
});

test('agency metadata and AboutPage identify Jacques without assigning him the existing blog articles', async () => {
  const { default: Page, generateMetadata } = page({ 'agency-seo-title': 'Titre de l’agence édité | Wharf' });
  const meta = await generateMetadata();
  assert.equal(meta.title.absolute, 'Titre de l’agence édité | Wharf');
  assert.equal(meta.alternates.canonical, 'https://bywharf.com/agence');
  assert.equal(meta.robots.index, true);
  const html = renderToStaticMarkup(await Page());
  const schemas = Array.from(html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g), match => JSON.parse(match[1]));
  const person = schemas.find(schema => schema['@type'] === 'Person');
  assert.equal(person.name, 'Jacques Castel');
  assert.equal(person.worksFor['@id'], 'https://bywharf.com/#organization');
  assert.ok(schemas.some(schema => schema['@type'] === 'AboutPage' && schema.url === meta.alternates.canonical));
  assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'));
  assert.ok(!schemas.some(schema => schema['@type'] === 'BlogPosting'));
});
