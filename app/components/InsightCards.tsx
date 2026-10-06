import Link from 'next/link';
import { articlePath, formatDate, readingMinutes, getArticleFormat, type InsightArticle } from '../lib/insights';
export default function InsightCards({ items, headingLevel = 2, composed = false }: { items: InsightArticle[]; headingLevel?: 2 | 3; composed?: boolean }) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  return <div className={`insight-cards${composed ? " insight-cards-composed" : ""}`}>{items.map(article => <article key={article.slug} className="insight-card">
    <p className="editorial-eyebrow">{getArticleFormat(article)?.label} · {article.tag}</p>
    <Heading><Link href={articlePath(article)}>{article.title}</Link></Heading>
    <p>{article.description}</p>
    <p className="insight-meta"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {readingMinutes(article)} min de lecture</p>
    <Link className="card-split-link" href={articlePath(article)}>Lire l’article →</Link>
  </article>)}</div>;
}
