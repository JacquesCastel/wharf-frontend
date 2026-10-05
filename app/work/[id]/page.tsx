import ProjectHeroVideo from '../../components/ProjectHeroVideo';
import { cache } from 'react';
import { generateMetadataFromStrapi } from '../../lib/metadata';
import { blocksToHtml } from '../../lib/strapi';
import { SITE_URL } from '../../lib/site';
import type { VideoEvidence } from '../../lib/structured-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectJsonLd, WebPageJsonLd, BreadcrumbJsonLd } from '../../components/JsonLd';
import { getPublishedProjects, projectMediaUrl } from '../../lib/projects';
import { getProjectEditorial } from '../../lib/project-editorial';

type ProjectMedia = { url: string; alternativeText?: string; width?: number; height?: number; createdAt?: string };
type ProjectBlock = { __component: string; titre?: string; contenu?: unknown; image?: ProjectMedia; legende?: string; type_video?: string; video_fichier?: ProjectMedia; video_url?: string; colonnes?: number; images?: ProjectMedia[]; citation?: string; auteur?: string; fonction?: string; entreprise?: string };
type ProjectData = { documentId: string; titre: string; type?: string; description_courte?: string; hero_type?: string; hero_image?: ProjectMedia; vignette?: ProjectMedia; hero_media?: ProjectMedia; hero_titre_position?: string; publishedAt?: string; updatedAt?: string; client?: unknown; contenu?: ProjectBlock[] };

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
const getProjet = cache(async (id: string) => {
  const response = await fetch(`${STRAPI_URL}/api/projets/${encodeURIComponent(id)}?populate=*&status=published`, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Project CMS HTTP ${response.status}`);
  const project = (await response.json()).data as ProjectData | null;
  if (project && (typeof project.documentId !== 'string' || typeof project.titre !== 'string')) throw new Error('Invalid project identity');
  return project;
});

// Générer les métadonnées dynamiques pour chaque projet
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const projet = await getProjet(id);

  if (!projet) notFound();
  const titre = projet.titre || 'Projet';
  const description = getProjectEditorial(projet)?.summary || projet.description_courte || `Découvrez le projet ${titre} réalisé par Wharf.`;
  const image = projet.vignette?.url ? projet.vignette : projet.hero_image;
  return generateMetadataFromStrapi(`${titre} — Portfolio | Wharf`, description, image, `/work/${id}`);
}

export default async function ProjetDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const projet = await getProjet(id);

  if (!projet) {
    notFound();
  }

  const editorial = getProjectEditorial(projet);
  const summary = editorial?.summary ?? projet.description_courte;
  const projectType = editorial?.format ?? projet.type;
  const allProjets = await getPublishedProjects() ?? [];
  const currentIndex = allProjets.findIndex((p) => p.documentId === id);
  const prevProjet = currentIndex > 0 ? allProjets[currentIndex - 1] : null;
  const nextProjet = currentIndex < allProjets.length - 1 ? allProjets[currentIndex + 1] : null;

  const image = projet.hero_image?.url ? projet.hero_image : projet.vignette;
  const ogImage = image?.url ? projectMediaUrl(image.url) : undefined;
  const videos: VideoEvidence[] = [];
  if (projet.hero_type === 'video' && projet.hero_media?.url && ogImage && summary && projet.hero_media.createdAt) {
    videos.push({ name: projet.titre, description: summary, thumbnailUrl: ogImage, uploadDate: projet.hero_media.createdAt, contentUrl: projectMediaUrl(projet.hero_media.url), ...(editorial ? { embedUrl: editorial.videoUrl } : {}) });
  }
  const client = typeof projet.client === 'string' ? projet.client : undefined;
  const isVideo = projet.hero_type === 'video' || /vidéo|video|film|fiction/i.test(projectType || '');


  return (
    <main id="main-content" className="wharf-project">
      <WebPageJsonLd path={`/work/${id}`} title={projet.titre} description={summary || `Projet Wharf : ${projet.titre}`} about={{ '@id': `${SITE_URL}/work/${id}#project` }} dateModified={editorial?.updatedAt ?? projet.updatedAt} />
      <BreadcrumbJsonLd items={[{ name: 'WORK', path: '/work' }, { name: projet.titre, path: `/work/${id}` }]} />
      <ProjectJsonLd
        titre={projet.titre || 'Projet'}
        description={summary}
        image={ogImage}
        url={`${SITE_URL}/work/${id}`}
        datePublished={projet.publishedAt}
        dateModified={editorial?.updatedAt ?? projet.updatedAt}
        client={client}
        videos={videos}
        expertiseIds={isVideo ? ['video'] : []}
      />
      {/* HERO */}
      <section className="projet-hero">
        {projet.hero_type === 'video' && projet.hero_media?.url ? (
          <ProjectHeroVideo src={projectMediaUrl(projet.hero_media.url)} poster={ogImage} title={projet.titre} />
        ) : projet.hero_image?.url ? (
          <div className="projet-hero-image">
            <Image
              src={projectMediaUrl(projet.hero_image.url)}
              alt={projet.hero_image.alternativeText || projet.titre}
              sizes="100vw"
              fill
              className="projet-hero-img"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        ) : null}

        <div className="projet-hero-overlay"></div>

        {projet.hero_titre_position !== 'dessous' && (
          <div className="projet-hero-content">
            <h1>{projet.titre}</h1>
            <p className="projet-type">{projectType}</p>
          </div>
        )}
      </section>

      {/* TITRE SOUS LE HERO */}
      {projet.hero_titre_position === 'dessous' && (
        <section className="projet-header">
          <div className="projet-container">
            <h1>{projet.titre}</h1>
            <p className="projet-type">{projectType}</p>
            {summary && (
              <p className="projet-description">{summary}</p>
            )}
          </div>
        </section>
      )}

      {/* CONTENU DYNAMIQUE */}
      <section className="projet-content">
        <div className="projet-container">
          <nav aria-label="Fil d’Ariane"><Link href="/work#realisations" className="card-split-link">← WORK / Réalisations</Link></nav>
          {client && <p>Client : {client}</p>}
          {editorial ? (
            <>
              <div className="bloc-texte">
                <p className="editorial-eyebrow">Wharf · Film d’autopromotion</p>
                <p className="projet-description">Prendre la parole, avant que les autres ne parlent pour vous.</p>
              </div>
              {editorial.sections.map(section => <div className="bloc-texte" key={section.title}>
                <h2>{section.title}</h2>
                <div className="bloc-texte-content">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
              </div>)}
              <div className="bloc-video">
                <h2>Voir le film</h2>
                <div className="video-embed"><iframe src={editorial.videoUrl} title="Au café du commerce — film d’autopromotion Wharf" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
                <p><a href={editorial.videoLink}>Voir « Au café du commerce » sur YouTube →</a></p>
              </div>
            </>
          ) : projet.contenu?.map((bloc, index) => {
            switch (bloc.__component) {
              case 'bloc.texte-bloc':
                return (
                  <div key={index} className="bloc-texte">
                    {bloc.titre && <h2>{bloc.titre}</h2>}
                    {Array.isArray(bloc.contenu) && (
                      <div
                        className="bloc-texte-content"
                        dangerouslySetInnerHTML={{
                          __html: blocksToHtml(bloc.contenu, bloc.titre ? 3 : 2)
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
                          src={projectMediaUrl(bloc.image.url)}
                          alt={bloc.image.alternativeText || bloc.legende || ''}
                          width={bloc.image.width || 1200}
                          height={bloc.image.height || 800}
                          sizes="(max-width: 760px) 100vw, 1200px"
                          className="bloc-image-img"
                          loading="lazy"
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
                      <video controls preload="metadata">
                        <source
                          src={projectMediaUrl(bloc.video_fichier.url)}
                          type="video/mp4"
                        />
                      </video>
                    ) : bloc.video_url ? (
                      <div className="video-embed">
                        <iframe
                          src={bloc.video_url}
                          title={bloc.titre || `Vidéo du projet ${projet.titre}`}
                          loading="lazy"
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
                    {bloc.images?.map((img, imgIndex) => (
                      <div key={imgIndex} className="galerie-item">
                        <Image
                          src={projectMediaUrl(img.url)}
                          alt={img.alternativeText || ''}
                          width={img.width || 600}
                          height={img.height || 400}
                          sizes="(max-width: 760px) 100vw, 400px"
                          className="galerie-item-img"
                          loading="lazy"
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

      <section className="editorial-section"><div className="projet-container">
        <h2>Du récit à votre prochain projet</h2>
        <p>Découvrez nos <Link href="/work#strategy">expertises de conseil</Link>, notre <Link href="/work#content">création de contenus</Link> et notre <Link href="/work#video">production vidéo</Link>.</p>
        <Link href={isVideo ? '/insights/video-b2b' : '/insights'} className="card-split-link">{isVideo ? 'Préparer votre production vidéo : guides et analyses →' : 'Explorer nos guides et analyses →'}</Link>
      </div></section>
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
    </main>
  );
}
