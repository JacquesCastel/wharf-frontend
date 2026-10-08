import { getPageCopy, getInsights, getLiveOffers } from '../lib/cms-content';
import { ServicesJsonLd } from './JsonLd';
import FogBackdrop from './FogBackdrop';
import { articlePath } from '../lib/insights';
import EditorialMark from './EditorialMark';

function OfferReading({ id, articles, text: t }: { id: string; articles: import('../lib/insights').InsightArticle[]; text: (key: string) => string }) {
  const article = articles.find(item => item.service === `/work#${id}`)
    ?? (id === 'video' ? articles.find(item => item.theme === 'video-b2b') : undefined);
  if (!article) return null;
  return <p className="offer-reading">{t("components-Offers-1")}<a href={articlePath(article)}>{article.title}</a></p>;
}

function AIOfferDetails({ text: t }: { text: (key: string) => string }) {
  return <div className="ai-offer-details">
    {[1, 2, 3].map(index => <section key={index}>
      <h4>{t(`offer-creation-ia-section-${index}-title`)}</h4>
      {t(`offer-creation-ia-section-${index}-text`).split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
    </section>)}
    <section className="ai-offer-questions" aria-labelledby="ai-offer-questions-title">
      <h4 id="ai-offer-questions-title">{t('offer-creation-ia-questions-title')}</h4>
      {[1, 2, 3, 4].map(index => <details key={index}>
        <summary>{t(`offer-creation-ia-question-${index}`)}</summary>
        <p>{t(`offer-creation-ia-answer-${index}`)}</p>
      </details>)}
    </section>
    <a className="card-split-link" href="/work/d3n2ackc10ow3w8i3hd4yt0o">{t('offer-creation-ia-project-link')} →</a>
  </div>;
}

export default async function Offers({ compact = false }: { compact?: boolean }) {
  const { articles } = await getInsights();
  const copy = await getPageCopy('global');
  const t = copy.text;
  const offers = await getLiveOffers();
  return (
    <section className={`work-expertises editorial-offers${compact ? ' offers-compact' : ''}`} aria-labelledby="offers-title">
      <ServicesJsonLd items={offers} />
      <div className="work-container">
        <div className="wharf-section-heading wharf-composed-heading" data-scroll-scene><div><p className="editorial-eyebrow">{t("components-Offers-2")}</p><h2 id="offers-title" className="work-expertises-title">{t("components-Offers-3")}<br />{t("components-Offers-4")}</h2></div><EditorialMark variant={compact ? "orbit" : "frames"} /></div>
        <div className="work-expertises-grid editorial-offers-grid">
          {offers.filter(offer => offer.id !== 'creation-ia').map(offer => (
            <article key={offer.id} id={offer.id} className="expertise">
              <span className={`offer-colour offer-colour-${offer.id}`} aria-hidden="true" />
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
            {!compact && <AIOfferDetails text={t} />}
            <a className="card-split-link" href={compact ? '/work#creation-ia' : '/contact'}>{compact ? 'Explorer la création IA' : 'Parlons de votre projet'} {t("components-Offers-7")}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
