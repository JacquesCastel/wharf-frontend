import content from './insights-content.json';
import { insightTopics } from './editorial';

export const insightFormats = [
  { slug: 'guides', label: 'Guide', title: 'Guides', description: 'Des méthodes et des outils pour préparer vos contenus et vos films B2B.' },
  { slug: 'analyses', label: 'Analyse', title: 'Analyses', description: 'Des décryptages pour éclairer vos choix de communication et de production.' },
  { slug: 'observations', label: 'Observation / Data', title: 'Observations / Data', description: 'Des observations documentées, avec leur périmètre, leurs sources et leurs limites.' },
  { slug: 'etudes', label: 'Étude', title: 'Études Wharf', description: 'Des études originales, avec une méthode explicite et des données vérifiables.' },
] as const;
export type InsightFormat = typeof insightFormats[number]['slug'];
export type InsightArticle = {
  slug: string;
  theme: string;
  tag: string;
  title: string;
  seoTitle: string;
  description: string;
  intro: string;
  takeaway: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  cta: string;
  service: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    items?: string[];
    source?: { label: string; url: string; accessedAt: string };
    table?: { caption: string; headers: string[]; rows: string[][] };
  }[];
  format: InsightFormat;
  research?: {
    series?: 'observatoire-wharf';
    period: string;
    scope: string;
    method: string;
    limitations: string;
    sources: { label: string; url: string; accessedAt: string }[];
  };
};
// Validate the editorial taxonomy before publishing.
export const articles: InsightArticle[] = (content as InsightArticle[]).map(article => {
  if (!insightFormats.some(format => format.slug === article.format)) {
    throw new Error(`Unknown Insights format: ${article.slug}`);
  }
  const entry: InsightArticle = { ...article, format: article.format as InsightFormat };
  if (entry.format === 'etudes' || entry.format === 'observations') {
    const research = entry.research;
    if (!research || !research.period?.trim() || !research.scope?.trim() || !research.method?.trim() || !research.limitations?.trim() || !research.sources?.length) {
      throw new Error(`Missing research evidence: ${entry.slug}`);
    }
  }
  if (entry.research && (entry.research.sources.some(source => !source.label?.trim() || !/^https?:\/\//.test(source.url) || !/^\d{4}-\d{2}-\d{2}$/.test(source.accessedAt)) || (entry.research.series && entry.research.series !== 'observatoire-wharf'))) {
    throw new Error(`Invalid research source or series: ${entry.slug}`);
  }
  return entry;
}).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const articlePath = (article: InsightArticle) => `/insights/${article.theme}/${article.slug}`;
export const formatPath = (slug: string) => `/insights/formats/${slug}`;
export const getArticleFormat = (article: InsightArticle) => insightFormats.find(format => format.slug === article.format);
export const publishedFormats = insightFormats.filter(format => articles.some(article => article.format === format.slug));
export const publishedTopics = insightTopics.filter(topic => articles.some(article => article.theme === topic.slug));
export const getArticle = (theme: string, slug: string) => articles.find(article => article.theme === theme && article.slug === slug);
export const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
export const readingMinutes = (article: InsightArticle) => Math.max(1, Math.ceil([article.intro, article.takeaway, ...article.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.items ?? []), ...(section.table?.rows.flat() ?? [])])].join(' ').split(/\s+/).length / 200));
export const relatedArticles = (article: InsightArticle) => articles.filter(item => item.slug !== article.slug).sort((a, b) => Number(b.theme === article.theme) - Number(a.theme === article.theme)).slice(0, 3);
