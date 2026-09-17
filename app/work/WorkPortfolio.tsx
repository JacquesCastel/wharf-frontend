'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { PublishedProject } from '../lib/projects';

const PAGE_SIZE = 6;
export default function WorkPortfolio({ projects }: { projects: PublishedProject[] | null }) {
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
        <h2>Nos réalisations</h2>
        {projects === null ? (
          <p className="editorial-intro" role="status">Les réalisations sont momentanément indisponibles. <a href="/work#realisations">Réessayer</a> ou <a href="/contact">contactez-nous pour découvrir notre travail</a>.</p>
        ) : projects.length === 0 ? (
          <p className="editorial-intro">Les réalisations seront présentées ici prochainement. <a href="/contact">Échangeons sur votre projet</a>.</p>
        ) : (
          <>
            <div className="work-filters" role="group" aria-label="Filtrer les réalisations">
              <button type="button" className={`work-filter ${selectedType === null ? 'active' : ''}`} aria-pressed={selectedType === null} onClick={() => selectType(null)}>Tous les projets ({projects.length})</button>
              {types.map(type => <button type="button" key={type} className={`work-filter ${selectedType === type ? 'active' : ''}`} aria-pressed={selectedType === type} onClick={() => selectType(type)}>{type} ({projects.filter(project => project.type === type).length})</button>)}
            </div>
            <p className="editorial-result-count" aria-live="polite">{Math.min(visibleCount, filtered.length)} réalisation(s) affichée(s) sur {filtered.length}</p>
            <div className="work-masonry">
              {filtered.slice(0, visibleCount).map(project => (
                <article key={project.documentId} className="work-masonry-item">
                  <a href={`/work/${project.documentId}`} className="work-project-link">
                    <div className="work-project-image">
                      {project.vignette?.url ? <Image src={project.vignette.url} alt={project.vignette.alternativeText || project.titre} width={600} height={400} className="work-project-image" loading="lazy" /> : <div className="editorial-project-placeholder">WHARF / WORK</div>}
                    </div>
                    <div className="work-project-overlay"><h3>{project.titre}</h3><p>{project.type}</p></div>
                  </a>
                </article>
              ))}
            </div>
            {visibleCount < filtered.length && <div className="work-load-more"><button type="button" className="work-filter" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>Voir plus de réalisations</button></div>}
          </>
        )}
      </div>
    </section>
  );
}
