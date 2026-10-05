import Image from 'next/image';
import Link from 'next/link';
import type { PublishedProject } from '../lib/projects';
import { portfolioSelection, portfolioPath, PORTFOLIO_PAGE_SIZE } from '../lib/portfolio-pagination';

export default function WorkPortfolio({ projects, compact = false, page = 1, selectedType }: { projects: PublishedProject[] | null; compact?: boolean; page?: number; selectedType?: string }) {
  const { filtered, types, pageCount } = portfolioSelection(projects, { page: String(page), type: selectedType });
  const start = compact ? 0 : (page - 1) * PORTFOLIO_PAGE_SIZE;
  const visible = filtered.slice(start, start + (compact ? 3 : PORTFOLIO_PAGE_SIZE));
  return <section className="work-portfolio" id="realisations"><div className="work-container">
    <div className="wharf-section-heading"><p className="editorial-eyebrow">WHARF / WORK</p><h2>Nos réalisations.</h2></div>
    {projects === null ? <p className="editorial-intro" role="status">Les réalisations sont momentanément indisponibles. <a href="/work#realisations">Réessayer</a> ou <a href="/contact">contactez-nous pour découvrir notre travail</a>.</p> : projects.length === 0 ? <p className="editorial-intro">Les réalisations seront présentées ici prochainement. <a href="/contact">Échangeons sur votre projet</a>.</p> : <>
      {!compact && types.length > 1 && <nav className="work-filters" aria-label="Filtrer les réalisations">
        <Link className={`work-filter ${!selectedType ? 'active' : ''}`} aria-current={!selectedType ? 'page' : undefined} href="/work#realisations">Tous les projets ({projects.length})</Link>
        {types.map(type => <Link key={type} className={`work-filter ${selectedType === type ? 'active' : ''}`} aria-current={selectedType === type ? 'page' : undefined} href={`${portfolioPath(1, type)}#realisations`}>{type} ({projects.filter(project => project.type === type).length})</Link>)}
      </nav>}
      {!compact && projects.length > PORTFOLIO_PAGE_SIZE && <p className="editorial-result-count">{start + 1}–{start + visible.length} sur {filtered.length} réalisations · page {page} sur {pageCount}</p>}
      <div className={`work-masonry editorial-projects${filtered.length === 1 ? ' project-featured' : ''}`}>
        {visible.map(project => <article key={project.documentId} className="work-masonry-item"><a href={`/work/${project.documentId}`} className="work-project-link">
          <div className="work-project-image">{project.vignette?.url ? <Image src={project.vignette.url} alt={project.vignette.alternativeText || project.titre} width={project.vignette.width || 1200} height={project.vignette.height || 800} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 70vw, 65vw" className="work-project-image" loading="lazy" /> : <div className="editorial-project-placeholder">WHARF / WORK</div>}</div>
          <div className="work-project-caption"><h3>{project.titre}</h3><p className="editorial-eyebrow">{project.type}</p>{project.description_courte && <p>{project.description_courte}</p>}<span className="card-split-link">Découvrir le projet →</span></div>
        </a></article>)}
      </div>
      {!compact && pageCount > 1 && <nav className="work-load-more" aria-label="Pages des réalisations">{page > 1 && <Link className="work-filter" href={`${portfolioPath(page - 1, selectedType)}#realisations`}>← Réalisations précédentes</Link>}{page < pageCount && <Link className="work-filter" href={`${portfolioPath(page + 1, selectedType)}#realisations`}>Réalisations suivantes →</Link>}</nav>}
      {compact && <a href="/work#realisations" className="card-split-link">Toutes les réalisations →</a>}
    </>}
  </div></section>;
}
