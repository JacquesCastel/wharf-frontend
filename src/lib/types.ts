export interface Projet {
  id: number;
  attributes: {
    titre: string;
    slug: string;
    type: 'strategie' | 'production' | 'design';
    description_courte: string;
    vignette_grille: {
      data: {
        attributes: {
          url: string;
          alternativeText: string;
        };
      };
    };
    hero_type: 'image' | 'video';
    hero_image?: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    hero_video_url?: string;
    hero_titre_position: 'surimpression' | 'dessous';
    contenu: BlockContent[];
    date_publication: string;
  };
}

export type BlockContent = 
  | BlockTexte
  | BlockImage
  | BlockVideo
  | BlockGalerie
  | BlockCitation;

export interface BlockTexte {
  __component: 'blocs.bloc-texte';
  titre?: string;
  contenu: string;
}

export interface BlockImage {
  __component: 'blocs.bloc-image';
  image: {
    data: {
      attributes: {
        url: string;
        alternativeText: string;
      };
    };
  };
  legende?: string;
}

export interface BlockVideo {
  __component: 'blocs.bloc-video';
  type_video: 'upload' | 'embed';
  video_fichier?: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  video_url?: string;
}

export interface BlockGalerie {
  __component: 'blocs.bloc-galerie';
  images: {
    data: Array<{
      attributes: {
        url: string;
        alternativeText: string;
      };
    }>;
  };
  colonnes: number;
}

export interface BlockCitation {
  __component: 'blocs.bloc-citation';
  citation: string;
  auteur?: string;
  fonction?: string;
  entreprise?: string;
}