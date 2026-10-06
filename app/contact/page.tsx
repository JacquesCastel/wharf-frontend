import ScrollMotion from '../components/ScrollMotion';
import EditorialMark from '../components/EditorialMark';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { getPageCopy } from '../lib/cms-content';
import { WebPageJsonLd } from '../components/JsonLd';
import { getContact } from '../lib/strapi';
import ContactForm from './ContactForm';

export async function generateMetadata() {
  const copy = await getPageCopy('contact');
  return generateMetadataFromStrapi(copy.seo.title, copy.seo.description, undefined, '/contact');
}

export default async function ContactPage() {
  const copy = await getPageCopy('contact');
  const t = copy.text;
  const data = await getContact();
  const email = data.closing.email || 'contact@bywharf.com';

  return <main id="main-content" className="wharf-public wharf-contact wharf-motion">
      <ScrollMotion />
      <WebPageJsonLd path="/contact" title={copy.seo.title} description={copy.seo.description} type="ContactPage" />
    <section className="wharf-masthead" aria-labelledby="contact-title" data-scroll-scene>
      <div className="wharf-masthead-aside"><p className="editorial-eyebrow">{t("contact-page-1")}</p><EditorialMark className="masthead-art" variant="frames" /></div>
      <div>
        <h1 id="contact-title">{t("contact-page-2")}<br /><em>{t("contact-page-3")}</em></h1>
        <p>{t("contact-page-4")}</p>
      </div>
    </section>

    <section className="contact-project-section" aria-labelledby="contact-form-title">
      <div className="wharf-container contact-project-grid">
        <aside className="contact-project-intro" data-scroll-scene><span className="contact-colour-stroke" aria-hidden="true" data-scroll-shift="-70" data-scroll-turn="12" />
          <p className="editorial-eyebrow">{t("contact-page-5")}</p>
          <h2 id="contact-form-title">{t("contact-page-6")}<br />{t("contact-page-7")}</h2>
          <p>{t("contact-page-8")}</p>
          <p>{t("contact-page-9")}</p>
          <div className="contact-direct">
            <p className="editorial-eyebrow">{t("contact-page-10")}</p>
            <a href={`mailto:${email}`}>{email} <span aria-hidden="true">{t("contact-page-11")}</span></a>
          </div>
          <nav className="contact-explore" aria-label="Préparer votre échange avec Wharf">
            <a href="/work" className="card-split-link">{t("contact-page-12")}</a>
            <a href="/you" className="card-split-link">{t("contact-page-13")}</a>
          </nav>
        </aside>
        <ContactForm email={email} />
      </div>
    </section>
  </main>;
}
