'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { PublishedProject } from '../lib/projects';

const PAGE_SIZE = 6;
export default function WorkPortfolio({ projects, compact = false }: { projects: PublishedProject[] | null; compact?: boolean }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filtered = useMemo(() => (projects ?? []).filter(project => !selectedType || project.type === selectedType), [projects, selectedType]);
  const types = Array.from(new Set((projects ?? []).map(project => project.type).filter((type): type is string => Boolean(type))));
  function selectType(type: string | null) {
    setSelectedType(type);
    setVisibleCount(PAGE_SIZE);
  }
  return (
    <section className="work-portfolio" id="realisations">
      <div className="work-container">
        <div className="wharf-section-heading"><p className="editorial-eyebrow">WHARF / WORK</p><h2>Nos réalisations.</h2></div>
        {projects === null ? (
          <p className="editorial-intro" role="status">Les réalisations sont momentanément indisponibles. <a href="/work#realisations">Réessayer</a> ou <a href="/contact">contactez-nous pour découvrir notre travail</a>.</p>
        ) : projects.length === 0 ? (
          <p className="editorial-intro">Les réalisations seront présentées ici prochainement. <a href="/contact">Échangeons sur votre projet</a>.</p>
        ) : (
          <>
            {!compact && types.length > 1 && <div className="work-filters" role="group" aria-label="Filtrer les réalisations">
              <button type="button" className={`work-filter ${selectedType === null ? 'active' : ''}`} aria-pressed={selectedType === null} onClick={() => selectType(null)}>Tous les projets ({projects.length})</button>
              {types.map(type => <button type="button" key={type} className={`work-filter ${selectedType === type ? 'active' : ''}`} aria-pressed={selectedType === type} onClick={() => selectType(type)}>{type} ({projects.filter(project => project.type === type).length})</button>)}
            </div>}
            {!compact && projects.length > PAGE_SIZE && <p className="editorial-result-count" aria-live="polite">{Math.min(visibleCount, filtered.length)} réalisation(s) affichée(s) sur {filtered.length}</p>}
            <div className={`work-masonry editorial-projects${filtered.length === 1 ? ' project-featured' : ''}`}>
              {filtered.slice(0, compact ? 3 : visibleCount).map(project => (
                <article key={project.documentId} className="work-masonry-item">
                  <a href={`/work/${project.documentId}`} className="work-project-link">
                    <div className="work-project-image">
                      {project.vignette?.url ? <Image src={project.vignette.url} alt={project.vignette.alternativeText || project.titre} width={1200} height={800} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 70vw, 65vw" className="work-project-image" loading="lazy" /> : <div className="editorial-project-placeholder">WHARF / WORK</div>}
                    </div>
                    <div className="work-project-caption"><h3>{project.titre}</h3><p className="editorial-eyebrow">{project.type}</p>{project.description_courte && <p>{project.description_courte}</p>}<span className="card-split-link">Découvrir le projet →</span></div>
                  </a>
                </article>
              ))}
            </div>
            {!compact && visibleCount < filtered.length && <div className="work-load-more"><button type="button" className="work-filter" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Voir plus de réalisations</button></div>}
            {compact && <a href="/work#realisations" className="card-split-link">Toutes les réalisations →</a>}
          </>
        )}
      </div>
    </section>
  );
}
