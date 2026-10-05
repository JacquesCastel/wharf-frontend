import { getPageCopy, getInsights, getLiveSituations } from '../lib/cms-content';
import { WebPageJsonLd } from '../components/JsonLd';
import type { Metadata } from 'next';
import { getYou } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo, situations } from '../lib/editorial';
import { articlePath } from '../lib/insights';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const seoCopy = await getPageCopy('you');
  const data = await getYou();
  return generateMetadataFromStrapi(seoCopy.seo.title, seoCopy.seo.description, data.seo?.image, '/you');
}
export default async function YouPage() {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const copy = await getPageCopy('you');
  const t = copy.text;
  const seoCopy = copy;
  const situations = await getLiveSituations();
  return (
    <main id="main-content" className="wharf-public wharf-you">
      <WebPageJsonLd path="/you" title={seoCopy.seo.title} description={seoCopy.seo.description} />
      <section className="wharf-masthead" aria-labelledby="you-title">
        <p className="editorial-eyebrow">{t("you-page-1")}</p>
        <div><h1 id="you-title">{t("you-page-2")}<br /><em>{t("you-page-3")}</em></h1>
          <p>{t("you-page-4")}</p>
          <a href="#vos-besoins" className="card-split-link">{t("you-page-5")}</a>
        </div>
      </section>
      <section className="you-situations" id="vos-besoins">
        <div className="you-container">
          <h2>{t("you-page-6")}</h2>
          <p className="editorial-intro">{t("you-page-7")}</p>
          <div className="you-situations-grid">
            {situations.map((situation, index) => {
              const reading = 'readingSlug' in situation ? articles.find(article => article.slug === situation.readingSlug) : undefined;
              return (
              <article key={situation.id} id={situation.id} className="you-situation">
                <div className="you-situation-heading"><div className="you-situation-number">{String(index + 1).padStart(2, '0')}</div><h3>{situation.titre}</h3></div>
                <div className="you-situation-content">
                <p>{situation.description}</p>
                <p><strong>{t("you-page-8")}</strong> {situation.formats}</p>
                <ul className="you-situation-paths" aria-label="Les accompagnements pour ce besoin">
                  {situation.links.map(link => <li key={link.href}><a className="card-split-link" href={link.href}>{link.label} {t("you-page-9")}</a></li>)}
                </ul>
                {reading && <p className="you-situation-reading">{t("you-page-10")}<a href={articlePath(reading)}>{reading.title}</a></p>}
                <a href="/contact" className="you-situation-link" aria-label={`Parlons de votre besoin : ${situation.titre.toLowerCase()}`}>{t("you-page-11")}</a>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="you-understand">
        <div className="you-container">
          <h2>{t("you-page-12")}</h2>
          <div className="you-understand-grid">
            {[
              [t("you-page-13"), t("you-page-14")],
              [t("you-page-15"), t("you-page-16")],
              [t("you-page-17"), t("you-page-18")],
            ].map(([title, text]) => <div className="you-understand-item" key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
          <p className="you-understand-conclusion">{t("you-page-19")}</p>
          <a href="/work" className="card-split-link">{t("you-page-20")}</a>
        </div>
      </section>
      <section className="you-closing">
        <div className="you-container">
          <h2>{t("you-page-21")}</h2>
          <p>{t("you-page-22")}</p>
          <a href="/contact" className="you-cta-button">{t("you-page-23")}</a>
        </div>
      </section>
    </main>
  );
}
