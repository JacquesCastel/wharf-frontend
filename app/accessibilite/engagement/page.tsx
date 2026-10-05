import { generateMetadataFromStrapi } from '../../lib/metadata';
import { WebPageJsonLd } from '../../components/JsonLd';
export const metadata = generateMetadataFromStrapi('Notre engagement pour l’accessibilité | Wharf', 'Les principes de Wharf pour concevoir des contenus lisibles et une navigation accessible : structure, contrastes et amélioration continue.', undefined, '/accessibilite/engagement');
export default function EngagementPage() {
  return (
    <main id="main-content" className="engagement-page">
      <WebPageJsonLd path="/accessibilite/engagement" title="Notre engagement pour l’accessibilité" description="Les principes de Wharf pour concevoir des contenus et une navigation accessibles." />
      <div className="engagement-container">
        
        {/* Hero */}
        <div className="engagement-hero">
          <h1>Notre engagement inclusif</h1>
          <p>Au-delà de l&apos;obligation : un choix éthique et narratif</p>
        </div>

        {/* Section 1 */}
        <section className="engagement-section">
          <h2>Pourquoi l&apos;accessibilité fait partie de notre ADN</h2>
          <p>
            Chez Wharf, l&apos;accessibilité n&apos;est pas une case à cocher. C&apos;est une conviction.
          </p>
          <p>
            Un récit qui ne peut être lu par tous n&apos;est pas un récit complet. Un récit qui exclut une partie de vos publics est un récit qui ne vous ressemble pas.
          </p>
          <p>
            L&apos;accessibilité, c&apos;est simplement faire en sorte que votre message atteigne tout le monde. C&apos;est une question d&apos;intégrité narrative.
          </p>
        </section>

        {/* Section 2 */}
        <section className="engagement-section">
          <h2>Le récit inclusif : raconter pour tous</h2>
          <p>
            Un bon récit doit pouvoir être entendu, lu, compris par tous. Peu importe comment vous naviguez sur internet, peu importe vos capacités.
          </p>
          <p>
            Cela signifie : contraste suffisant, textes lisibles, navigation au clavier, descriptions d&apos;images, structure claire.
          </p>
          <p>
            Mais cela signifie aussi : une intention authentique. Pas d&apos;accessibilité pour faire joli, mais une accessibilité qui vient de la volonté de vraiment communiquer avec tous vos publics.
          </p>
        </section>

        {/* Section 3 */}
        <section className="engagement-section">
          <h2>Un engagement au quotidien</h2>
          <p>
            L&apos;accessibilité n&apos;est pas un projet unique. C&apos;est une pratique, une habitude, une manière de penser.
          </p>
          <p>
            Chaque page que nous créons, chaque film que nous réalisons, chaque contenu que nous produisons est pensé pour être accessible.
          </p>
          <p>
            Et nous testons, nous améliorons continuellement. Parce que l&apos;accessibilité est un chemin, pas une destination.
          </p>
        </section>

        {/* Citation */}
        <div className="engagement-quote">
          <p>Un récit qui ne peut être lu par tous n&apos;est pas un récit complet.</p>
        </div>

        {/* Engagements */}
        <section className="engagement-section">
          <h2>Nos engagements</h2>
          <div className="engagement-cards">
            <div className="engagement-card">
              <h3>Standards WCAG 2.1 AA</h3>
              <p>Nous visons les recommandations WCAG 2.1 AA. Une conformité complète doit être établie par un audit, pour chaque création.</p>
            </div>
            <div className="engagement-card">
              <h3>Tests réguliers</h3>
              <p>Les retours d’usage et les contrôles d’accessibilité permettent d’identifier les améliorations nécessaires.</p>
            </div>
            <div className="engagement-card">
              <h3>Amélioration continue</h3>
              <p>Nous écoutons les retours et améliorons constamment nos créations.</p>
            </div>
            <div className="engagement-card">
              <h3>Formation de l&apos;équipe</h3>
              <p>Développer les compétences d’accessibilité fait partie de la démarche d’amélioration.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <div className="engagement-contact">
          <p>
            Vous avez des questions sur l&apos;accessibilité ou vous avez des suggestions pour nous aider à nous améliorer ?
          </p>
          <a href="/contact" className="engagement-contact-button">
            Nous contacter
          </a>
        </div>

      </div>
    </main>
  );
}
