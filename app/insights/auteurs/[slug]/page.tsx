import { getInsights } from '../../../lib/cms-content';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { authorPath } from '../../../lib/insights-authors';
import { absoluteUrl } from '../../../lib/site';
import { generateMetadataFromStrapi } from '../../../lib/metadata';
import { personSchema, webPageSchema } from '../../../lib/structured-data';
import JsonLd, { BreadcrumbJsonLd } from '../../../components/JsonLd';
import InsightCards from '../../../components/InsightCards';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const { slug } = await params;
  const author = publishedAuthors.find(author => author.slug === slug);
  if (!author) notFound();
  return generateMetadataFromStrapi(`${author.name} — Auteur Insights | Wharf`, author.bio, author.photo ? { ...author.photo, url: absoluteUrl(author.photo.url) } : undefined, authorPath(slug));
}
export default async function AuthorPage({ params }: Props) {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const { slug } = await params;
  const author = publishedAuthors.find(author => author.slug === slug);
  if (!author) notFound();
  const person = personSchema(author);
  return <main id="main-content" className="insights-page">
    <JsonLd data={[person, { ...webPageSchema({ path: authorPath(slug), title: author.name, description: author.bio, type: 'ProfilePage', dateModified: author.updatedAt }), mainEntity: { '@id': person['@id'] } }]} />
    <BreadcrumbJsonLd items={[{ name: 'Insights', path: '/insights' }, { name: author.name, path: authorPath(slug) }]} />
    <section className="editorial-section"><div className="work-container">
      <nav aria-label="Fil d’Ariane"><Link href="/insights" className="card-split-link">← Tous les articles</Link></nav>
      <p className="editorial-eyebrow">{author.role}</p><h1>{author.name}</h1><p className="editorial-intro">{author.bio}</p>
      {author.photo && <Image src={author.photo.url} alt={author.photo.alt} width={author.photo.width} height={author.photo.height} sizes="(max-width: 760px) 100vw, 400px" style={{ maxWidth: '100%', height: 'auto' }} />}
      <p><strong>Domaines d’expertise :</strong> {author.expertise.join(', ')}.</p>
      <h2>Articles publiés</h2><InsightCards items={articles.filter(article => article.authorId === slug)} headingLevel={3} />
    </div></section>
  </main>;
}
