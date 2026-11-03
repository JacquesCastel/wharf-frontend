import Link from 'next/link';
import { articlePath, getArticleFormat, type InsightArticle } from '../lib/insights';
import './content-paths.css';

export default function ReadingLinks({ items, label = 'Pour préparer votre projet' }: { items: InsightArticle[]; label?: string }) {
  if (!items.length) return null;
  return <div className="context-readings">
    <p className="context-readings-label">{label}</p>
    <ul className="context-readings-list">{items.map(article => <li key={article.slug}>
      <Link href={articlePath(article)} className="context-reading-link">
        <span><span className="context-reading-format">{getArticleFormat(article)?.label} · {article.tag}</span><span className="context-reading-title">{article.title}</span></span>
        <span className="context-reading-arrow" aria-hidden="true">↗</span>
      </Link>
    </li>)}</ul>
  </div>;
}
