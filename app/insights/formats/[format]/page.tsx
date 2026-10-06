import ScrollMotion from '../../../components/ScrollMotion';
import EditorialMark from '../../../components/EditorialMark';
import { getInsights } from '../../../lib/cms-content';
import { WebPageJsonLd, BreadcrumbJsonLd } from '../../../components/JsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPath } from '../../../lib/insights';
import { generateMetadataFromStrapi } from '../../../lib/metadata';
import InsightCards from '../../../components/InsightCards';
type Props = { params: Promise<{ format: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publishedFormats } = await getInsights();
  const { format } = await params;
  const entry = publishedFormats.find(item => item.slug === format);
  if (!entry) notFound();
  return generateMetadataFromStrapi(`${entry.title} — INSIGHTS | Wharf`, entry.description, undefined, formatPath(format));
}
export default async function FormatPage({ params }: Props) {
  const { articles, publishedFormats } = await getInsights();
  const { format } = await params;
  const entry = publishedFormats.find(item => item.slug === format);
  if (!entry) notFound();
  return <main id="main-content" className="insights-page wharf-public wharf-insights wharf-motion"><ScrollMotion /><WebPageJsonLd path={formatPath(format)} title={entry.title} description={entry.description} type="CollectionPage" /><BreadcrumbJsonLd items={[{ name: 'Insights', path: '/insights' }, { name: entry.title, path: formatPath(format) }]} /><section className="editorial-section"><div className="work-container">
    <nav aria-label="Fil d’Ariane"><Link href="/insights" className="card-split-link">← Tous les articles</Link></nav>
    <div className="insights-composed-intro" data-scroll-scene><div><p className="editorial-eyebrow">INSIGHTS</p><h1>{entry.title}</h1><p className="editorial-intro">{entry.description}</p></div><EditorialMark variant={format === "guides" ? "arches" : "orbit"} /></div>
    <InsightCards items={articles.filter(article => article.format === format)} composed />
  </div></section></main>;
}
