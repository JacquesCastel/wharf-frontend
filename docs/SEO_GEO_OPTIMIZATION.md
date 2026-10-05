# Optimisation SEO + GEO — Wharf

Passe du 5 octobre 2026 dans `wharf-frontend`. Positionnement conservé : **Agence de stratégie, contenus & production vidéo B2B**. Navigation WE / WORK / YOU / INSIGHTS, baseline « Révéler ce qui existe déjà », palette, typographies, compositions et animations validées conservées.

## État initial

L’inspection du code et du HTML a précédé les modifications. Le site possédait déjà des canonical, huit articles sourcés rendus côté serveur, des taxonomies format/thème, un sitemap avec dates éditoriales, un portfolio Strapi paginé à la collecte et des liens entre offres et articles. Les 21 URL publiques du sitemap avaient un H1 unique. Ces éléments ont été réutilisés.

Les problèmes réels étaient :

- Metadata globales incomplètes ; helper de valeurs par défaut non utilisé ; positionnement abrégé dans le titre d’accueil et le slogan structuré.
- Organization et WebSite sans identifiants communs ; répétition d’organisations anonymes dans les articles et projets ; absence de WebPage, Service et breadcrumbs sur les archives et fiches WORK.
- Canonical de `/accessibilite/engagement` hérité de `/accessibilite` et image sociale `/og-default.jpg` inexistante.
- Connexion et démonstration typographique indexables ; directives d’indexation insuffisantes sur les espaces privés.
- Pagination du portfolio dépendant d’un bouton client après les six premières réalisations ; liens imbriqués du Rich Text perdus ; possibilité d’un H1 supplémentaire venant du CMS.
- Dimensions des logos absentes et dimensions sociales du portfolio déclarées arbitrairement à 1200 × 630.
- Pas de modèle léger de vrais auteurs ; informations d’étude insuffisantes pour question, échantillon, résultats et analyse ; sources peu extensibles.
- Métadonnées vidéo disponibles mais non structurées ; absence de pause explicite pour la vidéo d’ambiance d’une fiche projet.
- Script Vercel Speed Insights demandé sur le VPS alors que son endpoint renvoyait 404.
- Affirmations de conformité et de tests utilisateurs sur l’accessibilité non étayées par un audit disponible.

## Modifications réalisées

Les helpers SEO et JSON-LD existants ont été consolidés autour de `app/lib/site.ts` et `app/lib/structured-data.ts`. Les pages réutilisent ces fonctions au lieu de construire chacune une identité Wharf. Les metadata, l’indexation privée, les sources, les modèles auteur/recherche, le rendu WORK, les liens et quelques corrections d’accessibilité ont été appliqués.

Les huit entrées de `app/lib/insights-content.json` sont inchangées : aucun billet réécrit mécaniquement, nouvelle date de publication, auteur inventé, étude fictive ou résultat client ajouté. Aucun changement dans Strapi ni suppression d’URL existante. Une route de profil auteur a été préparée mais aucun profil n’est publié.

## SEO

- Domaine canonique public centralisé sur `https://bywharf.com`, indépendamment d’une variable de preview ou d’une ancienne URL Vercel.
- Titres absolus et descriptions propres à chaque page ; Open Graph et Twitter cards avec image de secours valide `/og`. Les dimensions CMS réelles sont conservées lorsqu’elles existent.
- Metadata de l’engagement d’accessibilité autonomes et entrée de sitemap distincte. Sitemap limité aux pages publiques, taxonomies alimentées, articles et projets réellement publiés ; auteurs uniquement avec article publié.
- Connexion, démonstration et espaces privés en `noindex, nofollow`, également via `X-Robots-Tag`. Les pages protégées conservent leur authentification. En production, `/admin/` est refusé en HTTP 403 par l’hébergement, avant Next.js ; les directives ajoutées restent applicables au rendu de cette route dans l’application. Ne pas confondre désindexation et protection des données.
- Vraies 404 pour les contenus inexistants et archives vides ; H1 et élément main dans la page d’erreur.
- Pagination WORK par liens HTML : chaque page non filtrée dispose d’un canonical propre ; les variantes de type restent `noindex, follow`. Les numéros inexistants sont rejetés. Une indisponibilité du CMS ne doit pas transformer une URL de pagination connue en 404.
- Aucun hreflang ajouté : aucune version multilingue n’existe actuellement.
- Les règles robots publiques continuent à autoriser les pages, avec exclusion de `/api/`. Aucune modification de politique GPTBot ; Googlebot, Bingbot et OAI-SearchBot ne sont pas bloqués par ces règles.

## GEO

La priorité reste la clarté pour le lecteur : introduction directe, titres explicites, sources visibles dans le HTML, dates réelles, signature identifiable, tableau avec légende et en-têtes, lectures liées et expertise pertinente. Le bloc « À retenir » reste facultatif. Une date de mise à jour distincte devient visible lorsqu’une évolution éditoriale est réellement datée.

Les citations JSON-LD reprennent les sources affichées, sans inventer leur organisme ou leur date. La grille interne `docs/GEO_BASELINE.md` prépare 30 requêtes avec les champs demandés. Les résultats sont tous **non testés** : aucun score ou niveau de visibilité IA n’est affirmé.

Aucun FAQPage, fichier IA spécial, promesse de classement ou garantie de citation ajouté. Google confirme que les fondamentaux SEO s’appliquent à ses fonctionnalités IA, sans schéma spécifique supplémentaire : [documentation Google](https://developers.google.com/search/docs/appearance/ai-features), consultée le 5 octobre 2026.

## Structured data

| Nœud | Relation et contenu |
|---|---|
| Organization | Identifiant stable `https://bywharf.com/#organization`, nom, URL, logo existant, email public et domaines d’expertise cohérents avec le site. Pas d’adresse ou de lien social non confirmé. |
| WebSite | Identifiant `/#website`, publisher → Organization. |
| WebPage | Identifiant de la page `#webpage`, isPartOf → WebSite, publisher → Organization. AboutPage pour WE, ContactPage pour Contact, CollectionPage pour les archives. |
| BlogPosting | Sous-type d’Article : URL, dates éditoriales, thème, format, image, sources, mainEntityOfPage → WebPage ; auteur et publisher → Organization pour les signatures actuelles Wharf. |
| Person / ProfilePage | Émis seulement pour un vrai auteur renseigné et publié ; Article → Person → worksFor → Organization, profil et articles liés. |
| BreadcrumbList | Archives de thèmes/formats, articles, fiches WORK et futurs profils auteur. |
| Service | Quatre offres visibles : stratégie, contenus, vidéo et création IA ; provider → Organization ; mêmes identifiants référencés par les articles et réalisations pertinents. |
| CreativeWork / VideoObject | Réalisation réelle liée à sa page ; vidéo uniquement avec titre, description, vignette, vraie date de mise à disposition et source lisible. |

Les JSON-LD sont sérialisés en échappant les caractères pouvant fermer un script. Il n’existe qu’une définition principale de Wharf par page. Les organisations citées comme sources sont distinctes de Wharf. Aucune propriété de résultat, témoignage ou Dataset ajoutée sans données.

Références : [Article](https://developers.google.com/search/docs/appearance/structured-data/article) et [Video](https://developers.google.com/search/docs/appearance/structured-data/video), Google, consultées le 5 octobre 2026.

## Maillage

Le maillage existant offres ↔ Insights a été conservé. Les ancres finales des articles précisent l’accompagnement lié, au lieu d’un libellé générique. Les fiches WORK renvoient aux expertises et aux guides pertinents. Les liens Rich Text Strapi sont maintenant préservés dans le HTML.

Un champ facultatif `relatedProjectIds` permet des relations article → réalisation réelle publiée ; aucune relation n’est créée automatiquement pour remplir un bloc. « Au café du commerce » demeure exclusivement dans le portfolio et est explicitement exclu de ce bloc dans le blog. La bibliothèque actuelle, les archives et les fiches publiques sont accessibles par des liens HTML.

## Insights

Les deux dimensions format/thème et les URL existantes sont conservées. Seuls trois thèmes et deux formats ayant des contenus sont actuellement indexables. Les archives Observations, Études et Marque employeur ne sont pas générées tant qu’elles sont vides.

Le registre auteur est local, comme les articles : `app/lib/insights-authors.json`. Il n’existe pas de système auteur Strapi disponible dans le projet à améliorer. Les profils supportent nom, fonction, bio, expertises, photo facultative et date ; les signatures actuelles ne sont pas réattribuées.

Les sources supportent désormais label, URL, consultation, organisme, titre et publication lorsqu’ils sont connus. Pour une étude, le modèle exige question, période, périmètre, échantillon, méthode, résultats, analyse, limites et sources. Les contrôles refusent notamment les doublons de slug, signatures inconnues, dates invalides, références de section dupliquées et tableaux incohérents. La procédure est détaillée dans `docs/insights-editorial.md`.

## WORK

Les blocs Strapi existants suffisent pour structurer contexte, problématique, compréhension, choix stratégique, réponse, production, résultats documentés, enseignements et expertises. La trame éditoriale est documentée ; pas de nouveau modèle CMS ni de fiche fictive.

Le portfolio utilise maintenant un Server Component pour ses listes, filtres et pagination. Les fiches réutilisent le rendu Rich Text commun, maintiennent les liens et empêchent un H1 additionnel venant des blocs. Les erreurs CMS temporaires ne sont plus converties systématiquement en 404 sur une fiche connue.

Pour « Au café du commerce », VideoObject utilise le fichier vidéo public, la vignette réelle, l’embed existant et la date de création du média CMS : **4 novembre 2025 à 13:42:42 UTC**, distincte de la publication de la fiche. Durée et transcription n’étant pas disponibles, elles ne sont pas déclarées. Les films et fonds décoratifs ne reçoivent pas de balisage éditorial artificiel.

## Technique

Dimensions réelles des logos et vignettes lorsque disponibles, images de portfolio chargées à la demande, image d’accueil prioritaire conservée. Les polices validées gardent `display=swap` et leurs préconnexions. Les familles utilisées par le site et sa démonstration ne sont pas supprimées arbitrairement.

Les vidéos d’ambiance partagent un contrôle de lecture : pause manuelle, préférence de mouvement réduit, arrêt hors écran et lorsque l’onglet est masqué. Un bouton est ajouté à la fiche projet. Le lien « Aller au contenu » apparaît au clavier. Le titre superposé au film dans WORK reçoit une couleur blanche explicite : sa couleur globale noire prenait le dessus sur celle du conteneur vidéo. Les paragraphes du portfolio utilisent aussi la couleur de texte principale, car leur ancien gris était trop clair pour du corps en 18 px ; les variables des modes d’accessibilité restent respectées. Les assertions d’accessibilité ont été corrigées pour exprimer des objectifs, sans annoncer une conformité non auditée.

Speed Insights est conservé pour un éventuel hébergement Vercel mais n’est plus chargé sur le VPS. Aucun outil de mesure du trafic organique ou des conversions (GA, Matomo, Plausible) n’a été trouvé ni installé. Le formulaire EmailJS existant n’a pas été envoyé pendant les vérifications.

Validation : build de production avec TypeScript activé ; 14 tests automatisés réussis ; `git diff --check` ; ESLint ciblé sans erreur. Trois avertissements restent sur les logos natifs et le lien de polices existant. Le contrôle HTTP couvre les 22 URL du sitemap, les metadata uniques, H1/main, hiérarchie de titres, JSON-LD, sources, liens et ancres internes, images sociales, 404, pages privées et robots. Les user-agents Googlebot, Bingbot et OAI-SearchBot reçoivent le texte et les metadata dans le HTML ; le paramètre `utm_source=chatgpt.com` conserve un canonical propre.

Ces contrôles ne constituent pas une mesure des Core Web Vitals réels ni une certification d’accessibilité. Pas de scores LCP, CLS ou INP inventés. Les données terrain sont à consulter dans Search Console/CrUX lorsqu’un échantillon et les accès existent.

## À compléter éditorialement

- Profils de personnes réellement impliquées dans les contenus : identité, fonction, bio, expertises et photo autorisée.
- Cas clients avec contexte, décisions, livrables, autorisation de publication et résultats sourcés, si disponibles. Le test SGB reste une démonstration d’avant-vente, pas un résultat client publié.
- Transcriptions, sous-titres et durées vérifiées des films importants ; date réelle de mise à disposition pour chaque nouveau média.
- Protocoles, corpus et données originales pour observations/études ; distinguer observations, interprétations et conseils, exposer les limites.
- Coordonnées et profils sociaux confirmés avant d’enrichir Organization. Aucun LocalBusiness ou adresse n’est présumé.

## Points à surveiller

1. **Mesure** : renseigner `GOOGLE_SITE_VERIFICATION` et/ou `BING_SITE_VERIFICATION` avec de vrais jetons si une vérification HTML est souhaitée, puis soumettre le sitemap. Une vérification DNS reste possible. Les jetons et accès ne sont pas inventés. Comparer pages d’entrée, trafic organique, référents IA et paramètres UTM avec la solution de mesure retenue. Distinguer clic mailto et demande réellement envoyée ; pour le formulaire, la confirmation après succès EmailJS est le point de mesure, pas le simple clic sur « Envoyer ».
2. **Google IA** : les visites issues des fonctionnalités IA Google sont comprises dans le rapport Web Search Console ; ce rapport ne permet pas ici d’isoler une conversion AI Overviews. Suivre séparément les tests de citation avec date et preuve, sans en déduire un trafic garanti. [Documentation Google](https://developers.google.com/search/docs/appearance/ai-features), consultée le 5 octobre 2026.
3. **Alias www** : HTTP redirige vers HTTPS ; `https://www.bywharf.com/` sert encore la même page en 200 avec canonical sur bywharf.com. Une redirection unique de l’alias serait à configurer au niveau de l’hébergement lorsque sa configuration est disponible ; aucune modification Nginx n’a été présumée.
4. **Disponibilité CMS** : le sitemap refuse une réponse incomplète si le portfolio est indisponible. La route CMS Contact existante répond 404 ; le contenu et les metadata publics utilisent leurs valeurs éditoriales valides. Surveiller les erreurs serveur ; aucune modification de schéma Strapi n’a été improvisée.
5. **Robots** : Search et entraînement restent distincts. Les règles publiques n’ont pas été durcies ni la politique GPTBot modifiée. [Documentation OpenAI](https://developers.openai.com/api/docs/bots), consultée le 5 octobre 2026.
6. **Production** : déploiement principal `7a2bed4` réussi via `.github/workflows/deploy.yml` (run `37350234766`). Contrôles publics : 22 pages et 102 destinations internes sans erreur. Inspection bureau et mobile à 390 × 844 : navigation, formulaire et tableaux sans débordement global ; pause vidéo fonctionnelle. La hauteur des sections d’accueil reste identique à la version de référence. Le titre WORK blanc a également été vérifié en production après le correctif `a34c100` (run `37351110511`, réussi). Le renforcement du contraste des paragraphes de portfolio complète cette correction ; chaque déploiement est contrôlé sur la page effectivement servie. Un build réussi ne prouve pas seul qu’une version est en ligne. Les observations de cette passe ne garantissent aucune position ou citation future.
