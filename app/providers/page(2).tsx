export default function HomePage() {
  return (
    <>
      {/* SKIP TO CONTENT */}
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>

      {/* NAVIGATION */}
      <div className="nav-wrapper">
        <nav>
          <div className="nav-container">
            <a href="/" className="nav-logo">
              <img 
                src="/images/logo-wharf.png" 
                alt="Wharf"
              />
            </a>
            
            <div className="bridge-line"></div>
            
            <ul className="nav-links">
              <li><a href="/we" className="nav-link">WE</a></li>
              <li><a href="/work" className="nav-link">WORK</a></li>
              <li><a href="/you" className="nav-link">YOU</a></li>
            </ul>
            
            <a href="/contact" className="btn-contact">Contact</a>
          </div>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <main id="main-content">
        
        {/* HERO AVEC VIDÉO */}
        <section className="hero">
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
            <h1 className="hero-title">
              Combler l'écart entre <br />
              réalité et perception
            </h1>
            <p className="hero-subtitle">
              Nous aidons les organisations à se réapproprier leur récit. 
              À révéler ce qu'elles sont vraiment, au-delà des apparences.
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
                <div 
                  className="card-split-left"
                  style={{ backgroundImage: 'url(/images/card-we.jpg)' }}
                >
                  <h2 className="card-split-title">01</h2>
                </div>
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Qui sommes-nous ?</h3>
                  <p className="card-split-content">
                    Wharf est une agence de design narratif. Nous croyons que chaque organisation 
                    possède un récit unique, et notre mission est de révéler ce récit pour combler 
                    l'écart entre ce que vous êtes et ce qui est perçu.
                  </p>
                  <a href="/we" className="card-split-link">Découvrir notre approche →</a>
                </div>
              </div>

              {/* CARD 2 - WORK (inversée) */}
              <div className="card-split card-split-work">
                <div 
                  className="card-split-left"
                  style={{ backgroundImage: 'url(/images/card-work.jpg)' }}
                >
                  <h2 className="card-split-title">02</h2>
                </div>
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Comment travaillons-nous ?</h3>
                  <p className="card-split-content">
                    De la stratégie narrative à la production audiovisuelle, nous accompagnons 
                    chaque étape de votre récit avec une approche globale et cohérente.
                  </p>
                  <a href="/work" className="card-split-link">Explorer nos services →</a>
                </div>
              </div>

              {/* CARD 3 - YOU */}
              <div className="card-split card-split-you">
                <div 
                  className="card-split-left"
                  style={{ backgroundImage: 'url(/images/card-you.jpg)' }}
                >
                  <h2 className="card-split-title">03</h2>
                </div>
                <div className="card-split-right">
                  <h3 className="card-split-subtitle">Pourquoi nous choisir ?</h3>
                  <p className="card-split-content">
                    Parce que votre récit mérite d'être raconté avec authenticité, cohérence 
                    et impact. Nous transformons le décalage en opportunité.
                  </p>
                  <a href="/you" className="card-split-link">Voir nos cas d'usage →</a>
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
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-section">
          <div className="container">
            <h2>Prêt à combler l'écart ?</h2>
            <p>
              Discutons de votre projet et construisons ensemble votre récit authentique.
            </p>
            <a href="/contact" className="btn btn-primary">Contactez-nous</a>
          </div>
        </section>

      </main>

      {/* FOOTER ASYMÉTRIQUE AVEC LOGO */}
      <footer>
        <div className="footer-container">
          
          {/* Logo carré gauche */}
          <div className="footer-left">
            <img 
              src="/images/logo-f-wharf.png" 
              alt="Wharf" 
              className="footer-logo"
            />
          </div>
          
          {/* Liens droite */}
          <div className="footer-right">
            
            <div className="footer-section">
              <h4>Navigation</h4>
              <ul>
                <li><a href="/we">Qui sommes-nous</a></li>
                <li><a href="/work">Notre travail</a></li>
                <li><a href="/you">Cas d'usage</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Ressources</h4>
              <ul>
                <li><a href="/accessibilite">Accessibilité</a></li>
                <li><a href="/accessibilite/engagement">Engagement inclusif</a></li>
                <li><a href="/mentions-legales">Mentions légales</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:contact@wharf.fr">contact@wharf.fr</a></li>
                <li><a href="tel:+33123456789">+33 1 23 45 67 89</a></li>
              </ul>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}
