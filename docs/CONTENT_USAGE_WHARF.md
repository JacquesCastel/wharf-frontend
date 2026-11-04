# Utilisation des contenus — 4 novembre 2026

Orientation validée par Jacques : recherche et réponses IA sourcées autorisées pour les textes éditoriaux publics originaux dont Wharf détient les droits ; entraînement et jeux de données destinés à cette fin sur autorisation écrite, sous réserve des exceptions légales.

## Déclarations

- `/robots.txt` conserve le groupe `User-Agent: *`, `Allow: /`, les exclusions `/api/` et `/mesure/` et le sitemap de production. Il ajoute `Content-Signal: search=yes, ai-input=yes, ai-train=no`, avec un commentaire renvoyant au périmètre précis de la politique.
- Le gestionnaire `app/robots.txt/route.ts` remplace la route de métadonnées `app/robots.ts` : le sérialiseur standard Next ne fournit pas de champ Content-Signal. Une seule route sert le fichier public.
- `/.well-known/tdmrep.json` sert une réservation `1` et une URL de politique HTML absolue en production. Il s’agit de la technique centrale choisie ; aucun en-tête ou balisage TDM concurrent n’est ajouté.
- `/utilisation-des-contenus` définit les exceptions de recherche et de réponse à cette réservation, le crédit de la source, les liens et le contact. La page est accessible depuis le footer, figure dans le sitemap avec sa date réelle et rejoint la liste des pages publiques mesurables après consentement.

La réservation TDM est plus large que le seul entraînement. La politique liée autorise donc explicitement les usages limités de recherche et de réponse ; `tdm-reservation: 1` ne doit pas être interprété comme une interdiction totale de ces usages.

## Périmètre et limites

Ces autorisations ne concernent ni les médias ni les éléments de tiers. Elles ne couvrent aucun contenu privé et ne constituent pas une licence sur les médias de `admin.bywharf.com` ou d’un autre domaine. Aucun réglage Strapi, serveur média, compte, authentification ou permission d’accès n’est modifié. Les signaux de bywharf.com renvoient explicitement à ces limites ; ils ne peuvent pas octroyer des droits que Wharf ne possède pas.

Les signaux déclarent une préférence et une réservation de droits ; ils ne bloquent pas techniquement un robot et ne garantissent ni son respect ni une citation IA. Aucun blocage générique des robots d’IA n’est ajouté, car certains agents combinent des usages de recherche, de réponse et d’entraînement. Les ressources privées conservent leurs contrôles existants.

Content Signals est un mécanisme porté par Cloudflare, pas une exigence SEO de Google. TDMRep est une spécification d’un groupe communautaire, pas une recommandation W3C. L’ajout de Content-Signal peut être signalé comme une ligne non comprise par certains validateurs robots ; les directives standard restent présentes.

## Vérification

Contrôler les réponses HTTP, les types MIME, les trois choix Content-Signal, les exclusions existantes, la correspondance entre le lien TDM et la canonique de la page, le maillage footer/sitemap et le rendu mobile. Les tests `content-usage.test.cjs` vérifient ces contrats de sortie ; vérifier aussi le robots réel avec un parseur indépendant et compiler avec TypeScript.

Sources primaires consultées le 4 novembre 2026 :

- [TDMRep, document final du groupe communautaire du 10 mai 2024](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240510/) : fichier `/.well-known/tdmrep.json`, valeurs, politique HTML et priorité des mécanismes.
- [Documentation Cloudflare — robots.txt et Content Signals](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) : catégories de réutilisation et limites de prise en compte.
- [Fonctionnalités IA de Google Search](https://developers.google.com/search/docs/appearance/ai-features?hl=fr) : aucune exigence de fichier ou balisage IA spécial.
- [Article L122-5-3 du Code de la propriété intellectuelle](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044363192) : réservation exprimable et exceptions légales à préserver.
