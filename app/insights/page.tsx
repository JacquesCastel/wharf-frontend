import { getPageCopy, getInsights } from '../lib/cms-content';
import { WebPageJsonLd } from '../components/JsonLd';
import Link from 'next/link';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { formatPath } from '../lib/insights';
import InsightCards from '../components/InsightCards';
import { pageSeo } from '../lib/editorial';
export async function generateMetadata() {
 const copy = await getPageCopy('insights');
 return generateMetadataFromStrapi(copy.seo.title, copy.seo.description, undefined, '/insights');
}
export default async function InsightsPage() {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const copy = await getPageCopy('insights');
  const t = copy.text;
  return <main id="main-content" className="insights-page wharf-public wharf-insights">
      <WebPageJsonLd path="/insights" title={copy.seo.title} description={copy.seo.description} type="CollectionPage" />
    <section className="editorial-section"><div className="work-container">
      <p className="editorial-eyebrow">{t("insights-page-1")}</p>
      <h1>{t("insights-page-2")}</h1>
      <p className="editorial-intro">{t("insights-page-3")}</p>
      <p className="insight-browse-label">{t("insights-page-4")}</p>
      <nav className="work-filters" aria-label="Thèmes du blog">{publishedTopics.map(topic => <Link className="work-filter" key={topic.slug} href={`/insights/${topic.slug}`}>{topic.title}</Link>)}</nav>
      <p className="insight-browse-label">{t("insights-page-5")}</p>
      <nav className="work-filters" aria-label="Formats éditoriaux">{publishedFormats.map(format => <Link className="work-filter" key={format.slug} href={formatPath(format.slug)}>{format.title}</Link>)}</nav>
      <InsightCards items={articles} />
    </div></section>
    <section className="work-closing"><div className="work-container"><h2>{t("insights-page-6")}</h2><p>{t("insights-page-7")}</p><Link href="/contact" className="work-cta-button">{t("insights-page-8")}</Link></div></section>
  </main>;
}
