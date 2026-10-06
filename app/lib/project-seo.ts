import { getProjectEditorial } from './project-editorial';
import type { ProjectMedia } from './project-media';

export type ProjectSeoFields = {
  documentId: string;
  titre: string;
  contenu?: unknown;
  description_courte?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_image?: ProjectMedia | null;
  vignette?: ProjectMedia;
  hero_image?: ProjectMedia;
  hero_type?: string;
  hero_media?: ProjectMedia;
};

/** Optional SEO overrides never replace the visible project title or its URL. */
export function getProjectSeo(project: ProjectSeoFields) {
  const summary = project.description_courte?.trim() || getProjectEditorial(project)?.summary;
  const title = project.seo_title?.trim() || `${project.titre} — Portfolio | Wharf`;
  const description = project.seo_description?.trim() || summary || `Découvrez le projet ${project.titre} réalisé par Wharf.`;
  const image = [project.seo_image, project.vignette, project.hero_image, ...(project.hero_type === 'image' ? [project.hero_media] : [])].find(media => media?.url);
  return { summary, title, description, image };
}
