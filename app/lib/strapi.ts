// lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://91.99.170.150:1337';

// Fonction simple pour convertir les blocks
function blocksToHtml(blocks: any): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  try {
    return blocks.map((block: any) => {
      if (!block?.type) return '';
      
      switch (block.type) {
        case 'paragraph':
          if (!block.children) return '';
          const paragraphText = block.children
            .map((child: any) => {
              let text = child?.text || '';
              if (child?.bold) text = `<strong>${text}</strong>`;
              if (child?.italic) text = `<em>${text}</em>`;
              if (child?.underline) text = `<u>${text}</u>`;
              return text;
            })
            .join('');
          return `<p>${paragraphText}</p>`;
        
        case 'heading':
          if (!block.children) return '';
          const headingText = block.children.map((c: any) => c?.text || '').join('');
          const level = Math.min(Math.max(block.level || 2, 1), 6);
          return `<h${level}>${headingText}</h${level}>`;
        
        case 'list':
          if (!block.children) return '';
          const isOrdered = block.format === 'ordered';
          const tag = isOrdered ? 'ol' : 'ul';
          const items = block.children
            .map((item: any) => {
              if (!item?.children) return '<li></li>';
              const itemText = item.children.map((c: any) => c?.text || '').join('');
              return `<li>${itemText}</li>`;
            })
            .join('');
          return `<${tag}>${items}</${tag}>`;
        
        default:
          return '';
      }
    }).join('');
  } catch (e) {
    console.error('blocksToHtml error:', e);
    return '';
  }
}

export async function getWe() {
  try {
    const url = `${STRAPI_URL}/api/page-we?populate=*`;
    console.log('Fetching WE from:', url);
    
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error('Strapi error:', res.status, res.statusText);
      throw new Error(`HTTP ${res.status}`);
    }
    
    const json = await res.json();
    const data = json.data;
    
    console.log('WE Data:', {
      acte1_titre: data?.acte1_titre,
      acte1_contenu_type: typeof data?.acte1_contenu,
      acte1_contenu_is_array: Array.isArray(data?.acte1_contenu),
      acte1_contenu_length: Array.isArray(data?.acte1_contenu) ? data.acte1_contenu.length : 'N/A'
    });

    return {
      hero: {
        titre: data?.hero_titre || 'Notre approche',
        texte: data?.hero_baseline || 'WE',
        video: data?.hero_video ? {
          url: `${STRAPI_URL}${data.hero_video.url}`,
          alternativeText: data.hero_video.alternativeText || ''
        } : null
      },
      actes: {
        acte1: {
          numero: 1,
          titre: data?.acte1_titre || 'Acte 1',
          contenu: blocksToHtml(data?.acte1_contenu)
        },
        acte2: {
          numero: 2,
          titre: data?.acte2_titre || 'Acte 2',
          contenu: blocksToHtml(data?.acte2_contenu)
        },
        acte3: {
          numero: 3,
          titre: data?.acte3_titre || 'Acte 3',
          contenu: blocksToHtml(data?.acte3_contenu)
        }
      },
      transition: {
        texte: data?.transition_texte || 'Là où la stratégie rencontre la création'
      },
      piliers: {
        pilier1: {
          titre: data?.pilier1_titre || 'Pilier 1',
          contenu: blocksToHtml(data?.pilier1_contenu)
        },
        pilier2: {
          titre: data?.pilier2_titre || 'Pilier 2',
          contenu: blocksToHtml(data?.pilier2_contenu)
        }
      },
      manifesto: {
        texte: blocksToHtml(data?.manifesto_texte)
      },
      manifesto_pdf: data?.manifesto_pdf ? {
        url: `${STRAPI_URL}${data.manifesto_pdf.url}`,
        name: data.manifesto_pdf.name
      } : null,
      closing: {
        titre: data?.closing_titre || 'Travaillons ensemble',
        description: data?.closing_description || '',
        lien: data?.closing_lien || '/contact',
        texte_bouton: data?.closing_texte_bouton || 'Découvrir nos services →'
      },
      seo: {
        title: data?.seo_title || '',
        description: data?.seo_description || '',
        image: data?.seo_image || null
      }
    };
  } catch (error) {
    console.error('getWe error:', error);
    return {
      hero: { titre: 'Notre approche', baseline: 'WE', video: null },
      actes: {
        acte1: { numero: 1, titre: 'Intention', contenu: '<p>Erreur de chargement</p>' },
        acte2: { numero: 2, titre: 'Perception', contenu: '<p>Erreur de chargement</p>' },
        acte3: { numero: 3, titre: 'Réalignement', contenu: '<p>Erreur de chargement</p>' }
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

export async function getHome() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/page-home?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;

    return {
      hero: {
        titre: data?.hero_titre || '',
        baseline: data?.hero_baseline || '',
        video: data?.hero_video ? {
          url: `${STRAPI_URL}${data.hero_video.url}`,
          alternativeText: data.hero_video.alternativeText || ''
        } : null
      },
      blocs: {
        we: { titre: data?.bloc_we_titre || 'WE', description: data?.bloc_we_description || '', lien: '/we' },
        work: { titre: data?.bloc_work_titre || 'WORK', description: data?.bloc_work_description || '', lien: '/work' },
        you: { titre: data?.bloc_you_titre || 'YOU', description: data?.bloc_you_description || '', lien: '/you' }
      },
      manifesto: { texte: blocksToHtml(data?.manifesto_texte) || data?.manifesto_texte || '' },
      cta: { texte: data?.cta_texte || '', lien: data?.cta_lien || '/contact' },
      seo: { title: data?.seo_title || '', description: data?.seo_description || '', image: data?.seo_image || null }
    };
  } catch (error) {
    console.error('getHome error:', error);
    return { hero: { titre: '', baseline: '', video: null }, blocs: {}, manifesto: { texte: '' }, cta: { texte: '', lien: '/contact' } };
  }
}

export async function getWork() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/page-work?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;

    return {
      hero: {
        titre: data?.hero_titre || 'Comment travaillons-nous ?',
        baseline: data?.hero_baseline || 'WORK',
        video: data?.hero_video ? {
          url: `${STRAPI_URL}${data.hero_video.url}`,
          alternativeText: data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        paragraphe1: data?.intro_paragraphe1 || '',
        paragraphe2: data?.intro_paragraphe2 || '',
        highlight: data?.intro_highlight || ''
      },
      methode: {
        titre: data?.methode_titre || 'Notre méthode',
        intro: data?.methode_intro || '',
        mouvements: [
          { numero: 1, titre: data?.mouvement1_titre || '', description: blocksToHtml(data?.mouvement1_description) },
          { numero: 2, titre: data?.mouvement2_titre || '', description: blocksToHtml(data?.mouvement2_description) },
          { numero: 3, titre: data?.mouvement3_titre || '', description: blocksToHtml(data?.mouvement3_description) }
        ]
      },
      expertises: {
        titre: data?.expertises_titre || 'Nos expertises',
        expertise1: {
          titre: data?.expertise1_titre || 'Conseil stratégique',
          subtitle: data?.expertise1_subtitle || 'formuler le sens',
          description: blocksToHtml(data?.expertise1_description),
          liste: blocksToHtml(data?.expertise1_liste)
        },
        expertise2: {
          titre: data?.expertise2_titre || 'Création audiovisuelle',
          subtitle: data?.expertise2_subtitle || 'donner corps au récit',
          description: blocksToHtml(data?.expertise2_description),
          liste: blocksToHtml(data?.expertise2_liste)
        }
      },
      closing: {
        titre: data?.closing_titre || 'Travaillons ensemble',
        texte: blocksToHtml(data?.closing_texte),
        subtext: data?.closing_subtext || 'Parlons-en.',
        lien: data?.closing_lien || '/contact',
        texte_bouton: data?.closing_texte_bouton || "Let's work together →"
      },
      seo: { title: data?.seo_title || '', description: data?.seo_description || '', image: data?.seo_image || null }
    };
  } catch (error) {
    console.error('getWork error:', error);
    return { hero: { titre: '', baseline: '', video: null }, intro: {}, methode: { mouvements: [] }, expertises: {}, closing: {} };
  }
}

export async function getYou() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/page-you?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;

    return {
      hero: {
        titre: data?.hero_titre || 'Votre situation',
        baseline: data?.hero_baseline || '',
        video: data?.hero_video ? {
          url: `${STRAPI_URL}${data.hero_video.url}`,
          alternativeText: data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data?.intro_titre || '',
        paragraphe1: data?.intro_paragraphe1 || '',
        paragraphe2: data?.intro_paragraphe2 || ''
      },
      comprendre: {
        titre: data?.comprendre_titre || '',
        items: [
          { titre: data?.comprendre_item1_titre || '', texte: data?.comprendre_item1_texte || '' },
          { titre: data?.comprendre_item2_titre || '', texte: data?.comprendre_item2_texte || '' },
          { titre: data?.comprendre_item3_titre || '', texte: data?.comprendre_item3_texte || '' }
        ],
        conclusion: data?.comprendre_conclusion || ''
      },
      situations: {
        titre: data?.situations_titre || '',
        liste: (data?.situations || []).sort((a: any, b: any) => a.numero - b.numero)
      },
      approche: {
        titre: data?.approche_titre || '',
        intro: data?.approche_intro || '',
        detail: data?.approche_detail || ''
      },
      closing: {
        titre: data?.closing_titre || '',
        texte: data?.closing_texte || '',
        lien: data?.closing_lien || '/contact',
        texte_bouton: data?.closing_texte_bouton || ''
      },
      seo: { title: data?.seo_title || '', description: data?.seo_description || '', image: data?.seo_image || null }
    };
  } catch (error) {
    console.error('getYou error:', error);
    return { hero: { titre: '', baseline: '', video: null }, intro: {}, comprendre: { items: [] }, situations: { liste: [] }, approche: {}, closing: {} };
  }
}

export async function getContact() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/page-contact?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;

    return {
      hero: {
        titre: data?.hero_titre || 'Parlons-en',
        baseline: data?.hero_baseline || '',
        video: data?.hero_video ? {
          url: `${STRAPI_URL}${data.hero_video.url}`,
          alternativeText: data.hero_video.alternativeText || ''
        } : null
      },
      intro: {
        titre: data?.intro_titre || '',
        texte: data?.intro_texte || ''
      },
      closing: {
        titre: data?.closing_titre || '',
        texte: data?.closing_texte || '',
        email: data?.closing_email || 'contact@bywharf.com'
      },
      seo: { title: data?.seo_title || '', description: data?.seo_description || '', image: data?.seo_image || null }
    };
  } catch (error) {
    console.error('getContact error:', error);
    return { hero: { titre: '', baseline: '', video: null }, intro: {}, closing: {} };
  }
}

export async function getFooter() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/footer?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;
    return {
      logo: data?.logo ? { url: `${STRAPI_URL}${data.logo.url}`, alternativeText: data.logo.alternativeText || '' } : null,
      email: data?.email || '',
      telephone: data?.telephone || '',
      sections: (data?.sections || []).map((s: any) => ({ titre: s.titre, liens: s.liens || [] }))
    };
  } catch (error) {
    console.error('getFooter error:', error);
    return { logo: null, email: '', telephone: '', sections: [] };
  }
}

export async function getNavigation() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/navigation?populate=*`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()).data;
    return {
      logo: data?.logo ? { url: `${STRAPI_URL}${data.logo.url}`, alternativeText: data.logo.alternativeText || '' } : null,
      liens: data?.Link || [],
      cta_text: data?.cta_text || 'Contact',
      cta_url: data?.cta_url || '/contact'
    };
  } catch (error) {
    console.error('getNavigation error:', error);
    return { logo: null, liens: [], cta_text: 'Contact', cta_url: '/contact' };
  }
}
export function markdownToHtml(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}