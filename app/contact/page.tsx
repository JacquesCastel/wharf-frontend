// PAS de 'use client' ici
import type { Metadata } from 'next';
import ContactClient from './ContactPage.client';

export const metadata: Metadata = {
  title: 'Contact - Parlons de votre projet - Wharf',
  description:
    "Contactez Wharf pour discuter de votre projet de communication narrative. Prenons le temps d'en parler.",
  openGraph: {
    title: 'Contact - Wharf',
    description:
      "Contactez Wharf pour discuter de votre projet de communication narrative. Prenons le temps d'en parler.",
    url: 'https://bywharf.com/contact',
    type: 'website',
  },
};

export default function Page() {
  return <ContactClient />;
}
