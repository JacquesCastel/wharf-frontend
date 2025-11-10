import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

async function getProjet(id: string) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/projets/${id}?populate=*`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching projet:', error);
    return null;
  }
}

// Générer les métadonnées dynamiques pour chaque projet
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const projet = await getProjet(params.id);

  if (!projet) {
    return {
      title: 'Projet introuvable - Wharf',
      description: 'Ce projet n\'existe pas.',
    };
  }

  const titre = projet.titre || 'Projet';
  const description = projet.description_courte || `Découvrez le projet ${titre} réalisé par Wharf.`;

   // Image Open Graph (vignette ou hero)
  let ogImage = `${SITE_URL}/og-default.jpg`;
  
  if (projet.vignette?.url) {
    ogImage = `${STRAPI_URL}${projet.vignette.url}`;
  } else if (projet.hero_image?.url) {
    ogImage = `${STRAPI_URL}${projet.hero_image.url}`;
  }

  return {
    title: `${titre} - Portfolio Wharf`,
    description,
    openGraph: {
      title: `${titre} - Portfolio Wharf`,
      description,
      url: `${SITE_URL}/work/${params.id}`,
      siteName: 'Wharf',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: titre,
        },
      ],
      locale: 'fr_FR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titre} - Portfolio Wharf`,
      description,
      images: [ogImage],
    },
  };
}
  


async function getAllProjets() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/projets?populate=*`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching projets:', error);
    return [];
  }
}

export default async function ProjetDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const projet = await getProjet(params.id);

  if (!projet) {
    notFound();
  }

  const allProjets = await getAllProjets();
  const currentIndex = allProjets.findIndex((p: any) => p.documentId === params.id);
  const prevProjet = currentIndex > 0 ? allProjets[currentIndex - 1] : null;
  const nextProjet = currentIndex < allProjets.length - 1 ? allProjets[currentIndex + 1] : null;

  return (
    <>
      {/* HERO */}
      <section className="projet-hero">
        {projet.hero_type === 'video' && projet.hero_media?.url ? (
          <video
            className="projet-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={`${STRAPI_URL}${projet.hero_media.url}`} type="video/mp4" />
          </video>
        ) : projet.hero_image?.url ? (
          <div className="projet-hero-image">
            <Image
              src={`${STRAPI_URL}${projet.hero_image.url}`}
              alt={projet.titre}
              fill
              className="projet-hero-img"
              style={{ objectFit: 'cover' }}
              priority
              unoptimized={true}
            />
          </div>
        ) : null}

        <div className="projet-hero-overlay"></div>
        
        {projet.hero_titre_position === 'dessus' && (
          <div className="projet-hero-content">
            <h1>{projet.titre}</h1>
            <p className="projet-type">{projet.type}</p>
          </div>
        )}
      </section>

      {/* TITRE SOUS LE HERO */}
      {projet.hero_titre_position === 'dessous' && (
        <section className="projet-header">
          <div className="projet-container">
            <h1>{projet.titre}</h1>
            <p className="projet-type">{projet.type}</p>
            {projet.description_courte && (
              <p className="projet-description">{projet.description_courte}</p>
            )}
          </div>
        </section>
      )}

      {/* CONTENU DYNAMIQUE */}
      <section className="projet-content">
        <div className="projet-container">
          {projet.contenu?.map((bloc: any, index: number) => {
            switch (bloc.__component) {
              case 'bloc.texte-bloc':
                return (
                  <div key={index} className="bloc-texte">
                    {bloc.titre && <h2>{bloc.titre}</h2>}
                    {bloc.contenu && (
                      <div 
                        className="bloc-texte-content"
                        dangerouslySetInnerHTML={{ 
                          __html: renderBlocks(bloc.contenu) 
                        }}
                      />
                    )}
                  </div>
                );

              case 'bloc.image-bloc':
                return (
                  <div key={index} className="bloc-image">
                    {bloc.image?.url && (
                      <figure>
                        <Image
                          src={`${STRAPI_URL}${bloc.image.url}`}
                          alt={bloc.legende || ''}
                          width={1200}
                          height={800}
                          className="bloc-image-img"
                          loading="lazy"
                          unoptimized={true}
                        />
                        {bloc.legende && (
                          <figcaption>{bloc.legende}</figcaption>
                        )}
                      </figure>
                    )}
                  </div>
                );

              case 'bloc.video-bloc':
                return (
                  <div key={index} className="bloc-video">
                    {bloc.type_video === 'upload' && bloc.video_fichier?.url ? (
                      <video controls>
                        <source 
                          src={`${STRAPI_URL}${bloc.video_fichier.url}`} 
                          type="video/mp4" 
                        />
                      </video>
                    ) : bloc.video_url ? (
                      <div className="video-embed">
                        <iframe
                          src={bloc.video_url}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                  </div>
                );

              case 'bloc.galerie-bloc':
                return (
                  <div 
                    key={index} 
                    className="bloc-galerie"
                    style={{ 
                      gridTemplateColumns: `repeat(${bloc.colonnes || 3}, 1fr)` 
                    }}
                  >
                    {bloc.images?.map((img: any, imgIndex: number) => (
                      <div key={imgIndex} className="galerie-item">
                        <Image
                          src={`${STRAPI_URL}${img.url}`}
                          alt={img.alternativeText || ''}
                          width={600}
                          height={400}
                          className="galerie-item-img"
                          loading="lazy"
                          unoptimized={true}
                        />
                      </div>
                    ))}
                  </div>
                );

              case 'bloc.citation-bloc':
                return (
                  <div key={index} className="bloc-citation">
                    <blockquote>
                      <p className="citation-text">{bloc.citation}</p>
                      {(bloc.auteur || bloc.fonction || bloc.entreprise) && (
                        <footer className="citation-author">
                          {bloc.auteur && <span className="auteur">{bloc.auteur}</span>}
                          {bloc.fonction && <span className="fonction">{bloc.fonction}</span>}
                          {bloc.entreprise && <span className="entreprise">{bloc.entreprise}</span>}
                        </footer>
                      )}
                    </blockquote>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </section>

      {/* NAVIGATION PROJET PRÉCÉDENT / SUIVANT */}
      <section className="projet-navigation">
        <div className="projet-container">
          <div className="projet-nav-grid">
            {prevProjet ? (
              <Link 
                href={`/work/${prevProjet.documentId}`}
                className="projet-nav-link projet-nav-prev"
              >
                <span className="nav-label">← Projet précédent</span>
                <span className="nav-titre">{prevProjet.titre}</span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextProjet ? (
              <Link 
                href={`/work/${nextProjet.documentId}`}
                className="projet-nav-link projet-nav-next"
              >
                <span className="nav-label">Projet suivant →</span>
                <span className="nav-titre">{nextProjet.titre}</span>
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          <div className="projet-back">
            <Link href="/work" className="btn-back">
              ← Retour aux projets
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Fonction utilitaire pour convertir les blocs Strapi en HTML
function renderBlocks(blocks: any): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map((block: any) => {
    switch (block.type) {
      case 'paragraph':
        const paragraphContent = block.children
          .map((child: any) => {
            if (child.bold) return `<strong>${child.text}</strong>`;
            if (child.italic) return `<em>${child.text}</em>`;
            if (child.underline) return `<u>${child.text}</u>`;
            return child.text;
          })
          .join('');
        return `<p>${paragraphContent}</p>`;

      case 'heading':
        const headingContent = block.children
          .map((child: any) => child.text)
          .join('');
        return `<h${block.level}>${headingContent}</h${block.level}>`;

      case 'list':
        const listItems = block.children
          .map((item: any) => {
            const itemContent = item.children
              .map((child: any) => child.text)
              .join('');
            return `<li>${itemContent}</li>`;
          })
          .join('');
        return block.format === 'ordered' 
          ? `<ol>${listItems}</ol>` 
          : `<ul>${listItems}</ul>`;

      default:
        return '';
    }
  }).join('');
}