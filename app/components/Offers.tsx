import { offers } from '../lib/editorial';

export default function Offers({ compact = false }: { compact?: boolean }) {
  return (
    <section className="work-expertises editorial-offers" aria-labelledby="offers-title">
      <div className="work-container">
        <h2 id="offers-title" className="work-expertises-title">STRATEGY + CONTENT + VIDEO</h2>
        <div className="work-expertises-grid editorial-offers-grid">
          {offers.map(offer => (
            <article key={offer.id} id={offer.id} className="expertise">
              <p className="expertise-subtitle">{offer.name}</p>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              {!compact && <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>}
              <a className="card-split-link" href={compact ? `/work#${offer.id}` : '/contact'}>
                {compact ? 'Explorer cette expertise' : 'Parlons de votre projet'} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
