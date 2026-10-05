# Évolution éditoriale du 2 octobre 2026

## Existant analysé

Next.js 16 App Router, React 18, TypeScript strict, CSS global et composants existants. Strapi fournit les médias, navigation et réalisations ; les textes commerciaux sont dans `app/lib/editorial.ts` et les pages. Insights est versionné en JSON, sans interface CMS. Les pages importantes sont rendues côté serveur. La liste de projets charge les publications Strapi et distingue vide et panne ; les liens et nombres sont présents dans le HTML initial.

## Changements

Accueil : proposition commerciale explicite, trois familles, création IA conservée, nouveaux récits et design narratif, réalisations publiées, trois articles récents. WE : même structure en trois actes, méthode déclinée du diagnostic à la diffusion. WORK : offres et preuves, guides de préparation. YOU : liens vers les accompagnements concernés. Insights : formats, index uniquement alimentés, données de méthode pour les futures études. Métadonnées et URLs existantes conservées ; ajout des index de formats au sitemap.

## Portfolio : matière à réunir

Les fiches Strapi acceptent déjà des blocs texte, image, vidéo, galerie et citation. Pour constituer un cas, ajouter dans ces blocs les rubriques réellement documentées : contexte, problème, réponse Wharf, parti pris, production, formats, diffusion et résultats éventuels. Une rubrique sans information doit rester absente. Ne pas afficher de résultat, de citation ou de client déduit d’un nom de fichier.

La fiche « Au café du commerce » demeure dans le portfolio. Son contenu CMS n’est pas modifié par cette évolution. Le test SGB SYSTEMS n’est pas ajouté comme commande client ni publié dans le portfolio. Leur enrichissement demande une validation de la matière et du contexte de publication.

## À alimenter ensuite

Marque employeur, observations et études : leurs index apparaîtront avec les premiers contenus réels. L’Observatoire dispose du modèle `research` documenté dans `docs/insights-editorial.md`. Aucune étude ou donnée n’a été créée. Les identifiants, thèmes et dates des articles existants sont conservés ; seul le classement par format est ajouté.


## Contrôles

Build Next.js avec TypeScript strict ; tests de la taxonomie (`node --test tests/insights.test.cjs`) ; contrôles HTTP de 19 pages et 32 liens internes, canonicals, Open Graph, BlogPosting, sitemap, routes vides en 404 et conservation des articles. Vérification mobile à 390 px et ordinateur à 1440 px. Correction des débordements des conclusions WORK/Insights et des titres mobiles.

ESLint passe sur les autres fichiers TypeScript modifiés. La fiche portfolio `app/work/[id]/page.tsx` conserve neuf signalements `no-explicit-any` préexistants, vérifiés contre HEAD. Aucun nouveau signalement n’est ajouté. Le script historique `npm run lint` utilise encore `next lint` ; les contrôles ont été lancés avec ESLint directement.

## Fichiers concernés

- `app/page.tsx`, `app/we/page.tsx`, `app/work/page.tsx`, `app/you/page.tsx` : hiérarchie, méthode, preuves et liens.
- `app/components/Offers.tsx`, `app/lib/editorial.ts` : positionnement et trois familles, création IA conservée.
- `app/work/WorkPortfolio.tsx`, `app/work/[id]/page.tsx` : réutilisation du portfolio sur l’accueil, lien vers les offres, balisage main et image OG de secours.
- `app/components/InsightCards.tsx`, `app/insights/page.tsx`, `app/insights/[theme]/[slug]/page.tsx`, `app/insights/formats/[format]/page.tsx` : formats éditoriaux et encadré de méthode des études.
- `app/lib/insights.ts`, `app/lib/insights-content.json`, `app/sitemap.ts` : modèle, classement, validation et indexation.
- `app/globals.css` : réutilisation des styles et corrections mobiles.
- `docs/insights-editorial.md`, `tests/insights.test.cjs` : règles de publication et tests.


## Corrections après l’audit du 5 octobre

Réalisations placées après le hero sur Home et WORK, avec titre, type et résumé visibles sans survol. Cartes WE/WORK/YOU de l’accueil raccourcies ; hiérarchie H2/H3 corrigée. WE relie explicitement la méthode aux trois expertises et au film d’autopromotion. YOU dispose de parcours et lectures par besoin. Contact apparaît une seule fois dans chaque menu. Métadonnées Insights centralisées et dates du sitemap fondées sur des modifications documentées ou sur Strapi, sans date générée à la requête.

Le contenu « Au café du commerce » est une reprise locale du concept et du lien fournis par Jacques : `app/lib/project-editorial.ts`. Il remplace uniquement le texte provisoire (ou vide) du projet existant. Les contenus substantiels ajoutés au CMS reprennent automatiquement la priorité. Aucun média ou champ Strapi n’est écrit, aucun crédit ou résultat n’est ajouté. La date de publication CMS est conservée ; la date de modification reflète cet enrichissement. Le film reste exclusivement dans le portfolio.

Les observations, études, cas supplémentaires, crédits de production et présentation de l’équipe nécessitent une matière réelle ; aucun contenu fictif n’est produit pour remplir ces rubriques.

Les cartes YOU passent de trois colonnes à deux puis une selon la largeur. Les correctifs des petits écrans suppriment les doubles marges internes et les largeurs minimales des grilles. Les tests du portfolio vérifient que le contenu CMS finalisé conserve la priorité et que l’enrichissement ne modifie pas les données d’origine. Contrôles HTTP : ordre des preuves, résumé visible, lien vidéo, absence du texte provisoire, parcours, dates de publication conservées et sitemap stable entre deux requêtes. Le contrôle visuel du 5 octobre après ces corrections est bloqué par la politique d’accès du navigateur intégré à l’URL locale ; il reste à faire.


## Direction UX/UI Division + Bonhomme — 5 octobre 2026

Choix de Jacques : direction cinématographique, références Division et Bonhomme. L’accueil conserve la baseline « Révéler ce qui existe déjà » et son média CMS, avec un film net, une composition alignée à gauche, un visuel existant de secours optimisé et une commande pause/lecture. La lecture automatique respecte la réduction des animations. Les pages intérieures utilisent des ouvertures éditoriales plutôt que le même grand bandeau vidéo. Les réalisations gagnent une présentation image/texte et les filtres ne sont affichés que lorsqu’ils permettent un choix réel.

Les expertises, la méthode, les besoins YOU et les articles sont présentés sans cartes encadrées ni effets de déplacement. Les trois actes WE, les URLs, les liens internes et les métadonnées sont conservés. Les H2/H3 restent en Lora avec empattements. Le bloc de création IA reste centré. Le footer conserve ses liens, son bloc gris de lecture et sa description sous le copyright. Les styles de contenu sont isolés dans `app/wharf-ui.css`, sous `.wharf-public`, pour préserver les espaces d’administration et clients. Aucun projet, article, résultat ou nouveau média n’est inventé.

Cette proposition est locale, sans commit ni publication. Une copie des fichiers avant cette étape est conservée dans `/private/tmp/wharf-before-cinema-20261005`. Le contrôle visuel du navigateur intégré nécessite de résoudre son blocage précédent d’accès à l’adresse locale ; les contrôles de compilation et HTTP sont menés indépendamment.

Contrôles de cette étape : build Next.js avec TypeScript activé réussi ; ESLint sans erreur sur les composants et pages concernés (deux avertissements historiques sur le logo img et le chargement des polices) ; sept tests existants réussis ; `git diff --check` et parsing CSS réussis. Vérification HTTP de 19 pages et 32 liens internes, un H1 et un main par page, canonical de production, Open Graph, BlogPosting, sitemap et articles préservés. Les nouveaux styles sont servis sur le port 3120, la vidéo CMS répond HTTP 200/video/mp4 et l’image de secours passe par le service d’optimisation Next. Les contrôles visuels et des interactions au navigateur restent en attente de l’autorisation demandée pour résoudre le blocage précédent.


## Contact — 5 octobre 2026

La page Contact rejoint la direction Division + Bonhomme : ouverture éditoriale en Lora, contenu de préparation et email direct à gauche, formulaire à droite, une colonne sur petits écrans. Le formulaire est présent dans le HTML initial. Le chargement navigateur de l’ancienne IP HTTP est remplacé par le helper serveur `getContact()` existant, qui utilise l’URL CMS configurée ; l’email de contact du CMS est conservé. Aucun nouveau média ni nouvelle coordonnée n’est créé.

Les cinq champs et le service/modèle/paramètres EmailJS d’origine restent utilisés. Les besoins proposés couvrent Strategy, Content, Video, création IA, recrutement et transformation, avec une entrée à définir. Les champs disposent de labels, de complétion automatique et de validation native. Le formulaire se verrouille pendant l’envoi, conserve la saisie en cas d’échec, donne un retour accessible et garde la confirmation jusqu’à une nouvelle action du visiteur. Aucune soumission réelle n’est effectuée pendant les contrôles. Les métadonnées sont centralisées et la modification Contact est datée dans le sitemap.

Contrôles Contact : build Next.js et TypeScript réussis ; ESLint sans erreur ni avertissement sur les fichiers concernés ; CSS parsé et `git diff --check` valide. Le service, le modèle, la clé publique et les paramètres EmailJS sont comparés au code précédent et préservés. Des essais isolés avec un SDK simulé vérifient le verrouillage, la protection contre les doublons, la confirmation, la reprise après erreur et la conservation de la saisie. Contrôles HTTP : Contact 200, un H1 et un main, formulaire et cinq champs dans le HTML initial, labels, complétion automatique, liens WORK/YOU, canonical de production, OG, indexabilité et date du sitemap. Le contrôle visuel reste soumis au blocage d’accès local précédemment signalé. Proposition locale, sans commit ni déploiement.
