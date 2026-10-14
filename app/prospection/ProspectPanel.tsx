'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Contact, Message, ContactStatus } from '../lib/prospection';
import './prospection.css';
type Data = { contacts: Omit<Contact, 'token'>[]; messages: Message[]; settings: { sender: string; configured: boolean; enabled: boolean; noticeReady: boolean } };
type Preview = { id: string; to: string; subject: string; text: string; reviewHash: string };
const statusLabels: Record<ContactStatus, string> = { active: 'À contacter', replied: 'Réponse reçue', opposed: 'Opposition', bounced: 'Adresse invalide', closed: 'Clos' };
const messageLabels: Record<Message['status'], string> = { draft: 'Brouillon', sending: 'Envoi réservé — à vérifier', accepted: 'Accepté par Gandi', uncertain: 'Résultat à vérifier dans Gandi' };
export default function ProspectPanel() {
  const [data, setData] = useState<Data>();
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(''), [preview, setPreview] = useState<Preview>();
  const [subject, setSubject] = useState(''), [body, setBody] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [contact, setContact] = useState({ company: '', name: '', email: '', role: '', source: '', collectedAt: new Date().toISOString().slice(0, 10), qualified: false });
  async function refresh() {
    const response = await fetch('/api/prospection', { cache: 'no-store' }); const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setData(result);
  }
  useEffect(() => { refresh().catch(e => setError(e.message)); }, []);
  async function action(input: Record<string, unknown>, success: string) {
    if (busy) return;
    setBusy(true); setError(''); setNotice(''); setReviewed(false);
    try {
      const response = await fetch('/api/prospection', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (result.preview) setPreview(result.preview);
      if (input.action === 'send') setPreview(undefined);
      if (input.action === 'contact') setContact({ ...contact, company: '', name: '', email: '', role: '', source: '', qualified: false });
      if (input.action === 'status') setPreview(undefined);
      await refresh(); setNotice(success);
    } catch (e) { setError(e instanceof Error ? e.message : 'Opération impossible.'); await refresh().catch(() => {}); }
    finally { setBusy(false); }
  }
  const current = data?.contacts.find(c => c.id === selected);
  const history = data?.messages.filter(m => m.contactId === selected) || [];
  const activeDraft = history.find(m => m.status === 'draft');
  const canSend = data?.settings.configured && data.settings.enabled && data.settings.noticeReady;
  function choose(id: string) {
    setSelected(id); setPreview(undefined); setReviewed(false); setError(''); setNotice('');
    const draft = data?.messages.find(m => m.contactId === id && m.status === 'draft');
    setSubject(draft?.subject || ''); setBody(draft?.body || '');
  }
  return <main className="prospect-shell">
    <nav aria-label="Navigation privée"><Link href="/admin">Wharf — Administration</Link><Link href="/login">Compte</Link></nav>
    <h1>Prospection</h1>
    <p>Préparer un message, le relire et l’envoyer à une seule personne. Trois emails maximum par jour.</p>
    <div className="prospect-notice">
      <strong>{canSend ? 'Connexion configurée pour les envois' : 'Préparation uniquement — envois désactivés'}</strong>
      <p>Expéditeur : {data?.settings.sender || 'contact@bywharf.com'}. Les réponses se consultent dans Gandi. Marquez chaque réponse ou opposition ici pour arrêter les relances.</p>
    </div>
    {error && <p role="alert" className="prospect-error">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <div className="prospect-columns">
      <section aria-labelledby="contacts-title"><h2 id="contacts-title">Contacts</h2>
        <label>Choisir un contact<select value={selected} onChange={e => choose(e.target.value)}><option value="">Sélectionner</option>{data?.contacts.map(c => <option key={c.id} value={c.id}>{c.company} — {c.name} ({statusLabels[c.status]})</option>)}</select></label>
        {current && <div className="prospect-card"><p><strong>{current.name}</strong><br />{current.email}<br />{current.role}</p><p>Collecté le {current.collectedAt}. <a href={current.source} target="_blank" rel="noreferrer">Source de l’adresse</a></p>
          <div className="prospect-actions">{(['replied', 'opposed', 'bounced', 'closed'] as ContactStatus[]).map(status => <button key={status} disabled={busy || current.status === 'opposed'} onClick={() => action({ action: 'status', id: current.id, status }, 'Statut enregistré. Les relances sont arrêtées.')}>{statusLabels[status]}</button>)}</div>
        </div>}
        <details><summary>Ajouter un contact vérifié</summary>
          <form onSubmit={e => { e.preventDefault(); action({ action: 'contact', ...contact }, 'Contact ajouté.'); }}>
            <label>Entreprise<input required maxLength={180} value={contact.company} onChange={e => setContact({ ...contact, company: e.target.value })} /></label>
            <label>Nom ou interlocuteur<input required maxLength={180} value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} /></label>
            <label>Email professionnel<input required type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} /></label>
            <label>Fonction<input required maxLength={240} value={contact.role} onChange={e => setContact({ ...contact, role: e.target.value })} /></label>
            <label>URL où l’adresse est publiée<input required type="url" value={contact.source} onChange={e => setContact({ ...contact, source: e.target.value })} /></label>
            <label>Date de collecte<input required type="date" value={contact.collectedAt} onChange={e => setContact({ ...contact, collectedAt: e.target.value })} /></label>
            <label className="prospect-check"><input required type="checkbox" checked={contact.qualified} onChange={e => setContact({ ...contact, qualified: e.target.checked })} />J’ai vérifié la fonction, la source de l’adresse et la pertinence de la proposition.</label>
            <button disabled={busy}>Ajouter</button>
          </form>
        </details>
      </section>
      <section aria-labelledby="message-title"><h2 id="message-title">Message personnalisé</h2>
        {!current ? <p>Sélectionnez ou ajoutez un contact.</p> : <>
          <p>{statusLabels[current.status]}. {history.filter(m => m.status === 'accepted').length} message(s) accepté(s) par Gandi sur trois maximum.</p>
          <form onSubmit={e => { e.preventDefault(); action({ action: 'draft', contactId: selected, subject, body }, 'Brouillon enregistré. Relisez le message complet avant envoi.'); }}>
            <label>Objet<input required maxLength={160} value={subject} onChange={e => { setSubject(e.target.value); setPreview(undefined); setReviewed(false); }} /></label>
            <label>Texte sans signature<textarea required maxLength={6000} rows={12} value={body} onChange={e => { setBody(e.target.value); setPreview(undefined); setReviewed(false); }} /></label>
            <p>La signature, l’information sur les données et le lien d’opposition sont ajoutés à l’aperçu.</p>
            <button disabled={busy || current.status !== 'active'}>Enregistrer et prévisualiser</button>
          </form>
          {activeDraft && !preview && <button disabled={busy} onClick={() => action({ action: 'preview', id: activeDraft.id }, '')}>Relire le brouillon enregistré</button>}
          {preview && <section className="prospect-preview" aria-labelledby="preview-title"><h3 id="preview-title">Message qui sera envoyé</h3><p>À : {preview.to}<br />Objet : {preview.subject}</p><pre>{preview.text}</pre>
            <label className="prospect-check"><input type="checkbox" checked={reviewed} onChange={e => setReviewed(e.target.checked)} />J’ai relu le destinataire, le texte, la source et la notice. Je souhaite envoyer ce message.</label>
            <button disabled={busy || !reviewed || !canSend || current.status !== 'active'} onClick={() => action({ action: 'send', id: preview.id, reviewHash: preview.reviewHash, confirm: true }, 'Message accepté par le serveur Gandi. Sa réception n’est pas encore confirmée.')}>Envoyer ce message</button>
          </section>}
          <h3>Historique</h3>
          <ul>{history.map(m => <li key={m.id}>{messageLabels[m.status]} — message {m.step + 1} — {m.subject}<br />{m.acceptedAt || m.attemptedAt || m.createdAt}</li>)}</ul>
          <p>Relances à cinq et onze jours ouvrés après le premier envoi, à valider manuellement. Aucun envoi programmé.</p>
        </>}
      </section>
    </div>
  </main>;
}
