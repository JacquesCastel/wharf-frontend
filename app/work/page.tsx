import type { Metadata } from 'next';
import { getWork } from '../lib/strapi';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { getPublishedProjects } from '../lib/projects';
import { pageSeo } from '../lib/editorial';
import Offers from '../components/Offers';
import WorkPortfolio from './WorkPortfolio';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const data = await getWork();
  return generateMetadataFromStrapi(pageSeo.work.title, pageSeo.work.description, data.seo?.image, '/work');
}
export default async function WorkPage() {
  const [data, projects] = await Promise.all([getWork(), getPublishedProjects()]);
  return (
    <main id="main-content">
      <section className="work-hero">
        <video className="work-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src={data.hero.video?.url || 'https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4'} type="video/mp4" />
        </video>
        <div className="work-hero-overlay" />
        <div className="work-hero-content">
          <p className="editorial-eyebrow">WORK</p>
          <h1>Stratégie, contenus & vidéo B2B</h1>
          <p className="work-hero-subtitle">Wharf conçoit ce qu’il produit et produit ce qu’il conçoit. Du premier message au film final, une même intention guide le travail.</p>
        </div>
      </section>
      <Offers />
      <WorkPortfolio projects={projects} />
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
