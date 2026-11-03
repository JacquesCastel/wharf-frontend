const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const load = require('./load-module.cjs');
const paths = load('app/lib/content-paths.ts');
const plain = value => JSON.parse(JSON.stringify(value));

test('journey contact codes are whitelisted; arrays, external URLs and unknown input cannot prefill the form', () => {
  for (const code of [undefined, ['recrutement'], '__proto__', 'https://evil.example', '<script>alert(1)</script>']) {
    assert.equal(paths.contactContext(code), undefined);
  }
  assert.equal(paths.contactContext('recrutement').need, 'Marque employeur ou recrutement');
  assert.equal(paths.contactContext('creation-ia').need, 'Création d’images et de films par l’IA');
  assert.equal(paths.contactHref('https://evil.example/you#film'), '/contact');
  for (const context of paths.contentContexts) {
    const target = new URL(paths.contactHref(context.href), 'https://bywharf.com');
    assert.equal(target.pathname, '/contact');
    assert.equal(paths.contactContext(target.searchParams.get('parcours')).href, context.href);
  }
});

test('recruitment reading leads to the relevant offers and a matching contact, with no invented case', () => {
  const article = { slug: 'preparer-portrait-metier-situations-travail', service: '/you#recrutement' };
  assert.deepEqual(plain(paths.articleRoutes(article).map(link => link.href)), ['/you#recrutement', '/work#strategy', '/work#video']);
  assert.equal(paths.articleContactHref(article), '/contact?parcours=recrutement#votre-projet');
  assert.deepEqual(plain(paths.contextualProjectIds(article)), []);
  assert.deepEqual(plain(paths.contextProjects([{ documentId: 'film', categories: [{ slug: 'films-videos' }] }], '/you#recrutement')), []);
});

test('unpublished readings stay absent and the autopromotion film cannot be attached to a blog article', () => {
  const published = [{ slug: 'preparer-portrait-metier-situations-travail' }];
  assert.deepEqual(plain(paths.contextReadings(published, '/you#recrutement')), published);
  assert.deepEqual(plain(paths.contextReadings([], '/you#recrutement')), []);
  const cafe = load('app/lib/project-editorial.ts').CAFE_PROJECT_ID;
  assert.deepEqual(plain(paths.contextualProjectIds({ slug: 'any', relatedProjectIds: [cafe, paths.AI_PROJECT_ID] })), [paths.AI_PROJECT_ID]);
});

test('contact preselection sets only the editable need; personal fields remain empty and rendering sends no email', () => {
  let sends = 0;
  const Form = load('app/contact/ContactForm.tsx', { '@emailjs/browser': { init() {}, send() { sends++; } } }).default;
  const html = renderToStaticMarkup(React.createElement(Form, { email: 'contact@bywharf.com', initialNeed: 'Marque employeur ou recrutement' }));
  assert.ok(html.includes('<option value="Marque employeur ou recrutement" selected="">'));
  for (const field of ['name', 'email', 'organization']) assert.match(html, new RegExp('name="'+field+'"[^>]*value=""'));
  assert.ok(!html.includes('name="situation" disabled'));
  assert.equal(sends, 0);
  const invalid = renderToStaticMarkup(React.createElement(Form, { email: 'contact@bywharf.com', initialNeed: 'https://evil.example' }));
  assert.ok(!invalid.includes('https://evil.example'));
});
