import { getPageCopy } from '../lib/cms-content';
import Image from 'next/image';
import Link from 'next/link';
import type { PublishedProject } from '../lib/projects';
import { portfolioSelection, portfolioPath, PORTFOLIO_PAGE_SIZE } from '../lib/portfolio-pagination';

export default async function WorkPortfolio({ projects, compact = false, page = 1, selectedType, selectedCategory }: { projects: PublishedProject[] | null; compact?: boolean; page?: number; selectedType?: string; selectedCategory?: string }) {
  const copy = await getPageCopy('global');
  const t = copy.text;
  const { filtered, types, categories, pageCount } = portfolioSelection(projects, { page: String(page), type: selectedType, categorie: selectedCategory });
  const start = compact ? 0 : (page - 1) * PORTFOLIO_PAGE_SIZE;
  const visible = filtered.slice(start, start + (compact ? 3 : PORTFOLIO_PAGE_SIZE));
  return <section className="work-portfolio" id="realisations"><div className="work-container">
    <div className="wharf-section-heading"><p className="editorial-eyebrow">{t("work-WorkPortfolio-32")}</p><h2>{t("work-WorkPortfolio-33")}</h2></div>
    {projects === null ? <p className="editorial-intro" role="status">{t("work-WorkPortfolio-34")}<a href="/work#realisations">{t("work-WorkPortfolio-35")}</a> {t("work-WorkPortfolio-36")}<a href="/contact">{t("work-WorkPortfolio-37")}</a>{t("work-WorkPortfolio-38")}</p> : projects.length === 0 ? <p className="editorial-intro">{t("work-WorkPortfolio-39")}<a href="/contact">{t("work-WorkPortfolio-40")}</a>{t("work-WorkPortfolio-41")}</p> : <>
      {!compact && (categories.length > 0 || types.length > 1) && <nav className="work-filters" aria-label="Filtrer les réalisations">
        <Link className={`work-filter ${!selectedType && !selectedCategory ? 'active' : ''}`} aria-current={!selectedType && !selectedCategory ? 'page' : undefined} href="/work#realisations">{t("work-WorkPortfolio-42")}{projects.length}{t("work-WorkPortfolio-43")}</Link>
        {categories.map(category => <Link key={category.slug} className={`work-filter ${selectedCategory === category.slug ? 'active' : ''}`} aria-current={selectedCategory === category.slug ? 'page' : undefined} href={`${portfolioPath(1, undefined, category.slug)}#realisations`}>{category.nom} ({category.count})</Link>)}
        {categories.length === 0 && types.map(type => <Link key={type} className={`work-filter ${selectedType === type ? 'active' : ''}`} aria-current={selectedType === type ? 'page' : undefined} href={`${portfolioPath(1, type)}#realisations`}>{type} {t("work-WorkPortfolio-44")}{projects.filter(project => project.type === type).length}{t("work-WorkPortfolio-45")}</Link>)}
      </nav>}
      {!compact && filtered.length > PORTFOLIO_PAGE_SIZE && <p className="editorial-result-count">{start + 1}{t("work-WorkPortfolio-46")}{start + visible.length} {t("work-WorkPortfolio-47")}{filtered.length} {t("work-WorkPortfolio-48")}{page} {t("work-WorkPortfolio-49")}{pageCount}</p>}
      {filtered.length === 0 && <p role="status">Aucune réalisation ne correspond à ces filtres. <Link href="/work#realisations">Voir toutes les réalisations</Link></p>}
      <div className={`work-masonry editorial-projects${filtered.length === 1 ? ' project-featured' : ''}`}>
        {visible.map(project => <article key={project.documentId} className="work-masonry-item"><a href={`/work/${project.documentId}`} className="work-project-link">
          <div className="work-project-image">{project.vignette?.url ? <Image src={project.vignette.url} alt={project.vignette.alternativeText || project.titre} width={project.vignette.width || 1200} height={project.vignette.height || 800} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 70vw, 65vw" className="work-project-image" loading="lazy" /> : <div className="editorial-project-placeholder">{t("work-WorkPortfolio-50")}</div>}</div>
          <div className="work-project-caption"><h3>{project.titre}</h3><p className="editorial-eyebrow">{project.categories?.length ? project.categories.map(category => category.nom).join(" · ") : project.type}</p>{project.description_courte && <p>{project.description_courte}</p>}<span className="card-split-link">{t("work-WorkPortfolio-51")}</span></div>
        </a></article>)}
      </div>
      {!compact && pageCount > 1 && <nav className="work-load-more" aria-label="Pages des réalisations">{page > 1 && <Link className="work-filter" href={`${portfolioPath(page - 1, selectedType, selectedCategory)}#realisations`}>{t("work-WorkPortfolio-52")}</Link>}{page < pageCount && <Link className="work-filter" href={`${portfolioPath(page + 1, selectedType, selectedCategory)}#realisations`}>{t("work-WorkPortfolio-53")}</Link>}</nav>}
      {compact && <a href="/work#realisations" className="card-split-link">{t("work-WorkPortfolio-54")}</a>}
    </>}
  </div></section>;
}
