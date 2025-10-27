import type { Metadata } from 'next';
import { getYou } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import Image from 'next/image';

// Générer les métadonnées dynamiques
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  try {
    const youData = await getYou();
    
    return generateMetadataFromStrapi(
      youData.seo?.title || 'Votre situation - Commencer avec Wharf',
      youData.seo?.description || 'Trouvez l\'approche qui correspond à votre situation : lancer un projet, traverser une transformation, renforcer votre identité.',
      youData.seo?.image,
      '/you'
    );
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Votre situation - Commencer avec Wharf',
      description: 'Trouvez l\'approche qui correspond à votre situation : lancer un projet, traverser une transformation, renforcer votre identité.',
    };
  }
}

export default async function YouPage() {
  const youData = await getYou();

  return (
    <>
      {/* HERO */}
      <section className="you-hero">
        {youData.hero.video ? (
          <video
            className="you-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={youData.hero.video.url} type="video/mp4" />
          </video>
        ) : (
          <video
            className="you-hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
          </video>
        )}
        <div className="you-hero-overlay"></div>
        <div className="you-hero-content">
          <h1>{youData.hero.titre}</h1>
          <p className="you-hero-subtitle">{youData.hero.baseline}</p>
        </div>
      </section>

      {/* INTRO */}
      <section className="you-intro">
        <div className="you-container">
          <h2>{youData.intro.titre}</h2>
          <p>{youData.intro.paragraphe1}</p>
          <p>{youData.intro.paragraphe2}</p>
        </div>
      </section>

      {/* CE QUE NOUS AIMONS COMPRENDRE */}
      <section className="you-understand">
        <div className="you-container">
          <h2>{youData.comprendre.titre}</h2>
          
          <div className="you-understand-grid">
            {youData.comprendre.items.map((item, index) => (
              <div key={index} className="you-understand-item">
                <h3>{item.titre}</h3>
                <p>{item.texte}</p>
              </div>
            ))}
          </div>

          <p className="you-understand-conclusion">
            {youData.comprendre.conclusion}
          </p>
        </div>
      </section>

      {/* LES 4 SITUATIONS */}
      <section className="you-situations">
        <div className="you-container">
          <h2>{youData.situations.titre}</h2>
          
          <div className="you-situations-grid">
            {youData.situations.liste.map((situation: { numero: number; titre: string; description: string }) => (
              <div key={situation.numero} className="you-situation">
                <div className="you-situation-number">{situation.numero}</div>
                <h3>{situation.titre}</h3>
                <p>{situation.description}</p>
                <a href="/contact" className="you-situation-link">Explorer cette situation →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE APPROCHE */}
      <section className="you-approach">
        <div className="you-container">
          <h2>{youData.approche.titre}</h2>
          
          <p className="you-approach-intro">
            {youData.approche.intro}
          </p>

          <p className="you-approach-detail">
            {youData.approche.detail}
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="you-closing">
        <div className="you-container">
          <h2>{youData.closing.titre}</h2>
          <p>{youData.closing.texte}</p>
          <a href={youData.closing.lien} className="you-cta-button">
            {youData.closing.texte_bouton}
          </a>
        </div>
      </section>
    </>
  );
}