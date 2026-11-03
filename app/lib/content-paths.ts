import type { InsightArticle } from './insights';
import type { PublishedProject } from './projects';
import { CAFE_PROJECT_ID } from './project-editorial';

export const AI_PROJECT_ID = 'd3n2ackc10ow3w8i3hd4yt0o';

// Editorial selection: resolve only against the current published CMS collection.
const readingSlugs: Record<string, readonly string[]> = {
  '/work#strategy': ['strategie-editoriale-b2b-questions-acheteurs', 'tribune-dirigeant-conviction-prise-parole'],
  '/work#content': ['construire-sommaire-livre-blanc-question-client', 'newsletter-b2b-promesse-rubriques-numero-pilote'],
  '/work#video': ['preparer-brief-film-message-public-contraintes', 'tournage-videos-articles-linkedin'],
  '/work#creation-ia': ['ia-communication-b2b-montrer-le-reel', 'demonstration-b2b-ce-que-prouve-un-test'],
  '/you#visibilite': ['strategie-editoriale-b2b-questions-acheteurs', 'cas-client-preuve-expertise'],
  '/you#dirigeants': ['preparer-interview-dirigeant-video', 'tribune-dirigeant-conviction-prise-parole'],
  '/you#recrutement': ['preparer-portrait-metier-situations-travail', 'marque-employeur-montrer-au-dela-valeurs'],
  '/you#transformation': ['preparer-faq-transformation-questions-equipes', 'communication-interne-ce-qui-change-ce-qui-reste-a-decider'],
  '/you#reseaux': ['tournage-videos-articles-linkedin'],
  '/you#film': ['preparer-brief-film-message-public-contraintes', 'fiction-corporate-faire-comprendre-enjeu'],
};

export function contextReadings(articles: InsightArticle[], context: string): InsightArticle[] {
  return (readingSlugs[context] ?? []).flatMap(slug => {
    const article = articles.find(item => item.slug === slug);
    return article ? [article] : [];
  });
}

// These two articles discuss the limits of generative imagery or demonstrations.
// The film Au café du commerce is never selected for a blog article.
export function contextualProjectIds(article: InsightArticle): string[] {
  if (article.relatedProjectIds?.length) return article.relatedProjectIds.filter(id => id !== CAFE_PROJECT_ID);
  return ['ia-communication-b2b-montrer-le-reel', 'demonstration-b2b-ce-que-prouve-un-test'].includes(article.slug)
    ? [AI_PROJECT_ID] : [];
}

export type ContextLink = { href: string; label: string };
export const contentContexts = [
  { href: '/work#strategy', code: 'strategie', label: 'Stratégie de communication', need: 'Stratégie de communication' },
  { href: '/work#content', code: 'contenus', label: 'Création de contenus B2B', need: 'Création de contenus B2B' },
  { href: '/work#video', code: 'video', label: 'Conception et production vidéo', need: 'Film ou série vidéo' },
  { href: '/work#creation-ia', code: 'creation-ia', label: 'Création d’images et de films par l’IA', need: 'Création d’images et de films par l’IA' },
  { href: '/you#visibilite', code: 'visibilite', label: 'Faire connaître votre entreprise', need: 'Stratégie de communication' },
  { href: '/you#dirigeants', code: 'dirigeants', label: 'Donner la parole à vos dirigeants', need: 'Stratégie de communication' },
  { href: '/you#recrutement', code: 'recrutement', label: 'Attirer et recruter', need: 'Marque employeur ou recrutement' },
  { href: '/you#transformation', code: 'transformation', label: 'Expliquer une transformation', need: 'Communication interne ou transformation' },
  { href: '/you#reseaux', code: 'reseaux', label: 'Produire régulièrement pour vos réseaux', need: 'Création de contenus B2B' },
  { href: '/you#film', code: 'film', label: 'Produire un film', need: 'Film ou série vidéo' },
] as const;

const situationOffers: Record<string, string[]> = {
  '/you#visibilite': ['/work#strategy', '/work#content'],
  '/you#dirigeants': ['/work#strategy', '/work#video'],
  '/you#recrutement': ['/work#strategy', '/work#video'],
  '/you#transformation': ['/work#strategy', '/work#content'],
  '/you#reseaux': ['/work#content', '/work#video'],
  '/you#film': ['/work#video', '/work#creation-ia'],
};
const offerSituations: Record<string, string[]> = {
  '/work#strategy': ['/you#visibilite', '/you#dirigeants', '/you#transformation'],
  '/work#content': ['/you#visibilite', '/you#transformation', '/you#reseaux'],
  '/work#video': ['/you#dirigeants', '/you#recrutement', '/you#film'],
  '/work#creation-ia': ['/you#film'],
};
const contextLinks = (paths: string[]): ContextLink[] => [...new Set(paths)].flatMap(path => {
  const context = contentContexts.find(item => item.href === path);
  return context ? [{ href: context.href, label: context.label }] : [];
});
export const offerNeeds = (path: string) => contextLinks(offerSituations[path] ?? []);
export function contactContext(code: unknown) {
  return typeof code === 'string' ? contentContexts.find(context => context.code === code) : undefined;
}
export function contactHref(path: string): string {
  const context = contentContexts.find(item => item.href === path);
  return context ? `/contact?parcours=${context.code}#votre-projet` : '/contact';
}
export function articleRoutes(article: InsightArticle): ContextLink[] {
  const need = contentContexts.find(context => context.href.startsWith('/you#') &&
    (context.href === article.service || readingSlugs[context.href]?.includes(article.slug)));
  const ai = ['ia-communication-b2b-montrer-le-reel', 'demonstration-b2b-ce-que-prouve-un-test'].includes(article.slug);
  return contextLinks([
    article.service,
    ...(need ? [need.href, ...situationOffers[need.href]] : []),
    ...(ai ? ['/work#creation-ia'] : []),
  ]);
}
export function articleContactHref(article: InsightArticle): string {
  const ai = ['ia-communication-b2b-montrer-le-reel', 'demonstration-b2b-ce-que-prouve-un-test'].includes(article.slug);
  return contactHref(ai ? '/work#creation-ia' : article.service);
}
export function contextProjects(projects: PublishedProject[], context: string): PublishedProject[] {
  const category = ({ '/work#strategy': 'strategie', '/work#content': 'contenus-editoriaux', '/work#video': 'films-videos', '/you#film': 'films-videos', '/work#creation-ia': 'creation-ia' } as Record<string, string>)[context];
  return category ? projects.filter(project => project.categories?.some(item => item.slug === category)).slice(0, 2) : [];
}
export function projectRoutes(expertiseIds: string[], isVideo: boolean): ContextLink[] {
  return contextLinks([...expertiseIds.map(id => `/work#${id}`), ...(isVideo ? ['/you#film'] : [])]);
}
