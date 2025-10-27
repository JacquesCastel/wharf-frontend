import type { Metadata } from 'next';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.170.150';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

/**
 * Génère les métadonnées SEO depuis les données Strapi
 */
export function generateMetadataFromStrapi(
  seoTitle: string,
  seoDescription: string,
  seoImage?: any,
  path: string = ''
): Metadata {
  const title = seoTitle || 'Wharf - Design Narratif';
  const description = seoDescription || 'Design narratif et communication corporate';
  
  // URL de l'image Open Graph
  let ogImage = `${SITE_URL}/og-default.jpg`; // Image par défaut
  
  if (seoImage?.url) {
    ogImage = seoImage.url.startsWith('http') 
      ? seoImage.url 
      : `${STRAPI_URL}${seoImage.url}`;
  }

  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Wharf',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Métadonnées par défaut pour le site
 */
export const defaultMetadata: Metadata = {
  title: {
    default: 'Wharf - Design Narratif & Communication Corporate',
    template: '%s | Wharf',
  },
  description: 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
  metadataBase: new URL(SITE_URL),
  keywords: ['design narratif', 'communication corporate', 'storytelling', 'branding', 'stratégie narrative'],
  authors: [{ name: 'Wharf' }],
  creator: 'Wharf',
  publisher: 'Wharf',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'Wharf',
    title: 'Wharf - Design Narratif & Communication Corporate',
    description: 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wharf - Design Narratif & Communication Corporate',
    description: 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
  },
  robots: {
    index: true,
    follow: true,
  },
};