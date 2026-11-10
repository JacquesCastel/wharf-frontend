# Captcha du formulaire de contact

Le formulaire conserve EmailJS, son service `service_dl0m9h9` et son modèle `template_fobl3ib`. L’intégration utilise reCAPTCHA **v2, case « Je ne suis pas un robot »**, seule version prise en charge nativement par EmailJS. Le jeton est transmis dans `g-recaptcha-response`.

## Activation indispensable dans les deux services

1. Dans la console Google reCAPTCHA, créer ou sélectionner une clé **v2 case à cocher** pour les domaines du site Wharf. Conserver la validation du domaine. Ne pas utiliser une clé v3 ni une clé de démonstration en production.
2. Ajouter la **clé publique de site** dans la variable `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` de l’environnement de construction/déploiement. Cette valeur est destinée au navigateur. Aucune clé secrète n’entre dans le dépôt, dans une variable `NEXT_PUBLIC_*` ni dans la conversation.
3. Préparer le site avec cette clé et vérifier l’affichage du widget. Dans EmailJS, ouvrir **Email Templates → template_fobl3ib → Settings**, activer **Enable reCAPTCHA V2 verification** et saisir la **clé secrète correspondante directement dans EmailJS**. Coordonner cette activation avec le déploiement pour ne pas bloquer le formulaire de production existant.
4. Vérifier qu’EmailJS refuse les requêtes sans jeton valide, puis effectuer un essai de bout en bout sous le contrôle de Jacques. La présence du widget et les tests simulés ne prouvent pas, à eux seuls, l’activation de la vérification chez EmailJS.

**Configuration sans clé :** sans clé publique, le formulaire existant reste disponible et aucun script Google n’est chargé. Cette configuration ne constitue pas une protection captcha active. Ne pas annoncer la protection comme opérationnelle avant l’activation et la vérification côté EmailJS.

## Clé dédiée au formulaire Wharf

La clé créée le 10 novembre 2026 porte le libellé **Wharf — Formulaire de contact**, dans le projet Google Cloud **Wharf**. Sa configuration est accessible dans https://www.google.com/recaptcha/admin/site/773416838/settings. Le choix doit être **Défi (v2)** puis **Case à cocher « Je ne suis pas un robot »**. Un exemple Google utilisant `enterprise.execute(..., { action: "LOGIN" })` ne correspond pas à cette intégration EmailJS. La clé secrète reste dans Google et dans les réglages du modèle EmailJS ; elle ne figure pas ici.

## Comportement attendu

Avec une clé configurée, l’envoi reste verrouillé jusqu’à la validation du widget. L’expiration ou une erreur invalide la réponse. Un échec d’envoi conserve les champs saisis et exige une nouvelle vérification ; les jetons ne sont pas réutilisés. Le script peut être rechargé après une panne réseau. Le widget passe au format compact sur les petits écrans. L’adresse email directe reste disponible si la vérification ne fonctionne pas.

La mesure `contact_form_success` reste déclenchée uniquement après résolution de l’envoi EmailJS. Elle ne contient ni jeton captcha ni données personnelles. La page Confidentialité présente Google reCAPTCHA lorsque la clé est configurée.

Contrôles : `node --test tests/*.test.cjs`, build TypeScript avec le runtime Node du projet, `git diff --check`, affichage Contact sur ordinateur et mobile. Les tests isolés ne transmettent aucun message réel.

Sources consultées le 10 novembre 2026 :

- https://www.emailjs.com/docs/user-guide/adding-captcha-verification/
- https://developers.google.com/recaptcha/docs/display
- https://developers.google.com/recaptcha/docs/verify
