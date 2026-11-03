import { getPageCopy, getInsights, getLiveOffers } from '../lib/cms-content';
import { ServicesJsonLd } from './JsonLd';
import FogBackdrop from './FogBackdrop';
import { AI_PROJECT_ID, contactHref, contextProjects, contextReadings, offerNeeds } from '../lib/content-paths';
import { getPublishedProjects } from '../lib/projects';
import ReadingLinks from './ReadingLinks';
import ProjectProof from './ProjectProof';
import ProjectLinks from './ProjectLinks';
import ContextLinks from './ContextLinks';
import EditorialMark from './EditorialMark';

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
  </div>;
}

export default async function Offers({ compact = false }: { compact?: boolean }) {
  const { articles } = await getInsights();
  const projects = compact ? [] : await getPublishedProjects() ?? [];
  const aiProject = projects.find(project => project.documentId === AI_PROJECT_ID);
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
              {!compact && <ReadingLinks items={contextReadings(articles, `/work#${offer.id}`)} />}
              {!compact && <ProjectLinks projects={contextProjects(projects, `/work#${offer.id}`)} />}
              {!compact && <ContextLinks links={offerNeeds(`/work#${offer.id}`)} label="Votre point de départ" />}
              <a className="card-split-link" href={offer.id === 'video' ? '/agence-audiovisuelle-paris' : compact ? `/work#${offer.id}` : contactHref(`/work#${offer.id}`)}>
                {offer.id === 'video' ? t('video-paris-offer-link') : compact ? 'Explorer cette expertise' : 'Parlons de votre projet'} {t("components-Offers-5")}</a>
              {!compact && offer.id === "video" && <a className="card-split-link context-offer-contact" href={contactHref("/work#video")}>Parlons de votre film →</a>}
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
            {aiProject && <ProjectProof project={aiProject} anchorId="creation-ia-exemple" headingLevel={4} />}
            {!compact && <ReadingLinks items={contextReadings(articles, "/work#creation-ia")} label="Pour explorer les possibilités et les limites" />}
            {!compact && <ContextLinks links={offerNeeds("/work#creation-ia")} label="Votre projet de film" />}
            <a className="card-split-link" href={compact ? '/work#creation-ia' : contactHref('/work#creation-ia')}>{compact ? 'Explorer la création IA' : 'Parlons de votre projet'} {t("components-Offers-7")}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
