const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const loadModule = require('./load-module.cjs');
const current = JSON.parse(fs.readFileSync(path.join(__dirname, '../app/lib/insights-content.json'), 'utf8'));
const load = (articles = current) => loadModule('app/lib/insights-import.ts', { 'app/lib/insights-content.json': articles });
test('published taxonomy includes only populated formats and themes', () => {
  const data = load();
  assert.equal(data.publishedFormats.map(x => x.slug).join(','), 'guides,analyses');
  assert.ok(!data.publishedTopics.some(x => x.slug === 'marque-employeur'));
  assert.equal(data.articles.length, current.length);
  for (const a of data.articles) assert.equal(data.articlePath(a), `/insights/${a.theme}/${a.slug}`);
});
test('article ordering is independent of input order and does not mutate the input', () => {
  const shuffled = [...current].reverse();
  const before = JSON.stringify(shuffled);
  const data = load(shuffled);
  assert.equal(data.articles[0].publishedAt, current[0].publishedAt);
  assert.equal(JSON.stringify(shuffled), before);
});
test('invalid formats and undocumented studies are rejected', () => {
  assert.throws(() => load([{ ...current[0], format: 'invented' }]), /Unknown Insights format/);
  assert.throws(() => load([{ ...current[0], format: 'etudes' }]), /Missing research evidence/);
  assert.throws(() => load([{ ...current[0], format: 'observations', research: { period: '', sources: [] } }]), /Missing research evidence/);
});
test('documented research enables its format without changing the article URL', () => {
  // Synthetic fixture only: never added to the published content file.
  const article = { ...current[0], format: 'etudes', research: { series: 'observatoire-wharf', period: 'Test', scope: 'Test fixture', method: 'Synthetic test', question: 'Question fictive', sample: 'Échantillon fictif', findings: ['Résultat de test, non réel'], analysis: 'Analyse de test', limitations: 'Not real research', sources: [{ label: 'Fixture', url: 'https://example.com', accessedAt: '2026-10-02' }] } };
  const data = load([article]);
  assert.equal(data.publishedFormats[0].slug, 'etudes');
  assert.equal(data.articles[0].research.series, 'observatoire-wharf');
});
test('related reading excludes the current article and prioritizes its theme', () => {
  const data = load();
  const first = data.articles[0];
  const related = data.relatedArticles(first);
  assert.ok(related.length <= 3);
  assert.ok(related.every(x => x.slug !== first.slug));
  assert.equal(related[0].theme, first.theme);
});
