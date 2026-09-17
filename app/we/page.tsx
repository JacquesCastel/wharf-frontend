import type { Metadata } from 'next';
import { getWe } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo } from '../lib/editorial';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWe();
  return generateMetadataFromStrapi(pageSeo.we.title, pageSeo.we.description, data.seo?.image, '/we');
}

export default async function WePage() {
  const data = await getWe();
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
    <main id="main-content">
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
    __html: weData.hero.texte
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Gras Markdown
      .replace(/\n/g, '<br>')  // Retours à la ligne
      .replace(/fidèle/g, '<span class="we-hero-accent">fidèle</span>')  // Highlight
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
          Là où la <span className="we-transition-highlight">stratégie rencontre la création</span>
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

      <section className="editorial-section">
        <div className="we-pillars-container">
          <h2>Le design narratif en pratique</h2>
          <ol className="editorial-steps">
            <li><strong>Comprendre.</strong> Quel enjeu, quels publics et quelles perceptions faut-il faire évoluer ?</li>
            <li><strong>Formuler.</strong> Quels messages et quelles preuves rendent votre récit crédible ?</li>
            <li><strong>Produire.</strong> Quels contenus, quels intervenants et quels formats lui donnent corps ?</li>
            <li><strong>Diffuser et évaluer.</strong> Quels canaux et quels critères permettront de juger le travail utile ?</li>
          </ol>
          <a href="/you" className="card-split-link">Partir de votre situation →</a>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="we-closing">
        <h2>{weData.closing.titre}</h2>
        <p>{weData.closing.texte}</p>
        <a href={weData.closing.lien} className="we-cta-button">
          {weData.closing.texte_bouton}
        </a>
      </section>
    </main>
  );
}