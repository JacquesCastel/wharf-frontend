import Link from 'next/link';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { publishedTopics } from '../lib/insights';
import InsightCards from '../components/InsightCards';
export const metadata = generateMetadataFromStrapi('INSIGHTS — IA, contenus & vidéo B2B | Wharf', 'Analyses et guides sur l’IA, la visibilité, la crédibilité des entreprises et la production de contenus B2B.', undefined, '/insights');
export default function InsightsPage() {
  return <main id="main-content" className="insights-page">
    <section className="editorial-section"><div className="work-container">
      <p className="editorial-eyebrow">INSIGHTS / LE BLOG WHARF</p>
      <h1>Rendre votre expertise visible.</h1>
      <p className="editorial-intro">IA, visibilité, autorité et vidéo : des analyses et des guides pour rendre votre entreprise plus compréhensible et plus crédible. Des questions de communication, traitées à partir des contenus qui leur donnent forme.</p>
      <nav className="work-filters" aria-label="Thèmes du blog">{publishedTopics.map(topic => <Link className="work-filter" key={topic.slug} href={`/insights/${topic.slug}`}>{topic.title}</Link>)}</nav>
      <InsightCards />
    </div></section>
    <section className="work-closing"><div className="work-container"><h2>De la réflexion à votre projet</h2><p>Relions vos enjeux aux messages, aux contenus et aux films qui peuvent les servir.</p><Link href="/contact" className="work-cta-button">Échanger avec Wharf →</Link></div></section>
  </main>;
}
