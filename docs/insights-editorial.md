# INSIGHTS — publication et formats éditoriaux

Des guides et des analyses, sans cas client ni résultat inventé. Les exemples hypothétiques sont explicitement désignés comme fictifs. Chaque source porte sa date réelle de consultation.

Les articles publiés sont désormais gérés dans Strapi, collection **Articles du blog**, et lus en direct via `/api/wharf-content`. `app/lib/insights-content.json` conserve uniquement la copie d’importation des huit articles initiaux ; elle n’est plus la source du site. Chaque entrée porte un thème, un slug unique, un titre, une description, une signature Wharf, des dates, un résumé, des sections et les sources pertinentes. Les signatures ne prétendent pas à une relecture par une personne nommée.

Les pages de catégories n’existent que pour les thèmes ayant au moins un article. Marque employeur reste prévue dans le référentiel mais sans route vide ni lien public. Les articles publiés alimentent le sitemap et les cartes du blog. Les slugs déjà publiés doivent rester stables ou faire l’objet de redirections.

Pour ajouter un article : ouvrir **Articles du blog** dans le Content Manager, rédiger un brouillon, vérifier les faits et sources, puis publier. Les champs `publicationDate` et `revisionDate` correspondent aux dates éditoriales et alimentent les metadata et le sitemap. Les slugs et thèmes d’un article déjà publié restent stables. Le site lit uniquement les versions publiées : une dépublication retire aussi l’article des index, du footer, de son image Open Graph et du sitemap, sans reconstruire le site.

La routine automatique utilise le même modèle : préparer un fichier JSON au format InsightArticle, puis exécuter sur le serveur `/opt/wharf-node22/current/bin/node scripts/publish-insight.cjs /chemin/prive/article.json` depuis `/var/www/wharf-strapi`, avec `NODE_ENV=production`. Ce script vérifie les données, refuse d’écraser un article existant différent, conserve le brouillon en cas de publication refusée et vérifie la version publiée. Consulter `docs/CMS_WHARF.md`.

Prochaine matière à recueillir : un projet réel documenté, ses arbitrages et ses observations. Elle permettra de prolonger ces guides par une preuve propre à Wharf. Aucun chiffre, témoignage ou résultat ne doit être ajouté sans source vérifiable.


## Deux axes de classement

`theme` conserve les clusters et les URLs existantes : `video-b2b`, `content-b2b`, `communication-corporate`, `marque-employeur`.

`format` est obligatoire :
- `guides` : méthode, étapes et outil concret ;
- `analyses` : décryptage argumenté et conséquences ;
- `observations` : ce qui a réellement été observé ou mesuré ;
- `etudes` : recherche originale, documentée et reproductible dans ses limites.

La validation éditoriale et le CMS rejettent un format inconnu. Les index `/insights/formats/[format]` et les entrées du sitemap n’existent que lorsqu’au moins un article de ce format est publié. Les types Observation / Data et Études sont prêts mais ne sont pas affichés sans contenu. Les articles gardent `/insights/[theme]/[slug]` : aucun déplacement d’URL.

## Observatoire Wharf et études futures

Pour `observations` ou `etudes`, ajouter obligatoirement un objet `research` : `period`, `scope`, `method`, `limitations`, et `sources` (liste de `label`, `url`, `accessedAt`). Pour une `etudes`, `question`, `sample`, `findings` (liste de résultats observés) et `analysis` sont également obligatoires. Ces champs restent optionnels pour une observation lorsque le protocole ne les justifie pas. Ces éléments sont rendus dans une section « Méthode et périmètre ». L’absence de méthode, de périmètre, de période, de limites ou de sources bloque la publication.

Le champ optionnel `research.series: "observatoire-wharf"` identifie une étude de l’Observatoire. Il affiche la mention dans l’article. Aucun rapport, panel, résultat ou jeu de données n’est présumé disponible aujourd’hui. Aucun balisage Dataset n’est émis sans véritable jeu de données publié.

Préparer les futures collectes séparément : question de recherche, critères de sélection, période, population, définitions des indicateurs, protocole, fichiers sources, droits de publication et limites. Ne pas extrapoler un échantillon de convenance à toutes les entreprises B2B françaises.

## Avant publication

Réponse directe dans l’introduction, sections explicites, sources près des faits, dates réelles et signature Wharf. L’expérience de terrain n’est attribuée à Wharf que si elle est documentée. Choisir un lien `service` vers une offre pertinente. Les suggestions de lecture privilégient le même thème ; les trois contenus récents apparaissent sur l’accueil.

Contrôler le HTML, le format éditorial, les liens, le canonical, BlogPosting, l’image Open Graph et le sitemap. Les fondamentaux SEO restent applicables aux AI Overviews ; aucun schéma spécial IA ni fichier artificiel n’est nécessaire. Référence : https://developers.google.com/search/docs/appearance/ai-features (consultée le 2 octobre 2026). Aucune indexation ou citation n’est garantie.


## Auteurs, sources et relations — 5 octobre 2026

Le registre léger `app/lib/insights-authors.json` reste vide tant que Jacques n’a pas fourni de vrais profils. Un profil comporte `slug`, `name`, `role`, `bio`, `expertise` (liste) et `updatedAt` (YYYY-MM-DD) ; `photo` est facultative, avec `url`, `width`, `height`, `alt`. La photo doit être locale, hébergée sur bywharf.com ou dans les uploads du CMS configuré. Aucun profil de démonstration n’est publié.

Un article signé par une personne utilise `authorId` égal au slug du registre et `author` égal au nom vérifié. La page `/insights/auteurs/[slug]` et son entrée de sitemap n’existent que lorsque cette personne a au moins un article publié. Le balisage relie BlogPosting → Person → worksFor → Organization. Sans personne identifiée, la signature Wharf et l’auteur Organization sont conservés. Une mise en forme ou une optimisation technique ne justifie pas de changer `updatedAt` éditorial.

Les sources conservent `label`, `url`, `accessedAt` ; elles peuvent préciser `organization`, `title`, `publishedAt` si connus. La date de consultation est celle d’une consultation réelle. Ces données sont affichées côté serveur, près de l’affirmation, et les URL alimentent les citations JSON-LD. `takeaway` est optionnel : ne pas ajouter un bloc mécanique à un contenu qui n’en a pas besoin.

`relatedProjectIds` peut relier un article à des réalisations réellement publiées et pertinentes. Le rendu ignore les projets absents ou indisponibles. Le film « Au café du commerce » est exclu de ces relations : il reste exclusivement dans le portfolio. Les huit articles existants n’ont pas reçu de cas client artificiel.

Le build contrôle les taxonomies, slugs uniques, signatures, dates réelles, liens d’offre, sources, identifiants de sections, tableaux et protocoles d’étude. Avant publication : `node --test tests/*.test.cjs`, `npm run build`, `git diff --check`, puis contrôle HTTP du contenu, des liens, des metadata et du sitemap.

## Futures fiches WORK : utiliser les blocs Strapi existants

Composer une fiche avec les blocs texte, images, vidéos et citations déjà disponibles : Contexte ; Problématique ; Compréhension / insight ; Choix stratégique ; Réponse Wharf ; Production ; Résultats documentés ; Enseignements ; Expertises mobilisées. Ne pas afficher un bloc vide ni inventer de résultats pour compléter la trame. Les liens d’expertise et d’Insights doivent correspondre au projet décrit. Publier les noms de clients, citations et mesures seulement avec des informations et droits confirmés.

Pour une vidéo importante, fournir titre, description, vignette et date réelle de mise à disposition. Le CMS fournit actuellement la date de création du fichier uploadé pour le film disponible ; elle est distincte de la publication de sa fiche. Ajouter durée ISO 8601 et transcription uniquement lorsqu’elles sont connues et vérifiées. Les fonds décoratifs, dont le brouillard IA, ne sont pas présentés comme des films éditoriaux et ne reçoivent pas de VideoObject.
