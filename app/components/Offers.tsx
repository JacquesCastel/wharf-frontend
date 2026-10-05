import { getPageCopy, getInsights, getLiveOffers } from '../lib/cms-content';
import { ServicesJsonLd } from './JsonLd';
import { offers } from '../lib/editorial';
import FogBackdrop from './FogBackdrop';
import { articlePath } from '../lib/insights';

function OfferReading({ id, articles, text: t }: { id: string; articles: import('../lib/insights').InsightArticle[]; text: (key: string) => string }) {
  const article = articles.find(item => item.service === `/work#${id}`)
    ?? (id === 'video' ? articles.find(item => item.theme === 'video-b2b') : undefined);
  if (!article) return null;
  return <p className="offer-reading">{t("components-Offers-1")}<a href={articlePath(article)}>{article.title}</a></p>;
}

export default async function Offers({ compact = false }: { compact?: boolean }) {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const copy = await getPageCopy('global');
  const t = copy.text;
  const offers = await getLiveOffers();
  return (
    <section className={`work-expertises editorial-offers${compact ? ' offers-compact' : ''}`} aria-labelledby="offers-title">
      <ServicesJsonLd items={offers} />
      <div className="work-container">
        <div className="wharf-section-heading"><p className="editorial-eyebrow">{t("components-Offers-2")}</p><h2 id="offers-title" className="work-expertises-title">{t("components-Offers-3")}<br />{t("components-Offers-4")}</h2></div>
        <div className="work-expertises-grid editorial-offers-grid">
          {offers.filter(offer => offer.id !== 'creation-ia').map(offer => (
            <article key={offer.id} id={offer.id} className="expertise">
              <p className="expertise-subtitle">{offer.name}</p>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              {!compact && <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>}
              {!compact && <OfferReading id={offer.id} articles={articles} text={t} />}
              <a className="card-split-link" href={compact ? `/work#${offer.id}` : '/contact'}>
                {compact ? 'Explorer cette expertise' : 'Parlons de votre projet'} {t("components-Offers-5")}</a>
            </article>
          ))}
        </div>
        {offers.filter(offer => offer.id === 'creation-ia').map(offer => (
          <article key={offer.id} id={offer.id} className="expertise editorial-ai-offer">
            <FogBackdrop />
            <p className="expertise-subtitle">{t("components-Offers-6")}</p>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            {!compact && <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>}
            <a className="card-split-link" href={compact ? '/work#creation-ia' : '/contact'}>{compact ? 'Explorer la création IA' : 'Parlons de votre projet'} {t("components-Offers-7")}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
