const nodemailer = require('gandi-nodemailer');
const user = process.env.GANDI_SMTP_USER;
const pass = process.env.GANDI_SMTP_PASSWORD;
if (!user || !pass) { console.error('Renseigner les variables Gandi sur le serveur.'); process.exit(1); }
const transport = nodemailer.createTransport({
  host: 'mail.gandi.net', port: 465, secure: true, auth: { user, pass },
  tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 20000,
  logger: false, debug: false,
});
transport.verify().then(() => {
  console.log('Connexion et authentification SMTP validées. Aucun message envoyé.');
}).catch(() => {
  console.error('Connexion SMTP non validée. Vérifier les accès Gandi et le réseau du serveur.');
  process.exitCode = 1;
}).finally(() => transport.close());
