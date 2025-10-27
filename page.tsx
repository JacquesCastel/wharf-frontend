export const dynamic = 'force-dynamic';
export default function HomePage() {
  return (
    <main>
      {/* Hero Section avec vidéo en fond */}
      <section className="hero" id="main-content">
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">Combler l'écart entre réalité et perception</h1>
          <p className="hero-subtitle">
            Nous aidons les organisations à se réapproprier leur récit. 
            À révéler ce qu'elles sont vraiment, au-delà des apparences.
          </p>
          <div className="hero-actions">
            <a href="/work" className="btn btn-primary">Découvrir nos projets</a>
            <a href="/we" className="btn btn-secondary">Notre approche</a>
          </div>
        </div>
      </section>

      {/* Entry Points - Les 3 points d'entrée */}
      <section className="entry-points">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trois façons de nous découvrir</h2>
            <p className="section-subtitle">
              Que vous cherchiez à comprendre notre philosophie, explorer notre travail, 
              ou identifier comment nous pouvons vous accompagner.
            </p>
          </div>
          </div>

{/* WE */}
<div className="card-split card-split-we fade-in">
  <div 
    className="card-split-left"
    style={{
      backgroundImage: 'url(/images/we-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <h3 className="card-split-title">WE</h3>
  </div>
  <div className="card-split-right">
    {/* ... texte ... */}
  </div>
</div>

{/* WORK */}
<div className="card-split card-split-work fade-in">
  <div 
    className="card-split-left"
    style={{
      backgroundImage: 'url(/images/work-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <h3 className="card-split-title">WORK</h3>
  </div>
  {/* ... */}
</div>

{/* YOU */}
<div className="card-split card-split-you fade-in">
  <div 
    className="card-split-left"
    style={{
      backgroundImage: 'url(/images/you-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <h3 className="card-split-title">YOU</h3>
  </div>
  {/* ... */}
</div>

      </section>

      {/* Manifesto Section */}
      <section className="manifesto">
        <div className="manifesto-container">
          <h2 className="manifesto-title">Le récit que vous méritez</h2>
          
          <p className="manifesto-text">
            Trop souvent, les organisations racontent une histoire qui n'est pas la leur. 
            Un récit dicté par les conventions, les attentes du marché, ou simplement l'inertie.
          </p>
          
          <p className="manifesto-text">
            Pourtant, la vérité existe déjà. Elle vit dans vos actions, vos choix, 
            votre culture. Notre rôle n'est pas de l'inventer, mais de la révéler. 
            De construire le pont entre qui vous êtes et comment vous êtes perçus.
          </p>
          
          <p className="manifesto-text">
            C'est ce que nous appelons le design narratif : l'art de transformer la réalité 
            en récit authentique. Pas du storytelling. Du truth-telling.
          </p>

          <div className="manifesto-signature">
            — L'équipe Wharf
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Prêt à vous réapproprier votre récit ?</h2>
          <p>Discutons de votre projet et découvrons ensemble votre véritable histoire.</p>
          <a href="/contact" className="btn btn-primary">Démarrer la conversation</a>
        </div>
      </section>
    </main>
  );
}
