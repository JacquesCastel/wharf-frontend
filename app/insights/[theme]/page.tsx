import ScrollMotion from '../../components/ScrollMotion';
import EditorialMark from '../../components/EditorialMark';
import { getInsights } from '../../lib/cms-content';
import { WebPageJsonLd, BreadcrumbJsonLd } from '../../components/JsonLd';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { generateMetadataFromStrapi } from '../../lib/metadata';
import InsightCards from '../../components/InsightCards';
type Props = { params: Promise<{ theme: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publishedTopics } = await getInsights();
  const { theme } = await params;
  const topic = publishedTopics.find(topic => topic.slug === theme);
  if (!topic) notFound();
  return generateMetadataFromStrapi(`${topic.title} — INSIGHTS | Wharf`, topic.description, undefined, `/insights/${theme}`);
}
export default async function ThemePage({ params }: Props) {
  const { articles, publishedTopics } = await getInsights();
  const { theme } = await params;
  const topic = publishedTopics.find(topic => topic.slug === theme);
  if (!topic) notFound();
  return <main id="main-content" className="insights-page wharf-public wharf-insights wharf-motion"><ScrollMotion /><WebPageJsonLd path={`/insights/${theme}`} title={topic.title} description={topic.description} type="CollectionPage" /><BreadcrumbJsonLd items={[{ name: 'Insights', path: '/insights' }, { name: topic.title, path: `/insights/${theme}` }]} /><section className="editorial-section"><div className="work-container">
    <nav aria-label="Fil d’Ariane"><Link href="/insights" className="card-split-link">← Tous les articles</Link></nav>
    <div className="insights-composed-intro" data-scroll-scene><div><p className="editorial-eyebrow">INSIGHTS</p><h1>{topic.title}</h1><p className="editorial-intro">{topic.description}</p></div><EditorialMark variant={theme === "content-b2b" ? "frames" : theme === "communication-corporate" ? "arches" : "orbit"} /></div>
    <InsightCards items={articles.filter(article => article.theme === theme)} composed />
  </div></section></main>;
}
