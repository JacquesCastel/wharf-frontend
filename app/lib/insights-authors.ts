import data from './insights-authors.json';
import { absoluteUrl } from './site';

export type InsightAuthor = {
  slug: string; name: string; role: string; bio: string; expertise: string[];
  updatedAt: string;
  photo?: { url: string; width: number; height: number; alt: string };
};
export const authorPath = (slug: string) => `/insights/auteurs/${slug}`;
export const insightAuthors: InsightAuthor[] = data as InsightAuthor[];
const seen = new Set<string>();
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
function validPhotoUrl(value: string) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && (url.hostname === 'bywharf.com' || url.hostname === 'admin.bywharf.com' && url.pathname.startsWith('/uploads/')); } catch { return false; }
}
for (const author of insightAuthors) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(author.slug) || seen.has(author.slug) || !author.name?.trim() || !author.role?.trim() || !author.bio?.trim() || !author.expertise?.length || !author.expertise.every(value => typeof value === 'string' && value.trim()) || !validDate(author.updatedAt)) {
    throw new Error(`Incomplete or duplicate Insights author: ${author.slug}`);
  }
  if (author.photo && (!validPhotoUrl(author.photo.url) || !Number.isFinite(author.photo.width) || !Number.isFinite(author.photo.height) || author.photo.width <= 0 || author.photo.height <= 0 || !author.photo.alt?.trim())) throw new Error(`Invalid author photo: ${author.slug}`);
  seen.add(author.slug);
}
export const getInsightAuthor = (slug?: string) => insightAuthors.find(author => author.slug === slug);
export function articleAuthor(article: { author: string; authorId?: string }) {
  const person = getInsightAuthor(article.authorId);
  return { name: person?.name ?? article.author, path: person ? authorPath(person.slug) : '/we', url: absoluteUrl(person ? authorPath(person.slug) : '/we'), person };
}
