import type { Metadata } from 'next';
import { getWe } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo } from '../lib/editorial';
import { getPublishedProjects } from '../lib/projects';
import { CAFE_PROJECT_ID } from '../lib/project-editorial';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWe();
  return generateMetadataFromStrapi(pageSeo.we.title, pageSeo.we.description, data.seo?.image, '/we');
}

export default async function WePage() {
  const [data, projects] = await Promise.all([getWe(), getPublishedProjects()]);
  const cafeProject = projects?.find(project => project.documentId === CAFE_PROJECT_ID);
  const weData = {
    ...data,
    hero: { ...data.hero, titre: 'Le design narratif', texte: 'Relier la réalité de votre entreprise à ce que vos publics comprennent.\nNotre méthode pour concevoir votre stratégie, vos contenus et vos films.' },
    actes: {
      acte1: { titre: 'Constat — Quand la parole se dilue', contenu: '<p>Les messages se multiplient. Pourtant, les savoir-faire, les engagements et les transformations de l’entreprise restent parfois difficiles à comprendre.</p><p>Le point de départ : identifier ce que vos publics doivent percevoir et ce qui les en empêche.</p>' },
      acte2: { titre: 'Conviction — Partir de ce qui existe', contenu: '<p>Une parole crédible s’appuie sur une réalité : les métiers, les pratiques, les personnes et les preuves.</p><p>Le design narratif organise cette matière pour construire un récit fidèle à votre entreprise et utile à vos publics.</p>' },
      acte3: { titre: 'Mission — Donner une forme au récit', contenu: '<p>Nous traduisons ce récit en messages, en choix éditoriaux et en productions concrètes.</p><p>Une interview, un film corporate ou une série de contenus prolonge ainsi la même intention, dans un format adapté à son usage.</p>' },
    },
    piliers: {
      pilier1: { titre: 'Conseil stratégique', contenu: '<p>Comprendre l’enjeu, écouter les parties prenantes et définir les messages. La plateforme narrative et la ligne éditoriale donnent une direction aux prises de parole.</p>' },
      pilier2: { titre: 'Contenus & production vidéo', contenu: '<p>Concevoir les formats, préparer les intervenants, tourner et monter. Les contenus et les films donnent corps à la stratégie jusque dans les déclinaisons de diffusion.</p>' },
    },
    closing: { titre: 'De la méthode aux réalisations', texte: 'Découvrez comment notre travail prend forme dans les projets Wharf.', lien: '/work#realisations', texte_bouton: 'Découvrir nos réalisations →' },
  };

  return (
    <main id="main-content" className="wharf-public wharf-we">
      <section className="wharf-masthead" aria-labelledby="we-title">
        <p className="editorial-eyebrow">WE / Notre approche</p>
        <div><h1 id="we-title">Le design <br /><em>narratif.</em></h1>
          <p>Relier la réalité de votre entreprise à ce que vos publics comprennent. Notre méthode pour concevoir votre stratégie, vos contenus et vos films.</p>
          <a href="#notre-approche" className="card-split-link">Découvrir notre approche ↓</a>
        </div>
      </section>

      {/* ACTES TIMELINE */}
      <section className="we-actes-timeline" id="notre-approche">
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
          Là où la <span className="we-transition-highlight">stratégie rencontre la création</span>
        </h2>
      </section>

      {/* PILLARS */}
      <section className="we-pillars">
        <div className="we-pillars-container">
          <h2 className="we-pillars-title">Une méthode, trois expertises</h2>
          <div className="we-pillars-grid editorial-pillars-grid">
            <div className="we-pillar">
              <p className="editorial-eyebrow">STRATEGY</p>
              <h3>{weData.piliers.pilier1.titre}</h3>
              <div dangerouslySetInnerHTML={{ __html: weData.piliers.pilier1.contenu }} />
              <a href="/work#strategy" className="card-split-link">Explorer la stratégie →</a>
            </div>
            <div className="we-pillar">
              <p className="editorial-eyebrow">CONTENT</p>
              <h3>Création éditoriale</h3>
              <p>Organiser la matière, choisir un angle et écrire. Articles, publications, contenus web et audio développent vos messages et font vivre votre expertise.</p>
              <a href="/work#content" className="card-split-link">Explorer les contenus →</a>
            </div>
            <div className="we-pillar">
              <p className="editorial-eyebrow">VIDEO</p>
              <h3>Production vidéo</h3>
              <p>Du scénario au montage, les images incarnent votre point de vue. Le tournage, la création IA ou leur association donnent forme au parti pris retenu.</p>
              <a href="/work#video" className="card-split-link">Explorer la vidéo →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <div className="we-pillars-container">
          <h2>Le design narratif en pratique</h2>
          <ol className="editorial-steps">
            <li><strong>Diagnostic.</strong> Écouter les parties prenantes, identifier les publics et les difficultés de compréhension.</li>
            <li><strong>Stratégie.</strong> Définir l’objectif, les priorités et le rôle de chaque prise de parole.</li>
            <li><strong>Récit.</strong> Organiser les messages autour des faits, des personnes et des preuves disponibles.</li>
            <li><strong>Contenus.</strong> Choisir les sujets et les formats, écrire et préparer les intervenants.</li>
            <li><strong>Production.</strong> Donner forme aux contenus : tournage, création visuelle, montage et déclinaisons.</li>
            <li><strong>Diffuser et évaluer.</strong> Quels canaux et quels critères permettront de juger le travail utile ?</li>
          </ol>
          <a href="/you" className="card-split-link">Partir de votre situation →</a>
        </div>
      </section>

      {cafeProject && <section className="editorial-section"><div className="we-pillars-container">
        <p className="editorial-eyebrow">La méthode dans un projet</p>
        <h2>Une conviction mise en scène</h2>
        <p>Dans son film d’autopromotion « Au café du commerce », Wharf part d’une conviction : lorsque l’on ne prend pas la parole, les autres le font à notre place. Le café devient la métaphore de cette scène publique où chacun observe et commente.</p>
        <p>Une intention, un point de vue, une forme : la fiction donne corps à cette idée et permet de la partager.</p>
        <a href={`/work/${cafeProject.documentId}`} className="card-split-link">Découvrir le concept et le film →</a>
      </div></section>}

      {/* CLOSING CTA */}
      <section className="we-closing">
        <div className="we-pillars-container">
        <h2>{weData.closing.titre}</h2>
        <p>{weData.closing.texte}</p>
        <a href={weData.closing.lien} className="we-cta-button">
          {weData.closing.texte_bouton}
        </a>
        </div>
      </section>
    </main>
  );
}