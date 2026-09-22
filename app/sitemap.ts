import { MetadataRoute } from 'next';
import { articles, articlePath, publishedTopics } from './lib/insights';
import { getPublishedProjects } from './lib/projects';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/we`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/work`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/you`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/accessibilite`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const projects = await getPublishedProjects();
  if (projects === null) throw new Error('Cannot generate a complete sitemap: portfolio unavailable');
  const ids = projects.map(project => project.documentId);
  const projectPages: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${SITE_URL}/work/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/insights`, lastModified: new Date(Math.max(...articles.map(article => Date.parse(article.updatedAt)))), changeFrequency: 'weekly', priority: 0.8 },
    ...publishedTopics.map(topic => ({ url: `${SITE_URL}/insights/${topic.slug}`, lastModified: new Date(Math.max(...articles.filter(article => article.theme === topic.slug).map(article => Date.parse(article.updatedAt)))) })),
    ...articles.map(article => ({ url: `${SITE_URL}${articlePath(article)}`, lastModified: new Date(article.updatedAt) })),
  ];
  return [...staticPages, ...projectPages, ...blogPages];
}
