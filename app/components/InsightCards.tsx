import Link from 'next/link';
import { articles, articlePath, formatDate, readingMinutes, type InsightArticle } from '../lib/insights';
export default function InsightCards({ items = articles }: { items?: InsightArticle[] }) {
  return <div className="insight-cards">{items.map(article => <article key={article.slug} className="insight-card">
    <p className="editorial-eyebrow">{article.tag}</p>
    <h2><Link href={articlePath(article)}>{article.title}</Link></h2>
    <p>{article.description}</p>
    <p className="insight-meta"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {readingMinutes(article)} min de lecture</p>
    <Link className="card-split-link" href={articlePath(article)}>Lire l’article →</Link>
  </article>)}</div>;
}
