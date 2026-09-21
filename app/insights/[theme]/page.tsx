import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, publishedTopics } from '../../lib/insights';
import { generateMetadataFromStrapi } from '../../lib/metadata';
import InsightCards from '../../components/InsightCards';
type Props = { params: Promise<{ theme: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  const topic = publishedTopics.find(topic => topic.slug === theme);
  if (!topic) notFound();
  return generateMetadataFromStrapi(`${topic.title} — INSIGHTS | Wharf`, topic.description, undefined, `/insights/${theme}`);
}
export default async function ThemePage({ params }: Props) {
  const { theme } = await params;
  const topic = publishedTopics.find(topic => topic.slug === theme);
  if (!topic) notFound();
  return <main id="main-content" className="insights-page"><section className="editorial-section"><div className="work-container">
    <Link href="/insights" className="card-split-link">← Tous les articles</Link>
    <p className="editorial-eyebrow">INSIGHTS</p><h1>{topic.title}</h1><p className="editorial-intro">{topic.description}</p>
    <InsightCards items={articles.filter(article => article.theme === theme)} />
  </div></section></main>;
}
