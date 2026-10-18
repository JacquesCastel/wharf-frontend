import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { defaultMetadata } from './lib/metadata';
import Footer from './components/Footer'
import Measurement from './components/Measurement';
import { getInsights } from './lib/cms-content';
import { getPublishedProjects } from './lib/projects';
import { articlePath, formatPath } from './lib/insights';
import { authorPath } from './lib/insights-authors';
import './measurement.css';
import AccessibilityWidget from './components/AccessibilityWidget'
import './globals.css'
import './wharf-ui.css'
import './wharf-motion.css'
import './wharf-footer.css'
import HeaderWrapper from './components/HeaderWrapper';
import { OrganizationJsonLd, WebSiteJsonLd } from './components/JsonLd';
import { lora, bodoni, playfair, plexSans, plexMono } from './lib/fonts';
export const dynamic = 'force-dynamic';
export const metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { articles, publishedTopics, publishedFormats, publishedAuthors } = await getInsights();
  const projects = await getPublishedProjects() ?? [];
  const paths = ['/', '/we', '/work', '/agence-audiovisuelle-paris', '/you', '/contact', '/insights', '/accessibilite', '/accessibilite/engagement', '/confidentialite', ...articles.map(articlePath), ...publishedTopics.map(topic => `/insights/${topic.slug}`), ...publishedFormats.map(format => formatPath(format.slug)), ...publishedAuthors.map(author => authorPath(author.slug)), ...projects.map(project => `/work/${project.documentId}`)];
  return (
    <html lang="fr" className={`${lora.variable} ${bodoni.variable} ${playfair.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body>
        <HeaderWrapper />
        {children}
        {process.env.VERCEL === '1' && <SpeedInsights />}
        <Footer />
        <AccessibilityWidget />
        <Suspense fallback={null}><Measurement websiteId={process.env.UMAMI_WEBSITE_ID} paths={paths} /></Suspense>
      </body>
    </html>
  );
}
