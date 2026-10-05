import { WebPageJsonLd } from './components/JsonLd';
import type { Metadata } from 'next';
import { getHome } from './lib/strapi';
import { generateMetadataFromStrapi } from './lib/metadata';
import Offers from './components/Offers';
import FilmHero from './components/FilmHero';
import WorkPortfolio from './work/WorkPortfolio';
import { getPublishedProjects } from './lib/projects';
import InsightCards from './components/InsightCards';
import { articles } from './lib/insights';
import { pageSeo, positioning, description } from './lib/editorial';

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return generateMetadataFromStrapi(pageSeo.home.title, pageSeo.home.description, data.seo?.image, '/');
}

export default async function HomePage() {
  const [homeData, projects] = await Promise.all([getHome(), getPublishedProjects()]);
  const entries = [
    { label: 'WE', href: '/we', image: homeData.blocs.we.image || '/images/card-we.jpg', title: 'Le design narratif', text: 'Une méthode pour relier ce que vous êtes, ce que vous dites et ce que vos publics perçoivent.' },
    { label: 'WORK', href: '/work', image: homeData.blocs.work.image || '/images/card-work.jpg', title: 'De l’intention à l’image', text: 'Stratégie, création éditoriale et production vidéo : une même intention, jusque dans la réalisation.' },
    { label: 'YOU', href: '/you', image: homeData.blocs.you.image || '/images/card-you.jpg', title: 'Votre point de départ', text: 'Faire connaître votre entreprise, recruter, expliquer une transformation ou produire un film.' },
  ];
  return <main id="main-content" className="wharf-public wharf-home">
      <WebPageJsonLd path="/" title={pageSeo.home.title} description={pageSeo.home.description} />
    <FilmHero videoSrc={homeData.hero.video?.url || 'https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4'}>
      <p className="editorial-eyebrow">{positioning}</p>
      <h1 id="home-title">Révéler ce qui <br /><em>existe déjà</em></h1>
      <div className="film-hero-intro">
        <p>{description}</p>
        <a href="/work" className="film-link">Découvrir nos expertises <span aria-hidden="true">↗</span></a>
      </div>
    </FilmHero>

    <WorkPortfolio projects={projects} compact />
    <Offers compact />

    <section className="wharf-entry-section" aria-labelledby="entry-title">
      <div className="wharf-container">
        <div className="wharf-section-heading"><p className="editorial-eyebrow">L’agence, le travail, vos enjeux</p><h2 id="entry-title">Trois portes d’entrée.</h2></div>
        <div className="wharf-entries">{entries.map(entry => <a className="wharf-entry" href={entry.href} key={entry.label}>
          <div className="wharf-entry-image" style={{ backgroundImage: `url(${entry.image})` }}><span>{entry.label}</span><span aria-hidden="true">↗</span></div>
          <h3>{entry.title}</h3><p>{entry.text}</p>
        </a>)}</div>
      </div>
    </section>

    <section className="wharf-manifesto" aria-labelledby="manifesto-title">
      <div className="wharf-manifesto-image" style={{ backgroundImage: 'url(https://admin.bywharf.com/uploads/manifeste_b8fb418ca3.png)' }} aria-hidden="true" />
      <div className="wharf-manifesto-copy">
        <p className="editorial-eyebrow">Notre manifeste</p>
        <h2 id="manifesto-title">Quand la parole<br />se dilue.</h2>
        <p>La communication a besoin de retrouver son point d’appui : la réalité de l’entreprise.</p>
        <p>De nouveaux récits se construisent à partir de cette matière. Notre design narratif relie ce que vous êtes, ce que vous dites et ce que vos publics perçoivent. Il guide la stratégie comme les contenus et les images.</p>
        <a href="/we" className="card-split-link">Découvrir notre méthode →</a>
      </div>
    </section>

    <section className="editorial-section"><div className="wharf-container">
      <div className="wharf-section-heading"><p className="editorial-eyebrow">INSIGHTS</p><h2>Partager les questions<br />de notre métier.</h2></div>
      <p>Des guides et des analyses sur la stratégie éditoriale, la communication corporate et la production vidéo B2B.</p>
      <InsightCards items={articles.slice(0, 3)} headingLevel={3} />
      <a href="/insights" className="card-split-link">Tous les articles →</a>
    </div></section>

    <section className="cta-section"><div className="wharf-container">
      <p className="editorial-eyebrow">La suite commence avec vous</p>
      <h2>Quel projet voulez-vous<br />faire avancer ?</h2>
      <p>Parlons de vos publics, de vos enjeux et de ce que votre communication doit rendre possible.</p>
      <a href="/contact" className="btn btn-primary">Démarrer la conversation</a>
    </div></section>
  </main>;
}
