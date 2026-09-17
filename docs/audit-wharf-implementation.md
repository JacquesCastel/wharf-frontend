# Audit Wharf — septembre 2026

## Existant analysé
Next.js 16 App Router, React 18, styles globaux et Strapi. Pages publiques dans `app`, espaces client et administration séparés. Dépôt propre avant intervention.

Les pages marketing lisaient les textes Strapi, avec une offre surtout narrative. WORK chargeait ses projets uniquement après montage côté navigateur et ne parcourait pas la pagination Strapi. Le filtre recréait sa liste à chaque rendu, utilisée comme dépendance d’un effet qui mettait l’état à jour. Le Header ignorait les données de son wrapper serveur. Le contrôle TypeScript initial signalait ce contrat et la signature de `/clients/[video]`.

## Choix d’implémentation
- Textes du repositionnement versionnés dans le frontend ; les anciennes valeurs SEO Strapi ne prennent plus le dessus sur ces pages. Référentiel commun : `app/lib/editorial.ts` ; textes de sections dans les pages.
- Médias, projets, blocs des fiches, logos et autres pages restent alimentés par Strapi. Aucune écriture dans le CMS.
- Identité visuelle, classes existantes, navigation WE / WORK / YOU et design narratif conservés. Ajout d’INSIGHTS.
- Portfolio transmis par le serveur au composant interactif ; pagination Strapi complète, filtres stables et bouton de chargement accessible. Panne et collection vide sont distinguées.
- URLs existantes `/work/[documentId]` conservées. Une migration en slugs nécessitera un champ unique et des redirections permanentes.
- INSIGHTS préparé avec quatre thèmes. Page en `noindex, follow`, absente du sitemap jusqu’à publication de contenus documentés.

## Publications à préparer
Pour chaque cas réel, utiliser les blocs texte existants dans Strapi, avec les titres : Contexte, Problème, Réponse, Parti pris, Production, Formats, Diffusion, Résultats. Ne publier que les éléments vérifiés ; omettre une section sans matière. Les fiches savent déjà afficher ces blocs. Aucun cas, client, chiffre ni témoignage ajouté artificiellement.

Pour INSIGHTS, architecture cible : `/insights`, `/insights/[theme]`, `/insights/[theme]/[slug]`. Les quatre slugs sont définis dans `editorial.ts`. Créer les routes de catégories et articles lors de la première publication, avec titre, résumé, corps, auteur réel, dates de publication/modification, sources et liens vers les cas concernés. Ajouter alors les URLs publiées au sitemap et retirer le noindex des pages suffisamment documentées. Aucun lien vers une route inexistante n’est exposé actuellement.

L’Observatoire Wharf reste un chantier de recherche : protocole, échantillon, collecte et données à valider avant de communiquer des résultats ou une date de publication.

## Vérification
Contrôler TypeScript, le build de production, le rendu serveur des pages publiques, les filtres du portfolio et la navigation mobile. Le dépôt contenait `typescript.ignoreBuildErrors: true` : un build seul ne prouve pas la validité TypeScript.
