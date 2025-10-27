'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';


interface ContactData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  intro: {
    titre: string;
    texte: string;
  };
  closing: {
    titre: string;
    texte: string;
    email: string;
  };
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    situation: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Charger les données depuis Strapi
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('http://91.99.170.150/api/page-contact?populate=*');
        const data = await response.json();
        
        setContactData({
          hero: {
            titre: data.data.hero_titre || 'Parlons-en',
            baseline: data.data.hero_baseline || 'Prenons le temps de discuter de votre projet',
            video: data.data.hero_video ? {
              url: `http://91.99.170.150${data.data.hero_video.url}`,
              alternativeText: data.data.hero_video.alternativeText || ''
            } : null
          },
          intro: {
            titre: data.data.intro_titre || 'Le commencement d\'une collaboration',
            texte: data.data.intro_texte || ''
          },
          closing: {
            titre: data.data.closing_titre || 'Vous préférez simplement prendre un café ?',
            texte: data.data.closing_texte || 'Nous sommes à votre disposition pour discuter.',
            email: data.data.closing_email || 'contact@bywharf.com'
          }
        });
      } catch (error) {
        console.error('Error fetching contact data:', error);
        // Données par défaut en cas d'erreur
        setContactData({
          hero: {
            titre: 'Parlons-en',
            baseline: 'Prenons le temps de discuter de votre projet',
            video: null
          },
          intro: {
            titre: 'Le commencement d\'une collaboration',
            texte: 'Vous avez une histoire à raconter, une transformation à rendre visible, un récit à faire vivre.'
          },
          closing: {
            titre: 'Vous préférez simplement prendre un café ?',
            texte: 'Nous sommes à votre disposition pour discuter.',
            email: 'contact@bywharf.com'
          }
        });
      }
    };

    fetchContactData();
    emailjs.init('BI44pMZfr-I0uqf2n');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await emailjs.send(
        'service_dl0m9h9',
        'template_fobl3ib',
        {
          from_name: formData.name,
          from_email: formData.email,
          organization: formData.organization,
          situation: formData.situation,
          message: formData.message,
          to_email: 'contact@bywharf.com'
        }
      );

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        organization: '',
        situation: '',
        message: ''
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('EmailJS Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!contactData) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <>
      {/* HERO */}
      <section className="contact-hero">
        {contactData.hero.video ? (
          <video
            className="contact-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={contactData.hero.video.url} type="video/mp4" />
          </video>
        ) : (
          <video
            className="contact-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
          </video>
        )}
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>{contactData.hero.titre}</h1>
          <p className="contact-hero-subtitle">{contactData.hero.baseline}</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="contact-intro">
        <div className="contact-container">
          <h2>{contactData.intro.titre}</h2>
          <p>{contactData.intro.texte}</p>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="contact-form-wrapper">
            {submitted && (
              <div className="contact-success-message">
                <h3>Merci !</h3>
                <p>Nous avons bien reçu votre message. Nous vous recontacterons très bientôt.</p>
              </div>
            )}

            {!submitted && (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-group">
                  <label htmlFor="name">Votre nom *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email">Votre email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jean@exemple.fr"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="organization">Entreprise/Organisation</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Votre entreprise"
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="situation">Quelle est votre situation ? *</label>
                  <select
                    id="situation"
                    name="situation"
                    value={formData.situation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez une situation</option>
                    <option value="Lancer un projet">Lancer un projet</option>
                    <option value="Traverser une transformation">Traverser une transformation</option>
                    <option value="Renforcer votre identité">Renforcer votre identité</option>
                    <option value="Restaurer la confiance">Restaurer la confiance</option>
                  </select>
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message">Votre message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre projet et ce que vous envisagez..."
                    rows={6}
                  ></textarea>
                </div>

                {error && <div className="contact-error-message">{error}</div>}

                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>

                <p className="contact-form-note">* Champs obligatoires</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="contact-closing">
        <div className="contact-container">
          <h2>{contactData.closing.titre}</h2>
          <p>{contactData.closing.texte}</p>
          <a href={`mailto:${contactData.closing.email}`} className="contact-closing-link">
            {contactData.closing.email}
          </a>
        </div>
      </section>
    </>
  );
}
 {/* CTA FINAL */}
