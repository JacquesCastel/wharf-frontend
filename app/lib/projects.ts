import { cache } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
export interface PublishedProject {
  id: number;
  documentId: string;
  titre: string;
  type?: string;
  description_courte?: string;
  vignette?: { url: string; alternativeText?: string };
}
export function projectMediaUrl(path: string): string {
  return new URL(path, STRAPI_URL).toString();
}

// null denotes an unavailable service, [] a successfully loaded empty collection.
// Fetch every Strapi page, so filtering and counts cover the complete portfolio.
export const getPublishedProjects = cache(async (): Promise<PublishedProject[] | null> => {
  try {
    const projects: PublishedProject[] = [];
    let page = 1;
    let pageCount = 1;
    do {
      const query = new URLSearchParams({
        populate: '*', status: 'published', sort: 'publishedAt:desc',
        'pagination[page]': String(page), 'pagination[pageSize]': '100',
      });
      const response = await fetch(`${STRAPI_URL}/api/projets?${query}`, {
        cache: 'no-store', signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Portfolio HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload.data)) throw new Error('Invalid portfolio response');
      for (const project of payload.data) {
        if (typeof project.documentId !== 'string' || typeof project.titre !== 'string') {
          throw new Error('Invalid project identity');
        }
        projects.push({
          id: project.id, documentId: project.documentId, titre: project.titre,
          type: project.type, description_courte: project.description_courte,
          vignette: project.vignette?.url ? {
            url: projectMediaUrl(project.vignette.url),
            alternativeText: project.vignette.alternativeText || '',
          } : undefined,
        });
      }
      pageCount = payload.meta?.pagination?.pageCount ?? 1;
      if (!Number.isInteger(pageCount) || pageCount < 0) throw new Error('Invalid pagination');
      page += 1;
    } while (page <= pageCount);
    return projects;
  } catch (error) {
    console.error('Portfolio unavailable:', error);
    return null;
  }
});
