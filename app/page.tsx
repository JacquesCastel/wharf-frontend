import type { Metadata } from 'next';
import { getHome } from './lib/strapi';
import { generateMetadataFromStrapi } from './lib/metadata';
import Image from 'next/image';

// Générer les métadonnées dynamiques
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeData = await getHome();
    
    return generateMetadataFromStrapi(
      homeData.seo?.title || 'Wharf - Design Narratif & Communication Corporate',
      homeData.seo?.description || 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
      homeData.seo?.image,
      '/' // path de la page
    );
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Wharf - Design Narratif & Communication Corporate',
      description: 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
    };
  }
}

export default async function HomePage() {
  const homeData = await getHome();


  return (
    <>
      {/* MAIN CONTENT */}
      <main id="main-content">
        
        {/* HERO AVEC VIDÉO */}
        <section className="hero">
          {homeData.hero.video ? (
            <video 
              className="hero-video" 
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src={homeData.hero.video.url} type="video/mp4" />
            </video>
          ) : (
            <video 
              className="hero-video" 
              autoPlay 
              muted 
              loop 
              playsInline
            >
              <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
            </video>
          )}
          <div className="hero-overlay"></div>
          
          <div className="hero-container">
            <h1 className="hero-title">
              {homeData.hero.titre}
            </h1>
            <p className="hero-subtitle">
              {homeData.hero.baseline}
            </p>
            <div className="hero-actions">
              <a href="/we" className="btn btn-primary">Découvrir notre approche</a>
              <a href="/contact" className="btn btn-secondary">Nous contacter</a>
            </div>
          </div>
        </section>

        {/* 3 ENTRY POINTS - CARDS AVEC IMAGES */}
        <section className="entry-points">
          <div className="container">
            
            <div className="cards-split">
              
              {/* CARD 1 - WE */}
              <div className="card-split card-split-we">
                <div className="card-split-left">
                  <h2 className="card-split-title">{homeData.blocs.we.titre}</h2>
                </div>
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Qui sommes-nous ?</h3>
                  <p className="card-split-content">
                    {homeData.blocs.we.description}
                  </p>
                  <a href={homeData.blocs.we.lien} className="card-split-link">
                    Découvrir notre approche →
                  </a>
                </div>
              </div>

              {/* CARD 2 - WORK */}
              <div className="card-split card-split-work">
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Comment travaillons-nous ?</h3>
                  <p className="card-split-content">
                    {homeData.blocs.work.description}
                  </p>
                  <a href={homeData.blocs.work.lien} className="card-split-link">
                    Explorer nos services →
                  </a>
                </div>
                <div className="card-split-left">
                  <h2 className="card-split-title">{homeData.blocs.work.titre}</h2>
                </div>
              </div>

              {/* CARD 3 - YOU */}
              <div className="card-split card-split-you">
                <div className="card-split-left">
                  <h2 className="card-split-title">{homeData.blocs.you.titre}</h2>
                </div>
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Pourquoi nous choisir ?</h3>
                  <p className="card-split-content">
                    {homeData.blocs.you.description}
                  </p>
                  <a href={homeData.blocs.you.lien} className="card-split-link">
                    Voir nos cas d'usage →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MANIFESTO ASYMÉTRIQUE */}
        <section className="manifesto">
          <div 
            className="manifesto-image"
            style={{ backgroundImage: 'url(/images/manifesto-bg.jpg)' }}
          ></div>
          <div className="manifesto-container">
            <div className="manifesto-label">Notre manifeste</div>
            <h2 className="manifesto-headline">
              Révéler ce qui existe déjà
            </h2>
            <div className="manifesto-text-columns">
              {homeData.manifesto.texte ? (
                <div 
                  className="manifesto-text"
                  dangerouslySetInnerHTML={{ __html: homeData.manifesto.texte }}
                />
              ) : (
                <>
                  <p className="manifesto-text">
                    Nous croyons que la communication n'est pas un vernis, mais le reflet d'une réalité. 
                    Chaque organisation porte en elle un récit unique, souvent invisible ou mal compris.
                  </p>
                  <p className="manifesto-text">
                    Notre rôle n'est pas de créer une fiction, mais de <strong>révéler ce qui existe déjà</strong>. 
                    De transformer le décalage entre réalité et perception en une opportunité de réalignement authentique.
                  </p>
                  <p className="manifesto-text">
                    Chez Wharf, nous pensons que combler l'écart, c'est créer de la confiance, 
                    de la cohérence et de l'impact durable.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-section">
          <div className="container">
            <h2>{homeData.cta.texte}</h2>
            <p>
              Discutons de votre projet et construisons ensemble votre récit authentique.
            </p>
            <a href={homeData.cta.lien} className="btn btn-primary">Contactez-nous</a>
          </div>
        </section>

      </main>
    </>
  );
}
