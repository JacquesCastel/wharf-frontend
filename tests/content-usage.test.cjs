const { test } = require('node:test');
const assert = require('node:assert/strict');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');

test('robots keeps search and answer access distinct from training and retains private-route exclusions', async () => {
  const { GET } = load('app/robots.txt/route.ts');
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/plain/);
  const lines = (await response.text()).split('\n').filter(line => line && !line.startsWith('#'));
  assert.equal(lines.filter(line => /^User-Agent:/i.test(line)).length, 1);
  assert.ok(lines.includes('User-Agent: *'));
  assert.ok(lines.includes('Allow: /'));
  assert.ok(lines.includes('Disallow: /api/'));
  assert.ok(lines.includes('Disallow: /mesure/'));
  assert.ok(!lines.includes('Disallow: /'));
  const signal = lines.filter(line => /^Content-Signal:/i.test(line));
  assert.equal(signal.length, 1);
  const uses = Object.fromEntries(signal[0].split(':')[1].split(',').map(value => value.trim().split('=')));
  assert.deepEqual(uses, { search: 'yes', 'ai-input': 'yes', 'ai-train': 'no' });
  assert.ok(lines.includes('Sitemap: https://bywharf.com/sitemap.xml'));
});

test('TDM discovery returns a reservation and an absolute policy URL matching the canonical HTML page', async () => {
  const { GET } = load('app/.well-known/tdmrep.json/route.ts');
  const response = GET();
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  const rules = await response.json();
  assert.equal(rules.length, 1);
  assert.equal(rules[0].location, '/');
  assert.equal(rules[0]['tdm-reservation'], 1);
  const { metadata, default: Page } = load('app/utilisation-des-contenus/page.tsx');
  assert.equal(rules[0]['tdm-policy'], metadata.alternates.canonical);
  assert.equal(new URL(rules[0]['tdm-policy']).origin, 'https://bywharf.com');
  assert.equal(metadata.robots.index, true);
  const html = renderToStaticMarkup(Page());
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes('href="/.well-known/tdmrep.json"'));
  const schemas = Array.from(html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g), match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema['@type'] === 'WebPage' && schema.url === rules[0]['tdm-policy']));
  assert.ok(!schemas.some(schema => schema['@type'] === 'BlogPosting'));
});
