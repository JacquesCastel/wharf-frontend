import type { Metadata } from 'next';
import { getWe } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const weData = await getWe();
    return generateMetadataFromStrapi(
      weData.seo?.title || 'Notre approche - Wharf Design Narratif',
      weData.seo?.description || 'Découvrez notre méthode de design narratif pour révéler et exprimer l\'authenticité de votre entreprise.',
      weData.seo?.image,
      '/we'
    );
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Notre approche - Wharf Design Narratif',
      description: 'Découvrez notre méthode de design narratif pour révéler et exprimer l\'authenticité de votre entreprise.',
    };
  }
}

export default async function WePage() {
  const weData = await getWe();

  return (
    <>
      {/* HERO */}
      <section className="we-hero">
        {weData.hero.video ? (
          <video
            className="we-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={weData.hero.video.url} type="video/mp4" />
          </video>
        ) : (
          <video
            className="we-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
          </video>
        )}
        <div className="we-hero-content">
          <h1>{weData.hero.titre}</h1>
         <p 
  className="we-hero-subtitle"
  dangerouslySetInnerHTML={{
    __html: weData.hero.texte.replace(
      'fidèle',
      '<span class="we-hero-accent">fidèle</span>'
    )
  }}
/>
        </div>
      </section>

      {/* ACTES TIMELINE */}
      <section className="we-actes-timeline">
        <div className="we-timeline-container">
          <div className="we-timeline-line"></div>

          {/* ACTE 1 */}
          <div className="we-acte">
            <div className="we-acte-number">1</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">Acte 1</div>
              <h2>{weData.actes.acte1.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte1.contenu }}
              />
            </div>
          </div>

          {/* ACTE 2 */}
          <div className="we-acte">
            <div className="we-acte-number">2</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">Acte 2</div>
              <h2>{weData.actes.acte2.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte2.contenu }}
              />
            </div>
          </div>

          {/* ACTE 3 */}
          <div className="we-acte">
            <div className="we-acte-number">3</div>
            <div className="we-acte-visual"></div>
            <div className="we-acte-content">
              <div className="we-acte-label">Acte 3</div>
              <h2>{weData.actes.acte3.titre}</h2>
              <div 
                className="we-acte-text"
                dangerouslySetInnerHTML={{ __html: weData.actes.acte3.contenu }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* TRANSITION */}
      <section className="we-transition">
        <h2 className="we-transition-quote">
          {weData.transition.texte.split('stratégie rencontre la création').map((part: string, index: number) => (
            index === 0 ? (
              <span key={index}>
                {part}<span className="we-transition-highlight">stratégie rencontre la création</span>
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          ))}
        </h2>
      </section>

      {/* PILLARS */}
      <section className="we-pillars">
        <div className="we-pillars-container">
          <h2 className="we-pillars-title">Nos deux piliers</h2>
          <div className="we-pillars-grid">
            <div className="we-pillar">
              <h3>{weData.piliers.pilier1.titre}</h3>
              <div dangerouslySetInnerHTML={{ __html: weData.piliers.pilier1.contenu }} />
            </div>
            <div className="we-pillar">
              <h3>{weData.piliers.pilier2.titre}</h3>
              <div dangerouslySetInnerHTML={{ __html: weData.piliers.pilier2.contenu }} />
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="we-closing">
        <h2>{weData.closing.titre}</h2>
        <p>{weData.closing.description}</p>
        <a href={weData.closing.lien} className="we-cta-button">
          {weData.closing.texte_bouton}
        </a>
      </section>
    </>
  );
}