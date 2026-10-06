import type { PublishedProject } from './projects';
import { portfolioCategories } from './project-taxonomy';
export const PORTFOLIO_PAGE_SIZE = 6;
export function portfolioSelection(projects: PublishedProject[] | null, query: { page?: string; type?: string; categorie?: string } = {}) {
  const page = query.page ? Number(query.page) : 1;
  const types = Array.from(new Set((projects ?? []).flatMap(project => project.type ? [project.type] : [])));
  const selectedType = query.type || undefined;
  const selectedCategory = query.categorie || undefined;
  const categories = portfolioCategories(projects ?? []);
  const filtered = (projects ?? []).filter(project => (!selectedType || project.type === selectedType) && (!selectedCategory || project.categories?.some(category => category.slug === selectedCategory)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PORTFOLIO_PAGE_SIZE));
  // A CMS outage must not turn a previously valid paginated URL into a 404.
  const valid = Number.isSafeInteger(page) && page >= 1 && (projects === null || (page <= pageCount && (!selectedType || types.includes(selectedType)) && (!selectedCategory || categories.some(category => category.slug === selectedCategory))));
  return { page, pageCount, selectedType, filtered, types, categories, selectedCategory, valid };
}
export function portfolioPath(page = 1, type?: string, category?: string) {
  const query = new URLSearchParams();
  if (page > 1) query.set('page', String(page));
  if (type) query.set('type', type);
  if (category) query.set('categorie', category);
  return `/work${query.size ? `?${query}` : ''}`;
}
