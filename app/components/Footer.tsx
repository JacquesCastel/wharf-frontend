import { getPageCopy, getInsights } from '../lib/cms-content';
import Link from 'next/link';
import { AudiencePreferencesButton } from './Measurement';
import { getFooter } from '../lib/strapi';
import { articlePath } from '../lib/insights';
import EditorialMark from './EditorialMark';
import ScrollMotion from './ScrollMotion';

export default async function Footer() {
  const { articles, publishedTopics } = await getInsights();
  const copy = await getPageCopy('global');
  const t = copy.text;
  const data = await getFooter();
  const latestArticles = [...articles].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 3);
  const groups = [
    { title: t("components-Footer-8"), links: [
      { href: '/we', label: t("components-Footer-9") },
      { href: '/work', label: t("components-Footer-10") },
      { href: '/you', label: t("components-Footer-11") },
      { href: '/contact', label: t("components-Footer-12") },
    ] },
    { title: t("components-Footer-13"), links: [
      { href: '/work#strategy', label: t("components-Footer-14") },
      { href: '/work#content', label: t("components-Footer-15") },
      { href: '/work#video', label: t("components-Footer-16") },
      { href: '/work#creation-ia', label: t("components-Footer-17") },
    ] },
    { title: t("components-Footer-18"), links: [
      { href: '/you#dirigeants', label: t("components-Footer-19") },
      { href: '/you#recrutement', label: t("components-Footer-20") },
      { href: '/you#transformation', label: t("components-Footer-21") },
      { href: '/you#film', label: t("components-Footer-22") },
    ] },
  ];
  return (
    <footer id="site-footer" className="footer wharf-motion footer-editorial">
      <ScrollMotion />
      <div className="footer-container">
        <div className="footer-content" data-scroll-scene>
          <div className="footer-left">
            <div className="footer-brand-lockup">
              <Link href="/" className="footer-logo" aria-label="Wharf — accueil">
                <img src={data.logo?.url || '/images/logo-wharf.png'} alt="Wharf" width={data.logo?.width || 1100} height={data.logo?.height || 454} loading="lazy" decoding="async" />
              </Link>
              <EditorialMark className="footer-signature-art" variant="arches" />
            </div>
            <p className="footer-slogan">{t("positioning")}</p>
            <a href="mailto:contact@bywharf.com" className="footer-contact-link">{t("components-Footer-25")}<span aria-hidden="true">↗</span></a>
          </div>
          <div className="footer-right">
            {groups.map((group, index) => (
              <div className="footer-column" key={group.title}>
                <span className="footer-column-marker" aria-hidden="true">0{index + 1}</span>
                <h2 className="footer-column-title">{group.title}</h2>
                <nav className="footer-nav" aria-label={`Pied de page — ${group.title}`}>
                  {group.links.map(link => <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>)}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <section className="footer-reading" aria-labelledby="footer-reading-title">
          <div className="footer-reading-intro">
            <p className="footer-reading-kicker">{t("components-Footer-23")}</p>
            <h2 id="footer-reading-title" className="footer-column-title">{t("components-Footer-26")}</h2>
            <nav className="footer-topic-nav" aria-label="Pied de page — thématiques du blog">
              {publishedTopics.map(topic => <Link key={topic.slug} href={`/insights/${topic.slug}`} className="footer-topic-link">{topic.title}</Link>)}
            </nav>
            <Link href="/insights" className="footer-all-articles">{t("components-Footer-24")}<span aria-hidden="true">→</span></Link>
          </div>
          {latestArticles.length > 0 && <nav aria-label="Pied de page — derniers articles">
            <ul className="footer-reading-list">
              {latestArticles.map((article, index) => (
                <li key={article.slug}>
                  <Link href={articlePath(article)} className="footer-article-link">
                    <span className="footer-article-number" aria-hidden="true">0{index + 1}</span>
                    <div className="footer-article-copy">
                      <span className="footer-reading-topic">{article.tag}</span>
                      <h3>{article.title}</h3>
                    </div>
                    <span className="footer-article-arrow" aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>}
        </section>
        <div className="footer-bottom">
          <nav className="footer-utility" aria-label="Pied de page — accessibilité">
            <Link href="/confidentialite" className="footer-link">Confidentialité</Link>
            <AudiencePreferencesButton />
            <Link href="/accessibilite" className="footer-link">{t("components-Footer-27")}</Link>
            <Link href="/accessibilite/engagement" className="footer-link">{t("components-Footer-28")}</Link>
          </nav>
          <p className="footer-copyright">{data.copyright || `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`}</p>
          <p className="footer-description">{t("components-Footer-29")}<Link href="/we">{t("components-Footer-30")}</Link>{t("components-Footer-31")}</p>
          <p className="footer-side-project">
            Nous développons aussi <a href="https://postgenius.network/" target="_blank" rel="noopener noreferrer" aria-label="PostGenius — projet en développement (nouvel onglet)">PostGenius<span aria-hidden="true"> ↗</span></a>, un outil qui associe IA et approche éditoriale pour créer et programmer vos contenus LinkedIn.
          </p>
        </div>
      </div>
    </footer>
  );
}
