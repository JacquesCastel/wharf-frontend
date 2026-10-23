# Runtimes Node.js — 23 octobre 2026

| Usage | Version | Chemin |
| --- | --- | --- |
| Système, npm, gestionnaires PM2 | 24.22.1 LTS | `/usr/bin/node` |
| Frontend Wharf, installation et build | 24.22.1 LTS | `/opt/wharf-node24/current/bin/node` |
| Strapi 5.56.0 et Umami 3.4.0 | 22.23.4 LTS | `/opt/wharf-node22/current/bin/node` |

Le frontend déclare Node 24 dans `package.json` et `.nvmrc`. Le script de déploiement sélectionne explicitement ce runtime avant `npm ci`, les tests et le build avec TypeScript. Le processus PM2 du frontend conserve un interpréteur absolu, enregistré pour le prochain démarrage. La version de PM2 reste 6.0.13.

Strapi impose `>=22.13.0 <23` dans son projet de production. Son runtime reste donc sur Node 22 ; le correctif de sécurité 22.23.4 remplace 22.23.3 sans changer de version majeure ni de base de données. Umami utilise le même runtime dédié. Les exécutables précédents restent conservés pour le retour arrière.

Les services `pm2-root` et `pm2-wharf` démarrent avec un chemin Node explicite et un PATH Linux. Les processus et leur environnement existants sont sauvegardés et restaurés sans publication de leurs secrets. Après une mise à jour de Node, vérifier aussi les démons PM2, les interpréteurs des applications et leurs listes sauvegardées ; mettre à jour le binaire du système seul ne remplace pas les processus déjà lancés.

## Vérification

Contrôler la version système (`node --version`), les exécutables des processus (`/proc/<pid>/exe`), les interpréteurs de chaque application PM2 et les unités systemd. Vérifier le site public, les pages du portfolio et du blog, le sitemap, le CMS et le tableau de bord Umami. Le contrôle du formulaire et de la prospection reste sans envoi réel.

Les fichiers privés, médias, variables de production et modifications non commitées du checkout serveur ne sont pas remplacés. Les releases sont compilées séparément puis seuls les artefacts de build sont basculés par le déploiement existant.

## Retour arrière

Sauvegarde privée de la migration : `/root/wharf-maintenance/node-migration-20261023/`. Elle contient l’ancien paquet système Node 20, les configurations PM2/systemd et les listes de processus. Le script `rollback.sh` de ce répertoire est réservé à une restauration d’urgence ; il remet une version en fin de support et ne doit pas devenir la configuration durable. Les sauvegardes de build restent dans `/home/wharf/backups/deployment-<commit>/`.

Références officielles consultées le 23 octobre 2026 :

- https://nodejs.org/en/about/previous-releases
- https://nodejs.org/dist/index.json
- https://github.com/nodejs/Release/blob/main/schedule.json
- https://pm2.keymetrics.io/docs/usage/startup/
