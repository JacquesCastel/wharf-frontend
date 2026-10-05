import { getPageCopy, getInsights } from '../lib/cms-content';
import Link from 'next/link';
import { getFooter } from '../lib/strapi';
import { positioning } from '../lib/editorial';
import { articlePath } from '../lib/insights';

export default async function Footer() {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
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
    { title: t("components-Footer-23"), links: [
      { href: '/insights', label: t("components-Footer-24") },
      ...publishedTopics.map(topic => ({ href: `/insights/${topic.slug}`, label: topic.title })),
    ] },
  ];
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <Link href="/" className="footer-logo" aria-label="Wharf — accueil">
              <img src={data.logo?.url || '/images/logo-wharf.png'} alt="Wharf" width={data.logo?.width || 1100} height={data.logo?.height || 454} loading="lazy" decoding="async" />
            </Link>
            <p className="footer-slogan">{t("positioning")}</p>
            <a href="mailto:contact@bywharf.com" className="footer-contact-link">{t("components-Footer-25")}</a>
          </div>
          <div className="footer-right">
            {groups.map(group => (
              <div className="footer-column" key={group.title}>
                <h2 className="footer-column-title">{group.title}</h2>
                <nav className="footer-nav" aria-label={`Pied de page — ${group.title}`}>
                  {group.links.map(link => <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>)}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <section className="footer-reading" aria-labelledby="footer-reading-title">
          <h2 id="footer-reading-title" className="footer-column-title">{t("components-Footer-26")}</h2>
          <nav aria-label="Pied de page — derniers articles">
            <ul className="footer-reading-list">
              {latestArticles.map(article => (
                <li key={article.slug}>
                  <span className="footer-reading-topic">{article.tag}</span>
                  <Link href={articlePath(article)} className="footer-link">{article.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        <div className="footer-bottom">
          <nav className="footer-utility" aria-label="Pied de page — accessibilité">
            <Link href="/accessibilite" className="footer-link">{t("components-Footer-27")}</Link>
            <Link href="/accessibilite/engagement" className="footer-link">{t("components-Footer-28")}</Link>
          </nav>
          <p className="footer-copyright">{data.copyright || `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`}</p>
          <p className="footer-description">{t("components-Footer-29")}<Link href="/we">{t("components-Footer-30")}</Link>{t("components-Footer-31")}</p>
        </div>
      </div>
    </footer>
  );
}
