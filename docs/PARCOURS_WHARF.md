# Parcours Wharf — 3 novembre 2026

Version validée sur http://127.0.0.1:3132, puis préparée pour publication sur https://bywharf.com via le workflow de déploiement habituel. Cette évolution du frontend ne modifie ni les contenus ni les modèles Strapi de production.

## Parcours disponibles

| Entrée YOU | Lectures sélectionnées | Accompagnements | Contact présélectionné |
| --- | --- | --- | --- |
| Visibilité | Stratégie éditoriale ; cas client | Strategy, Content | Stratégie |
| Dirigeants | Interview ; tribune | Strategy, Video | Stratégie |
| Recrutement | Portrait métier ; marque employeur | Strategy, Video | Marque employeur |
| Transformation | FAQ ; expliquer le changement | Strategy, Content | Communication interne |
| Contenus réguliers | Décliner un tournage | Content, Video | Contenus B2B |
| Film | Brief ; fiction corporate | Video, Création IA | Film ou série |

Le parcours Création IA relie l’offre, la démonstration existante, les articles sur les limites des images générées et sur la valeur d’un test, puis le formulaire prérempli pour la création IA.

Les offres présentent leurs situations correspondantes. Les articles conservent leur lien de service publié et ajoutent des accès directs aux accompagnements pertinents. Les fiches projets proposent les expertises réellement associées, des guides et un contact adapté. Les liens vers les projets proviennent exclusivement de la collection publiée. La fiction d’autopromotion et le test d’avant-vente restent explicitement identifiés. Aucun projet n’est attribué artificiellement au recrutement, à la transformation, à la stratégie ou aux contenus.

## Relations et présentation

Les sélections sont centralisées dans app/lib/content-paths.ts. Les titres, articles et projets affichés restent issus du CMS publié ; une lecture ou une réalisation dépubliée disparaît des blocs correspondants. Les liens explicites relatedProjectIds des articles restent prioritaires. Au café du commerce est toujours exclu des articles, même si son identifiant y est saisi.

Les associations supplémentaires sont configurées dans ce référentiel. Leur édition visuelle dans Strapi reste une évolution distincte ; aucun formulaire CMS de production n’a été modifié ici.

Le paramètre parcours accepte seulement les dix codes du référentiel. Il ne renseigne que le besoin modifiable ; aucun nom, email ou message n’est prérempli. Les métadonnées et canoniques conservent /contact sans paramètre. La mesure existante continue d’exclure la query string et de distinguer clic Contact et envoi confirmé. Aucun email réel n’est envoyé lors des contrôles.
