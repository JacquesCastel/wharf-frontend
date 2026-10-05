import type { Metadata } from 'next';
import { getWork } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { getPublishedProjects } from '../lib/projects';
import { pageSeo } from '../lib/editorial';
import Offers from '../components/Offers';
import InsightCards from '../components/InsightCards';
import { articles } from '../lib/insights';
import WorkPortfolio from './WorkPortfolio';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const data = await getWork();
  return generateMetadataFromStrapi(pageSeo.work.title, pageSeo.work.description, data.seo?.image, '/work');
}
export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <main id="main-content" className="wharf-public wharf-work">
      <section className="wharf-masthead" aria-labelledby="work-title">
        <p className="editorial-eyebrow">WORK / Expertises & réalisations</p>
        <div><h1 id="work-title">Stratégie, <br />contenus & vidéo B2B.</h1>
          <p>Wharf conçoit ce qu’il produit et produit ce qu’il conçoit. Du premier message au film final, une même intention guide le travail.</p>
          <nav className="wharf-section-nav" aria-label="Explorer WORK"><a href="#realisations">Réalisations ↓</a><a href="#strategy">Strategy</a><a href="#content">Content</a><a href="#video">Video</a><a href="#creation-ia">Création IA</a></nav>
        </div>
      </section>
      <WorkPortfolio projects={projects} />
      <Offers />
      <section className="work-methode">
        <div className="work-container">
          <h2>Une intention, du conseil à la production</h2>
          <p className="work-methode-intro">Le design narratif relie vos enjeux aux contenus qui les incarnent.</p>
          <div className="work-mouvements">
            {[
              ['Cadrer', 'Comprendre votre situation, vos publics et l’objectif de communication. Définir les messages et les preuves à mobiliser.'],
              ['Concevoir', 'Construire le parti pris éditorial, les formats et le dispositif de production. Préparer les sujets et les intervenants.'],
              ['Produire et décliner', 'Réaliser les contenus et les films, puis les adapter aux canaux de diffusion et aux usages définis ensemble.'],
            ].map(([title, text], index) => <div className="mouvement" key={title}><div className="mouvement-number">{index + 1}</div><h3>{title}</h3><p>{text}</p></div>)}
          </div>
          <a href="/we" className="card-split-link">Découvrir le design narratif →</a>
        </div>
      </section>
      <section className="editorial-section"><div className="work-container">
        <h2>Préparer votre prochain projet</h2>
        <p>Des repères pour choisir vos contenus et préparer leur production.</p>
        <InsightCards items={articles.filter(article => article.format === 'guides').slice(0, 3)} headingLevel={3} />
      </div></section>
      <section className="work-closing">
        <div className="work-container">
          <h2>Un sujet à clarifier, un contenu à produire ?</h2>
          <p>Partons de votre besoin pour construire le bon accompagnement.</p>
          <a href="/contact" className="work-cta-button">Parlons de votre projet →</a>
        </div>
      </section>
    </main>
  );
}
