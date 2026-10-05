import { getPageCopy, getInsights } from './lib/cms-content';
import { WebPageJsonLd } from './components/JsonLd';
import type { Metadata } from 'next';
import { getHome } from './lib/strapi';
import { generateMetadataFromStrapi } from './lib/metadata';
import Offers from './components/Offers';
import FilmHero from './components/FilmHero';
import WorkPortfolio from './work/WorkPortfolio';
import { getPublishedProjects } from './lib/projects';
import InsightCards from './components/InsightCards';

import { pageSeo, positioning, description } from './lib/editorial';

export async function generateMetadata(): Promise<Metadata> {
  const seoCopy = await getPageCopy('home');
  const data = await getHome();
  return generateMetadataFromStrapi(seoCopy.seo.title, seoCopy.seo.description, data.seo?.image, '/');
}

export default async function HomePage() {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const copy = await getPageCopy('home');
  const t = copy.text;
  const seoCopy = copy;
  const [homeData, projects] = await Promise.all([getHome(), getPublishedProjects()]);
  const entries = [
    { label: t("page-1"), href: '/we', image: homeData.blocs.we.image || '/images/card-we.jpg', title: t("page-2"), text: t("page-3") },
    { label: t("page-4"), href: '/work', image: homeData.blocs.work.image || '/images/card-work.jpg', title: t("page-5"), text: t("page-6") },
    { label: t("page-7"), href: '/you', image: homeData.blocs.you.image || '/images/card-you.jpg', title: t("page-8"), text: t("page-9") },
  ];
  return <main id="main-content" className="wharf-public wharf-home">
      <WebPageJsonLd path="/" title={seoCopy.seo.title} description={seoCopy.seo.description} />
    <FilmHero videoSrc={homeData.hero.video?.url || 'https://bywharf.com/wp-content/uploads/2025/10/vidintro.mp4'}>
      <p className="editorial-eyebrow">{t("positioning")}</p>
      <h1 id="home-title">{t("page-10")}<br /><em>{t("page-11")}</em></h1>
      <div className="film-hero-intro">
        <p>{t("description")}</p>
        <a href="/work" className="film-link">{t("page-12")}<span aria-hidden="true">{t("page-13")}</span></a>
      </div>
    </FilmHero>

    <WorkPortfolio projects={projects} compact />
    <Offers compact />

    <section className="wharf-entry-section" aria-labelledby="entry-title">
      <div className="wharf-container">
        <div className="wharf-section-heading"><p className="editorial-eyebrow">{t("page-14")}</p><h2 id="entry-title">{t("page-15")}</h2></div>
        <div className="wharf-entries">{entries.map(entry => <a className="wharf-entry" href={entry.href} key={entry.label}>
          <div className="wharf-entry-image" style={{ backgroundImage: `url(${entry.image})` }}><span>{entry.label}</span><span aria-hidden="true">{t("page-16")}</span></div>
          <h3>{entry.title}</h3><p>{entry.text}</p>
        </a>)}</div>
      </div>
    </section>

    <section className="wharf-manifesto" aria-labelledby="manifesto-title">
      <div className="wharf-manifesto-image" style={{ backgroundImage: 'url(https://admin.bywharf.com/uploads/manifeste_b8fb418ca3.png)' }} aria-hidden="true" />
      <div className="wharf-manifesto-copy">
        <p className="editorial-eyebrow">{t("page-17")}</p>
        <h2 id="manifesto-title">{t("page-18")}<br />{t("page-19")}</h2>
        <p>{t("page-20")}</p>
        <p>{t("page-21")}</p>
        <a href="/we" className="card-split-link">{t("page-22")}</a>
      </div>
    </section>

    <section className="editorial-section"><div className="wharf-container">
      <div className="wharf-section-heading"><p className="editorial-eyebrow">{t("page-23")}</p><h2>{t("page-24")}<br />{t("page-25")}</h2></div>
      <p>{t("page-26")}</p>
      <InsightCards items={articles.slice(0, 3)} headingLevel={3} />
      <a href="/insights" className="card-split-link">{t("page-27")}</a>
    </div></section>

    <section className="cta-section"><div className="wharf-container">
      <p className="editorial-eyebrow">{t("page-28")}</p>
      <h2>{t("page-29")}<br />{t("page-30")}</h2>
      <p>{t("page-31")}</p>
      <a href="/contact" className="btn btn-primary">{t("page-32")}</a>
    </div></section>
  </main>;
}
