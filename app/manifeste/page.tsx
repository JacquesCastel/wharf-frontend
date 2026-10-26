import type { Metadata } from 'next';
import EditorialMark from '../components/EditorialMark';
import ScrollMotion from '../components/ScrollMotion';
import { BreadcrumbJsonLd, WebPageJsonLd } from '../components/JsonLd';
import { getPageCopy } from '../lib/cms-content';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { getManifestoSections, manifestoPath } from '../lib/manifesto';
import './manifeste.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy('global');
  return generateMetadataFromStrapi(copy.text('manifesto-seo-title'), copy.text('manifesto-seo-description'), undefined, manifestoPath);
}

export default async function ManifestoPage() {
  const copy = await getPageCopy('global');
  const t = (key: string) => copy.text(`manifesto-${key}`);
  const sections = getManifestoSections(copy.text);
  const contents = <ol>{sections.map(section => <li key={section.id}>
    <a href={`#${section.id}`}><span aria-hidden="true">{section.number}</span>{section.label}</a>
  </li>)}</ol>;

  return <main id="main-content" className="wharf-public wharf-manifesto-page wharf-motion">
    <ScrollMotion />
    <WebPageJsonLd path={manifestoPath} title={t('seo-title')} description={t('seo-description')} />
    <BreadcrumbJsonLd items={[{ name: 'Wharf', path: '/' }, { name: t('eyebrow'), path: manifestoPath }]} />
    <article aria-labelledby="manifesto-title">
      <header className="manifesto-masthead" data-scroll-scene>
        <div className="manifesto-masthead-aside">
          <p className="editorial-eyebrow">Wharf / {t('eyebrow')}</p>
          <EditorialMark variant="arches" />
        </div>
        <div className="manifesto-masthead-copy">
          <h1 id="manifesto-title">{t('h1')}<br /><em>{t('h1-end')}</em></h1>
          <p>{t('intro')}</p>
          <a href={`#${sections[0].id}`} className="card-split-link">{t('start-link')} <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <div className="manifesto-reading-layout">
        <aside className="manifesto-contents">
          <nav className="manifesto-desktop-contents" aria-label={t('toc-label')}>
            <p className="editorial-eyebrow">{t('toc-label')}</p>{contents}
          </nav>
          <details className="manifesto-mobile-contents">
            <summary>{t('toc-label')}</summary>
            <nav aria-label={t('toc-label')}>{contents}</nav>
          </details>
        </aside>
        <div className="manifesto-text">
          {sections.map(section => <section className="manifesto-chapter" key={section.id} aria-labelledby={section.id}>
            <span className="manifesto-chapter-number" aria-hidden="true">{section.number}</span>
            <h2 id={section.id} tabIndex={-1}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </section>)}
          <div className="manifesto-signature">
            <p>{t('signature')}</p>
            <span className="manifesto-signature-mark" aria-hidden="true">Wharf.</span>
          </div>
          <nav className="manifesto-next" aria-label="Poursuivre avec Wharf">
            <a href="/contact" className="card-split-link">{t('contact-link')} <span aria-hidden="true">↗</span></a>
            <a href="/we" className="card-split-link">{t('we-link')} <span aria-hidden="true">→</span></a>
            <a href="#manifesto-title" className="manifesto-back">{t('back-link')} <span aria-hidden="true">↑</span></a>
          </nav>
        </div>
      </div>
    </article>
  </main>;
}
