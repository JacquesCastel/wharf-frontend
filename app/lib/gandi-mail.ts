import nodemailer from 'gandi-nodemailer';
import { emailAddress, messageText, ProspectError, ProspectStore, prospectStore } from './prospection';
export function mailSettings(env: NodeJS.ProcessEnv = process.env) {
  const sender = env.GANDI_SMTP_USER || 'contact@bywharf.com';
  const configured = Boolean(env.GANDI_SMTP_USER && env.GANDI_SMTP_PASSWORD);
  return { sender, configured, enabled: env.PROSPECTION_SEND_ENABLED === 'true', noticeReady: env.PROSPECTION_NOTICE_READY === 'true' };
}
function transport() {
  const user = emailAddress(process.env.GANDI_SMTP_USER);
  if (!process.env.GANDI_SMTP_PASSWORD) throw new ProspectError('La connexion Gandi reste à configurer.', 503);
  return nodemailer.createTransport({
    host: 'mail.gandi.net', port: 465, secure: true,
    auth: { user, pass: process.env.GANDI_SMTP_PASSWORD },
    tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true, logger: false, debug: false,
  });
}
export async function sendDraft(id: string, reviewHash: string, options: {
  store?: ProspectStore; env?: NodeJS.ProcessEnv;
  send?: (mail: Record<string, unknown>) => Promise<{ accepted: unknown[] }>;
} = {}) {
  const env = options.env || process.env, settings = mailSettings(env);
  if (!settings.configured || !settings.enabled || !settings.noticeReady) throw new ProspectError('Envoi désactivé : configurer Gandi et finaliser la notice de prospection.', 503);
  if (!/^[a-f0-9]{64}$/.test(reviewHash)) throw new ProspectError('Relisez le message complet avant envoi.');
  const store = options.store || prospectStore;
  const reserved = await store.reserve(id, settings.sender, new Date().toISOString(), reviewHash);
  const site = 'https://bywharf.com';
  const mail = {
    from: { name: 'Jacques — Wharf', address: settings.sender }, to: reserved.contact.email,
    replyTo: settings.sender, subject: reserved.subject,
    text: messageText(reserved.contact, reserved.message, site),
    messageId: reserved.message.messageId,
    inReplyTo: reserved.inReplyTo, references: reserved.references,
  };
  // Mark ambiguous SMTP outcomes for manual review; never resend them automatically.
  let accepted = false;
  try {
    const result = await (options.send ? options.send(mail) : transport().sendMail(mail));
    accepted = result.accepted.map(String).some(value => value.toLowerCase() === reserved.contact.email);
    await store.finish(id, accepted);
  } catch {
    await store.finish(id, false);
    throw new ProspectError('Résultat SMTP à vérifier dans Gandi. Aucun nouvel envoi automatique.', 502);
  }
  if (!accepted) throw new ProspectError('Acceptation SMTP non confirmée. Vérifiez Gandi avant toute autre action.', 502);
  return { accepted: true };
}
