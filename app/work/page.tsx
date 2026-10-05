import { getPageCopy, getInsights } from '../lib/cms-content';
import { notFound } from 'next/navigation';
import { WebPageJsonLd } from '../components/JsonLd';
import { portfolioSelection, portfolioPath } from '../lib/portfolio-pagination';
import type { Metadata } from 'next';
import { getWork } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { getPublishedProjects } from '../lib/projects';
import { pageSeo } from '../lib/editorial';
import Offers from '../components/Offers';
import InsightCards from '../components/InsightCards';

import WorkPortfolio from './WorkPortfolio';

export const dynamic = 'force-dynamic';
type Props = { searchParams: Promise<{ page?: string; type?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const seoCopy = await getPageCopy('work');
  const [data, projects, query] = await Promise.all([getWork(), getPublishedProjects(), searchParams]);
  const selection = portfolioSelection(projects, query);
  if (!selection.valid) notFound();
  const title = selection.page > 1 ? `WORK — Réalisations, page ${selection.page} | Wharf` : seoCopy.seo.title;
  const metadata = generateMetadataFromStrapi(title, seoCopy.seo.description, data.seo?.image, portfolioPath(selection.page, selection.selectedType));
  return selection.selectedType ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}
export default async function WorkPage({ searchParams }: Props) {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const copy = await getPageCopy('work');
  const t = copy.text;
  const seoCopy = copy;
  const [projects, query] = await Promise.all([getPublishedProjects(), searchParams]);
  const selection = portfolioSelection(projects, query);
  if (!selection.valid) notFound();
  return (
    <main id="main-content" className="wharf-public wharf-work">
      <WebPageJsonLd path={portfolioPath(selection.page, selection.selectedType)} title={seoCopy.seo.title} description={seoCopy.seo.description} type="CollectionPage" />
      <section className="wharf-masthead" aria-labelledby="work-title">
        <p className="editorial-eyebrow">{t("work-page-1")}</p>
        <div><h1 id="work-title">{t("work-page-2")}<br />{t("work-page-3")}</h1>
          <p>{t("work-page-4")}</p>
          <nav className="wharf-section-nav" aria-label="Explorer WORK"><a href="#realisations">{t("work-page-5")}</a><a href="#strategy">{t("work-page-6")}</a><a href="#content">{t("work-page-7")}</a><a href="#video">{t("work-page-8")}</a><a href="#creation-ia">{t("work-page-9")}</a></nav>
        </div>
      </section>
      <WorkPortfolio projects={projects} page={selection.page} selectedType={selection.selectedType} />
      <Offers />
      <section className="work-methode">
        <div className="work-container">
          <h2>{t("work-page-10")}</h2>
          <p className="work-methode-intro">{t("work-page-11")}</p>
          <div className="work-mouvements">
            {[
              ['Cadrer', t("work-page-12")],
              ['Concevoir', t("work-page-13")],
              [t("work-page-14"), t("work-page-15")],
            ].map(([title, text], index) => <div className="mouvement" key={title}><div className="mouvement-number">{index + 1}</div><h3>{title}</h3><p>{text}</p></div>)}
          </div>
          <a href="/we" className="card-split-link">{t("work-page-16")}</a>
        </div>
      </section>
      <section className="editorial-section"><div className="work-container">
        <h2>{t("work-page-17")}</h2>
        <p>{t("work-page-18")}</p>
        <InsightCards items={articles.filter(article => article.format === 'guides').slice(0, 3)} headingLevel={3} />
      </div></section>
      <section className="work-closing">
        <div className="work-container">
          <h2>{t("work-page-19")}</h2>
          <p>{t("work-page-20")}</p>
          <a href="/contact" className="work-cta-button">{t("work-page-21")}</a>
        </div>
      </section>
    </main>
  );
}
