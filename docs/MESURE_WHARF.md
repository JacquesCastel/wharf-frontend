# Mesure de Wharf — activation du 6 octobre 2026

## Accès

- Audience : https://bywharf.com/mesure — Umami 3.4.0, hébergé sur le serveur Wharf, PostgreSQL dédiée `wharf_analytics`, service PM2 `wharf-analytics` lié à 127.0.0.1:3030.
- Commercial, GEO et bilans : https://admin.bywharf.com/admin — collections privées **Demandes commerciales**, **Observations GEO**, **Bilans mensuels**. Aucune autorisation REST publique n’est ajoutée.
- Google Search Console : propriété https://bywharf.com/, validée pour le compte Google de Jacques, sitemap https://bywharf.com/sitemap.xml. Le fichier Google public doit être conservé.
- Les identifiants Umami sont remis à Jacques dans un fichier local privé, jamais dans Git. Activer la double authentification dans les préférences du compte.

## Ce qui est mesuré

| Signal | Définition | Limite |
|---|---|---|
| Pages vues / visites | Navigation des visiteurs ayant accepté la mesure | Refus, DNT, bloqueurs et trafic hors navigateur non mesurés ; pas d’historique avant activation |
| `contact_click` | Clic vers Contact, avec page d’origine publique | Intention, pas demande reçue |
| `email_click` | Clic sur un lien mailto | Ne prouve ni rédaction ni envoi |
| `contact_form_success` | Promesse EmailJS résolue, une fois par envoi | Ne prouve ni livraison en boîte de réception ni qualification commerciale |
| `film_play` | Première lecture d’un film contrôlé ou d’un lecteur YouTube identifié dans une fiche WORK | Les vidéos d’ambiance ne comptent pas ; un lecteur externe non YouTube n’est pas instrumenté |
| Domaine d’origine | Domaine uniquement, sans paramètres ni chemin externe | Les renvois ChatGPT/Gemini/Perplexity identifiables ne prouvent pas une citation ; certaines sources masquent le référent |

Ne pas additionner les quatre événements comme s’il s’agissait de quatre prospects. Un même visiteur peut réaliser plusieurs actions. Aucune liaison entre identifiant de visiteur et coordonnées du formulaire n’est créée. Le besoin du formulaire est réduit à un code d’offre fixe.

La mesure démarre après consentement. Le choix, acceptation ou refus, est conservé six mois et modifiable dans le footer. DNT et `umami.disabled=1` sont respectés. Pages privées, URLs inconnues, paramètres et fragments sont exclus ; les pages publiées sont ajoutées à la liste automatiquement. Aucun replay ni heatmap n’est activé. Les statistiques détaillées expirent après treize mois ; le sel des identifiants anonymes tourne chaque jour. Les visiteurs uniques sur un mois ne constituent pas un décompte fiable de personnes distinctes.

## Qualification commerciale

Après une demande réelle, créer une entrée avec une référence interne, sa date, l’offre et la source déclarée. Utiliser **unknown** lorsque l’origine est inconnue. Renseigner les dates de qualification, rendez-vous, devis et signature lorsqu’elles surviennent. L’étape courante décrit le stock ; les dates permettent de compter les transitions du mois, y compris pour une demande reçue plus tôt. Ne pas inventer de parcours à partir d’un clic ni recopier les messages et coordonnées dans les statistiques.

## Tests GEO

Le panel est dans `docs/GEO_BASELINE.md`. Tester dans une session neuve, sans contexte Wharf, en conservant question exacte, date, moteur, modèle/mode, recherche activée ou non, et preuve privée. Une mention, une citation avec URL et une absence sont des observations différentes. Sans réponse testée, conserver **not_tested**. Une question contenant Wharf se classe séparément des questions de découverte.

Les captures privées ne doivent pas être déposées dans les uploads publics Strapi. Utiliser un emplacement privé et renseigner sa référence dans la collection. Aucun score de visibilité ni citation n’est présumé. Les tests dans la présente conversation, qui connaît déjà Wharf, ne sont pas une baseline neutre. Les comptes ou API des moteurs ne sont pas connectés : les observations restent à réaliser et documenter.

## Bilan mensuel

Le serveur génère les agrégats le 3 de chaque mois à 09:00 Europe/Paris dans **Bilans mensuels**, même lorsque le Mac est éteint. Source : `cms/scripts/monthly-measurement.cjs`, lancé dans `/var/www/wharf-strapi` avec le Node dédié. Le premier mois complet commence après l’activation ; octobre 2026 est partiel. Un mois antérieur à l’activation n’est pas rempli de zéros artificiels. Les champs Search Console restent vides jusqu’à un véritable import, jamais zéro par défaut.

Search Console : choisir le mois civil terminé et le type Web, exporter pages/requêtes, relever clics et impressions, puis saisir les indicateurs et référence/date de l’export dans le bilan. Requêtes de marque : motif `wharf|bywharf`. Les requêtes anonymisées ne figurent pas toutes dans les tableaux : marque + hors marque peut différer du total. Les chiffres Web incluent les surfaces IA selon le rapport Google ; ils ne constituent pas un rapport AI Overviews séparé. La connexion Google interactive ne crée pas un accès API permanent ; aucun compte de service ni délégation n’a été ajouté.

Comparer les mois et examiner : pages d’entrée, passage des articles et du portfolio vers Contact, envois réussis observés, demandes qualifiées enregistrées, transitions vers devis/signature, citations réellement testées. Si le volume est faible, décrire les observations plutôt que conclure à un effet causal ou extrapoler une tendance. Retenir trois actions maximum, avec hypothèse et date de réévaluation.

## Exploitation

Conservation quotidienne par `cms/scripts/retain-audience.cjs`, limitée au seul ID du site dans la seule base dédiée. Les sauvegardes privées de la base ont une rétention de trente jours. Pas de clé analytics dans le navigateur : l’ID du site est public, l’accès aux rapports reste authentifié.

Les releases frontend sont construites à partir d’un commit exact, dans un dossier isolé, via `scripts/deploy-clean-release.sh`. La CI ne construit plus depuis le checkout distant contenant des fichiers locaux. Le déploiement conserve les fichiers de Jacques et permet le retour au précédent artefact. Les migrations CMS sont sauvegardées et testées séparément ; ne jamais remplacer la base de production par celle du test.

Documentation primaire consultée le 6 octobre 2026 : [configuration du tracker](https://docs.umami.is/docs/tracker-configuration), [variables d’environnement](https://docs.umami.is/docs/environment-variables), [API YouTube](https://developers.google.com/youtube/iframe_api_reference), [mesure d’audience et conditions CNIL](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience).
