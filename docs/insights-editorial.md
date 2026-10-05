# INSIGHTS — publication et formats éditoriaux

Des guides et des analyses, sans cas client ni résultat inventé. Les exemples hypothétiques sont explicitement désignés comme fictifs. Chaque source porte sa date réelle de consultation.

Les articles sont versionnés dans `app/lib/insights-content.json`. Chaque entrée porte un thème, un slug unique, un titre, une description, une signature Wharf, des dates, un résumé, des sections et les sources pertinentes. Les signatures ne prétendent pas à une relecture par une personne nommée.

Les pages de catégories n’existent que pour les thèmes ayant au moins un article. Marque employeur reste prévue dans le référentiel mais sans route vide ni lien public. Les articles publiés alimentent le sitemap et les cartes du blog. Les slugs déjà publiés doivent rester stables ou faire l’objet de redirections.

Pour ajouter un article : compléter les données, vérifier les faits et les sources, employer la date réelle de publication, mettre à jour updatedAt uniquement pour une évolution éditoriale, lancer le build puis contrôler l’article et ses liens. Les articles ne sont pas encore éditables dans Strapi : cette intégration pourra suivre si nécessaire.

Prochaine matière à recueillir : un projet réel documenté, ses arbitrages et ses observations. Elle permettra de prolonger ces guides par une preuve propre à Wharf. Aucun chiffre, témoignage ou résultat ne doit être ajouté sans source vérifiable.


## Deux axes de classement

`theme` conserve les clusters et les URLs existantes : `video-b2b`, `content-b2b`, `communication-corporate`, `marque-employeur`.

`format` est obligatoire :
- `guides` : méthode, étapes et outil concret ;
- `analyses` : décryptage argumenté et conséquences ;
- `observations` : ce qui a réellement été observé ou mesuré ;
- `etudes` : recherche originale, documentée et reproductible dans ses limites.

Le build rejette un format inconnu. Les index `/insights/formats/[format]` et les entrées du sitemap n’existent que lorsqu’au moins un article de ce format est publié. Les types Observation / Data et Études sont prêts mais ne sont pas affichés sans contenu. Les articles gardent `/insights/[theme]/[slug]` : aucun déplacement d’URL.

## Observatoire Wharf et études futures

Pour `observations` ou `etudes`, ajouter obligatoirement un objet `research` : `period`, `scope`, `method`, `limitations`, et `sources` (liste de `label`, `url`, `accessedAt`). Ces éléments sont rendus dans une section « Méthode et périmètre ». L’absence de méthode, de périmètre, de période, de limites ou de sources bloque le build.

Le champ optionnel `research.series: "observatoire-wharf"` identifie une étude de l’Observatoire. Il affiche la mention dans l’article. Aucun rapport, panel, résultat ou jeu de données n’est présumé disponible aujourd’hui. Aucun balisage Dataset n’est émis sans véritable jeu de données publié.

Préparer les futures collectes séparément : question de recherche, critères de sélection, période, population, définitions des indicateurs, protocole, fichiers sources, droits de publication et limites. Ne pas extrapoler un échantillon de convenance à toutes les entreprises B2B françaises.

## Avant publication

Réponse directe dans l’introduction, sections explicites, sources près des faits, dates réelles et signature Wharf. L’expérience de terrain n’est attribuée à Wharf que si elle est documentée. Choisir un lien `service` vers une offre pertinente. Les suggestions de lecture privilégient le même thème ; les trois contenus récents apparaissent sur l’accueil.

Contrôler le HTML, le format éditorial, les liens, le canonical, BlogPosting, l’image Open Graph et le sitemap. Les fondamentaux SEO restent applicables aux AI Overviews ; aucun schéma spécial IA ni fichier artificiel n’est nécessaire. Référence : https://developers.google.com/search/docs/appearance/ai-features (consultée le 2 octobre 2026). Aucune indexation ou citation n’est garantie.
