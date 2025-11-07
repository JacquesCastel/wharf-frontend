'use client';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Projet {
  id: number;
  documentId: string;
  Titre: string;
  type: string;
  vignette_grille: {
    url: string;
  };
}

const PROJETS_PER_PAGE = 6;

export default function WorkPortfolio() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [displayedProjets, setDisplayedProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Charger tous les projets au départ
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await fetch(
          'https://admin.bywharf.com/api/projets?populate=*'
        );
        const data = await response.json();
        const allProjets = data.data || [];
        setProjets(allProjets);
        setDisplayedProjets(allProjets.slice(0, PROJETS_PER_PAGE));
        setHasMore(allProjets.length > PROJETS_PER_PAGE);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  // Filtrer les projets selon le type sélectionné
  const filteredProjets = selectedType
    ? projets.filter(p => p.type === selectedType)
    : projets;

  // Charger plus de projets
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * PROJETS_PER_PAGE;
      const endIndex = startIndex + PROJETS_PER_PAGE;
      const newProjets = filteredProjets.slice(0, endIndex);
      
      setDisplayedProjets(newProjets);
      setPage(nextPage);
      setHasMore(endIndex < filteredProjets.length);
      setLoadingMore(false);
    }, 500);
  }, [page, filteredProjets, hasMore, loadingMore]);

  // Observer pour l'infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  // Reset quand on change de filtre
  useEffect(() => {
    setDisplayedProjets(filteredProjets.slice(0, PROJETS_PER_PAGE));
    setPage(1);
    setHasMore(filteredProjets.length > PROJETS_PER_PAGE);
  }, [selectedType, filteredProjets]);

  const types = Array.from(new Set(projets.map(p => p.type)));

  return (
    <section className="work-portfolio">
      <div className="work-container">
        <h2>Nos récits en action</h2>
        
        {/* Filtres */}
        <div className="work-filters">
          <button 
            className={`work-filter ${selectedType === null ? 'active' : ''}`}
            onClick={() => setSelectedType(null)}
          >
            Tous les projets ({projets.length})
          </button>
          {types.map(type => (
            <button
              key={type}
              className={`work-filter ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type} ({projets.filter(p => p.type === type).length})
            </button>
          ))}
        </div>

        {/* Grille Masonry */}
        {loading ? (
          <div className="work-loading">Chargement des projets...</div>
        ) : (
          <>
            <div className="work-masonry">
              {displayedProjets.map(projet => (
                <div 
                  key={projet.documentId} 
                  className="work-masonry-item"
                >
                  <a href={`/work/${projet.documentId}`} className="work-project-link">
                    <div className="work-project-image">
                      {projet.vignette_grille?.url && (
  <Image
    src={`https://admin.bywharf.com${projet.vignette_grille.url}`}
    alt={projet.Titre}
    width={600}
    height={400}
    className="work-project-image"
    loading="lazy"
  />
)}
                    </div>
                    <div className="work-project-overlay">
                      <h3>{projet.Titre}</h3>
                      <p>{projet.type}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Trigger pour infinite scroll */}
            {hasMore && (
              <div ref={observerTarget} className="work-load-more">
                {loadingMore && (
                  <div className="work-loading-more">
                    Chargement de plus de projets...
                  </div>
                )}
              </div>
            )}

            {/* Message de fin */}
            {!hasMore && displayedProjets.length > 0 && (
              <div className="work-end-message">
                Vous avez vu tous les projets {selectedType ? `de type "${selectedType}"` : ''} 🎉
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
