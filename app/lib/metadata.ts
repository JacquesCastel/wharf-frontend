import type { Metadata } from 'next';
import { SITE_URL, absoluteUrl } from './site';
import { pageSeo } from './editorial';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
type SeoImage = { url?: string; width?: number; height?: number; alternativeText?: string };

/** Shared metadata for CMS-backed and versioned public pages. */
export function generateMetadataFromStrapi(
  seoTitle: string, seoDescription: string, seoImage?: SeoImage | null, path = '/'
): Metadata {
  const title = seoTitle || pageSeo.home.title;
  const description = seoDescription || pageSeo.home.description;
  const ogImage = seoImage?.url ? new URL(seoImage.url, STRAPI_URL).toString() : absoluteUrl('/og');
  const url = absoluteUrl(path);
  return {
    title: { absolute: title }, description, metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: 'Wharf', locale: 'fr_FR', type: 'website',
      images: [{ url: ogImage, width: seoImage?.width || 1200, height: seoImage?.height || 630, alt: seoImage?.alternativeText || title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export const defaultMetadata: Metadata = {
  title: pageSeo.home.title, description: pageSeo.home.description,
  metadataBase: new URL(SITE_URL), creator: 'Wharf', publisher: 'Wharf',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Wharf', title: pageSeo.home.title, description: pageSeo.home.description, images: [{ url: absoluteUrl('/og'), width: 1200, height: 630, alt: 'Wharf — Strategy + Content + Video' }] },
  twitter: { card: 'summary_large_image', title: pageSeo.home.title, description: pageSeo.home.description, images: [absoluteUrl('/og')] },
  robots: { index: true, follow: true },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } : {}),
  },
};
