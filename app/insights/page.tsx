import { generateMetadataFromStrapi } from '../lib/metadata';
import { insightTopics, pageSeo } from '../lib/editorial';

// Launch the editorial hub without indexing an announcement as published expertise.
export const metadata = {
  ...generateMetadataFromStrapi(pageSeo.insights.title, pageSeo.insights.description, undefined, '/insights'),
  robots: { index: false, follow: true },
};
export default function InsightsPage() {
  return (
    <main id="main-content" className="insights-page">
      <section className="editorial-section">
        <div className="work-container">
          <p className="editorial-eyebrow">INSIGHTS — À VENIR</p>
          <h1>Les questions derrière les contenus</h1>
          <p className="editorial-intro">Nous préparons une rubrique consacrée à la vidéo et à la communication B2B. Elle accueillera des analyses et des retours de pratique, appuyés sur des projets documentés.</p>
          <nav className="work-filters" aria-label="Les thèmes Insights">
            {insightTopics.map(topic => <a className="work-filter" key={topic.slug} href={`#${topic.slug}`}>{topic.title}</a>)}
          </nav>
          <div className="editorial-topic-grid">
            {insightTopics.map(topic => (
              <section className="expertise" key={topic.slug} id={topic.slug}>
                <h2>{topic.title}</h2>
                <p>{topic.description}</p>
                <h3 className="editorial-topic-label">Sujets en préparation</h3>
                <ul>{topic.subjects.map(subject => <li key={subject}>{subject}</li>)}</ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className="work-closing">
        <div className="work-container">
          <h2>Une question sur votre communication ?</h2>
          <p>Parlons de votre situation, de vos contenus ou de votre prochain film.</p>
          <a href="/contact" className="work-cta-button">Échanger avec Wharf →</a>
        </div>
      </section>
    </main>
  );
}
