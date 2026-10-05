import { offers } from '../lib/editorial';
import FogBackdrop from './FogBackdrop';
import { articles, articlePath } from '../lib/insights';

function OfferReading({ id }: { id: string }) {
  const article = articles.find(item => item.service === `/work#${id}`)
    ?? (id === 'video' ? articles.find(item => item.theme === 'video-b2b') : undefined);
  if (!article) return null;
  return <p className="offer-reading">Pour préparer votre projet : <a href={articlePath(article)}>{article.title}</a></p>;
}

export default function Offers({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`work-expertises editorial-offers${compact ? ' offers-compact' : ''}`} aria-labelledby="offers-title">
      <div className="work-container">
        <div className="wharf-section-heading"><p className="editorial-eyebrow">STRATEGY + CONTENT + VIDEO</p><h2 id="offers-title" className="work-expertises-title">Penser le fond.<br />Créer la forme.</h2></div>
        <div className="work-expertises-grid editorial-offers-grid">
          {offers.filter(offer => offer.id !== 'creation-ia').map(offer => (
            <article key={offer.id} id={offer.id} className="expertise">
              <p className="expertise-subtitle">{offer.name}</p>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              {!compact && <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>}
              {!compact && <OfferReading id={offer.id} />}
              <a className="card-split-link" href={compact ? `/work#${offer.id}` : '/contact'}>
                {compact ? 'Explorer cette expertise' : 'Parlons de votre projet'} →
              </a>
            </article>
          ))}
        </div>
        {offers.filter(offer => offer.id === 'creation-ia').map(offer => (
          <article key={offer.id} id={offer.id} className="expertise editorial-ai-offer">
            <FogBackdrop />
            <p className="expertise-subtitle">Une compétence de création, au service de vos contenus</p>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            {!compact && <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>}
            <a className="card-split-link" href={compact ? '/work#creation-ia' : '/contact'}>{compact ? 'Explorer la création IA' : 'Parlons de votre projet'} →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
