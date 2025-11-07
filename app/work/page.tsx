import type { Metadata } from 'next';
import { getWork } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import WorkPortfolio from './WorkPortfolio';

import Image from 'next/image';

// Générer les métadonnées dynamiques
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const workData = await getWork();
    
    return generateMetadataFromStrapi(
      workData.seo?.title || 'Nos services - Conseil & Création - Wharf',
      workData.seo?.description || 'Conseil stratégique narratif et production audiovisuelle pour donner corps à votre récit d\'entreprise.',
      workData.seo?.image,
      '/work'
    );
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Nos services - Conseil & Création - Wharf',
      description: 'Conseil stratégique narratif et production audiovisuelle pour donner corps à votre récit d\'entreprise.',
    };
  }
}

export default async function WorkPage() {
  const workData = await getWork();

  return (
    <>
      {/* HERO */}
      <section className="work-hero">
        {workData.hero.video ? (
          <video
            className="work-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={workData.hero.video.url} type="video/mp4" />
          </video>
        ) : (
          <video
            className="work-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
          </video>
        )}
        <div className="work-hero-overlay"></div>
        <div className="work-hero-content">
          <h1>{workData.hero.titre}</h1>
          <p className="work-hero-subtitle">{workData.hero.texte}</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="work-intro">
        <div className="work-container">
          <div className="work-intro-text">
            <div dangerouslySetInnerHTML={{ __html: workData.intro.paragraphe1 || '' }} />
            <div dangerouslySetInnerHTML={{ __html: workData.intro.paragraphe2 || '' }} />
            <div dangerouslySetInnerHTML={{ __html: workData.intro.highlight || '' }} />
          </div>
        </div>
      </section>

      {/* MÉTHODE */}
      <section className="work-methode">
        <div className="work-container">
          <h2>{workData.methode.titre}</h2>
          <p className="work-methode-intro">{workData.methode.intro}</p>
          
          <div className="work-mouvements">
            {workData.methode.mouvements.map((mouvement) => (
              <div key={mouvement.numero} className="mouvement">
                <div className="mouvement-number">{mouvement.numero}</div>
                <h3>{mouvement.titre}</h3>
                <div dangerouslySetInnerHTML={{ __html: mouvement.description }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEUX EXPERTISES */}
      <section className="work-expertises">
        <div className="work-container">
          <h2 className="work-expertises-title">{workData.expertises.titre}</h2>
          
          <div className="work-expertises-grid">
            <div className="expertise">
  <h3>{workData.expertises.expertise1?.titre}</h3>
  <p className="expertise-subtitle">{workData.expertises.expertise1?.subtitle}</p>
  <div dangerouslySetInnerHTML={{ __html: workData.expertises.expertise1?.description || '' }} />
  <div dangerouslySetInnerHTML={{ __html: workData.expertises.expertise1?.liste || '' }} />
</div>

<div className="expertise">
  <h3>{workData.expertises.expertise2?.titre}</h3>
  <p className="expertise-subtitle">{workData.expertises.expertise2?.subtitle}</p>
  <div dangerouslySetInnerHTML={{ __html: workData.expertises.expertise2?.description || '' }} />
  <div dangerouslySetInnerHTML={{ __html: workData.expertises.expertise2?.liste || '' }} />
</div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO - Composant client séparé */}
      <WorkPortfolio />

      {/* CTA FINAL */}
      <section className="work-closing">
        <div className="work-container">
          <h2>{workData.closing.titre}</h2>
          <p>{workData.closing.texte}</p>
          <p className="work-closing-subtext">{workData.closing.subtext}</p>
          <a href={workData.closing.lien} className="work-cta-button">
            {workData.closing.texte_bouton}
          </a>
        </div>
      </section>
    </>
  );
}
