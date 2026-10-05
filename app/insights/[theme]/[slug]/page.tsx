import { getInsights, getLiveArticle } from '../../../lib/cms-content';
import { getPublishedProjects } from '../../../lib/projects';
import { CAFE_PROJECT_ID } from '../../../lib/project-editorial';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articlePath, formatDate, readingMinutes, getArticleFormat, formatPath, relatedArticles } from '../../../lib/insights';
import { generateMetadataFromStrapi } from '../../../lib/metadata';
import InsightCards from '../../../components/InsightCards';
import { SITE_URL } from '../../../lib/site';
import JsonLd, { WebPageJsonLd, BreadcrumbJsonLd } from '../../../components/JsonLd';
import { articleSchema } from '../../../lib/structured-data';
import { articleAuthor } from '../../../lib/insights-authors';
import InsightSource from '../../../components/InsightSource';
import { offers, situations } from '../../../lib/editorial';
type Props = { params: Promise<{ theme: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme, slug } = await params;
  const article = await getLiveArticle(theme, slug);
  if (!article) notFound();
  const base = generateMetadataFromStrapi(article.seoTitle, article.description, { url: `${SITE_URL}/og?theme=${encodeURIComponent(theme)}&slug=${encodeURIComponent(slug)}` }, articlePath(article));
  return { ...base, authors: [{ name: articleAuthor(article).name, url: articleAuthor(article).url }], openGraph: { ...base.openGraph, type: 'article', publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: [articleAuthor(article).url] } };
}
export default async function ArticlePage({ params }: Props) {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const { theme, slug } = await params;
  const article = await getLiveArticle(theme, slug);
  if (!article) notFound();
  const topic = publishedTopics.find(topic => topic.slug === theme)!;
  const format = getArticleFormat(article);
  const author = articleAuthor(article);
  const linkedProjects = article.relatedProjectIds?.length ? (await getPublishedProjects() ?? []).filter(project => project.documentId !== CAFE_PROJECT_ID && article.relatedProjectIds!.includes(project.documentId)) : [];
  const offer = offers.find(offer => article.service === `/work#${offer.id}`);
  const situation = situations.find(situation => article.service === `/you#${situation.id}`);
  const situationLabels: Record<string, string> = { visibilite: 'notre accompagnement pour rendre votre expertise visible', dirigeants: 'notre accompagnement pour la parole dirigeante', recrutement: 'notre accompagnement en marque employeur', transformation: 'notre accompagnement pour expliquer une transformation', reseaux: 'notre accompagnement pour vos contenus réguliers', film: 'notre accompagnement pour produire un film' };
  const serviceLabel = offer ? ({ strategy: 'notre accompagnement en stratégie de communication', content: 'notre création de contenus B2B', video: 'notre production vidéo B2B', 'creation-ia': 'notre création d’images et de films par l’IA' }[offer.id]) : situation ? situationLabels[situation.id] : 'notre méthode de design narratif';
  return <main id="main-content" className="insights-page">
    <JsonLd data={articleSchema(article, topic.title, format?.title ?? '')} />
    <WebPageJsonLd path={articlePath(article)} title={article.title} description={article.description} dateModified={article.updatedAt} />
    <BreadcrumbJsonLd items={[{ name: 'Insights', path: '/insights' }, { name: topic.title, path: `/insights/${theme}` }, { name: article.title, path: articlePath(article) }]} />
    <article className="insight-article">
      <header className="insight-article-header">
        <nav aria-label="Fil d’Ariane"><Link href="/insights">Insights</Link> / <Link href={`/insights/${theme}`}>{topic.title}</Link></nav>
        <p className="editorial-eyebrow">{article.tag}</p>
        {format && <Link className="insight-format-link" href={formatPath(format.slug)}>{format.label}</Link>}<h1>{article.title}</h1>
        <p className="insight-meta">Par <Link href={author.path}>{author.name}</Link> · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {readingMinutes(article)} min de lecture</p>
        {article.updatedAt !== article.publishedAt && <p className="insight-meta">Mis à jour le <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></p>}
        <p className="insight-lead">{article.intro}</p>
      </header>
      {article.takeaway && <aside className="insight-takeaway" aria-label="À retenir"><strong>À retenir</strong><p>{article.takeaway}</p></aside>}
      <nav className="insight-toc" aria-label="Sommaire de l’article"><h2>Dans cet article</h2><ol>{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
      {article.sections.map(section => <section key={section.id} id={section.id} className="insight-section"><h2>{section.title}</h2>{section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}{section.table && <div className="insight-table-wrap"><table className="insight-table"><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => column === 0 ? <th key={column} scope="row">{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>}{section.source && <p className="insight-source">Source : <InsightSource source={section.source} /></p>}</section>)}
      {article.research && <section className="insight-section" aria-labelledby="research-method">
        <h2 id="research-method">Méthode et périmètre</h2>
        {article.research.series === 'observatoire-wharf' && <p className="editorial-eyebrow">Observatoire Wharf</p>}
        {article.research.question && <p><strong>Question étudiée :</strong> {article.research.question}</p>}
        <p><strong>Période étudiée :</strong> {article.research.period}</p>
        <p><strong>Périmètre :</strong> {article.research.scope}</p>
        {article.research.sample && <p><strong>Échantillon :</strong> {article.research.sample}</p>}
        <p>{article.research.method}</p>
        {article.research.findings && <><h3>Résultats observés</h3><ul>{article.research.findings.map(finding => <li key={finding}>{finding}</li>)}</ul></>}
        {article.research.analysis && <><h3>Analyse</h3><p>{article.research.analysis}</p></>}
        <h3>Limites de l’étude</h3><p>{article.research.limitations}</p>
        <ul>{article.research.sources.map(source => <li key={source.url}><InsightSource source={source} /></li>)}</ul>
      </section>}
      <footer className="insight-article-cta"><h2>{article.cta}</h2><p>Découvrez <Link href={article.service}>{serviceLabel}</Link>, puis parlons de votre situation.</p><Link href="/contact" className="btn btn-primary">Parlons de votre projet →</Link></footer>
    </article>
    {linkedProjects.length > 0 && <section className="editorial-section"><div className="work-container"><h2>Réalisations liées</h2><ul>{linkedProjects.map(project => <li key={project.documentId}><Link href={`/work/${project.documentId}`}>{project.titre}</Link>{project.description_courte && <p>{project.description_courte}</p>}</li>)}</ul></div></section>}
    <section className="editorial-section"><div className="work-container"><h2>Pour poursuivre la réflexion</h2><InsightCards items={relatedArticles(article, articles)} headingLevel={3} /></div></section>
  </main>;
}
