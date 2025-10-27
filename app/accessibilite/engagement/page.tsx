export default function EngagementPage() {
  return (
    <main className="engagement-page">
      <div className="engagement-container">
        
        {/* Hero */}
        <div className="engagement-hero">
          <h1>Notre engagement inclusif</h1>
          <p>Au-delà de l'obligation : un choix éthique et narratif</p>
        </div>

        {/* Section 1 */}
        <section className="engagement-section">
          <h2>Pourquoi l'accessibilité fait partie de notre ADN</h2>
          <p>
            Chez Wharf, l'accessibilité n'est pas une case à cocher. C'est une conviction.
          </p>
          <p>
            Un récit qui ne peut être lu par tous n'est pas un récit complet. Un récit qui exclut une partie de vos publics est un récit qui ne vous ressemble pas.
          </p>
          <p>
            L'accessibilité, c'est simplement faire en sorte que votre message atteigne tout le monde. C'est une question d'intégrité narrative.
          </p>
        </section>

        {/* Section 2 */}
        <section className="engagement-section">
          <h2>Le récit inclusif : raconter pour tous</h2>
          <p>
            Un bon récit doit pouvoir être entendu, lu, compris par tous. Peu importe comment vous naviguez sur internet, peu importe vos capacités.
          </p>
          <p>
            Cela signifie : contraste suffisant, textes lisibles, navigation au clavier, descriptions d'images, structure claire.
          </p>
          <p>
            Mais cela signifie aussi : une intention authentique. Pas d'accessibilité pour faire joli, mais une accessibilité qui vient de la volonté de vraiment communiquer avec tous vos publics.
          </p>
        </section>

        {/* Section 3 */}
        <section className="engagement-section">
          <h2>Un engagement au quotidien</h2>
          <p>
            L'accessibilité n'est pas un projet unique. C'est une pratique, une habitude, une manière de penser.
          </p>
          <p>
            Chaque page que nous créons, chaque film que nous réalisons, chaque contenu que nous produisons est pensé pour être accessible.
          </p>
          <p>
            Et nous testons, nous améliorons continuellement. Parce que l'accessibilité est un chemin, pas une destination.
          </p>
        </section>

        {/* Citation */}
        <div className="engagement-quote">
          <p>Un récit qui ne peut être lu par tous n'est pas un récit complet.</p>
        </div>

        {/* Engagements */}
        <section className="engagement-section">
          <h2>Nos engagements</h2>
          <div className="engagement-cards">
            <div className="engagement-card">
              <h3>Standards WCAG 2.1 AA</h3>
              <p>Toutes nos créations respectent les normes d'accessibilité web internationales.</p>
            </div>
            <div className="engagement-card">
              <h3>Tests réguliers</h3>
              <p>Nous testons avec de vrais utilisateurs et des outils d'accessibilité pour garantir l'expérience.</p>
            </div>
            <div className="engagement-card">
              <h3>Amélioration continue</h3>
              <p>Nous écoutons les retours et améliorons constamment nos créations.</p>
            </div>
            <div className="engagement-card">
              <h3>Formation de l'équipe</h3>
              <p>Notre équipe est formée aux pratiques d'accessibilité et aux bonnes pratiques inclusives.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div className="engagement-contact">
          <p>
            Vous avez des questions sur l'accessibilité ou vous avez des suggestions pour nous aider à nous améliorer ?
          </p>
          <a href="/contact" className="engagement-contact-button">
            Nous contacter
          </a>
        </div>

      </div>
    </main>
  );
}
