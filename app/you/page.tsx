import type { Metadata } from 'next';
import { getYou } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo, situations } from '../lib/editorial';
import { articles, articlePath } from '../lib/insights';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const data = await getYou();
  return generateMetadataFromStrapi(pageSeo.you.title, pageSeo.you.description, data.seo?.image, '/you');
}
export default function YouPage() {
  return (
    <main id="main-content" className="wharf-public wharf-you">
      <section className="wharf-masthead" aria-labelledby="you-title">
        <p className="editorial-eyebrow">YOU / Vos enjeux</p>
        <div><h1 id="you-title">Que voulez-vous <br /><em>faire avancer ?</em></h1>
          <p>Faire connaître votre entreprise, recruter, expliquer un changement ou produire un film : commençons par ce que vous avez besoin de réussir.</p>
          <a href="#vos-besoins" className="card-split-link">Explorer vos besoins ↓</a>
        </div>
      </section>
      <section className="you-situations" id="vos-besoins">
        <div className="you-container">
          <h2>Vous voulez…</h2>
          <p className="editorial-intro">Six points de départ, à combiner selon vos enjeux, vos ressources et votre calendrier.</p>
          <div className="you-situations-grid">
            {situations.map((situation, index) => {
              const reading = 'readingSlug' in situation ? articles.find(article => article.slug === situation.readingSlug) : undefined;
              return (
              <article key={situation.id} id={situation.id} className="you-situation">
                <div className="you-situation-heading"><div className="you-situation-number">{String(index + 1).padStart(2, '0')}</div><h3>{situation.titre}</h3></div>
                <div className="you-situation-content">
                <p>{situation.description}</p>
                <p><strong>Les réponses possibles :</strong> {situation.formats}</p>
                <ul className="you-situation-paths" aria-label="Les accompagnements pour ce besoin">
                  {situation.links.map(link => <li key={link.href}><a className="card-split-link" href={link.href}>{link.label} →</a></li>)}
                </ul>
                {reading && <p className="you-situation-reading">À lire : <a href={articlePath(reading)}>{reading.title}</a></p>}
                <a href="/contact" className="you-situation-link" aria-label={`Parlons de votre besoin : ${situation.titre.toLowerCase()}`}>Parlons de ce besoin →</a>
                </div>
              </article>
              );
            })}
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
