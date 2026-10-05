'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';

const emptyForm = { name: '', email: '', organization: '', situation: '', message: '' };
const needs = [
  'Stratégie de communication',
  'Création de contenus B2B',
  'Film ou série vidéo',
  'Création d’images et de films par l’IA',
  'Marque employeur ou recrutement',
  'Communication interne ou transformation',
  'Autre besoin / À définir',
];

export default function ContactForm({ email }: { email: string }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const sending = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { emailjs.init('BI44pMZfr-I0uqf2n'); }, []);
  useEffect(() => { if (submitted) successRef.current?.focus(); }, [submitted]);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setLoading(true);
    setError('');
    try {
      await emailjs.send('service_dl0m9h9', 'template_fobl3ib', {
        from_name: formData.name,
        from_email: formData.email,
        organization: formData.organization,
        situation: formData.situation,
        message: formData.message,
        to_email: 'contact@bywharf.com',
      });
      setSubmitted(true);
      setFormData(emptyForm);
    } catch {
      setError('Votre message n’a pas pu être envoyé. Vous pouvez réessayer ou nous écrire directement par email.');
    } finally {
      sending.current = false;
      setLoading(false);
    }
  }

  return <div className="contact-form-wrapper">
    {submitted ? <div className="contact-success-message" role="status" tabIndex={-1} ref={successRef}>
      <p className="editorial-eyebrow">Message envoyé</p>
      <h3>Merci pour votre message.</h3>
      <p>Votre projet est le point de départ de notre prochain échange.</p>
      <button type="button" className="contact-reset-button" onClick={() => setSubmitted(false)}>Écrire un autre message →</button>
    </div> : <form onSubmit={handleSubmit} className="contact-form" aria-labelledby="contact-form-title" aria-busy={loading}>
      <p className="contact-form-note" id="contact-required">Les champs marqués d’un * sont obligatoires.</p>
      <fieldset className="contact-form-fields" disabled={loading} aria-describedby="contact-required">
        <legend className="contact-form-legend">Vos coordonnées et votre projet</legend>
        <div className="contact-field-pair">
          <div className="contact-form-group">
            <label htmlFor="name">Votre nom *</label>
            <input id="name" name="name" type="text" autoComplete="name" value={formData.name} onChange={handleChange} required placeholder="Nom et prénom" />
          </div>
          <div className="contact-form-group">
            <label htmlFor="email">Votre email *</label>
            <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} required placeholder="vous@entreprise.fr" />
          </div>
        </div>
        <div className="contact-form-group">
          <label htmlFor="organization">Votre entreprise <span>(facultatif)</span></label>
          <input id="organization" name="organization" type="text" autoComplete="organization" value={formData.organization} onChange={handleChange} placeholder="Entreprise ou organisation" />
        </div>
        <div className="contact-form-group">
          <label htmlFor="situation">Votre besoin *</label>
          <select id="situation" name="situation" value={formData.situation} onChange={handleChange} required>
            <option value="" disabled>Choisir un point de départ</option>
            {needs.map(need => <option key={need} value={need}>{need}</option>)}
          </select>
        </div>
        <div className="contact-form-group">
          <label htmlFor="message">Quelques mots sur votre projet *</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Votre enjeu, votre idée, ce que vous souhaitez faire avancer…" rows={6} />
        </div>
      </fieldset>
      {error && <div className="contact-error-message" role="alert" tabIndex={-1} ref={errorRef}>
        <p>{error}</p><a href={`mailto:${email}`}>{email}</a>
      </div>}
      <div className="contact-form-actions">
        <button type="submit" className="contact-submit-button" disabled={loading}>{loading ? 'Envoi en cours…' : 'Envoyer votre message'} <span aria-hidden="true">↗</span></button>
        <p>Ces informations nous permettent de vous répondre au sujet de votre projet.</p>
      </div>
    </form>}
  </div>;
}
