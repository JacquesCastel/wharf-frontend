const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');
const get = load('app/lib/project-seo.ts').getProjectSeo;

test('custom SEO values leave the visible title, summary and production URL distinct', () => {
  const project = { documentId: 'fixture', titre: 'Titre visible', description_courte: 'Résumé visible', seo_title: ' Titre SEO | Wharf ', seo_description: ' Description du lien ', seo_image: { url: '/uploads/seo.jpg', width: 1200, height: 630 }, vignette: { url: '/uploads/card.jpg' } };
  const before = JSON.stringify(project);
  const seo = get(project);
  const metadata = load('app/lib/metadata.ts').generateMetadataFromStrapi(seo.title, seo.description, seo.image, '/work/fixture');
  assert.equal(metadata.title.absolute, 'Titre SEO | Wharf');
  assert.equal(metadata.description, 'Description du lien');
  assert.equal(metadata.openGraph.images[0].url, 'https://admin.bywharf.com/uploads/seo.jpg');
  assert.equal(metadata.twitter.images[0], metadata.openGraph.images[0].url);
  assert.equal(metadata.alternates.canonical, 'https://bywharf.com/work/fixture');
  assert.equal(seo.summary, 'Résumé visible');
  assert.equal(JSON.stringify(project), before);
});

test('empty SEO fields retain published copy and never use a video as a sharing image', () => {
  const base = { documentId: 'fixture', titre: 'Titre', seo_title: '  ', seo_description: null, seo_image: null, hero_type: 'video', hero_media: { url: '/uploads/film.mp4' } };
  assert.equal(get(base).title, 'Titre — Portfolio | Wharf');
  assert.equal(get(base).description, 'Découvrez le projet Titre réalisé par Wharf.');
  assert.equal(get(base).image, undefined);
  assert.equal(get({ ...base, description_courte: ' Résumé ' }).description, 'Résumé');
  assert.equal(get({ ...base, vignette: { url: '/uploads/card.jpg' } }).image.url, '/uploads/card.jpg');
  assert.equal(get({ ...base, hero_type: 'image', hero_media: { url: '/uploads/hero.jpg' } }).image.url, '/uploads/hero.jpg');
  const cafe = { ...base, documentId: load('app/lib/project-editorial.ts').CAFE_PROJECT_ID };
  assert.match(get(cafe).description, /autopromotion/);
  assert.equal(get({ ...cafe, description_courte: 'Résumé rédigé dans Strapi' }).summary, 'Résumé rédigé dans Strapi');
});

test('the portfolio renderer uses SEO overrides without changing the H1 or media', async () => {
  const project = { documentId: 'fixture', titre: 'Titre visible', description_courte: 'Résumé public', seo_title: 'Titre SEO', seo_description: 'Méta-description personnalisée', seo_image: { url: '/uploads/share.jpg' }, contenu: [], publishedAt: '2026-10-06' };
  const originalFetch = global.fetch;
  global.fetch = async url => { assert.match(String(url), /populate%5Bseo_image%5D=true/); return { ok: true, status: 200, json: async () => ({ data: project }) }; };
  try {
    const module = load('app/work/[id]/page.tsx', {
      react: { ...React, cache: fn => fn },
      'next/image': props => React.createElement('img', { src: props.src, alt: props.alt }),
      'next/link': props => React.createElement('a', { href: props.href }, props.children),
      'next/navigation': { notFound() { throw new Error('not found'); } },
      'app/lib/projects.ts': { getPublishedProjects: async () => [project], projectMediaUrl: path => new URL(path, 'https://admin.bywharf.com').toString() },
      'app/components/ScrollMotion.tsx': () => null,
      'app/components/EditorialMark.tsx': () => null,
    });
    const props = { params: Promise.resolve({ id: 'fixture' }) };
    const metadata = await module.generateMetadata(props);
    assert.equal(metadata.title.absolute, 'Titre SEO');
    const html = renderToStaticMarkup(await module.default(props));
    assert.match(html, /<h1[^>]*>Titre visible<\/h1>/);
    assert.match(html, /Résumé public/);
    assert.ok(!html.includes('<h1>Titre SEO</h1>'));
    assert.match(html, /Méta-description personnalisée/);
  } finally { global.fetch = originalFetch; }
});
