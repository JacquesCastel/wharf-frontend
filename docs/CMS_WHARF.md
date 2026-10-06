# Gestion du contenu Wharf — 5 octobre 2026

CMS : https://admin.bywharf.com/admin. Se connecter avec le compte existant puis ouvrir **Content Manager / Gestionnaire de contenu**.

| Où | Ce qui est modifiable |
| --- | --- |
| Articles du blog | Les 8 articles importés, les nouveaux brouillons, sections, paragraphes, listes, tableaux, sources, dates éditoriales et SEO. |
| Pages du site | Home, WE, WORK, YOU, Contact, INSIGHTS et les textes communs : titres, introductions, offres, prestations, situations, boutons et textes du footer. |
| Portfolio — Réalisations | Les projets, leurs catégories, médias, séries d’images et de vidéos et blocs éditoriaux. |
| Portfolio — Catégories | Les catégories des filtres : Stratégie, Contenus éditoriaux, Films & vidéos, Création IA. |
| Médiathèque / Media Library | Les images, vidéos et fichiers. Les anciens uploads restent au même emplacement. |
| Médias — Accueil | La vidéo d’accueil et les images des trois entrées WE, WORK et YOU. |
| Adresse de contact | L’adresse email utilisée par le formulaire. |
| Navigation / Footer | Le logo, les liens de navigation et le copyright. |

## Modifier une page

Ouvrir **Pages du site**, choisir la page, déplier **Textes de la page** puis le bloc repéré par son texte actuel. Modifier **Contenu affiché**, enregistrer et **Publier**. Les titres répartis sur deux lignes conservent leurs fragments pour préserver la composition. Les listes de prestations utilisent une ligne par élément. Les textes sont échappés : du code HTML saisi dans le CMS n’est pas exécuté. Le nom du bloc et ses repères sont conservés pour éviter une rupture du rendu.

Les champs Titre SEO et Description SEO de la page alimentent son HTML et son balisage. Le site lit le contenu publié à chaque requête ; aucun commit ni déploiement n’est nécessaire pour modifier un texte ou publier un article. Les trois anciens modèles WE, WORK et YOU sont conservés pour préserver les données mais masqués du gestionnaire afin d’éviter d’éditer des champs inutilisés.

## Rédiger un article

Créer une entrée **Articles du blog**. Renseigner le titre, le thème, le format, l’adresse, l’introduction, le résumé/description SEO et les sections. Une section peut comporter des paragraphes, une liste, un tableau et une source datée. Un tableau comporte des en-têtes et des lignes avec le même nombre de cellules. Enregistrer un brouillon avant publication. La signature actuelle reste **Wharf** ; aucun profil humain n’est inventé.

La date éditoriale de publication conserve la date d’origine des articles importés. La date de révision est mise à jour lors d’une modification éditoriale, et non par une simple nouvelle compilation. Les dates futures et les données éditoriales invalides sont refusées à la publication. Les études/observations exigent une méthode, un périmètre et des limites. Le thème et le slug sont verrouillés après la première publication pour préserver les URLs ; préparer une redirection avant toute évolution de structure.

Dépublier retire l’article du site, des listes, du footer, de l’image de partage et du sitemap. Une panne du CMS produit une erreur explicite : les anciennes copies JSON ne sont pas réintroduites silencieusement.

## Publication automatique

La cadence mardi/jeudi à 9 h Europe/Paris et le calendrier validé restent inchangés. Lire les articles actuels dans `https://admin.bywharf.com/api/wharf-content`. Préparer un seul article JSON au contrat `InsightArticle` de `app/lib/insights.ts`, vérifier les sources et déposer le fichier dans un répertoire privé du serveur via l’accès SSH déjà configuré.

Depuis `/var/www/wharf-strapi`, lancer :

```sh
NODE_ENV=production /opt/wharf-node22/current/bin/node scripts/publish-insight.cjs /root/wharf-maintenance/insights/article.json
```

Le script refuse de remplacer un article différent, est réutilisable après une interruption et compare la version publiée au fichier fourni. Vérifier ensuite l’URL réelle, le canonical, BlogPosting, INSIGHTS, les liens et le sitemap avant notification. Les publications de contenu ne nécessitent plus de commit/push ni de déploiement GitHub. Le build, les tests et GitHub Actions restent requis pour les modifications du code.

Aucun nouvel accès API ni mot de passe n’est créé. Les données privées des clients sont exclues de `/api/wharf-content`. Les routes REST ordinaires des nouveaux modèles restent protégées. Les tests qui publient/dépublient des copies de contenu ne sont exécutés que dans la copie privée de test, jamais en production.

## Exploitation et code

Strapi 5.56.0 ; Node LTS 22 dédié sous `/opt/wharf-node22/current`. Le frontend conserve son runtime existant. Strapi reste en production sous PM2, lié à `127.0.0.1:1337` derrière le proxy HTTPS ; Vite/HMR n’est pas exposé. La base réelle et les uploads restent dans `/var/www/wharf-strapi/.tmp/data.db` et `/var/www/wharf-strapi/public/uploads`.

Les ajouts/modifications du CMS sont versionnés dans `cms/`. Ce dossier contient une couche à appliquer au projet Strapi existant, pas un remplacement des contrôleurs, services, politiques ou lifecycles clients. `cms/scripts/import-editorial.cjs` importe les archives initiales sans écraser un contenu existant modifié. `cms/scripts/configure-editorial.cjs` configure les libellés et dispositions d’édition. `cms/scripts/test-editorial.cjs` refuse de fonctionner hors de la copie de test désignée.

Sauvegardes privées du code, de PM2 et de SQLite dans `/root/wharf-maintenance/strapi-cms-20261005/`. Le déploiement du CMS utilise la base fraîche de production, jamais la copie de test. Les versions précédentes des dépendances et du build sont conservées pour un retour arrière.

## Classer et présenter les réalisations — 6 octobre 2026

Dans **Portfolio — Réalisations**, choisir une ou plusieurs **Catégories du portfolio**. Les catégories sont distinctes du champ libre **Format / type de réalisation**, qui sert à préciser la nature du projet. Par exemple, une série de films générés par IA peut être classée à la fois dans **Films & vidéos** et **Création IA** ; une série d’images peut être classée dans **Création IA**. Les filtres apparaissent sur WORK dès qu’une réalisation publiée utilise la catégorie. Les références non classées restent dans « Toutes ». Les anciennes URLs filtrées par `type` restent utilisables.

Dans **Portfolio — Catégories**, ajouter une catégorie ou ajuster son nom et son ordre d’affichage. Conserver son adresse après utilisation pour préserver les liens de filtre. Les catégories vides ne sont pas affichées sur le site ; les pages filtrées sont en `noindex,follow` pour éviter de multiplier les variantes de WORK.

Pour créer une série, ajouter dans **Présentation de la réalisation** le bloc **Série d’images et de vidéos**. Renseigner son titre et le nombre de colonnes (1 à 3). Ajouter des éléments **Image ou vidéo**, puis choisir un fichier image/vidéo dans la médiathèque OU un lien YouTube/Vimeo. Pour chaque élément, renseigner éventuellement un titre, une légende et une affiche pour une vidéo. Réordonner les éléments dans Strapi. Le site conserve leur ordre, les proportions des images, les contrôles des vidéos et passe sur une colonne sur mobile. Les vidéos ne démarrent pas automatiquement.

Pour une démonstration IA en avant-vente, expliquer ce statut dans un bloc texte : ne pas présenter le test comme une commande ou une campagne diffusée. Aucun nouveau projet ni résultat client n’est créé par cette mise à jour.

Enregistrer puis **Publier** pour afficher les changements. Les blocs image, vidéo, galerie, texte et citation existants sont conservés. Les fichiers vidéos du bloc `VideoBloc` sont lus depuis le champ `video` réel du CMS ; les médias des blocs et des séries sont chargés explicitement avec leurs sous-composants.

La configuration des catégories et du formulaire est idempotente : depuis le projet Strapi, exécuter `NODE_ENV=production /opt/wharf-node22/current/bin/node scripts/configure-portfolio.cjs`. Ce script crée seulement les catégories initiales manquantes et leur permission de lecture publique ; il ne modifie ni ne republie les fiches projets existantes.

Avant de compiler le CMS après ajout de modèles, générer les types avec `node node_modules/@strapi/strapi/bin/strapi.js ts:generate-types`, puis compiler avec TypeScript. Les essais de création/publication de séries sont exécutés uniquement dans une copie SQLite privée ; aucune fiche fictive n’est publiée sur le site.

## Résumé et SEO des réalisations — 6 octobre 2026

Dans **Portfolio — Réalisations**, quatre champs facultatifs complètent chaque fiche :

| Champ | Utilisation sur le site |
| --- | --- |
| Résumé du projet | Présentation visible sur la fiche et les cartes du portfolio ; description de la réalisation dans les données structurées. Il peut préciser le contexte, l’objectif, la démarche et les livrables. |
| Titre SEO (facultatif) | Titre HTML, Open Graph et Twitter. Saisir le titre complet souhaité. Le H1 reste le champ **Titre**. Si vide, le titre est « Titre de la réalisation — Portfolio \| Wharf ». |
| Méta-description (facultative) | Description HTML et des partages. Si vide, le résumé du projet est utilisé, puis la présentation existante du film d’autopromotion ou une description générique. |
| Image de partage (facultative) | Visuel Open Graph et Twitter, distinct de la vignette et du média d’ouverture. Si vide, la vignette reste utilisée. |

Enregistrer puis **Publier** : les modifications sont lues sans nouveau déploiement. Les nouveaux champs sont laissés vides sur les fiches existantes ; aucune réalisation n’est réécrite ou republiée automatiquement. Les URLs et le titre visible restent inchangés. Le résumé peut également compléter la description du balisage vidéo d’ouverture lorsque sa source, son affiche et sa date d’upload sont disponibles.

Le contexte utile à la visibilité dans les moteurs et leurs réponses IA se rédige dans **Résumé du projet** et **Présentation de la réalisation**. Aucun champ GEO caché n’est ajouté. Pour les médias, utiliser le texte alternatif de la médiathèque et les titres/légendes des séries.
