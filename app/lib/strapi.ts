// lib/strapi.ts
// Service pour communiquer avec Strapi

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.170.150:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

/**
 * Récupère les données du Footer depuis Strapi
 */
export async function getFooter() {
  try {
    // On fait plusieurs appels pour récupérer toutes les données
    const baseUrl = `${STRAPI_URL}/api/footer`;
    
    // 1. Récupérer les données de base + logo
    const baseResponse = await fetch(`${baseUrl}?populate=logo`, {
      next: { revalidate: 60 } // Cache pendant 60 secondes
    });
    
    if (!baseResponse.ok) {
      throw new Error('Failed to fetch footer');
    }
    
    const baseData: StrapiResponse<any> = await baseResponse.json();
    
    // 2. Récupérer les sections séparément
    const sectionsResponse = await fetch(`${baseUrl}?populate[sections][populate]=liens`, {
      next: { revalidate: 60 }
    });
    
    let sectionsData = baseData.data.sections || [];
    
    if (sectionsResponse.ok) {
      const sectionsJson: StrapiResponse<any> = await sectionsResponse.json();
      if (sectionsJson.data?.sections) {
        sectionsData = sectionsJson.data.sections;
      }
    }
    
    // Construire l'objet Footer complet
    return {
      logo: baseData.data.logo ? {
        url: `${STRAPI_URL}${baseData.data.logo.url}`,
        alternativeText: baseData.data.logo.alternativeText || 'Wharf Logo',
        width: baseData.data.logo.width,
        height: baseData.data.logo.height
      } : null,
      email: baseData.data.email,
      telephone: baseData.data.telephone,
      sections: sectionsData.map((section: any) => ({
        titre: section.titre,
        liens: section.liens || []
      }))
    };
  } catch (error) {
    console.error('Error fetching footer:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      logo: null,
      email: 'contact@bywharf.com',
      telephone: '06',
      sections: [
        {
          titre: 'Navigation',
          liens: [
            { texte: 'WE', url: '/we' },
            { texte: 'WORK', url: '/work' },
            { texte: 'YOU', url: '/you' },
            { texte: 'Contact', url: '/contact' }
          ]
        },
        {
          titre: 'Ressources',
          liens: [
            { texte: 'Accessibilité', url: '/accessibilite' },
            { texte: 'Notre engagement', url: '/accessibilite/engagement' }
          ]
        },
        {
          titre: 'Contact',
          liens: [
            { texte: 'Email', url: 'mailto:contact@bywharf.com' }
          ]
        }
      ]
    };
  }
}

/**
 * Type pour le Footer
 */
export interface FooterData {
  logo: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | null;
  email: string;
  telephone: string;
  sections: {
    titre: string;
    liens: {
      texte: string;
      url: string;
    }[];
  }[];
}

/**
 * Récupère les données de la Navigation depuis Strapi
 */
export async function getNavigation() {
  try {
    const baseUrl = `${STRAPI_URL}/api/navigation`;
    console.log('Fetching from:', baseUrl); // LOG 1
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch navigation');
    }
    
    const data: StrapiResponse<any> = await response.json();
    console.log('Navigation data received:', data.data); // LOG 2
    console.log('Link data:', data.data.Link); // LOG 3
    
    
    // Construire l'objet Navigation complet
    return {
      logo: data.data.logo ? {
        url: `${STRAPI_URL}${data.data.logo.url}`,
        alternativeText: data.data.logo.alternativeText || 'Wharf Logo',
        width: data.data.logo.width,
        height: data.data.logo.height
      } : null,
      liens: data.data.Link || [],
      cta_text: data.data.cta_text || 'Contact',
      cta_url: data.data.cta_url || '/contact'
    };
  } catch (error) {
    console.error('Error fetching navigation:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      logo: null,
      liens: [
        { texte: 'WE', url: '/we' },
        { texte: 'WORK', url: '/work' },
        { texte: 'YOU', url: '/you' },
        { texte: 'CONTACT', url: '/contact' }
      ],
      cta_text: 'Contact',
      cta_url: '/contact'
    };
  }
}

/**
 * Type pour la Navigation
 */
export interface NavigationData {
  logo: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | null;
  liens: {
    texte: string;
    url: string;
  }[];
  cta_text: string;
  cta_url: string;
}


/**
 * Récupère les données de la page Home depuis Strapi
 */
export async function getHome() {
  try {
    const baseUrl = `${STRAPI_URL}/api/page-home`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch home page');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    // Construire l'objet Home complet
    return {
      hero: {
        titre: data.data.hero_titre || '',
        baseline: data.data.hero_baseline || '',
        video: data.data.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      blocs: {
        we: {
          titre: data.data.bloc_we_titre || 'WE',
          description: data.data.bloc_we_description || '',
          lien: '/we'
        },
        work: {
          titre: data.data.bloc_work_titre || 'WORK',
          description: data.data.bloc_work_description || '',
          lien: '/work'
        },
        you: {
          titre: data.data.bloc_you_titre || 'YOU',
          description: data.data.bloc_you_description || '',
          lien: '/you'
        }
      },
      manifesto: {
        texte: data.data.manifesto_texte || ''
      },
      cta: {
        texte: data.data.cta_texte || '',
        lien: data.data.cta_lien || '/contact'
      },
      seo: {
        title: data.data.seo_title || '',
        description: data.data.seo_description || '',
        image: data.data.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching home page:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      hero: {
        titre: 'Donner du sens à votre communication',
        baseline: 'Design narratif et communication corporate',
        video: null
      },
      blocs: {
        we: {
          titre: 'WE',
          description: 'Notre vision du design narratif',
          lien: '/we'
        },
        work: {
          titre: 'WORK',
          description: 'Notre approche méthodologique',
          lien: '/work'
        },
        you: {
          titre: 'YOU',
          description: 'Vos situations, nos solutions',
          lien: '/you'
        }
      },
      manifesto: {
        texte: 'Nous croyons au pouvoir des histoires pour transformer la communication corporate.'
      },
      cta: {
        texte: 'Prêt à donner du sens à votre communication ?',
        lien: '/contact'
      }
    };
  }
}

/**
 * Type pour la page Home
 */
export interface HomeData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  blocs: {
    we: {
      titre: string;
      description: string;
      lien: string;
    };
    work: {
      titre: string;
      description: string;
      lien: string;
    };
    you: {
      titre: string;
      description: string;
      lien: string;
    };
  };
  manifesto: {
    texte: string;
  };
  cta: {
    texte: string;
    lien: string;
  };
  seo: {
    title: string;
    description: string;
    image: any;
  };
}

/**
 * Fonction utilitaire pour convertir les Strapi Blocks en HTML
 */
const blocksToHtml = (blocks: any): string => {
  // Vérifier que blocks existe et est un array
  if (!blocks || !Array.isArray(blocks)) {
    console.warn('blocksToHtml: blocks is not an array', blocks);
    return '';
  }
  
  try {
    return blocks.map((block: any) => {
      if (!block || !block.type) return '';
      
      switch (block.type) {
        case 'paragraph':
          if (!block.children || !Array.isArray(block.children)) return '';
          return `<p>${block.children.map((child: any) => {
            if (!child || !child.text) return '';
            let text = child.text;
            if (child.bold) text = `<strong>${text}</strong>`;
            if (child.italic) text = `<em>${text}</em>`;
            if (child.underline) text = `<u>${text}</u>`;
            return text;
          }).join('')}</p>`;
        
        case 'heading':
          if (!block.children || !Array.isArray(block.children)) return '';
          const level = block.level || 2;
          return `<h${level}>${block.children.map((child: any) => child?.text || '').join('')}</h${level}>`;
        
        case 'list':
          if (!block.children || !Array.isArray(block.children)) return '';
          const listType = block.format === 'ordered' ? 'ol' : 'ul';
          return `<${listType}>${block.children.map((item: any) => {
            if (!item || !item.children) return '<li></li>';
            return `<li>${item.children.map((child: any) => child?.text || '').join('')}</li>`;
          }).join('')}</${listType}>`;
        
        case 'quote':
          if (!block.children || !Array.isArray(block.children)) return '';
          return `<blockquote>${block.children.map((child: any) => child?.text || '').join('')}</blockquote>`;
        
        case 'code':
          if (!block.children || !Array.isArray(block.children)) return '';
          return `<pre><code>${block.children.map((child: any) => child?.text || '').join('')}</code></pre>`;
        
        default:
          return '';
      }
    }).join('');
  } catch (err) {
    console.error('Error in blocksToHtml:', err);
    return '';
  }
};

/**
 * Récupère les données de la page WE depuis Strapi
 */
export async function getWe() {
  try {
    const baseUrl = `${STRAPI_URL}/api/page-we`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch we page');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    console.log('WE Data from Strapi:', data.data);
    
    // Construire l'objet WE complet - Format attendu par la page
    return {
      hero: {
        titre: data.data?.hero_titre || 'Notre approche',
        baseline: data.data?.hero_baseline || 'WE',
        video: data.data?.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      actes: {
        acte1: {
          numero: 1,
          titre: data.data?.acte1_titre || 'Intention',
          contenu: blocksToHtml(data.data?.acte1_contenu)
        },
        acte2: {
          numero: 2,
          titre: data.data?.acte2_titre || 'Perception',
          contenu: blocksToHtml(data.data?.acte2_contenu)
        },
        acte3: {
          numero: 3,
          titre: data.data?.acte3_titre || 'Réalignement',
          contenu: blocksToHtml(data.data?.acte3_contenu)
        }
      },
      transition: {
        texte: data.data?.transition_texte || 'La où la stratégie rencontre la création'
      },
      piliers: {
        pilier1: {
          titre: data.data?.pilier1_titre || 'Pilier 1',
          contenu: blocksToHtml(data.data?.pilier1_contenu)
        },
        pilier2: {
          titre: data.data?.pilier2_titre || 'Pilier 2',
          contenu: blocksToHtml(data.data?.pilier2_contenu)
        }
      },
      manifesto: {
        texte: blocksToHtml(data.data?.manifesto_texte)
      },
      manifesto_pdf: data.data?.manifesto_pdf ? {
        url: `${STRAPI_URL}${data.data.manifesto_pdf.url}`,
        name: data.data.manifesto_pdf.name
      } : null,
      closing: {
        titre: data.data?.closing_titre || 'Travaillons ensemble',
        description: data.data?.closing_description || '',
        lien: data.data?.closing_lien || '/contact',
        texte_bouton: data.data?.closing_texte_bouton || 'Découvrir nos services →'
      },
      seo: {
        title: data.data?.seo_title || '',
        description: data.data?.seo_description || '',
        image: data.data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching we page:', error);
    // Retourner des données par défaut
    return {
      hero: {
        titre: 'Notre approche',
        baseline: 'WE',
        video: null
      },
      actes: {
        acte1: { numero: 1, titre: 'Intention', contenu: '' },
        acte2: { numero: 2, titre: 'Perception', contenu: '' },
        acte3: { numero: 3, titre: 'Réalignement', contenu: '' }
      },
      transition: {
        texte: 'La où la stratégie rencontre la création'
      },
      piliers: {
        pilier1: { titre: 'Pilier 1', contenu: '' },
        pilier2: { titre: 'Pilier 2', contenu: '' }
      },
      manifesto: {
        texte: ''
      },
      manifesto_pdf: null,
      closing: {
        titre: 'Travaillons ensemble',
        description: '',
        lien: '/contact',
        texte_bouton: 'Découvrir nos services →'
      },
      seo: {
        title: '',
        description: '',
        image: null
      }
    };
  }
}

/**
 * Type pour la page WE
 */
export interface WeData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  actes: {
    acte1: {
      numero: number;
      titre: string;
      contenu: string;
    };
    acte2: {
      numero: number;
      titre: string;
      contenu: string;
    };
    acte3: {
      numero: number;
      titre: string;
      contenu: string;
    };
  };
  transition: {
    texte: string;
  };
  piliers: {
    pilier1: {
      titre: string;
      contenu: string;
    };
    pilier2: {
      titre: string;
      contenu: string;
    };
  };
  manifesto: {
    texte: string;
  };
  manifesto_pdf: {
    url: string;
    name: string;
  } | null;
  closing: {
    titre: string;
    description: string;
    lien: string;
    texte_bouton: string;
  };
  seo: {
    title: string;
    description: string;
    image: any;
  };
}

/**
 * Récupère les données de la page WORK depuis Strapi
 */
export async function getWork() {
  try {
    const baseUrl = `${STRAPI_URL}/api/page-work`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch work page');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    console.log('WORK Data from Strapi:', data.data);
    
    // Construire l'objet WORK complet
    return {
      hero: {
        titre: data.data?.hero_titre || 'Comment travaillons-nous ?',
        baseline: data.data?.hero_baseline || 'WORK',
        video: data.data?.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        paragraphe1: data.data?.intro_paragraphe1 || '',
        paragraphe2: data.data?.intro_paragraphe2 || '',
        highlight: data.data?.intro_highlight || ''
      },
      methode: {
        titre: data.data?.methode_titre || 'Notre méthode',
        intro: data.data?.methode_intro || '',
        mouvements: [
          {
            numero: 1,
            titre: data.data?.mouvement1_titre || '',
            description: blocksToHtml(data.data?.mouvement1_description)
          },
          {
            numero: 2,
            titre: data.data?.mouvement2_titre || '',
            description: blocksToHtml(data.data?.mouvement2_description)
          },
          {
            numero: 3,
            titre: data.data?.mouvement3_titre || '',
            description: blocksToHtml(data.data?.mouvement3_description)
          }
        ]
      },
      expertises: {
        titre: data.data?.expertises_titre || 'Nos expertises',
        expertise1: {
          titre: data.data?.expertise1_titre || 'Conseil stratégique',
          subtitle: data.data?.expertise1_subtitle || 'formuler le sens',
          description: blocksToHtml(data.data?.expertise1_description),
          liste: blocksToHtml(data.data?.expertise1_liste)
        },
        expertise2: {
          titre: data.data?.expertise2_titre || 'Création audiovisuelle',
          subtitle: data.data?.expertise2_subtitle || 'donner corps au récit',
          description: blocksToHtml(data.data?.expertise2_description),
          liste: blocksToHtml(data.data?.expertise2_liste)
        }
      },
      closing: {
        titre: data.data?.closing_titre || 'Travaillons ensemble',
        texte: blocksToHtml(data.data?.closing_texte),
        subtext: data.data?.closing_subtext || 'Parlons-en.',
        lien: data.data?.closing_lien || '/contact',
        texte_bouton: data.data?.closing_texte_bouton || "Let's work together →"
      },
      seo: {
        title: data.data?.seo_title || '',
        description: data.data?.seo_description || '',
        image: data.data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching work page:', error);
    // Retourner des données par défaut
    return {
      hero: {
        titre: 'Comment travaillons-nous ?',
        baseline: 'WORK',
        video: null
      },
      intro: {
        paragraphe1: '',
        paragraphe2: '',
        highlight: ''
      },
      methode: {
        titre: 'Notre méthode',
        intro: '',
        mouvements: [
          { numero: 1, titre: '', description: '' },
          { numero: 2, titre: '', description: '' },
          { numero: 3, titre: '', description: '' }
        ]
      },
      expertises: {
        titre: 'Nos expertises',
        expertise1: {
          titre: 'Conseil stratégique',
          subtitle: 'formuler le sens',
          description: '',
          liste: ''
        },
        expertise2: {
          titre: 'Création audiovisuelle',
          subtitle: 'donner corps au récit',
          description: '',
          liste: ''
        }
      },
      closing: {
        titre: 'Travaillons ensemble',
        texte: '',
        subtext: 'Parlons-en.',
        lien: '/contact',
        texte_bouton: "Let's work together →"
      },
      seo: {
        title: '',
        description: '',
        image: null
      }
    };
  }
}

/**
 * Type pour la page WORK
 */
export interface WorkData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  intro: {
    paragraphe1: string;
    paragraphe2: string;
    highlight: string;
  };
  methode: {
    titre: string;
    intro: string;
    mouvements: {
      numero: number;
      titre: string;
      description: string;
    }[];
  };
  expertises: {
    titre: string;
    expertise1: {
      titre: string;
      subtitle: string;
      description: string;
      liste: string;
    };
    expertise2: {
      titre: string;
      subtitle: string;
      description: string;
      liste: string;
    };
  };
  closing: {
    titre: string;
    texte: string;
    subtext: string;
    lien: string;
    texte_bouton: string;
  };
  seo: {
    title: string;
    description: string;
    image: any;
  };
}

/**
 * Récupère les données de la page YOU depuis Strapi
 */
export async function getYou() {
  try {
    const baseUrl = `${STRAPI_URL}/api/page-you`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch you page');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    // Construire l'objet YOU complet
    return {
      hero: {
        titre: data.data.hero_titre || 'Votre situation',
        baseline: data.data.hero_baseline || 'Trouver l\'approche qui vous correspond',
        video: data.data.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data.data.intro_titre || 'Le commencement du dialogue',
        paragraphe1: data.data.intro_paragraphe1 || '',
        paragraphe2: data.data.intro_paragraphe2 || ''
      },
      comprendre: {
        titre: data.data.comprendre_titre || 'Ce que nous aimons comprendre',
        items: [
          {
            titre: data.data.comprendre_item1_titre || '',
            texte: data.data.comprendre_item1_texte || ''
          },
          {
            titre: data.data.comprendre_item2_titre || '',
            texte: data.data.comprendre_item2_texte || ''
          },
          {
            titre: data.data.comprendre_item3_titre || '',
            texte: data.data.comprendre_item3_texte || ''
          }
        ],
        conclusion: data.data.comprendre_conclusion || ''
      },
      situations: {
        titre: data.data.situations_titre || 'Quelle est votre situation ?',
        liste: (data.data.situations || []).sort((a: any, b: any) => a.numero - b.numero)
      },
      approche: {
        titre: data.data.approche_titre || 'Comment nous travaillons ensemble',
        intro: data.data.approche_intro || '',
        detail: data.data.approche_detail || ''
      },
      closing: {
        titre: data.data.closing_titre || 'Prenons le temps d\'en parler',
        texte: data.data.closing_texte || '',
        lien: data.data.closing_lien || '/contact',
        texte_bouton: data.data.closing_texte_bouton || 'Démarrer la conversation →'
      },
      seo: {
        title: data.data.seo_title || '',
        description: data.data.seo_description || '',
        image: data.data.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching you page:', error);
    // Retourner des données par défaut
    return {
      hero: {
        titre: 'Votre situation',
        baseline: 'Trouver l\'approche qui vous correspond',
        video: null
      },
      intro: {
        titre: 'Le commencement du dialogue',
        paragraphe1: '',
        paragraphe2: ''
      },
      comprendre: {
        titre: 'Ce que nous aimons comprendre',
        items: [
          { titre: 'Ce que vous voulez dire', texte: '' },
          { titre: 'Ce que vous vivez', texte: '' },
          { titre: 'Ce que vous incarnez', texte: '' }
        ],
        conclusion: ''
      },
      situations: {
        titre: 'Quelle est votre situation ?',
        liste: []
      },
      approche: {
        titre: 'Comment nous travaillons ensemble',
        intro: '',
        detail: ''
      },
      closing: {
        titre: 'Prenons le temps d\'en parler',
        texte: '',
        lien: '/contact',
        texte_bouton: 'Démarrer la conversation →'
      }
    };
  }
}

/**
 * Type pour la page YOU
 */
export interface YouData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  intro: {
    titre: string;
    paragraphe1: string;
    paragraphe2: string;
  };
  comprendre: {
    titre: string;
    items: {
      titre: string;
      texte: string;
    }[];
    conclusion: string;
  };
  situations: {
    titre: string;
    liste: {
      numero: number;
      titre: string;
      description: string;
    }[];
  };
  approche: {
    titre: string;
    intro: string;
    detail: string;
  };
  closing: {
    titre: string;
    texte: string;
    lien: string;
    texte_bouton: string;
  };
  seo: {
    title: string;
    description: string;
    image: any;
  };
}

/**
 * Récupère les données de la page CONTACT depuis Strapi
 */
export async function getContact() {
  try {
    const baseUrl = `${STRAPI_URL}/api/page-contact`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contact page');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    // Construire l'objet CONTACT complet
    return {
      hero: {
        titre: data.data.hero_titre || 'Parlons-en',
        baseline: data.data.hero_baseline || 'Prenons le temps de discuter de votre projet',
        video: data.data.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data.data.intro_titre || 'Le commencement d\'une collaboration',
        texte: data.data.intro_texte || ''
      },
      closing: {
        titre: data.data.closing_titre || 'Vous préférez simplement prendre un café ?',
        texte: data.data.closing_texte || 'Nous sommes à votre disposition pour discuter.',
        email: data.data.closing_email || 'contact@bywharf.com'
      },
      seo: {
        title: data.data.seo_title || '',
        description: data.data.seo_description || '',
        image: data.data.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching contact page:', error);
    // Retourner des données par défaut
    return {
      hero: {
        titre: 'Parlons-en',
        baseline: 'Prenons le temps de discuter de votre projet',
        video: null
      },
      intro: {
        titre: 'Le commencement d\'une collaboration',
        texte: 'Vous avez une histoire à raconter, une transformation à rendre visible, un récit à faire vivre.'
      },
      closing: {
        titre: 'Vous préférez simplement prendre un café ?',
        texte: 'Nous sommes à votre disposition pour discuter.',
        email: 'contact@bywharf.com'
      }
    };
  }
}

/**
 * Type pour la page CONTACT
 */
export interface ContactData {
  hero: {
    titre: string;
    baseline: string;
    video: {
      url: string;
      alternativeText: string;
    } | null;
  };
  intro: {
    titre: string;
    texte: string;
  };
  closing: {
    titre: string;
    texte: string;
    email: string;
  };
  seo: {
    title: string;
    description: string;
    image: any;
  };
}