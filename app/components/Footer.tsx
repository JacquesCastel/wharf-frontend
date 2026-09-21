import Link from 'next/link';
import { getFooter } from '../lib/strapi';
import { positioning } from '../lib/editorial';
import { publishedTopics } from '../lib/insights';

export default async function Footer() {
  const data = await getFooter();
  const groups = [
    { title: 'Wharf', links: [
      { href: '/we', label: 'L’agence et notre méthode' },
      { href: '/work', label: 'Expertises et réalisations' },
      { href: '/you', label: 'Vos enjeux de communication' },
      { href: '/contact', label: 'Parlons de votre projet' },
    ] },
    { title: 'Nos expertises', links: [
      { href: '/work#strategy', label: 'Stratégie de communication' },
      { href: '/work#content', label: 'Création de contenus B2B' },
      { href: '/work#video', label: 'Production vidéo' },
    ] },
    { title: 'Analyses et conseils', links: [
      { href: '/insights', label: 'Tous les articles' },
      ...publishedTopics.map(topic => ({ href: `/insights/${topic.slug}`, label: topic.title })),
    ] },
  ];
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <Link href="/" className="footer-logo" aria-label="Wharf — accueil">
              <img src={data.logo?.url || '/images/logo-wharf.png'} alt="Wharf" />
            </Link>
            <p className="footer-slogan">{positioning}</p>
            <a href="mailto:contact@bywharf.com" className="footer-contact-link">contact@bywharf.com</a>
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
        <div className="footer-bottom">
          <nav className="footer-utility" aria-label="Pied de page — accessibilité">
            <Link href="/accessibilite" className="footer-link">Accessibilité</Link>
            <Link href="/accessibilite/engagement" className="footer-link">Notre engagement d’accessibilité</Link>
          </nav>
          <p className="footer-copyright">{data.copyright || `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`}</p>
        </div>
      </div>
    </footer>
  );
}
