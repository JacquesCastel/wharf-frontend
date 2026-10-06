const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const project = fs.realpathSync(process.cwd());
assert.match(project, /^\/root\/wharf-maintenance\/portfolio-seo-[^/]+\/project$/, 'Ce test modifie exclusivement une copie privée de test.');
process.env.DATABASE_CLIENT = 'sqlite';
process.env.DATABASE_FILENAME = '.tmp/data.db';
const req = require('node:module').createRequire(path.join(project, 'package.json'));
const { createStrapi } = req('@strapi/strapi');
(async () => {
  const app = await createStrapi({ appDir: project, distDir: path.join(project, 'dist') }).load();
  let fixture;
  try {
    assert.equal(fs.realpathSync(app.config.get('database.connection.connection.filename')), path.join(project, '.tmp/data.db'));
    const uid = 'api::projet.projet';
    const image = await app.db.query('plugin::upload.file').create({ data: { name: 'Fixture image privée', hash: 'fixture_seo_test', ext: '.jpg', mime: 'image/jpeg', size: 1, url: '/uploads/fixture-seo.jpg', provider: 'local', width: 1200, height: 630 } });
    const values = { titre: 'Fixture privée SEO', description_courte: 'Résumé du test privé', seo_title: 'Titre SEO de test', seo_description: 'Description SEO de test', seo_image: image.id };
    fixture = await app.documents(uid).create({ data: values });
    assert.equal(await app.documents(uid).findOne({ documentId: fixture.documentId, status: 'published' }), null);
    await app.documents(uid).publish({ documentId: fixture.documentId });
    const published = () => app.documents(uid).findOne({ documentId: fixture.documentId, status: 'published', populate: { seo_image: true } });
    let entry = await published();
    for (const key of ['description_courte', 'seo_title', 'seo_description']) assert.equal(entry[key], values[key]);
    assert.equal(entry.seo_image.id, image.id);
    await app.documents(uid).update({ documentId: fixture.documentId, data: { seo_title: 'Titre SEO modifié' } });
    assert.equal((await published()).seo_title, values.seo_title);
    await app.documents(uid).publish({ documentId: fixture.documentId });
    assert.equal((await published()).seo_title, 'Titre SEO modifié');
    await app.documents(uid).update({ documentId: fixture.documentId, data: { description_courte: null, seo_title: null, seo_description: null, seo_image: null } });
    await app.documents(uid).publish({ documentId: fixture.documentId });
    entry = await published();
    for (const key of ['description_courte', 'seo_title', 'seo_description', 'seo_image']) assert.equal(entry[key], null);
    console.log('PASS CMS summary, SEO overrides and sharing image persist; drafts remain private; optional fields can be cleared.');
  } finally {
    if (fixture) await app.documents('api::projet.projet').delete({ documentId: fixture.documentId });
    await app.destroy();
  }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });
