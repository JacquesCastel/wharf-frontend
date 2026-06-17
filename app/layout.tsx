import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import Footer from './components/Footer'
import AccessibilityWidget from './components/AccessibilityWidget'
import './globals.css'
import HeaderWrapper from './components/HeaderWrapper';
import { OrganizationJsonLd, WebSiteJsonLd } from './components/JsonLd';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "Wharf - Design Narratif",
  description: "Agence de design narratif et de production audiovisuelle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700;1,6..96,400;1,6..96,500&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HeaderWrapper />
        {children}
        <SpeedInsights />
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
