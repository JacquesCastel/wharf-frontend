// Initial import archive and fixtures; never imported by a public route.
import content from './insights-content.json';
import { insightTopics } from './editorial';
import { insightAuthors } from './insights-authors';
import { validateInsights, insightFormats, relatedArticles as selectRelated, type InsightArticle } from './insights';
export * from './insights';
export const articles = validateInsights(content as InsightArticle[]);
export const publishedAuthors = insightAuthors.filter(author => articles.some(article => article.authorId === author.slug));
export const publishedFormats = insightFormats.filter(format => articles.some(article => article.format === format.slug));
export const publishedTopics = insightTopics.filter(topic => articles.some(article => article.theme === topic.slug));
export const getArticle = (theme: string, slug: string) => articles.find(article => article.theme === theme && article.slug === slug);
export const relatedArticles = (article: InsightArticle) => selectRelated(article, articles);
