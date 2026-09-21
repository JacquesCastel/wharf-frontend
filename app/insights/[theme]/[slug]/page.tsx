import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, articlePath, getArticle, publishedTopics, formatDate, readingMinutes } from '../../../lib/insights';
import { generateMetadataFromStrapi } from '../../../lib/metadata';
import InsightCards from '../../../components/InsightCards';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';
type Props = { params: Promise<{ theme: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme, slug } = await params;
  const article = getArticle(theme, slug);
  if (!article) notFound();
  const base = generateMetadataFromStrapi(article.seoTitle, article.description, undefined, articlePath(article));
  return { ...base, authors: [{ name: article.author, url: `${SITE_URL}/we` }], openGraph: { ...base.openGraph, type: 'article', publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [article.author] } };
}
export default async function ArticlePage({ params }: Props) {
  const { theme, slug } = await params;
  const article = getArticle(theme, slug);
  if (!article) notFound();
  const topic = publishedTopics.find(topic => topic.slug === theme)!;
  const url = `${SITE_URL}${articlePath(article)}`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt, author: { '@type': 'Organization', name: article.author, url: `${SITE_URL}/we` }, publisher: { '@type': 'Organization', name: 'Wharf', url: SITE_URL }, mainEntityOfPage: url, url, inLanguage: 'fr-FR', articleSection: topic.title },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Insights', item: `${SITE_URL}/insights` }, { '@type': 'ListItem', position: 2, name: topic.title, item: `${SITE_URL}/insights/${theme}` }, { '@type': 'ListItem', position: 3, name: article.title, item: url }] },
  ];
  return <main id="main-content" className="insights-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <article className="insight-article">
      <header className="insight-article-header">
        <nav aria-label="Fil d’Ariane"><Link href="/insights">Insights</Link> / <Link href={`/insights/${theme}`}>{topic.title}</Link></nav>
        <p className="editorial-eyebrow">{article.tag}</p><h1>{article.title}</h1>
        <p className="insight-meta">Par <Link href="/we">{article.author}</Link> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {readingMinutes(article)} min de lecture</p>
        <p className="insight-lead">{article.intro}</p>
      </header>
      <aside className="insight-takeaway" aria-label="À retenir"><strong>À retenir</strong><p>{article.takeaway}</p></aside>
      <nav className="insight-toc" aria-label="Sommaire de l’article"><h2>Dans cet article</h2><ol>{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
      {article.sections.map(section => <section key={section.id} id={section.id} className="insight-section"><h2>{section.title}</h2>{section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}{section.source && <p className="insight-source">Source : <a href={section.source.url}>{section.source.label}</a> — consultée le 18 septembre 2026.</p>}</section>)}
      <footer className="insight-article-cta"><h2>{article.cta}</h2><p>Découvrez <Link href={article.service}>notre approche et nos expertises</Link>, puis parlons de votre situation.</p><Link href="/contact" className="btn btn-primary">Parlons de votre projet →</Link></footer>
    </article>
    <section className="editorial-section"><div className="work-container"><h2>Pour poursuivre la réflexion</h2><InsightCards items={articles.filter(item => item.slug !== slug)} /></div></section>
  </main>;
}
