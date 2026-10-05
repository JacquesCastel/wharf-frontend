import { getContact } from '../lib/strapi';
import ContactForm from './ContactForm';

export default async function ContactPage() {
  const data = await getContact();
  const email = data.closing.email || 'contact@bywharf.com';

  return <main id="main-content" className="wharf-public wharf-contact">
    <section className="wharf-masthead" aria-labelledby="contact-title">
      <p className="editorial-eyebrow">CONTACT / Vous & Wharf</p>
      <div>
        <h1 id="contact-title">Parlons de<br /><em>votre projet.</em></h1>
        <p>Un besoin précis, une idée à explorer ou une question encore ouverte. Partons de ce que vous voulez faire avancer.</p>
      </div>
    </section>

    <section className="contact-project-section" aria-labelledby="contact-form-title">
      <div className="wharf-container contact-project-grid">
        <aside className="contact-project-intro">
          <p className="editorial-eyebrow">Le point de départ</p>
          <h2 id="contact-form-title">Quelques mots<br />suffisent.</h2>
          <p>Stratégie de communication, contenus B2B, film ou création d’images par l’IA : dites-nous ce que vous avez en tête.</p>
          <p>Vous pouvez préciser votre objectif, vos publics et votre calendrier. Le format peut encore rester à définir.</p>
          <div className="contact-direct">
            <p className="editorial-eyebrow">Vous préférez nous écrire directement ?</p>
            <a href={`mailto:${email}`}>{email} <span aria-hidden="true">↗</span></a>
          </div>
          <nav className="contact-explore" aria-label="Préparer votre échange avec Wharf">
            <a href="/work" className="card-split-link">Explorer nos expertises →</a>
            <a href="/you" className="card-split-link">Partir de votre situation →</a>
          </nav>
        </aside>
        <ContactForm email={email} />
      </div>
    </section>
  </main>;
}
