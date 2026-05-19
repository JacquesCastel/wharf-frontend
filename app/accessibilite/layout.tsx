import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

export const metadata: Metadata = {
  title: 'Accessibilité - Personnalisez votre navigation | Wharf',
  description: "Adaptez votre expérience de navigation sur bywharf.com : taille de police, contraste, interlignage et plus. Wharf s'engage pour un web accessible à tous.",
  alternates: {
    canonical: `${SITE_URL}/accessibilite`,
  },
  openGraph: {
    title: 'Accessibilité - Personnalisez votre navigation | Wharf',
    description: "Adaptez votre expérience de navigation sur bywharf.com. Wharf s'engage pour un web accessible à tous.",
    url: `${SITE_URL}/accessibilite`,
    siteName: 'Wharf',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: 'Accessibilité Wharf' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accessibilité - Personnalisez votre navigation | Wharf',
    description: "Adaptez votre expérience de navigation sur bywharf.com. Wharf s'engage pour un web accessible à tous.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function AccessibiliteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
