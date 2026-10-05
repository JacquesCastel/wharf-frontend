const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const load = require('./load-module.cjs');
const content = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/lib/insights-content.json'), 'utf8'));
const article = content[0];

test('one organization identity connects the website, page and editorial signature', () => {
  const data = load('app/lib/structured-data.ts');
  const org = data.organizationSchema();
  assert.equal(data.websiteSchema().publisher['@id'], org['@id']);
  const nodes = data.articleSchema(article, 'Content B2B', 'Guide');
  assert.equal(nodes.length, 1); // No invented human author.
  assert.equal(nodes[0].author['@id'], org['@id']);
  assert.equal(nodes[0].publisher['@id'], org['@id']);
  assert.ok(nodes[0].citation.length > 0);
  assert.equal(nodes[0].mainEntityOfPage['@id'], data.webPageSchema({ path: `/insights/${article.theme}/${article.slug}`, title: article.title, description: article.description })['@id']);
});
test('a documented author creates Person -> worksFor -> Organization without changing the article URL', () => {
  // Synthetic fixture only. No author is added to public content.
  const person = { slug: 'auteur-de-test', name: 'Auteur de test (fictif)', role: 'Fonction de test', bio: 'Profil fictif pour valider le modèle.', expertise: ['Test'], updatedAt: '2026-10-05' };
  const overrides = { 'app/lib/insights-authors.json': [person] };
  const data = load('app/lib/structured-data.ts', overrides);
  const nodes = data.articleSchema({ ...article, author: person.name, authorId: person.slug }, 'Content B2B', 'Guide');
  assert.equal(nodes[0]['@type'], 'Person');
  assert.equal(nodes[0].worksFor['@id'], data.organizationSchema()['@id']);
  assert.equal(nodes[1].author['@id'], nodes[0]['@id']);
  assert.equal(nodes[1].url, `https://bywharf.com/insights/${article.theme}/${article.slug}`);
  const validated = load('app/lib/insights-import.ts', { ...overrides, 'app/lib/insights-content.json': [{ ...article, author: person.name, authorId: person.slug }] });
  assert.equal(validated.publishedAuthors.length, 1);
});
test('video evidence is emitted only with a real upload date, thumbnail and playable source', () => {
  const data = load('app/lib/structured-data.ts');
  const evidence = { name: 'Fixture vidéo', description: 'Fixture synthétique', thumbnailUrl: 'https://example.com/video.jpg', uploadDate: '2025-11-04T13:42:42.362Z', contentUrl: 'https://example.com/video.mp4' };
  assert.equal(data.videoSchema({ ...evidence, uploadDate: '' }, 'https://bywharf.com/work/test'), undefined);
  assert.equal(data.videoSchema({ ...evidence, thumbnailUrl: '' }, 'https://bywharf.com/work/test'), undefined);
  assert.equal(data.videoSchema({ ...evidence, contentUrl: 'javascript:alert(1)' }, 'https://bywharf.com/work/test'), undefined);
  const nodes = data.projectSchema({ titre: 'Test', url: 'https://bywharf.com/work/test', datePublished: '2025-11-10', videos: [evidence] });
  assert.equal(nodes[0].datePublished, '2025-11-10');
  assert.equal(nodes[1].uploadDate, evidence.uploadDate);
  assert.equal(nodes[0].video[0]['@id'], nodes[1]['@id']);
});
test('duplicate URLs, unknown authors, invalid dates, sources and table dimensions block publication', () => {
  const validate = entries => load('app/lib/insights-import.ts', { 'app/lib/insights-content.json': entries });
  assert.throws(() => validate([{ ...article, relatedProjectIds: ['test', 'test'] }]), /Invalid related project IDs/);
  assert.throws(() => load('app/lib/insights-authors.ts', { 'app/lib/insights-authors.json': [{ slug: 'test', name: 'Fixture', role: 'Test', bio: 'Test', expertise: ['Test'], updatedAt: '2026-02-31' }] }), /Incomplete or duplicate/);
  assert.throws(() => validate([article, article]), /duplicate Insights slug/);
  assert.throws(() => validate([{ ...article, theme: 'unknown' }]), /Unknown Insights theme/);
  assert.throws(() => validate([{ ...article, author: 'Invented author' }]), /Unverified Insights author/);
  assert.throws(() => validate([{ ...article, updatedAt: '2026-02-31' }]), /Invalid Insights metadata/);
  assert.throws(() => validate([{ ...article, sections: [{ ...article.sections[0], source: { label: 'Bad', url: 'javascript:alert(1)', accessedAt: '2026-10-05' } }] }]), /Invalid Insights source/);
  assert.throws(() => validate([{ ...article, sections: [{ ...article.sections[0], table: { caption: 'Fixture', headers: ['A', 'B'], rows: [['A']] } }] }]), /Invalid Insights table/);
});
test('portfolio pages provide stable destinations and reject nonexistent selections', () => {
  const data = load('app/lib/portfolio-pagination.ts');
  const projects = Array.from({ length: 8 }, (_, i) => ({ documentId: `test-${i}`, titre: 'Fixture', type: i < 7 ? 'Film' : 'Autre' }));
  assert.equal(data.portfolioSelection(projects).pageCount, 2);
  assert.equal(data.portfolioSelection(projects, { page: '2' }).valid, true);
  assert.equal(data.portfolioSelection(projects, { page: '3' }).valid, false);
  assert.equal(data.portfolioSelection(projects, { type: 'Unknown' }).valid, false);
  assert.equal(data.portfolioSelection(null, { page: '2' }).valid, true);
  assert.equal(data.portfolioPath(2, 'Film & vidéo'), '/work?page=2&type=Film+%26+vid%C3%A9o');
});
test('CMS rich text keeps internal links, escapes text and cannot add another H1', () => {
  const data = load('app/lib/strapi.ts');
  const html = data.blocksToHtml([{ type: 'heading', level: 1, children: [{ text: 'Titre' }] }, { type: 'paragraph', children: [{ type: 'link', url: '/work#video', children: [{ text: 'Vidéo & <script>' }] }, { type: 'link', url: 'javascript:alert(1)', children: [{ text: 'Texte' }] }] }], 3);
  assert.ok(html.includes('<h3>Titre</h3>'));
  assert.ok(html.includes('href="/work#video"'));
  assert.ok(html.includes('&amp; &lt;script&gt;'));
  assert.ok(!html.includes('javascript:'));
});
test('shared metadata keeps production canonicals and actual image dimensions', () => {
  const data = load('app/lib/metadata.ts');
  const metadata = data.generateMetadataFromStrapi('Test | Wharf', 'Description', { url: '/uploads/test.png', width: 3664, height: 1494 }, '/work/test');
  assert.equal(metadata.alternates.canonical, 'https://bywharf.com/work/test');
  assert.equal(metadata.openGraph.images[0].width, 3664);
  assert.equal(metadata.openGraph.images[0].height, 1494);
  assert.equal(data.defaultMetadata.twitter.images[0], 'https://bywharf.com/og');
});
