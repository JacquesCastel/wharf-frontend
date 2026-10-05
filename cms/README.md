# Couche éditoriale Strapi Wharf

Cette couche s’applique au projet existant `/var/www/wharf-strapi`, avec Strapi 5.56.0 et Node 22 LTS. Elle ne remplace pas les APIs clients, les politiques d’accès, les lifecycles ni les uploads. Les fichiers de configuration utilisent des variables d’environnement ; aucun secret n’est versionné.

La procédure et les contrôles figurent dans `docs/CMS_WHARF.md`. Les sources de ce dossier sont compilées par Strapi, séparément du frontend Next.js. `package.json` et `package-lock.json` fixent les dépendances validées ; les données initiales du blog restent dans `app/lib/insights-content.json`, celles des pages dans `src/data/page-copy.json`.
