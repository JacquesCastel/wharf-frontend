import type { Metadata } from 'next';
import { getHome } from './lib/strapi';
import { generateMetadataFromStrapi } from './lib/metadata';
import Offers from './components/Offers';
import { pageSeo, positioning, description } from './lib/editorial';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return generateMetadataFromStrapi(pageSeo.home.title, pageSeo.home.description, data.seo?.image, '/');
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
            <p className="editorial-eyebrow">{positioning}</p>
            <h1 className="hero-title">
              Des récits qui trouvent leur forme.
            </h1>
            <p className="hero-subtitle">{description}</p>
            <div className="hero-actions">
              <a href="/work" className="btn btn-primary">Découvrir nos expertises</a>
              <a href="/contact" className="btn btn-secondary">Parlons de votre projet</a>
            </div>
          </div>
        </section>

        <Offers compact />

        {/* 3 ENTRY POINTS - CARDS AVEC IMAGES */}
        {/* Entry Points - Les 3 points d'entrée */}
  {/* 3 ENTRY POINTS - CARDS AVEC IMAGES */}
{/* Entry Points - Les 3 points d'entrée */}
<section className="entry-points">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Une approche, des réalisations, vos enjeux</h2>
      <p className="section-subtitle">
        Que vous cherchiez à comprendre notre philosophie, explorer notre travail, 
        ou identifier comment nous pouvons vous accompagner.
      </p>
    </div>
    
    <div className="cards-split">
      {/* CARD 1 - WE */}
      <div className="card-split card-split-we">
        <div 
          className="card-split-left"
          style={homeData.blocs.we.image ? { 
            backgroundImage: `url(${homeData.blocs.we.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <h2 className="card-split-title">{homeData.blocs.we.titre}</h2>
        </div>
        <div className="card-split-right">
          <h3 className="card-split-subtitle">Quand la parole se dilue</h3>
          <p className="card-split-content">
            Quand les messages se multiplient, nous cherchons ce qui rend votre entreprise singulière. Le design narratif relie cette réalité à une parole claire et aux formes qui l’incarnent.
          </p>
          <a href={homeData.blocs.we.lien} className="card-split-link">
            Découvrir notre approche →
          </a>
        </div>
      </div>

      {/* CARD 2 - WORK */}
      <div className="card-split card-split-work">
        <div 
          className="card-split-left"
          style={homeData.blocs.work.image ? { 
            backgroundImage: `url(${homeData.blocs.work.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <h2 className="card-split-title">{homeData.blocs.work.titre}</h2>
        </div>
        <div className="card-split-right">
          <h3 className="card-split-subtitle">De la stratégie aux réalisations</h3>
          <p className="card-split-content">
            Conseil éditorial, contenus B2B, films et séries vidéo : nous concevons ce que nous produisons et produisons ce que nous concevons. Découvrez nos projets.
          </p>
          <a href={homeData.blocs.work.lien} className="card-split-link">
            Découvrir nos réalisations →
          </a>
        </div>
      </div>

      {/* CARD 3 - YOU */}
      <div className="card-split card-split-you">
        <div 
          className="card-split-left"
          style={homeData.blocs.you.image ? { 
            backgroundImage: `url(${homeData.blocs.you.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <h2 className="card-split-title">{homeData.blocs.you.titre}</h2>
        </div>
        <div className="card-split-right">
          <h3 className="card-split-subtitle">Ce que vous voulez faire avancer</h3>
          <p className="card-split-content">
            Faire connaître votre entreprise, recruter, expliquer une transformation ou produire un film : partons de votre situation et du résultat que vous recherchez.
          </p>
          <a href={homeData.blocs.you.lien} className="card-split-link">
            Explorer vos besoins →
          </a>
        </div>
      </div>
    </div> {/* ← Fermeture de cards-split */}
  </div> {/* ← Fermeture de container */}
</section> {/* ← Fermeture de section */}

        {/* MANIFESTO ASYMÉTRIQUE */}
        <section className="manifesto">
          <div 
            className="manifesto-image"
            style={{ backgroundImage: 'url(https://admin.bywharf.com/uploads/manifeste_b8fb418ca3.png)' }}
          ></div>
          <div className="manifesto-container">
            <div className="manifesto-label">Notre manifeste</div>
            <h2 className="manifesto-headline">
              Révéler ce qui existe déjà
            </h2>
            <div className="manifesto-text-columns">
              <p className="manifesto-text">Quand la parole se dilue, la communication a besoin de retrouver son point d’appui : la réalité de l’entreprise.</p>
              <p className="manifesto-text">Notre design narratif relie ce que vous êtes, ce que vous dites et ce que vos publics perçoivent. Il guide la stratégie comme les contenus et les images.</p>
              <p className="manifesto-text"><a href="/we" className="card-split-link">Découvrir notre méthode →</a></p>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container">
            <p className="editorial-eyebrow">INSIGHTS</p>
            <h2>Partager les questions de notre métier</h2>
            <p>Vidéo B2B, communication corporate, contenus et marque employeur : découvrez les sujets de notre prochaine rubrique d’expertise.</p>
            <a href="/insights" className="card-split-link">Découvrir les thèmes →</a>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-section">
          <div className="container">
            <h2>Quel projet voulez-vous faire avancer ?</h2>
            <p>
              Parlons de vos publics, de vos enjeux et de ce que votre communication doit rendre possible.
            </p>
            <a href="/contact" className="btn btn-primary">Démarrer la conversation</a>
          </div>
        </section>

      </main>
    </>
  );
}
