import type { Metadata } from 'next';
import { getYou } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo, situations } from '../lib/editorial';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const data = await getYou();
  return generateMetadataFromStrapi(pageSeo.you.title, pageSeo.you.description, data.seo?.image, '/you');
}
export default async function YouPage() {
  const data = await getYou();
  return (
    <main id="main-content">
      <section className="you-hero">
        <video className="you-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src={data.hero.video?.url || 'https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4'} type="video/mp4" />
        </video>
        <div className="you-hero-overlay" />
        <div className="you-hero-content">
          <p className="editorial-eyebrow">YOU</p>
          <h1>Que voulez-vous faire avancer ?</h1>
          <p className="you-hero-subtitle">Faire connaître votre entreprise, recruter, expliquer un changement ou produire un film : commençons par ce que vous avez besoin de réussir.</p>
        </div>
      </section>
      <section className="you-situations">
        <div className="you-container">
          <h2>Vous voulez…</h2>
          <p className="editorial-intro">Six points de départ, à combiner selon vos enjeux, vos ressources et votre calendrier.</p>
          <div className="you-situations-grid">
            {situations.map((situation, index) => (
              <article key={situation.id} id={situation.id} className="you-situation">
                <div className="you-situation-number">{index + 1}</div>
                <h3>{situation.titre}</h3>
                <p>{situation.description}</p>
                <p><strong>Les réponses possibles :</strong> {situation.formats}</p>
                <a href="/contact" className="you-situation-link" aria-label={`Parlons de votre besoin : ${situation.titre.toLowerCase()}`}>Parlons de ce besoin →</a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="you-understand">
        <div className="you-container">
          <h2>Avant le format, comprendre l’enjeu</h2>
          <div className="you-understand-grid">
            {[
              ['Votre objectif', 'Que voulez-vous obtenir et pourquoi est-ce devenu important ?'],
              ['Vos publics', 'Que doivent-ils comprendre, ressentir ou pouvoir faire ?'],
              ['Votre situation', 'Qu’est-ce qui freine aujourd’hui votre communication ? De quelles ressources et de quel calendrier disposez-vous ?'],
            ].map(([title, text]) => <div className="you-understand-item" key={title}><h3>{title}</h3><p>{text}</p></div>)}
          </div>
          <p className="you-understand-conclusion">L’accompagnement peut être ciblé sur une production ou aller de la stratégie aux contenus.</p>
          <a href="/work" className="card-split-link">Explorer nos expertises et réalisations →</a>
        </div>
      </section>
      <section className="you-closing">
        <div className="you-container">
          <h2>Parlons de votre situation</h2>
          <p>Un besoin précis ou une question encore ouverte : c’est un bon point de départ.</p>
          <a href="/contact" className="you-cta-button">Démarrer la conversation →</a>
        </div>
      </section>
    </main>
  );
}
