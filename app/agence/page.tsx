import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialMark from '../components/EditorialMark';
import ScrollMotion from '../components/ScrollMotion';
import JsonLd, { BreadcrumbJsonLd, WebPageJsonLd } from '../components/JsonLd';
import { getPageCopy } from '../lib/cms-content';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { agencyPath, agencyRevision, agencyBookUrl, agencyProjectUrl, agencyParagraphs } from '../lib/agency';
import { latestContentDate } from '../lib/content-dates';
import { ORGANIZATION_ID, absoluteUrl } from '../lib/site';
import './agence.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy('global');
  return generateMetadataFromStrapi(copy.text('agency-seo-title'), copy.text('agency-seo-description'), undefined, agencyPath);
}

export default async function AgencyPage() {
  const copy = await getPageCopy('global');
  const t = (key: string) => copy.text(`agency-${key}`);
  const paragraphs = (key: string) => agencyParagraphs(t(key)).map((text, index) => <p key={index}>{text}</p>);
  const personId = `${absoluteUrl(agencyPath)}#jacques-castel`;
  return <main id="main-content" className="wharf-public wharf-agency-page wharf-motion">
    <ScrollMotion />
    <WebPageJsonLd path={agencyPath} title={t('seo-title')} description={t('seo-description')} type="AboutPage" dateModified={latestContentDate(copy.updatedAt, agencyRevision)?.toISOString()} about={[{ '@id': ORGANIZATION_ID }, { '@id': personId }]} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', '@id': personId, name: t('name'), url: absoluteUrl(agencyPath), worksFor: { '@id': ORGANIZATION_ID } }} />
    <BreadcrumbJsonLd items={[{ name: 'Wharf', path: '/' }, { name: t('eyebrow'), path: agencyPath }]} />
    <header className="agency-masthead agency-container" data-scroll-scene>
      <div className="agency-opening">
        <p className="editorial-eyebrow">Wharf / {t('eyebrow')}</p>
        <h1>{t('h1')}{' '}<br /><em>{t('h1-end')}</em></h1>
        <p className="agency-positioning">{t('positioning')}</p>
        <p className="agency-intro">{t('intro')}</p>
        <p>{t('role')}</p>
        <Link href="/contact" className="card-split-link">{t('contact-link')} <span aria-hidden="true">↗</span></Link>
      </div>
      <aside className="agency-signature" aria-label={t('name')}>
        <EditorialMark variant="orbit" />
        <p className="agency-name">{t('name')}</p>
        <p className="agency-signature-caption">{t('signature')}</p>
      </aside>
    </header>

    <section className="agency-chapter agency-container" aria-labelledby="agency-regard" data-scroll-scene>
      <div className="agency-section-label"><span aria-hidden="true">01</span><p className="editorial-eyebrow">{t('regard-label')}</p></div>
      <div className="agency-reading"><h2 id="agency-regard">{t('regard-title')}</h2>{paragraphs('regard-text')}</div>
    </section>
    <section className="agency-chapter agency-container" aria-labelledby="agency-recit" data-scroll-scene>
      <div className="agency-section-label"><span aria-hidden="true">02</span><p className="editorial-eyebrow">{t('recit-label')}</p></div>
      <div className="agency-reading"><h2 id="agency-recit">{t('recit-title')}</h2>{paragraphs('recit-text')}<Link href="/work" className="card-split-link">{t('expertise-link')} <span aria-hidden="true">→</span></Link></div>
    </section>
    <section className="agency-collaboration" aria-labelledby="agency-equipe">
      <div className="agency-container agency-collaboration-grid" data-scroll-scene>
        <div><p className="editorial-eyebrow">{t('equipe-label')}</p><h2 id="agency-equipe">{t('equipe-title')}</h2><EditorialMark variant="frames" /></div>
        <div className="agency-reading">{paragraphs('equipe-text')}</div>
      </div>
    </section>

    <section className="agency-projects agency-container" aria-labelledby="agency-projets">
      <div className="agency-section-heading"><p className="editorial-eyebrow">{t('projects-label')}</p><h2 id="agency-projets">{t('projects-title')}</h2></div>
      <div className="agency-project-grid">
        <article className="agency-project agency-project-book" data-scroll-scene>
          <span className="agency-project-marker" aria-hidden="true">01 / {t('book-label')}</span>
          <h3>{t('book-title')}</h3>{paragraphs('book-text')}
          <nav className="agency-links" aria-label={t('book-title')}><a href={agencyBookUrl} className="card-split-link">{t('book-link')} <span aria-hidden="true">↗</span></a><Link href="/manifeste" className="card-split-link">{t('manifesto-link')} <span aria-hidden="true">→</span></Link></nav>
        </article>
        <article className="agency-project agency-project-linkeepost" data-scroll-scene>
          <span className="agency-project-marker" aria-hidden="true">02 / LinkeePost</span>
          <h3>{t('project-title')}</h3>{paragraphs('project-text')}
          <a href={agencyProjectUrl} className="card-split-link">{t('project-link')} <span aria-hidden="true">↗</span></a>
        </article>
      </div>
    </section>
    <section className="agency-chapter agency-container agency-proof" aria-labelledby="agency-realisations">
      <div className="agency-section-label"><span aria-hidden="true">03</span><p className="editorial-eyebrow">{t('proof-label')}</p></div>
      <div className="agency-reading"><h2 id="agency-realisations">{t('proof-title')}</h2>{paragraphs('proof-text')}<nav className="agency-links" aria-label={t('proof-title')}><Link href="/work#realisations" className="card-split-link">{t('work-link')} <span aria-hidden="true">→</span></Link><Link href="/insights" className="card-split-link">{t('insights-link')} <span aria-hidden="true">→</span></Link><Link href="/we" className="card-split-link">{t('method-link')} <span aria-hidden="true">→</span></Link></nav></div>
    </section>
    <section className="agency-conversation agency-container" aria-labelledby="agency-contact">
      <h2 id="agency-contact">{t('cta-title')}</h2>{paragraphs('cta-text')}
      <Link href="/contact" className="card-split-link">{t('cta-link')} <span aria-hidden="true">↗</span></Link>
    </section>
  </main>;
}
