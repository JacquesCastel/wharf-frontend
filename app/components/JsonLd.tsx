const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wharf',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-wharf.png`,
    description: 'Wharf accompagne les entreprises dans leur communication corporate, de la stratégie éditoriale à la production vidéo B2B.',
    foundingLocation: {
      '@type': 'Place',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@bywharf.com',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [],
    serviceArea: {
      '@type': 'Country',
      name: 'France',
    },
    knowsAbout: [
      'Design narratif',
      'Communication corporate',
      'Stratégie de marque',
      'Production audiovisuelle',
      'Contenus B2B',
      'Stratégie éditoriale',
      'Storytelling',
      'Branding',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wharf',
    url: SITE_URL,
    description: 'Agence de contenus et de production vidéo B2B. STRATEGY + CONTENT + VIDEO.',
    inLanguage: 'fr-FR',

  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export function ProjectJsonLd({
  titre,
  description,
  image,
  url,
  datePublished,
  client,
}: {
  titre: string;
  description?: string;
  image?: string;
  url: string;
  datePublished?: string;
  client?: string;
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: titre,
    url,
    creator: {
      '@type': 'Organization',
      name: 'Wharf',
      url: SITE_URL,
    },
    inLanguage: 'fr-FR',
  };

  if (description) schema.description = description;
  if (image) schema.image = image;
  if (datePublished) schema.datePublished = datePublished;
  if (client) schema.contributor = { '@type': 'Organization', name: client };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
