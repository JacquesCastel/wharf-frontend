import { cache } from 'react';
import defaults from './page-copy.json';
import { insightTopics, offers, situations } from './editorial';
import { insightAuthors } from './insights-authors';
import { validateInsights, insightFormats, type InsightArticle } from './insights';
import { blocksToHtml } from './strapi';
export type PageSlug = keyof typeof defaults;
type CmsPage = { slug: PageSlug; texts: Record<string, string>; seoTitle?: string; seoDescription?: string; updatedAt?: string };
export async function fetchPublishedContent(fetcher: typeof fetch = fetch): Promise<{ articles: InsightArticle[]; pages: CmsPage[] }> {
 const base = process.env.STRAPI_CONTENT_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
 const response = await fetcher(new URL('/api/wharf-content', base), { cache: 'no-store', signal: AbortSignal.timeout(10000) });
 if (!response.ok) throw new Error('CMS indisponible : HTTP ' + response.status);
 const { data } = await response.json();
 if (!Array.isArray(data?.articles) || !Array.isArray(data?.pages)) throw new Error('Réponse CMS invalide');
 return { articles: validateInsights(data.articles), pages: data.pages };
}
export const getPublishedContent = cache(fetchPublishedContent);
export const getInsights = cache(async () => {
 const { articles } = await getPublishedContent();
 return { articles, publishedTopics: insightTopics.filter(topic => articles.some(article => article.theme === topic.slug)), publishedFormats: insightFormats.filter(format => articles.some(article => article.format === format.slug)), publishedAuthors: insightAuthors.filter(author => articles.some(article => article.authorId === author.slug)) };
});
export const getLiveArticle = async (theme: string, slug: string) => (await getInsights()).articles.find(article => article.theme === theme && article.slug === slug);
export const getPageCopy = cache(async (slug: PageSlug) => {
 const page = (await getPublishedContent()).pages.find(page => page.slug === slug);
 if (!page) throw new Error('Page non publiée dans le CMS : ' + slug);
 const seed = defaults[slug];
 const text = (key: string) => {
  if (typeof page.texts[key] === 'string') return page.texts[key];
  const item = (seed.texts as Record<string, {value: string}>)[key];
  if (!item) throw new Error('Texte inconnu : ' + slug + '/' + key);
  return item.value;
 };
 const html = (key: string) => blocksToHtml(text(key).split(/\n\s*\n/).map(text => ({type:'paragraph',children:[{type:'text',text}]})));
 const seoDefaults = 'seo' in seed ? seed.seo : undefined;
 return { text, html, updatedAt: page.updatedAt, seo: { title: page.seoTitle || seoDefaults?.title || '', description: page.seoDescription || seoDefaults?.description || '' } };
});
export const getLiveOffers = cache(async () => {
 const copy = await getPageCopy('global');
 return offers.map(offer => ({...offer,name:copy.text('offer-'+offer.id+'-name'),title:copy.text('offer-'+offer.id+'-title'),description:copy.text('offer-'+offer.id+'-description'),items:copy.text('offer-'+offer.id+'-items').split('\n').filter(Boolean)}));
});
export const getLiveSituations = cache(async () => {
 const copy = await getPageCopy('you');
 return situations.map(situation => ({...situation,titre:copy.text('situation-'+situation.id+'-titre'),description:copy.text('situation-'+situation.id+'-description'),formats:copy.text('situation-'+situation.id+'-formats'),links:situation.links.map((link,i)=>({...link,label:copy.text('situation-'+situation.id+'-link-'+i)}))}));
});
