# Chargement des polices — 18 octobre 2026

Rapport PageSpeed fourni : https://pagespeed.web.dev/analysis/https-bywharf-com/ndyc9y0j78

Mesure de laboratoire du 18 octobre à 16:48 UTC+2 : mobile 79, FCP 3,0 s, LCP 4,1 s, TBT 40 ms, CLS 0 ; ordinateur 96, FCP et LCP 0,8 s, TBT 20 ms, CLS 0,002. Aucune donnée de terrain CrUX disponible dans ce rapport. Les scores SEO et bonnes pratiques sont à 100, accessibilité à 96 ; ces scores ne prouvent ni l'indexation ni le classement.

Les requêtes bloquantes comprennent la feuille Google Fonts et deux feuilles CSS du site. Le film d'ambiance de l'accueil représente environ 6 800 Kio sur 7 221 Kio transférés sur mobile. Le LCP final du rapport mobile est le paragraphe du panneau de choix de mesure, affiché côté client ; le CSS et les polices ne sont donc pas les seuls facteurs à examiner. Le gain estimé de 1 440 ms du rapport n'est pas une promesse de gain mesuré.

La correction utilise next/font/google pour récupérer les cinq familles existantes à la compilation, puis servir leurs fichiers depuis Wharf : Lora, Bodoni Moda, Playfair Display, IBM Plex Sans et Mono. Les styles consomment leurs variables CSS. Les liens externes Google Fonts et les préconnexions associées ont été retirés du layout. Lora normal et italique sont préchargés ; les autres familles restent disponibles sans préchargement systématique. font-display: swap et les métriques de substitution sont gérés par next/font.

Le contenu, les choix typographiques et les contrôles de consentement sont conservés. La page de démonstration typographique privée/noindex possède encore son propre import de démonstration ; elle ne fait pas partie du layout public.

Validation : build de production et TypeScript, 48 tests, diff sans erreurs, contrôle visuel de la nouvelle page audiovisuelle. En aperçu, les polices sont chargées depuis /_next/static/media et aucun lien de polices externe n'est présent. Le nouveau score PageSpeed doit être mesuré après déploiement ; les 96/79 ci-dessus restent les mesures de référence.

La vidéo d'accueil reste à optimiser séparément (compression et variantes adaptées aux écrans). Les feuilles CSS nécessaires au rendu n'ont pas été différées au risque d'afficher une page sans styles. Aucun changement expérimental de compilation n'a été activé.

Références :
- https://nextjs.org/docs/app/getting-started/fonts
- https://developer.chrome.com/docs/performance/insights/render-blocking
