import Link from 'next/link';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { publishedTopics, publishedFormats, formatPath } from '../lib/insights';
import InsightCards from '../components/InsightCards';
import { pageSeo } from '../lib/editorial';
export const metadata = generateMetadataFromStrapi(pageSeo.insights.title, pageSeo.insights.description, undefined, '/insights');
export default function InsightsPage() {
  return <main id="main-content" className="insights-page wharf-public wharf-insights">
    <section className="editorial-section"><div className="work-container">
      <p className="editorial-eyebrow">INSIGHTS / LE BLOG WHARF</p>
      <h1>Éclairer vos choix de communication.</h1>
      <p className="editorial-intro">Stratégie éditoriale, communication corporate, vidéo et IA : des guides pour préparer vos projets et des analyses pour comprendre ce qui change. Chaque article distingue les conseils, les exemples et les faits documentés.</p>
      <p className="insight-browse-label">Explorer par thème</p>
      <nav className="work-filters" aria-label="Thèmes du blog">{publishedTopics.map(topic => <Link className="work-filter" key={topic.slug} href={`/insights/${topic.slug}`}>{topic.title}</Link>)}</nav>
      <p className="insight-browse-label">Explorer par format</p>
      <nav className="work-filters" aria-label="Formats éditoriaux">{publishedFormats.map(format => <Link className="work-filter" key={format.slug} href={formatPath(format.slug)}>{format.title}</Link>)}</nav>
      <InsightCards />
    </div></section>
    <section className="work-closing"><div className="work-container"><h2>De la réflexion à votre projet</h2><p>Relions vos enjeux aux messages, aux contenus et aux films qui peuvent les servir.</p><Link href="/contact" className="work-cta-button">Échanger avec Wharf →</Link></div></section>
  </main>;
}
