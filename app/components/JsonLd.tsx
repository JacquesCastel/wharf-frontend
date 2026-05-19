const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bywharf.com';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wharf',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-wharf.png`,
    description: 'Wharf révèle et exprime le sens profond des entreprises à travers le design narratif.',
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
      'Storytelling',
      'Branding',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wharf',
    url: SITE_URL,
    description: 'Agence de design narratif et de production audiovisuelle.',
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/work?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
