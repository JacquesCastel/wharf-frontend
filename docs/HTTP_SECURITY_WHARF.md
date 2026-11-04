# Sécurité HTTP — 4 novembre 2026

## Constat et correction préparée

Les réponses HTTPS publiques de `bywharf.com` et `www.bywharf.com` sont en 200 sans en-tête HSTS au contrôle du 4 novembre 2026. L'URL HTTP `http://bywharf.com/` redirige déjà en 301 vers HTTPS.

`next.config.mjs` ajoute `Strict-Transport-Security: max-age=31536000` aux réponses du frontend pour ces deux noms d'hôte uniquement. La durée est d'un an, renouvelée à chaque réception de l'en-tête sur HTTPS. Les conditions d'hôte sont interprétées par Next ; les aperçus sur localhost, les autres domaines et le CMS ne sont pas concernés. Les exclusions d'indexation privées restent présentes.

Ni `includeSubDomains` ni `preload` ne sont activés : cette correction ne force aucune politique sur les autres sous-domaines ni inscription à une liste de préchargement. Le certificat HTTPS du site public doit rester valide et renouvelé pendant la durée annoncée. HSTS est mémorisé par le navigateur après une réponse HTTPS valide ; ce n'est pas une protection du premier accès HTTP ni une garantie de classement SEO.

La règle couvre les réponses traitées par Next, y compris pages, métadonnées, ressources et erreurs Next. Les réponses servies directement par Nginx, le service de mesure ou le CMS gardent leur propre configuration. Une modification du frontend ne prouve pas que l'en-tête est déjà présent en production : après déploiement, contrôler les réponses publiques réelles et conserver la redirection HTTP vers HTTPS.

## Contrôle réseau

La capture d'audit signale deux ressources impossibles à charger sans en donner les URL. Lors du contrôle navigateur de l'accueil publié le 4 novembre, les neuf éléments image ont chargé après défilement, la vidéo d'ambiance du CMS dispose de données de lecture et aucune erreur de console n'a été capturée. Ce contrôle ne permet pas d'identifier les deux échecs du rapport : leurs URL et leur motif restent nécessaires avant toute correction de ressources.

## Validation

Les tests `http-headers.test.cjs` utilisent les correspondances de chemin et d'hôte de Next pour vérifier la portée HSTS, les exclusions des aperçus et la conservation des en-têtes privés. Vérifier aussi le manifeste issu du build et les réponses HTTP d'un serveur de production local avec des en-têtes Host de test, sans remplacer le serveur de développement.

Sources primaires consultées le 4 novembre 2026 :

- [MDN — Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security) : mémorisation HTTPS, durée et portée par hôte.
- [Next.js — headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) : en-têtes et conditions `has` par hôte. Contrat également vérifié dans la version installée de Next.
