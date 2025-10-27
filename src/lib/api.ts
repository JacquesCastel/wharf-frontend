import { Projet } from './types';

const API_URL = 'http://91.99.170.150';

export async function fetchAPI(path: string, options: any = {}) {
  try {
    const urlString = `${API_URL}/api${path}`;
    const response = await fetch(urlString, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Projets (Portfolio)
export async function getProjets(filters?: any) {
  const query = new URLSearchParams();
  query.append('populate', '*');
  if (filters?.type) {
    query.append('filters[type][$eq]', filters.type);
  }
  if (filters?.sort) {
    query.append('sort', filters.sort);
  }
  if (filters?.pagination) {
    query.append('pagination[page]', filters.pagination.page);
    query.append('pagination[pageSize]', filters.pagination.pageSize);
  }
  return fetchAPI(`/projets?${query.toString()}`);
}

export async function getProjetBySlug(slug: string) {
  return fetchAPI(`/projets?filters[slug][$eq]=${slug}&populate=*`);
}