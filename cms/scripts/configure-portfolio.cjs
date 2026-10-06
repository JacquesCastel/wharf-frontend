const path = require('node:path');
const req = require('node:module').createRequire(path.join(process.cwd(), 'package.json'));
const { createStrapi } = req('@strapi/strapi');
const categoryUid = 'api::categorie-portfolio.categorie-portfolio';
const seoOnly = process.argv.includes('--seo-only');
const defaults = [
  { nom: 'Stratégie', slug: 'strategie', ordre: 10 },
  { nom: 'Contenus éditoriaux', slug: 'contenus-editoriaux', ordre: 20 },
  { nom: 'Films & vidéos', slug: 'films-videos', ordre: 30 },
  { nom: 'Création IA', slug: 'creation-ia', ordre: 40 },
];
(async () => {
  const app = await createStrapi({ appDir: process.cwd(), distDir: path.join(process.cwd(), 'dist') }).load();
  try {
    if (!seoOnly) for (const category of defaults) {
      if (!await app.documents(categoryUid).findFirst({ filters: { slug: category.slug } })) await app.documents(categoryUid).create({ data: category });
    }
    const layouts = {
      'api::projet.projet': { main: 'titre', fields: ['titre', 'categories', 'type', 'slug', 'vignette', 'hero_type', 'hero_media', 'description_courte', 'contenu', 'seo_title', 'seo_description', 'seo_image'], list: ['titre', 'categories', 'type'] },
      [categoryUid]: { main: 'nom', fields: ['nom', 'slug', 'ordre'], list: ['nom', 'slug', 'ordre'] },
      'bloc.serie-media': { main: 'titre', fields: ['titre', 'colonnes', 'elements'] },
      'bloc.media-item': { main: 'titre', fields: ['titre', 'media', 'video_url', 'affiche', 'legende'] },
    };
    const labels = { titre: 'Titre', categories: 'Catégories du portfolio', type: 'Format / type de réalisation', slug: 'Adresse (à conserver)', vignette: 'Vignette dans le portfolio', hero_type: 'Média d’ouverture : image ou vidéo', hero_media: 'Image ou film d’ouverture', contenu: 'Présentation de la réalisation', nom: 'Nom de la catégorie', ordre: 'Ordre des filtres', colonnes: 'Nombre de colonnes (1 à 3)', elements: 'Images et vidéos dans l’ordre souhaité', media: 'Image ou vidéo à sélectionner', video_url: 'Ou lien YouTube / Vimeo', affiche: 'Affiche de la vidéo (facultatif)', legende: 'Légende / description', description_courte: 'Résumé du projet', seo_title: 'Titre SEO (facultatif)', seo_description: 'Méta-description (facultative)', seo_image: 'Image de partage (facultative)' };
    for (const [uid, layout] of Object.entries(layouts)) {
      if (seoOnly && uid !== 'api::projet.projet') continue;
      const component = !uid.startsWith('api::');
      const model = component ? app.components[uid] : app.contentTypes[uid];
      const svc = app.plugin('content-manager').service(component ? 'components' : 'content-types');
      const conf = await svc.findConfiguration(model);
      conf.settings.mainField = layout.main;
      if (layout.list) conf.layouts.list = layout.list;
      // Retain any fields added outside this overlay.
      const additional = Object.keys(model.attributes).filter(key => !layout.fields.includes(key) && !['id','documentId','createdAt','updatedAt','publishedAt','createdBy','updatedBy','locale','localizations'].includes(key));
      conf.layouts.edit = [...layout.fields, ...additional].map(name => [{ name, size: ['component','dynamiczone','media','text','relation'].includes(model.attributes[name]?.type) ? 12 : 6 }]);
      for (const [field, label] of Object.entries(labels)) {
        if (!conf.metadatas[field]) continue;
        conf.metadatas[field].edit = { ...conf.metadatas[field].edit, label };
        if (conf.metadatas[field].list) conf.metadatas[field].list.label = label;
      }
      if (uid === 'api::projet.projet') {
        const descriptions = {
          categories: 'Plusieurs catégories possibles. Les catégories des réalisations publiées deviennent les filtres du site.',
          description_courte: 'Présentation courte affichée sur la fiche et dans le portfolio. Précisez le besoin, la démarche et les livrables. Sert aussi de description SEO si la méta-description est vide.',
          seo_title: 'Titre complet pour les moteurs et le partage du lien. Ne change pas le titre visible (H1). Si vide, le site utilise le titre de la réalisation suivi de « — Portfolio | Wharf ».',
          seo_description: 'Résumé spécifique pour les moteurs et le partage du lien. Si vide, le site utilise le résumé du projet. Décrivez précisément cette réalisation, sans liste de mots-clés.',
          seo_image: 'Visuel représentatif pour le partage du lien. Si vide, le site utilise la vignette de la réalisation. Un format horizontal est conseillé.',
        };
        for (const [field, description] of Object.entries(descriptions)) conf.metadatas[field].edit.description = description;
      }
      if (uid === 'bloc.media-item') conf.metadatas.media.edit.description = 'Choisir un fichier OU renseigner un lien vidéo. Ajouter une légende et le texte alternatif des images dans la médiathèque.';
      await svc.updateConfiguration(model, conf);
    }
    if (!seoOnly) {
      const publicRole = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      const action = `${categoryUid}.find`;
      if (!await app.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: publicRole.id } })) await app.db.query('plugin::users-permissions.permission').create({ data: { action, role: publicRole.id } });
    }
    console.log('PORTFOLIO_CATEGORIES_AND_MEDIA_CONFIGURED');
  } finally { await app.destroy(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
