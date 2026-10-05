import { MetadataRoute } from 'next';
import { articles, articlePath, publishedTopics, publishedFormats, formatPath, publishedAuthors } from './lib/insights';
import { getPublishedProjects } from './lib/projects';
import { latestContentDate, pageUpdatedAt } from './lib/content-dates';

export const dynamic = 'force-dynamic';

import { SITE_URL } from './lib/site';
import { authorPath } from './lib/insights-authors';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  if (projects === null) throw new Error('Cannot generate a complete sitemap: portfolio unavailable');
  const articleDates = articles.map(article => article.updatedAt);
  const projectDates = projects.map(project => project.updatedAt);
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,              lastModified: latestContentDate(pageUpdatedAt.home, ...articleDates, ...projectDates), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/we`,            lastModified: latestContentDate(pageUpdatedAt.we), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/work`,          lastModified: latestContentDate(pageUpdatedAt.work, ...projectDates), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/you`,           lastModified: latestContentDate(pageUpdatedAt.you), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`,       lastModified: latestContentDate(pageUpdatedAt.contact), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/accessibilite`, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/accessibilite/engagement`, lastModified: new Date('2026-10-05'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${SITE_URL}/work/${project.documentId}`,
    lastModified: latestContentDate(project.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/insights`, lastModified: latestContentDate(pageUpdatedAt.insights, ...articleDates), changeFrequency: 'weekly', priority: 0.8 },
    ...publishedTopics.map(topic => ({ url: `${SITE_URL}/insights/${topic.slug}`, lastModified: new Date(Math.max(...articles.filter(article => article.theme === topic.slug).map(article => Date.parse(article.updatedAt)))) })),
    ...publishedFormats.map(format => ({ url: `${SITE_URL}${formatPath(format.slug)}`, lastModified: new Date(Math.max(...articles.filter(article => article.format === format.slug).map(article => Date.parse(article.updatedAt)))) })),
    ...publishedAuthors.map(author => ({ url: `${SITE_URL}${authorPath(author.slug)}`, lastModified: latestContentDate(author.updatedAt, ...articles.filter(article => article.authorId === author.slug).map(article => article.updatedAt)) })),
    ...articles.map(article => ({ url: `${SITE_URL}${articlePath(article)}`, lastModified: new Date(article.updatedAt) })),
  ];
  return [...staticPages, ...projectPages, ...blogPages];
}
