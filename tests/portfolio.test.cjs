const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');
const categories = [
  { documentId: 'cat-film', nom: 'Films & vidéos', slug: 'films-videos', ordre: 30 },
  { documentId: 'cat-ai', nom: 'Création IA', slug: 'creation-ia', ordre: 40 },
];
const projects = Array.from({ length: 9 }, (_, i) => ({ id: i, documentId: `test-${i}`, titre: 'Fixture', type: i === 8 ? 'Image' : 'Film', categories: i < 7 ? categories : i === 7 ? [categories[0]] : [] }));
test('a project can belong to two categories; counts and pagination use the selected category', () => {
  const data = load('app/lib/portfolio-pagination.ts');
  const selection = data.portfolioSelection(projects, { categorie: 'creation-ia', page: '2' });
  assert.equal(selection.valid, true);
  assert.equal(selection.filtered.length, 7);
  assert.equal(selection.pageCount, 2);
  assert.equal(selection.categories.find(category => category.slug === 'films-videos').count, 8);
  assert.equal(selection.categories.find(category => category.slug === 'creation-ia').count, 7);
  assert.equal(data.portfolioSelection(projects).filtered.length, 9);
  assert.equal(data.portfolioSelection(projects, { type: 'Image' }).filtered.length, 1);
  assert.equal(data.portfolioPath(2, undefined, 'creation-ia'), '/work?page=2&categorie=creation-ia');
  assert.equal(data.portfolioSelection(projects, { categorie: 'unknown' }).valid, false);
  assert.equal(data.portfolioSelection(projects, { categorie: 'creation-ia', page: '3' }).valid, false);
  assert.equal(data.portfolioSelection(null, { categorie: 'creation-ia', page: '2' }).valid, true);
});
test('duplicate category assignments count a project once; unsafe or empty category names are ignored', () => {
  const data = load('app/lib/project-taxonomy.ts');
  const list = data.portfolioCategories([{ categories: [categories[1], categories[0], categories[1]] }]);
  assert.equal(list.length, 2);
  assert.equal(list[0].slug, 'films-videos');
  assert.equal(list[1].count, 1);
  assert.equal(data.projectCategories([null, { nom: '', slug: 'test' }, { nom: 'Invalid', slug: '../bad' }]).length, 0);
});
test('mixed media series retains order and captions, provides manual players and collapsible grid classes', () => {
  const Series = load('app/components/ProjectMediaSeries.tsx', {
    react: { ...React, cache: fn => fn },
    'next/image': props => React.createElement('img', { src: props.src, alt: props.alt, width: props.width, height: props.height }),
  }).default;
  const items = [
    { media: { url: '/uploads/fixture.png', mime: 'image/png', alternativeText: 'Image de test' }, titre: 'Premier', legende: '<script>texte</script>' },
    { media: { url: '/uploads/fixture.webm', mime: 'video/webm' }, titre: 'Deuxième' },
    { video_url: 'https://www.youtube.com/watch?v=3crnc6Hr4vk', titre: 'Troisième' },
  ];
  const html = renderToStaticMarkup(React.createElement(Series, { title: 'Fixture privée', items, columns: 2, projectId: 'fixture', blockIndex: 0 }));
  assert.ok(html.indexOf('Premier') < html.indexOf('Deuxième'));
  assert.ok(html.indexOf('Deuxième') < html.indexOf('Troisième'));
  assert.match(html, /alt="Image de test"/);
  assert.match(html, /video controls="" preload="metadata"/);
  assert.match(html, /type="video\/webm"/);
  assert.match(html, /youtube-nocookie.com\/embed\/3crnc6Hr4vk/);
  assert.ok(!html.includes('autoplay=""'));
  assert.ok(!html.includes('<script>texte</script>'));
  assert.match(html, /&lt;script&gt;texte&lt;\/script&gt;/);
});
test('unsupported files and dangerous URLs never become media players', () => {
  const data = load('app/lib/project-media.ts');
  assert.equal(data.mediaKind({ url: '/uploads/file.pdf', mime: 'application/pdf' }), undefined);
  assert.equal(data.videoEmbed('javascript:alert(1)'), undefined);
  assert.equal(data.videoEmbed('https://evil.example/embed/3crnc6Hr4vk'), undefined);
  assert.equal(data.videoEmbed('https://youtu.be/3crnc6Hr4vk'), 'https://www.youtube-nocookie.com/embed/3crnc6Hr4vk');
  assert.equal(data.videoEmbed('https://vimeo.com/12345678'), 'https://player.vimeo.com/video/12345678');
  assert.equal(data.seriesColumns(9999), 2);
});
