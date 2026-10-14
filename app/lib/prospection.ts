import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

export type ContactStatus = 'active' | 'replied' | 'opposed' | 'bounced' | 'closed';
export type Contact = { id: string; company: string; name: string; email: string; role: string; source: string; collectedAt: string; qualified: boolean; status: ContactStatus; token: string; createdAt: string };
export type Message = { id: string; contactId: string; step: number; subject: string; body: string; status: 'draft' | 'sending' | 'accepted' | 'uncertain'; createdAt: string; attemptedAt?: string; acceptedAt?: string; messageId?: string };
type State = { version: 1; contacts: Contact[]; messages: Message[]; suppressions: { hash: string; at: string }[] };
export class ProspectError extends Error { constructor(message: string, public status = 400) { super(message); } }
const empty = (): State => ({ version: 1, contacts: [], messages: [], suppressions: [] });
const signature = 'Jacques\nWHARF — SARL\n122 rue Amelot, 75011 Paris\nSIREN 513 572 883\ncontact@bywharf.com';
export function emailAddress(value: unknown) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(email)) throw new ProspectError('Une seule adresse professionnelle valide est requise.');
  return email;
}
function text(value: unknown, max: number, label: string) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /\x00/.test(value)) throw new ProspectError(label + ' invalide.');
  return value.trim();
}
function hash(email: string) { return createHash('sha256').update(emailAddress(email)).digest('hex'); }
function day(value: string) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date(value)); }
function workingDays(from: string, now: string) {
  let count = 0; const date = new Date(day(from) + 'T12:00:00Z'); const end = day(now);
  while (date.toISOString().slice(0, 10) < end) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (![0, 6].includes(date.getUTCDay())) count++;
  }
  return count;
}
function sourceUrl(value: unknown) {
  const source = text(value, 2000, 'Source'); let url: URL;
  try { url = new URL(source); } catch { throw new ProspectError('La source doit être une URL publique.'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new ProspectError('La source doit utiliser HTTPS.');
  return source;
}
export function messageText(contact: Contact, message: Message, site: string) {
  return message.body + '\n\n' + signature + '\n\n'
    + (message.step === 0 ? 'Votre adresse professionnelle est publiée sur ' + contact.source + '. WHARF l’utilise sur la base de son intérêt légitime pour vous proposer un accompagnement lié à votre fonction.\n' : '')
    + 'Pour ne plus recevoir de sollicitation, répondez « stop » ou confirmez votre opposition ici : ' + site + '/desinscription/' + contact.token
    + '\nInformations et droits : ' + site + '/confidentialite#prospection-professionnelle.';
}
// Durable single-host store. A cross-process lock protects reservations, limits and exclusions.
export class ProspectStore {
  constructor(private directory: string) {}
  private async transaction<T>(action: (state: State) => T | Promise<T>, save = true): Promise<T> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    const lock = path.join(this.directory, 'lock');
    let acquired = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      try { await mkdir(lock, { mode: 0o700 }); acquired = true; break; }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; await new Promise(resolve => setTimeout(resolve, 50)); }
    }
    if (!acquired) throw new ProspectError('Une opération est en cours. Réessayez dans quelques instants.', 409);
    try {
      let state: State;
      try { state = JSON.parse(await readFile(path.join(this.directory, 'state.json'), 'utf8')); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; state = empty(); }
      if (state.version !== 1 || !Array.isArray(state.contacts) || !Array.isArray(state.messages) || !Array.isArray(state.suppressions)) throw new Error('Invalid prospect store');
      const result = await action(state);
      if (save) {
        const temporary = path.join(this.directory, randomUUID() + '.tmp');
        await writeFile(temporary, JSON.stringify(state), { mode: 0o600, flag: 'wx' });
        await rename(temporary, path.join(this.directory, 'state.json'));
      }
      return result;
    } finally { await rm(lock, { recursive: true }); }
  }
  async snapshot() {
    return this.transaction(state => ({
      contacts: state.contacts.map(({ token, ...contact }) => contact),
      messages: state.messages,
    }), false);
  }
  async addContact(input: Record<string, unknown>, now = new Date().toISOString()) {
    const email = emailAddress(input.email);
    const collectedAt = text(input.collectedAt, 10, 'Date de collecte');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(collectedAt) || !Number.isFinite(Date.parse(collectedAt)) || new Date(collectedAt).toISOString().slice(0, 10) !== collectedAt || collectedAt > day(now)) throw new ProspectError('Date de collecte invalide.');
    const contact: Contact = {
      id: randomUUID(), email, company: text(input.company, 180, 'Entreprise'), name: text(input.name, 180, 'Nom'),
      role: text(input.role, 240, 'Fonction'), source: sourceUrl(input.source), collectedAt,
      qualified: input.qualified === true, status: 'active', token: randomBytes(32).toString('hex'), createdAt: now,
    };
    return this.transaction(state => {
      if (state.suppressions.some(item => item.hash === hash(email))) throw new ProspectError('Cette adresse a fait opposition.', 409);
      if (state.contacts.some(item => item.email === email)) throw new ProspectError('Ce contact existe déjà.', 409);
      state.contacts.push(contact); return contact.id;
    });
  }
  async saveDraft(input: Record<string, unknown>, now = new Date().toISOString()) {
    const contactId = text(input.contactId, 80, 'Contact');
    const subject = text(input.subject, 160, 'Objet');
    const body = text(input.body, 6000, 'Message');
    if (/[\r\n]/.test(subject) || /^re\s*:/i.test(subject)) throw new ProspectError('Objet invalide. Les relances conservent leur fil automatiquement.');
    return this.transaction(state => {
      const contact = state.contacts.find(item => item.id === contactId);
      if (!contact || contact.status !== 'active') throw new ProspectError('Ce contact est exclu des envois.', 409);
      if (/\[.+?\]|\{\{.+?\}\}/.test(subject + body)) throw new ProspectError('Remplacez les champs de personnalisation avant de sauvegarder.');
      const history = state.messages.filter(item => item.contactId === contactId);
      if (history.some(item => ['sending', 'uncertain'].includes(item.status))) throw new ProspectError('Un envoi doit être vérifié manuellement avant toute nouvelle tentative.', 409);
      const step = history.filter(item => item.status === 'accepted').length;
      if (step >= 3) throw new ProspectError('La séquence de trois messages est terminée.', 409);
      const existing = history.find(item => item.status === 'draft');
      if (existing) { existing.subject = subject; existing.body = body; return existing.id; }
      const draft: Message = { id: randomUUID(), contactId, step, subject, body, status: 'draft', createdAt: now };
      state.messages.push(draft); return draft.id;
    });
  }
  async preview(id: string, site: string) {
    return this.transaction(state => {
      const message = state.messages.find(item => item.id === id);
      const contact = state.contacts.find(item => item.id === message?.contactId);
      if (!message || !contact) throw new ProspectError('Message introuvable.', 404);
      const first = state.messages.find(item => item.contactId === contact.id && item.status === 'accepted');
      const preview = { to: contact.email, subject: message.step && first ? 'Re: ' + first.subject : message.subject, text: messageText(contact, message, site), id: message.id };
      return { ...preview, reviewHash: createHash('sha256').update(JSON.stringify(preview)).digest('hex') };
    }, false);
  }
  async reserve(id: string, sender: string, now = new Date().toISOString(), reviewHash?: string) {
    return this.transaction(state => {
      const message = state.messages.find(item => item.id === id);
      const contact = state.contacts.find(item => item.id === message?.contactId);
      if (!message || !contact) throw new ProspectError('Message introuvable.', 404);
      if (message.status !== 'draft') throw new ProspectError('Ce message a déjà été traité. Aucun nouvel envoi.', 409);
      if (!contact.qualified || contact.status !== 'active' || state.suppressions.some(item => item.hash === hash(contact.email))) throw new ProspectError('Contact non qualifié ou exclu.', 409);
      if (day(now) >= contact.collectedAt && Date.parse(day(now)) - Date.parse(contact.collectedAt) >= 90 * 86400000) throw new ProspectError('Contact à réexaminer après trois mois. Envoi bloqué.', 409);
      const history = state.messages.filter(item => item.contactId === contact.id && item.id !== id && item.status !== 'draft');
      if (reviewHash) {
        const preview = { to: contact.email, subject: message.step && history[0] ? 'Re: ' + history[0].subject : message.subject, text: messageText(contact, message, 'https://bywharf.com'), id: message.id };
        if (createHash('sha256').update(JSON.stringify(preview)).digest('hex') !== reviewHash) throw new ProspectError('Le brouillon a changé. Relisez son nouvel aperçu avant envoi.', 409);
      }
      if (history.some(item => ['sending', 'uncertain'].includes(item.status))) throw new ProspectError('Un envoi précédent doit être vérifié.', 409);
      if (history.length !== message.step || history.length >= 3) throw new ProspectError('Séquence incohérente ou terminée.', 409);
      if (message.step > 0) {
        const first = history[0], previous = history[history.length - 1];
        if (!first.acceptedAt || !previous.acceptedAt || workingDays(first.acceptedAt, now) < (message.step === 1 ? 5 : 11) || workingDays(previous.acceptedAt, now) < 5) throw new ProspectError('Cette relance n’est pas encore due.', 409);
      }
      const attempts = state.messages.filter(item => item.attemptedAt && day(item.attemptedAt) === day(now));
      if (attempts.length >= 3) throw new ProspectError('La limite de trois emails par jour est atteinte.', 429);
      message.status = 'sending'; message.attemptedAt = now;
      message.messageId = '<' + message.id + '@' + emailAddress(sender).split('@')[1] + '>';
      const first = history[0], references = history.map(item => item.messageId!).filter(Boolean);
      return { contact: { ...contact }, message: { ...message }, subject: first ? 'Re: ' + first.subject : message.subject, inReplyTo: references.at(-1), references };
    });
  }
  async finish(id: string, accepted: boolean, now = new Date().toISOString()) {
    return this.transaction(state => {
      const message = state.messages.find(item => item.id === id);
      if (!message || message.status !== 'sending') throw new ProspectError('Réservation introuvable.', 409);
      message.status = accepted ? 'accepted' : 'uncertain';
      if (accepted) message.acceptedAt = now;
    });
  }
  async setStatus(id: string, status: ContactStatus, now = new Date().toISOString()) {
    if (!['replied', 'opposed', 'bounced', 'closed'].includes(status)) throw new ProspectError('Statut invalide.');
    return this.transaction(state => {
      const contact = state.contacts.find(item => item.id === id);
      if (!contact) throw new ProspectError('Contact introuvable.', 404);
      if (contact.status === 'opposed') return;
      contact.status = status;
      if (status === 'opposed' && !state.suppressions.some(item => item.hash === hash(contact.email))) state.suppressions.push({ hash: hash(contact.email), at: now });
    });
  }
  async unsubscribe(token: string, now = new Date().toISOString()) {
    if (!/^[a-f0-9]{64}$/.test(token)) throw new ProspectError('Lien invalide.', 404);
    return this.transaction(state => {
      const contact = state.contacts.find(item => item.token === token);
      if (!contact) throw new ProspectError('Lien invalide.', 404);
      contact.status = 'opposed';
      if (!state.suppressions.some(item => item.hash === hash(contact.email))) state.suppressions.push({ hash: hash(contact.email), at: now });
    });
  }
}
export const prospectStore = new ProspectStore(process.env.PROSPECTION_DATA_DIR || path.join(process.cwd(), '.private', 'prospection'));
