import { insightTopics, offers, situations } from './editorial';
import { getInsightAuthor, insightAuthors } from './insights-authors';

export const insightFormats = [
  { slug: 'guides', label: 'Guide', title: 'Guides', description: 'Des méthodes et des outils pour préparer vos contenus et vos films B2B.' },
  { slug: 'analyses', label: 'Analyse', title: 'Analyses', description: 'Des décryptages pour éclairer vos choix de communication et de production.' },
  { slug: 'observations', label: 'Observation / Data', title: 'Observations / Data', description: 'Des observations documentées, avec leur périmètre, leurs sources et leurs limites.' },
  { slug: 'etudes', label: 'Étude', title: 'Études Wharf', description: 'Des études originales, avec une méthode explicite et des données vérifiables.' },
] as const;
export type InsightFormat = typeof insightFormats[number]['slug'];
export type InsightSource = { label: string; url: string; accessedAt: string; title?: string; organization?: string; publishedAt?: string };
export type InsightArticle = {
  slug: string;
  theme: string;
  tag: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  takeaway?: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorId?: string;
  relatedProjectIds?: string[];
  cta: string;
  service: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    items?: string[];
    source?: InsightSource;
    table?: { caption: string; headers: string[]; rows: string[][] };
  }[];
  format: InsightFormat;
  research?: {
    series?: 'observatoire-wharf';
    period: string;
    scope: string;
    method: string;
    limitations: string;
    sources: InsightSource[];
    question?: string;
    sample?: string;
    findings?: string[];
    analysis?: string;
  };
};
// Reject malformed evidence and duplicate URLs before they can be published.

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const validSource = (source: InsightSource) => Boolean(source.label?.trim()) && /^https?:\/\//.test(source.url) && validDate(source.accessedAt) && (!source.publishedAt || validDate(source.publishedAt));
const servicePaths = new Set(['/we', ...offers.map(offer => `/work#${offer.id}`), ...situations.map(situation => `/you#${situation.id}`)]);
export function validateInsights(content: InsightArticle[]): InsightArticle[] {
const seen = new Set<string>();
return content.map(article => {
  if (!insightFormats.some(format => format.slug === article.format)) throw new Error(`Unknown Insights format: ${article.slug}`);
  if (!insightTopics.some(topic => topic.slug === article.theme)) throw new Error(`Unknown Insights theme: ${article.slug}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || seen.has(article.slug)) throw new Error(`Invalid or duplicate Insights slug: ${article.slug}`);
  seen.add(article.slug);
  if (![article.title, article.seoTitle, article.description, article.intro, article.author, article.cta].every(value => typeof value === 'string' && value.trim()) || !validDate(article.publishedAt) || !validDate(article.updatedAt) || article.updatedAt < article.publishedAt) throw new Error(`Invalid Insights metadata: ${article.slug}`);
  if (!servicePaths.has(article.service)) throw new Error(`Unknown Insights service: ${article.slug}`);
  const person = getInsightAuthor(article.authorId);
  if (article.authorId && (!person || person.name !== article.author) || !article.authorId && article.author !== 'Wharf') throw new Error(`Unverified Insights author: ${article.slug}`);
  if (article.relatedProjectIds && (!Array.isArray(article.relatedProjectIds) || article.relatedProjectIds.some(id => typeof id !== 'string' || !id.trim()) || new Set(article.relatedProjectIds).size !== article.relatedProjectIds.length)) throw new Error(`Invalid related project IDs: ${article.slug}`);
  const sectionIds = new Set<string>(article.research ? ['research-method'] : []);
  if (!article.sections?.length) throw new Error(`Missing Insights sections: ${article.slug}`);
  for (const section of article.sections) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || sectionIds.has(section.id) || !section.title?.trim() || !Array.isArray(section.paragraphs)) throw new Error(`Invalid Insights section: ${article.slug}`);
    sectionIds.add(section.id);
    if (section.source && !validSource(section.source)) throw new Error(`Invalid Insights source: ${article.slug}`);
    if (section.table && (!section.table.caption?.trim() || !section.table.headers.length || section.table.rows.some(row => row.length !== section.table!.headers.length))) throw new Error(`Invalid Insights table: ${article.slug}`);
  }
  const entry: InsightArticle = { ...article };
  if (entry.format === 'etudes' || entry.format === 'observations') {
    const research = entry.research;
    if (!research || !research.period?.trim() || !research.scope?.trim() || !research.method?.trim() || !research.limitations?.trim() || !research.sources?.length) throw new Error(`Missing research evidence: ${entry.slug}`);
    if (entry.format === 'etudes' && (!research.question?.trim() || !research.sample?.trim() || !research.findings?.length || !research.findings.every(finding => finding.trim()) || !research.analysis?.trim())) throw new Error(`Incomplete study protocol: ${entry.slug}`);
  }
  if (entry.research && (entry.research.sources.some(source => !validSource(source)) || (entry.research.series && entry.research.series !== 'observatoire-wharf'))) throw new Error(`Invalid research source or series: ${entry.slug}`);
  return entry;
}).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export const articlePath = (article: InsightArticle) => `/insights/${article.theme}/${article.slug}`;
export const formatPath = (slug: string) => `/insights/formats/${slug}`;
export const getArticleFormat = (article: InsightArticle) => insightFormats.find(format => format.slug === article.format);
export const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
export const readingMinutes = (article: InsightArticle) => Math.max(1, Math.ceil([article.intro, article.takeaway ?? '', ...article.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.items ?? []), ...(section.table?.rows.flat() ?? [])])].join(' ').split(/\s+/).length / 200));
export const relatedArticles = (article: InsightArticle, items: InsightArticle[]) => items.filter(item => item.slug !== article.slug).sort((a, b) => Number(b.theme === article.theme) - Number(a.theme === article.theme)).slice(0, 3);
