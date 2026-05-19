import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';

async function getProjetsIds(): Promise<string[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/projets?fields=documentId&pagination[pageSize]=100`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((p: any) => p.documentId as string).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/we`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/work`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/you`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contact`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/accessibilite`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const ids = await getProjetsIds();
  const projectPages: MetadataRoute.Sitemap = ids.map((id) => ({
    url: `${SITE_URL}/work/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
