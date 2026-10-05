import { positioning, description, offers } from './editorial';
import { SITE_URL, ORGANIZATION_ID, WEBSITE_ID, absoluteUrl, webPageId, serviceId } from './site';
import type { InsightAuthor } from './insights-authors';
import { authorPath, articleAuthor } from './insights-authors';
import type { InsightArticle, InsightSource } from './insights';

export type Schema = Record<string, unknown>;
export const organizationSchema = (): Schema => ({
  '@context': 'https://schema.org', '@type': 'Organization', '@id': ORGANIZATION_ID,
  name: 'Wharf', url: SITE_URL, logo: absoluteUrl('/images/logo-wharf.png'),
  description, slogan: positioning, email: 'contact@bywharf.com',
  areaServed: { '@type': 'Country', name: 'France' },
  contactPoint: { '@type': 'ContactPoint', email: 'contact@bywharf.com', contactType: 'customer service', availableLanguage: 'fr' },
  knowsAbout: ['Stratégie de communication B2B', 'Contenus B2B', 'Production vidéo B2B', 'Communication corporate', 'Design narratif', 'Marque employeur', 'Communication du changement', 'Stratégie éditoriale', 'Création image et vidéo IA'],
});
export const websiteSchema = (): Schema => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': WEBSITE_ID,
  name: 'Wharf', url: SITE_URL, description: positioning, inLanguage: 'fr-FR', publisher: { '@id': ORGANIZATION_ID },
});
export function webPageSchema({ path, title, description, type = 'WebPage', dateModified, about }: { path: string; title: string; description: string; type?: string; dateModified?: string; about?: Schema | Schema[] }): Schema {
  return { '@context': 'https://schema.org', '@type': type, '@id': webPageId(path), url: absoluteUrl(path), name: title, description, inLanguage: 'fr-FR', isPartOf: { '@id': WEBSITE_ID }, publisher: { '@id': ORGANIZATION_ID }, about: about ?? { '@id': ORGANIZATION_ID }, ...(dateModified ? { dateModified } : {}) };
}
export const breadcrumbsSchema = (items: { name: string; path: string }[]): Schema => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
});
export const servicesSchema = (): Schema[] => offers.map(offer => ({
  '@context': 'https://schema.org', '@type': 'Service', '@id': serviceId(offer.id),
  name: offer.id === 'strategy' ? 'Stratégie de communication B2B' : offer.id === 'content' ? 'Création de contenus B2B' : offer.id === 'video' ? 'Production vidéo B2B' : offer.title,
  description: offer.description, url: absoluteUrl(`/work#${offer.id}`), provider: { '@id': ORGANIZATION_ID },
}));
export const personSchema = (person: InsightAuthor): Schema => ({
  '@context': 'https://schema.org', '@type': 'Person', '@id': `${absoluteUrl(authorPath(person.slug))}#person`,
  name: person.name, url: absoluteUrl(authorPath(person.slug)), jobTitle: person.role, description: person.bio,
  knowsAbout: person.expertise, worksFor: { '@id': ORGANIZATION_ID }, ...(person.photo ? { image: absoluteUrl(person.photo.url) } : {}),
});
const citationSchema = (source: InsightSource): Schema => ({ '@type': 'CreativeWork', name: source.title || source.label, url: source.url, ...(source.organization ? { publisher: { '@type': 'Organization', name: source.organization } } : {}), ...(source.publishedAt ? { datePublished: source.publishedAt } : {}) });
export function articleSchema(article: InsightArticle, topic: string, format: string): Schema[] {
  const path = `/insights/${article.theme}/${article.slug}`;
  const author = articleAuthor(article);
  const sources = [...article.sections.flatMap(section => section.source ? [section.source] : []), ...(article.research?.sources ?? [])];
  const uniqueSources = sources.filter((source, index) => sources.findIndex(other => other.url === source.url) === index);
  return [
    ...(author.person ? [personSchema(author.person)] : []),
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${absoluteUrl(path)}#article`,
      headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt,
      author: { '@id': author.person ? `${author.url}#person` : ORGANIZATION_ID }, publisher: { '@id': ORGANIZATION_ID },
      mainEntityOfPage: { '@id': webPageId(path) }, isPartOf: { '@id': WEBSITE_ID }, url: absoluteUrl(path), inLanguage: 'fr-FR', articleSection: topic, genre: format,
      image: absoluteUrl(`/og?theme=${encodeURIComponent(article.theme)}&slug=${encodeURIComponent(article.slug)}`),
      ...(article.service.startsWith('/work#') ? { about: { '@id': serviceId(article.service.split('#')[1]) } } : {}),
      ...(uniqueSources.length ? { citation: uniqueSources.map(citationSchema) } : {}),
    },
  ];
}
export type VideoEvidence = { name: string; description: string; thumbnailUrl: string; uploadDate: string; contentUrl?: string; embedUrl?: string; duration?: string; transcript?: string };
export function videoSchema(video: VideoEvidence, pageUrl: string, index = 0): Schema | undefined {
  // No upload date or thumbnail is inferred from the project publication date.
  if (!video.name?.trim() || !video.description?.trim() || !/^https?:\/\//.test(video.thumbnailUrl) || !Number.isFinite(Date.parse(video.uploadDate)) || !video.contentUrl && !video.embedUrl || video.contentUrl && !/^https?:\/\//.test(video.contentUrl) || video.embedUrl && !/^https?:\/\//.test(video.embedUrl)) return undefined;
  return { '@context': 'https://schema.org', '@type': 'VideoObject', '@id': `${pageUrl}#video-${index + 1}`, name: video.name, description: video.description, thumbnailUrl: video.thumbnailUrl, uploadDate: video.uploadDate, ...(video.contentUrl ? { contentUrl: video.contentUrl } : {}), ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}), ...(video.duration ? { duration: video.duration } : {}), ...(video.transcript ? { transcript: video.transcript } : {}), isPartOf: { '@id': webPageId(new URL(pageUrl).pathname) }, publisher: { '@id': ORGANIZATION_ID } };
}
export function projectSchema({ titre, description, image, url, datePublished, dateModified, client, videos = [], expertiseIds = [] }: { titre: string; description?: string; image?: string; url: string; datePublished?: string; dateModified?: string; client?: string; videos?: VideoEvidence[]; expertiseIds?: string[] }): Schema[] {
  const videoNodes = videos.flatMap((video, index) => { const node = videoSchema(video, url, index); return node ? [node] : []; });
  return [{ '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': `${url}#project`, name: titre, url, creator: { '@id': ORGANIZATION_ID }, mainEntityOfPage: { '@id': webPageId(new URL(url).pathname) }, inLanguage: 'fr-FR', ...(description ? { description } : {}), ...(image ? { image } : {}), ...(datePublished ? { datePublished } : {}), ...(dateModified ? { dateModified } : {}), ...(client ? { contributor: { '@type': 'Organization', name: client } } : {}), ...(videoNodes.length ? { video: videoNodes.map(node => ({ '@id': node['@id'] })) } : {}), ...(expertiseIds.length ? { about: expertiseIds.map(id => ({ '@id': serviceId(id) })) } : {}) }, ...videoNodes];
}
