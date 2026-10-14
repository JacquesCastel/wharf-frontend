# Module privé de prospection Gandi

Développement du 14 octobre 2026. Aucun email réel envoyé. Les envois sont désactivés par défaut.

## Fonctionnement

- Page `/prospection`, réservée aux sessions administrateur Wharf.
- Saisie d’un contact professionnel, de sa source publique et de la date de collecte.
- Brouillon personnalisé et aperçu du texte complet avec signature, source et information sur les données.
- Validation explicite d’un seul destinataire et d’un seul message avant chaque envoi.
- Trois tentatives d’envoi maximum par jour, fuseau Europe/Paris.
- Trois messages maximum par contact. Délais minimaux de cinq puis onze jours ouvrés depuis le premier, et cinq jours entre deux messages.
- Historique durable avec distinction entre brouillon, réservation, acceptation SMTP et résultat incertain.
- Arrêt des relances lorsqu’un contact est marqué réponse reçue, opposition, adresse invalide ou clos.
- Lien d’opposition opaque ; confirmation par formulaire POST. L’ouverture du lien par un scanner ne désinscrit pas la personne.
- Aucune pièce jointe, HTML de tracking, ouverture mesurée, envoi groupé ou relance automatique.
- Les réponses et retours d’erreur se consultent dans Gandi. La synchronisation IMAP n’est pas implémentée : il faut mettre à jour le statut dans l’outil avant toute relance.
- L’acceptation SMTP signifie que Gandi a accepté le message, pas qu’il est arrivé dans la boîte principale.

## Configuration serveur

Installer les dépendances avec `npm ci`, puis renseigner dans l’environnement du processus Next.js :

```dotenv
GANDI_SMTP_USER=contact@bywharf.com
GANDI_SMTP_PASSWORD=
PROSPECTION_DATA_DIR=/home/wharf/private/prospection
PROSPECTION_SEND_ENABLED=false
PROSPECTION_NOTICE_READY=false
```

Le mot de passe est celui de la boîte Gandi, pas du compte de gestion des domaines. Le saisir directement sur le serveur, dans un fichier privé de permissions 600 ou le gestionnaire de secrets existant. Ne pas le mettre dans Git, le navigateur, une variable NEXT_PUBLIC ou le chat.

Le transport utilise `mail.gandi.net:465`, TLS avec validation des certificats et TLS 1.2 minimum. Le nom affiché est « Jacques — Wharf ». L’adresse d’expédition et de réponse est GANDI_SMTP_USER.

Configurer un répertoire persistant appartenant à l’utilisateur du service, en permissions 700. Le fichier des contacts et messages utilise les permissions 600. Il doit rester hors de public, des exports et des releases supprimables. Le répertoire privé par défaut est `.private/prospection` : utiliser la configuration absolue ci-dessus en production.

Sauvegarder le fichier de manière privée avec une politique de conservation ; les adresses, sources et textes sont des données personnelles. Le fichier contient aussi les jetons des liens d’opposition. Ne pas publier ni importer automatiquement les 40 prospects : ajouter d’abord les contacts réellement qualifiés.

## Préparer la mise en service

1. Déployer le code et vérifier l’authentification administrateur sur /prospection et /api/prospection.
2. Renseigner Gandi et le stockage persistant.
3. Finaliser et publier la notice à /confidentialite#prospection-professionnelle : identité connue, Gandi comme prestataire de messagerie, hébergement et transferts vérifiés, conservation opérationnelle.
4. Vérifier SPF, DKIM et DMARC, puis la connexion SMTP.
5. Mettre PROSPECTION_NOTICE_READY=true seulement après cette vérification. Mettre PROSPECTION_SEND_ENABLED=true uniquement lors de l’activation choisie.
6. Préparer un email de test vers une boîte contrôlée et autoriser son envoi. Aucun test réel n’est effectué par les tests automatisés.
7. Contrôler la réception, le lien d’opposition et le statut avant de commencer le pilote.

La commande `node --env-file=.env.local scripts/prospection-check-smtp.cjs` vérifie la connexion et l’authentification, sans envoyer de message. Elle ne remplace pas un test de réception. Elle nécessite un Node compatible avec --env-file.

Le fournisseur est confirmé comme Gandi. L’identité exacte de l’hébergeur du serveur et les conditions de traitement / transferts restent à documenter ; ne pas annoncer une absence de transfert sur la seule base du domaine de l’adresse.

## Exploitation

- Double clic / requête répétée : la réservation durable empêche le renvoi du même brouillon.
- Délai SMTP dépassé ou résultat ambigu : statut « résultat à vérifier ». Aucun retry automatique. Contrôler Gandi et le message ID avant d’envisager une intervention.
- Processus arrêté après réservation : « envoi réservé — à vérifier ». Contrôler le message dans Gandi ; ne pas réinitialiser le statut pour tenter à l’aveugle.
- Verrou de stockage laissé par un arrêt brutal : arrêter les processus, vérifier l’état et retirer uniquement le dossier lock après contrôle. Aucun déverrouillage automatique qui risquerait deux opérations concurrentes.
- Opposition reçue par email : la marquer immédiatement. Lien de confirmation : l’opposition est enregistrée automatiquement dans le stockage.
- Après trois mois depuis la collecte, les nouveaux envois sont bloqués pour réexamen. La suppression ou anonymisation des données et des sauvegardes doit encore être organisée ; ce blocage n’est pas une purge RGPD.
- Le stockage est prévu pour un serveur unique avec disque persistant partagé entre les workers. Ne pas déployer sur plusieurs machines ou un filesystem éphémère. Une base transactionnelle sera nécessaire pour cette évolution.
- Le endpoint public d’opposition ne révèle pas l’adresse ou le nom du prospect. Les journaux du proxy doivent néanmoins masquer /desinscription/* pour ne pas archiver les jetons dans des logs d’accès.

## Validation

Tests métier hors réseau : destinataire unique, accès administrateur, origine des écritures, double réservation, limites durables, délais en jours ouvrés, oppositions et réimport, blocage après réponse, contenu légal, envois désactivés et GET d’opposition sans mutation.

Les tests SMTP injectent un transport factice. Le comportement réel du compte Gandi dépend de la configuration et n’a pas encore été validé.

Le transport du module utilise Nodemailer 10.1.1 sous l’alias npm gandi-nodemailer : cela évite de lui imposer l’ancienne version demandée par le peer optionnel de NextAuth. Nodemailer 7 reste présent comme peer optionnel de l’authentification existante, sans être utilisé par le transport Gandi. Les failles critiques détectées dans le socle ont motivé la mise à jour de Next.js vers 16.3.8 et NextAuth vers 4.24.15, suivie des vérifications. L’audit global npm signale encore des alertes de sévérité modérée ou élevée dans les dépendances existantes. Aucun npm audit fix --force n’a été exécuté.

## Documentation

- [Gandi — configuration de la messagerie](https://docs.gandi.net/fr/gandimail/configuration_messagerie/index.html).
- [Gandi — limitations et usage standard](https://docs.gandi.net/en/gandimail/limitations.html). Les plafonds techniques ne sont pas une autorisation de campagne de masse.
- [Nodemailer — transport SMTP](https://nodemailer.com/smtp).
