import { formatDate, type InsightSource as Source } from '../lib/insights';
export default function InsightSource({ source }: { source: Source }) {
  return <><a href={source.url}>{source.title || source.label}</a>{source.organization && <> — {source.organization}</>}{source.publishedAt && <> — publiée le <time dateTime={source.publishedAt}>{formatDate(source.publishedAt)}</time></>} — consultée le <time dateTime={source.accessedAt}>{formatDate(source.accessedAt)}</time>.</>;
}
