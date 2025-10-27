import { MetadataRoute } from 'next';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.170.150';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const routes = [
    '',
    '/we',
    '/work',
    '/you',
    '/contact',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Récupérer les projets dynamiques
  try {
    const response = await fetch(`${STRAPI_URL}/api/projets?populate=*`);
    const data = await response.json();
    
    const projets = data.data.map((projet: any) => ({
      url: `${SITE_URL}/work/${projet.documentId}`,
      lastModified: new Date(projet.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...projets];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}