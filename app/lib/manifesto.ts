/** Stable anchors remain valid when titles are edited in Strapi. */
export const manifestoPath = '/manifeste';
export const manifestoRevision = '2026-10-26';
const anchors = ["savoir-qui-l-on-est", "choisir-un-cap", "assumer-ses-choix", "entrer-en-relation", "etre-compris", "ecouter", "accepter-la-contradiction", "ouvrir-un-espace-de-parole", "tenir-parole", "donner-forme-au-sens", "creer-avec-responsabilite", "apporter-un-contenu-utile", "notre-engagement"] as const;

export function getManifestoSections(text: (key: string) => string) {
  return anchors.map((id, index) => ({
    id,
    number: String(index + 1).padStart(2, '0'),
    title: text(`manifesto-section-${index + 1}-title`),
    label: text(`manifesto-section-${index + 1}-nav`),
    paragraphs: text(`manifesto-section-${index + 1}-text`).split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean),
  }));
}
