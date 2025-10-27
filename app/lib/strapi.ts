// lib/strapi.ts
// Service pour communiquer avec Strapi

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.170.150';

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

/**
 * Fonction utilitaire pour convertir les Strapi Blocks en HTML
 * Gère tous les cas edge (null, undefined, etc.)
 */
function blocksToHtml(blocks: any): string {
  // Vérifier que blocks existe et est un array
  if (!blocks) return '';
  if (!Array.isArray(blocks)) {
    console.warn('blocksToHtml: blocks is not an array, received:', typeof blocks);
    return '';
  }
  
  if (blocks.length === 0) return '';
  
  try {
    return blocks.map((block: any) => {
      if (!block || typeof block !== 'object') return '';
      
      const blockType = block.type;
      
      if (!blockType) return '';
      
      switch (blockType) {
        case 'paragraph': {
          if (!Array.isArray(block.children) || block.children.length === 0) {
            return '<p></p>';
          }
          const text = block.children
            .map((child: any) => {
              if (!child || typeof child.text !== 'string') return '';
              let result = child.text;
              
              // Appliquer les formats
              if (child.bold) result = `<strong>${result}</strong>`;
              if (child.italic) result = `<em>${result}</em>`;
              if (child.underline) result = `<u>${result}</u>`;
              if (child.code) result = `<code>${result}</code>`;
              if (child.strikethrough) result = `<s>${result}</s>`;
              
              return result;
            })
            .join('');
          
          return `<p>${text}</p>`;
        }
        
        case 'heading': {
          if (!Array.isArray(block.children) || block.children.length === 0) {
            return '';
          }
          const level = Math.min(Math.max(block.level || 2, 1), 6); // Limite entre h1 et h6
          const text = block.children
            .map((child: any) => child?.text || '')
            .join('');
          return `<h${level}>${text}</h${level}>`;
        }
        
        case 'list': {
          if (!Array.isArray(block.children) || block.children.length === 0) {
            return '';
          }
          const isOrdered = block.format === 'ordered';
          const listType = isOrdered ? 'ol' : 'ul';
          const items = block.children
            .map((item: any) => {
              if (!item || !Array.isArray(item.children)) return '<li></li>';
              const itemText = item.children
                .map((child: any) => child?.text || '')
                .join('');
              return `<li>${itemText}</li>`;
            })
            .join('');
          return `<${listType}>${items}</${listType}>`;
        }
        
        case 'quote': {
          if (!Array.isArray(block.children) || block.children.length === 0) {
            return '';
          }
          const text = block.children
            .map((child: any) => child?.text || '')
            .join('');
          return `<blockquote>${text}</blockquote>`;
        }
        
        case 'code': {
          if (!Array.isArray(block.children) || block.children.length === 0) {
            return '';
          }
          const code = block.children
            .map((child: any) => child?.text || '')
            .join('\n');
          const language = block.language || 'plain';
          return `<pre><code class="language-${language}">${code}</code></pre>`;
        }
        
        case 'image': {
          if (!block.image) return '';
          const url = block.image.url?.startsWith('http') 
            ? block.image.url 
            : `${STRAPI_URL}${block.image.url}`;
          const alt = block.image.alternativeText || 'Image';
          const caption = block.children?.map((c: any) => c.text).join('') || '';
          
          if (caption) {
            return `<figure><img src="${url}" alt="${alt}" /><figcaption>${caption}</figcaption></figure>`;
          }
          return `<img src="${url}" alt="${alt}" />`;
        }
        
        default:
          console.warn(`Unknown block type: ${blockType}`);
          return '';
      }
    }).join('');
  } catch (error) {
    console.error('Error converting blocks to HTML:', error);
    return '';
  }
}

/**
 * Récupère les données du Footer depuis Strapi
 */
export async function getFooter() {
  try {
    const baseUrl = `${STRAPI_URL}/api/footer`;
    
    const baseResponse = await fetch(`${baseUrl}?populate=*`, {
      next: { revalidate: 60 }
    });
    
    if (!baseResponse.ok) {
      throw new Error('Failed to fetch footer');
    }
    
    const baseData: StrapiResponse<any> = await baseResponse.json();
    
    return {
      logo: baseData.data?.logo ? {
        url: `${STRAPI_URL}${baseData.data.logo.url}`,
        alternativeText: baseData.data.logo.alternativeText || 'Wharf Logo',
        width: baseData.data.logo.width,
        height: baseData.data.logo.height
      } : null,
      email: baseData.data?.email,
      telephone: baseData.data?.telephone,
      sections: (baseData.data?.sections || []).map((section: any) => ({
        titre: section.titre,
        liens: section.liens || []
      }))
    };
  } catch (error) {
    console.error('Error fetching footer:', error);
    return {
      logo: null,
      email: 'contact@bywharf.com',
      telephone: '06',
      sections: []
    };
  }
}

/**
 * Récupère les données de la Navigation depuis Strapi
 */
export async function getNavigation() {
  try {
    const baseUrl = `${STRAPI_URL}/api/navigation`;
    
    const response = await fetch(`${baseUrl}?populate=*`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch navigation');
    }
    
    const data: StrapiResponse<any> = await response.json();
    
    return {
      logo: data.data?.logo ? {
        url: `${STRAPI_URL}${data.data.logo.url}`,
        alternativeText: data.data.logo.alternativeText || 'Wharf Logo',
        width: data.data.logo.width,
        height: data.data.logo.height
      } : null,
      liens: data.data?.Link || [],
      cta_text: data.data?.cta_text || 'Contact',
      cta_url: data.data?.cta_url || '/contact'
    };
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return {
      logo: null,
      liens: [],
      cta_text: 'Contact',
      cta_url: '/contact'
    };
  }
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
    
    return {
      hero: {
        titre: data.data?.hero_titre || '',
        baseline: data.data?.hero_baseline || '',
        video: data.data?.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      blocs: {
        we: {
          titre: data.data?.bloc_we_titre || 'WE',
          description: data.data?.bloc_we_description || '',
          lien: '/we'
        },
        work: {
          titre: data.data?.bloc_work_titre || 'WORK',
          description: data.data?.bloc_work_description || '',
          lien: '/work'
        },
        you: {
          titre: data.data?.bloc_you_titre || 'YOU',
          description: data.data?.bloc_you_description || '',
          lien: '/you'
        }
      },
      manifesto: {
        texte: blocksToHtml(data.data?.manifesto_texte) || data.data?.manifesto_texte || ''
      },
      cta: {
        texte: data.data?.cta_texte || '',
        lien: data.data?.cta_lien || '/contact'
      },
      seo: {
        title: data.data?.seo_title || '',
        description: data.data?.seo_description || '',
        image: data.data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching home page:', error);
    return {
      hero: { titre: '', baseline: '', video: null },
      blocs: {
        we: { titre: 'WE', description: '', lien: '/we' },
        work: { titre: 'WORK', description: '', lien: '/work' },
        you: { titre: 'YOU', description: '', lien: '/you' }
      },
      manifesto: { texte: '' },
      cta: { texte: '', lien: '/contact' }
    };
  }
}

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
    
    console.log('WE Data received:', {
      acte1_titre: data.data?.acte1_titre,
      acte1_contenu_length: Array.isArray(data.data?.acte1_contenu) ? data.data.acte1_contenu.length : 'not array',
      hero_titre: data.data?.hero_titre
    });
    
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
          titre: data.data?.acte1_titre || 'Acte 1',
          contenu: blocksToHtml(data.data?.acte1_contenu)
        },
        acte2: {
          numero: 2,
          titre: data.data?.acte2_titre || 'Acte 2',
          contenu: blocksToHtml(data.data?.acte2_contenu)
        },
        acte3: {
          numero: 3,
          titre: data.data?.acte3_titre || 'Acte 3',
          contenu: blocksToHtml(data.data?.acte3_contenu)
        }
      },
      transition: {
        texte: data.data?.transition_texte || 'Là où la stratégie rencontre la création'
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
    return {
      hero: { titre: 'Notre approche', baseline: 'WE', video: null },
      actes: {
        acte1: { numero: 1, titre: 'Intention', contenu: '' },
        acte2: { numero: 2, titre: 'Perception', contenu: '' },
        acte3: { numero: 3, titre: 'Réalignement', contenu: '' }
      },
      transition: { texte: 'Là où la stratégie rencontre la création' },
      piliers: {
        pilier1: { titre: 'Pilier 1', contenu: '' },
        pilier2: { titre: 'Pilier 2', contenu: '' }
      },
      manifesto: { texte: '' },
      manifesto_pdf: null,
      closing: { titre: 'Travaillons ensemble', description: '', lien: '/contact', texte_bouton: 'Découvrir nos services →' }
    };
  }
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
    return {
      hero: { titre: 'Comment travaillons-nous ?', baseline: 'WORK', video: null },
      intro: { paragraphe1: '', paragraphe2: '', highlight: '' },
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
        expertise1: { titre: 'Conseil stratégique', subtitle: 'formuler le sens', description: '', liste: '' },
        expertise2: { titre: 'Création audiovisuelle', subtitle: 'donner corps au récit', description: '', liste: '' }
      },
      closing: { titre: 'Travaillons ensemble', texte: '', subtext: 'Parlons-en.', lien: '/contact', texte_bouton: 'Let\'s work together →' }
    };
  }
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
    
    return {
      hero: {
        titre: data.data?.hero_titre || 'Votre situation',
        baseline: data.data?.hero_baseline || 'Trouver l\'approche qui vous correspond',
        video: data.data?.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data.data?.intro_titre || 'Le commencement du dialogue',
        paragraphe1: data.data?.intro_paragraphe1 || '',
        paragraphe2: data.data?.intro_paragraphe2 || ''
      },
      comprendre: {
        titre: data.data?.comprendre_titre || 'Ce que nous aimons comprendre',
        items: [
          {
            titre: data.data?.comprendre_item1_titre || '',
            texte: data.data?.comprendre_item1_texte || ''
          },
          {
            titre: data.data?.comprendre_item2_titre || '',
            texte: data.data?.comprendre_item2_texte || ''
          },
          {
            titre: data.data?.comprendre_item3_titre || '',
            texte: data.data?.comprendre_item3_texte || ''
          }
        ],
        conclusion: data.data?.comprendre_conclusion || ''
      },
      situations: {
        titre: data.data?.situations_titre || 'Quelle est votre situation ?',
        liste: (data.data?.situations || []).sort((a: any, b: any) => a.numero - b.numero)
      },
      approche: {
        titre: data.data?.approche_titre || 'Comment nous travaillons ensemble',
        intro: data.data?.approche_intro || '',
        detail: data.data?.approche_detail || ''
      },
      closing: {
        titre: data.data?.closing_titre || 'Prenons le temps d\'en parler',
        texte: data.data?.closing_texte || '',
        lien: data.data?.closing_lien || '/contact',
        texte_bouton: data.data?.closing_texte_bouton || 'Démarrer la conversation →'
      },
      seo: {
        title: data.data?.seo_title || '',
        description: data.data?.seo_description || '',
        image: data.data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching you page:', error);
    return {
      hero: { titre: 'Votre situation', baseline: 'Trouver l\'approche qui vous correspond', video: null },
      intro: { titre: 'Le commencement du dialogue', paragraphe1: '', paragraphe2: '' },
      comprendre: {
        titre: 'Ce que nous aimons comprendre',
        items: [
          { titre: '', texte: '' },
          { titre: '', texte: '' },
          { titre: '', texte: '' }
        ],
        conclusion: ''
      },
      situations: { titre: 'Quelle est votre situation ?', liste: [] },
      approche: { titre: 'Comment nous travaillons ensemble', intro: '', detail: '' },
      closing: { titre: 'Prenons le temps d\'en parler', texte: '', lien: '/contact', texte_bouton: 'Démarrer la conversation →' }
    };
  }
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
    
    return {
      hero: {
        titre: data.data?.hero_titre || 'Parlons-en',
        baseline: data.data?.hero_baseline || 'Prenons le temps de discuter de votre projet',
        video: data.data?.hero_video ? {
          url: `${STRAPI_URL}${data.data.hero_video.url}`,
          alternativeText: data.data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data.data?.intro_titre || 'Le commencement d\'une collaboration',
        texte: data.data?.intro_texte || ''
      },
      closing: {
        titre: data.data?.closing_titre || 'Vous préférez simplement prendre un café ?',
        texte: data.data?.closing_texte || 'Nous sommes à votre disposition pour discuter.',
        email: data.data?.closing_email || 'contact@bywharf.com'
      },
      seo: {
        title: data.data?.seo_title || '',
        description: data.data?.seo_description || '',
        image: data.data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return {
      hero: { titre: 'Parlons-en', baseline: 'Prenons le temps de discuter de votre projet', video: null },
      intro: { titre: 'Le commencement d\'une collaboration', texte: '' },
      closing: { titre: 'Vous préférez simplement prendre un café ?', texte: 'Nous sommes à votre disposition pour discuter.', email: 'contact@bywharf.com' }
    };
  }
}

// Types TypeScript
export interface HomeData {
  hero: { titre: string; baseline: string; video: any };
  blocs: any;
  manifesto: { texte: string };
  cta: { texte: string; lien: string };
  seo: any;
}

export interface WeData {
  hero: any;
  actes: any;
  transition: any;
  piliers: any;
  manifesto: any;
  manifesto_pdf: any;
  closing: any;
  seo: any;
}

export interface WorkData {
  hero: any;
  intro: any;
  methode: any;
  expertises: any;
  closing: any;
  seo: any;
}

export interface YouData {
  hero: any;
  intro: any;
  comprendre: any;
  situations: any;
  approche: any;
  closing: any;
  seo: any;
}

export interface ContactData {
  hero: any;
  intro: any;
  closing: any;
  seo: any;
}