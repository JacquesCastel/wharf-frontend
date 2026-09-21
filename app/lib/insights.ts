import content from './insights-content.json';
import { insightTopics } from './editorial';
export const articles = content;
export type InsightArticle = typeof articles[number];
export const articlePath = (article: InsightArticle) => `/insights/${article.theme}/${article.slug}`;
export const publishedTopics = insightTopics.filter(topic => articles.some(article => article.theme === topic.slug));
export const getArticle = (theme: string, slug: string) => articles.find(article => article.theme === theme && article.slug === slug);
export const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date));
export const readingMinutes = (article: InsightArticle) => Math.max(1, Math.ceil([article.intro, article.takeaway, ...article.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.items ?? [])])].join(' ').split(/\s+/).length / 200));
