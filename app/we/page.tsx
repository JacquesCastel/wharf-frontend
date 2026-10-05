import { getPageCopy } from '../lib/cms-content';
import { WebPageJsonLd } from '../components/JsonLd';
import type { Metadata } from 'next';
import { getWe } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo } from '../lib/editorial';
import { getPublishedProjects } from '../lib/projects';
import { CAFE_PROJECT_ID } from '../lib/project-editorial';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const seoCopy = await getPageCopy('we');
  const data = await getWe();
  return generateMetadataFromStrapi(seoCopy.seo.title, seoCopy.seo.description, data.seo?.image, '/we');
}

export default async function WePage() {
  const copy = await getPageCopy('we');
  const t = copy.text;
  const seoCopy = copy;
  const [data, projects] = await Promise.all([getWe(), getPublishedProjects()]);
  const cafeProject = projects?.find(project => project.documentId === CAFE_PROJECT_ID);
  const weData = {
    ...data,
    actes: {
      acte1: { titre: t("we-page-3"), contenu: copy.html("we-page-4") },
      acte2: { titre: t("we-page-5"), contenu: copy.html("we-page-6") },
      acte3: { titre: t("we-page-7"), contenu: copy.html("we-page-8") },
    },
    piliers: {
      pilier1: { titre: t("we-page-9"), contenu: copy.html("we-page-10") },
    },
    closing: { titre: t("we-page-13"), texte: t("we-page-14"), lien: '/work#realisations', texte_bouton: 'Découvrir nos réalisations →' },
  };

  return (
    <main id="main-content" className="wharf-public wharf-we">
      <WebPageJsonLd path="/we" title={seoCopy.seo.title} description={seoCopy.seo.description} type="AboutPage" />
      <section className="wharf-masthead" aria-labelledby="we-title">
        <p className="editorial-eyebrow">{t("we-page-15")}</p>
        <div><h1 id="we-title">{t("we-page-16")}<br /><em>{t("we-page-17")}</em></h1>
          <p>{t("we-page-18")}</p>
          <a href="#notre-approche" className="card-split-link">{t("we-page-19")}</a>
        </div>
      </section>

      {/* ACTES TIMELINE */}
      <section className="we-actes-timeline" id="notre-approche">
        <div className="we-timeline-container">
          <div className="we-timeline-line"></div>

          {/* ACTE 1 */}
          <div className="we-acte">
            <div className="we-acte-number">{t("we-page-20")}</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">{t("we-page-21")}</div>
              <h2>{weData.actes.acte1.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte1.contenu }}
              />
            </div>
          </div>

          {/* ACTE 2 */}
          <div className="we-acte">
            <div className="we-acte-number">{t("we-page-22")}</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">{t("we-page-23")}</div>
              <h2>{weData.actes.acte2.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte2.contenu }}
              />
            </div>
          </div>

          {/* ACTE 3 */}
          <div className="we-acte">
            <div className="we-acte-number">{t("we-page-24")}</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">{t("we-page-25")}</div>
              <h2>{weData.actes.acte3.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte3.contenu }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION */}
      <section className="we-transition">
        <h2 className="we-transition-quote">
          {t("we-page-26")}<span className="we-transition-highlight">{t("we-page-27")}</span>
        </h2>
      </section>

      {/* PILLARS */}
      <section className="we-pillars">
        <div className="we-pillars-container">
          <h2 className="we-pillars-title">{t("we-page-28")}</h2>
          <div className="we-pillars-grid editorial-pillars-grid">
            <div className="we-pillar">
              <p className="editorial-eyebrow">{t("we-page-29")}</p>
              <h3>{weData.piliers.pilier1.titre}</h3>
              <div dangerouslySetInnerHTML={{ __html: weData.piliers.pilier1.contenu }} />
              <a href="/work#strategy" className="card-split-link">{t("we-page-30")}</a>
            </div>
            <div className="we-pillar">
              <p className="editorial-eyebrow">{t("we-page-31")}</p>
              <h3>{t("we-page-32")}</h3>
              <p>{t("we-page-33")}</p>
              <a href="/work#content" className="card-split-link">{t("we-page-34")}</a>
            </div>
            <div className="we-pillar">
              <p className="editorial-eyebrow">{t("we-page-35")}</p>
              <h3>{t("we-page-36")}</h3>
              <p>{t("we-page-37")}</p>
              <a href="/work#video" className="card-split-link">{t("we-page-38")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="we-pillars-container">
          <h2>{t("we-page-39")}</h2>
          <ol className="editorial-steps">
            <li><strong>{t("we-page-40")}</strong> {t("we-page-41")}</li>
            <li><strong>{t("we-page-42")}</strong> {t("we-page-43")}</li>
            <li><strong>{t("we-page-44")}</strong> {t("we-page-45")}</li>
            <li><strong>{t("we-page-46")}</strong> {t("we-page-47")}</li>
            <li><strong>{t("we-page-48")}</strong> {t("we-page-49")}</li>
            <li><strong>{t("we-page-50")}</strong> {t("we-page-51")}</li>
          </ol>
          <a href="/you" className="card-split-link">{t("we-page-52")}</a>
        </div>
      </section>

      {cafeProject && <section className="editorial-section"><div className="we-pillars-container">
        <p className="editorial-eyebrow">{t("we-page-53")}</p>
        <h2>{t("we-page-54")}</h2>
        <p>{t("we-page-55")}</p>
        <p>{t("we-page-56")}</p>
        <a href={`/work/${cafeProject.documentId}`} className="card-split-link">{t("we-page-57")}</a>
      </div></section>}

      {/* CLOSING CTA */}
      <section className="we-closing">
        <div className="we-pillars-container">
        <h2>{weData.closing.titre}</h2>
        <p>{weData.closing.texte}</p>
        <a href={weData.closing.lien} className="we-cta-button">
          {weData.closing.texte_bouton}
        </a>
        </div>
      </section>
    </main>
  );
}