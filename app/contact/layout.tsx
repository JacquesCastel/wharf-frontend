import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

export const metadata: Metadata = {
  title: 'Contact - Parlons de votre projet | Wharf',
  description: 'Discutons de votre projet. Wharf vous accompagne dans la construction de votre récit de marque à travers le design narratif et la production audiovisuelle.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact - Parlons de votre projet | Wharf',
    description: 'Discutons de votre projet. Wharf vous accompagne dans la construction de votre récit de marque.',
    url: `${SITE_URL}/contact`,
    siteName: 'Wharf',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: 'Contact Wharf' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Parlons de votre projet | Wharf',
    description: 'Discutons de votre projet. Wharf vous accompagne dans la construction de votre récit de marque.',
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
