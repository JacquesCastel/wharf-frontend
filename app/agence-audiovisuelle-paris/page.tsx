import type { Metadata } from 'next';
import ScrollMotion from '../components/ScrollMotion';
import EditorialMark from '../components/EditorialMark';
import JsonLd, { BreadcrumbJsonLd, WebPageJsonLd } from '../components/JsonLd';
import InsightCards from '../components/InsightCards';
import WorkPortfolio from '../work/WorkPortfolio';
import { getInsights, getPageCopy } from '../lib/cms-content';
import { getPublishedProjects } from '../lib/projects';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { servicesSchema } from '../lib/structured-data';
import { serviceId } from '../lib/site';
import './audiovisual.css';

export const dynamic = 'force-dynamic';
const path = '/agence-audiovisuelle-paris';

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy('global');
  return generateMetadataFromStrapi(copy.text('video-paris-seo-title'), copy.text('video-paris-seo-description'), undefined, path);
}

export default async function AudiovisualParisPage() {
  const [copy, projects, { articles }] = await Promise.all([getPageCopy('global'), getPublishedProjects(), getInsights()]);
  const t = (key: string) => copy.text(`video-paris-${key}`);
  const films = projects?.filter(project => project.categories?.some(category => category.slug === 'films-videos')) ?? (projects === null ? null : []);
  const service = servicesSchema().find(node => node['@id'] === serviceId('video'))!;
  return <main id="main-content" className="wharf-public wharf-audiovisual wharf-motion">
    <ScrollMotion />
    <WebPageJsonLd path={path} title={t('seo-title')} description={t('seo-description')} about={{ '@id': serviceId('video') }} />
    <BreadcrumbJsonLd items={[{ name: 'Wharf', path: '/' }, { name: 'Production audiovisuelle à Paris', path }]} />
    <JsonLd data={{ ...service, description: t('intro'), areaServed: { '@type': 'City', name: 'Paris' } }} />
    <section className="wharf-masthead" aria-labelledby="audiovisual-title">
      <div className="wharf-masthead-aside"><p className="editorial-eyebrow">{t('eyebrow')}</p><EditorialMark className="masthead-art" variant="frames" /></div>
      <div><h1 id="audiovisual-title">{t('h1')}<br /><em>{t('h1-end')}</em></h1>
        <p>{t('intro')}</p>
        <a href="/contact" className="card-split-link">{t('cta')} →</a>
        <nav className="wharf-section-nav" aria-label="Explorer la production audiovisuelle">
          <a href="#formats">{t('nav-formats')}</a><a href="#methode">{t('nav-method')}</a><a href="#realisations">{t('nav-projects')}</a><a href="#questions">{t('nav-questions')}</a>
        </nav>
      </div>
    </section>
    <section className="editorial-section audiovisual-formats" id="formats" aria-labelledby="formats-title">
      <div className="work-container"><h2 id="formats-title">{t('formats-title')}</h2><p>{t('formats-intro')}</p>
        <div className="audiovisual-grid">{[1, 2, 3, 4, 5, 6].map(index => <article key={index}>
          <span className="editorial-eyebrow" aria-hidden="true">0{index}</span><h3>{t(`format-${index}-title`)}</h3><p>{t(`format-${index}-text`)}</p>
        </article>)}</div>
      </div>
    </section>
    <section className="editorial-section" id="methode" aria-labelledby="method-title">
      <div className="work-container"><h2 id="method-title">{t('method-title')}</h2><p>{t('method-intro')}</p>
        <ol className="editorial-steps">{[1, 2, 3, 4].map(index => <li key={index}><h3>{t(`step-${index}-title`)}</h3><p>{t(`step-${index}-text`)}</p></li>)}</ol>
        <a href="/we" className="card-split-link">{t('method-link')} →</a>
      </div>
    </section>
    <div className="audiovisual-project-intro"><div className="work-container"><p className="editorial-eyebrow">{t('projects-title')}</p><p>{t('projects-intro')}</p></div></div>
    <WorkPortfolio projects={films} compact />
    <section className="editorial-section audiovisual-local" aria-labelledby="local-title"><div className="work-container audiovisual-grid">
      <div><h2 id="local-title">{t('local-title')}</h2><p>{t('local-text')}</p><p className="audiovisual-address"><strong>{t('address-label')}</strong><br />122 rue Amelot, 75011 Paris<br /><a href="mailto:contact@bywharf.com">contact@bywharf.com</a></p></div>
      <div><h2>{t('brief-title')}</h2><p>{t('brief-text')}</p><a href="/contact" className="card-split-link">{t('cta')} →</a></div>
    </div></section>
    <section className="editorial-section" id="questions" aria-labelledby="questions-title"><div className="work-container">
      <h2 id="questions-title">{t('faq-title')}</h2><div className="audiovisual-questions">{[1, 2, 3, 4, 5].map(index => <details key={index}><summary>{t(`question-${index}`)}</summary><p>{t(`answer-${index}`)}</p></details>)}</div>
    </div></section>
    <section className="editorial-section"><div className="work-container"><h2>{t('reading-title')}</h2>
      <InsightCards items={articles.filter(article => article.theme === 'video-b2b' && article.format === 'guides').slice(0, 3)} headingLevel={3} composed />
    </div></section>
    <section className="work-closing"><div className="work-container"><h2>{t('closing-title')}</h2><p>{t('closing-text')}</p><a href="/contact" className="work-cta-button">{t('cta')} →</a></div></section>
  </main>;
}
