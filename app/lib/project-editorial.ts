// Concept and film URL supplied by Jacques. No production credits or results inferred.
export const CAFE_PROJECT_ID = 'j0pkln92345g7343c6ctpdgv';
export const cafeCase = {
  title: 'Au café du commerce',
  format: 'Film d’autopromotion · Fiction corporate',
  summary: 'Un film d’autopromotion Wharf : le café du commerce comme métaphore d’une conviction. Prendre la parole avant que les autres ne parlent pour vous.',
  updatedAt: '2026-10-05',
  videoUrl: 'https://www.youtube-nocookie.com/embed/3crnc6Hr4vk',
  videoLink: 'https://www.youtube.com/watch?v=3crnc6Hr4vk',
  sections: [
    { title: 'Un film pour porter une conviction', paragraphs: ['Pour son film d’autopromotion, Wharf part d’une question : que devient la parole d’une entreprise lorsqu’elle laisse les autres raconter son histoire ? Le film donne une forme à cette conviction : prendre la parole permet de participer au récit qui se construit autour de soi.'] },
    { title: 'Le café du commerce, une scène publique', paragraphs: ['Un endroit où tout le monde parle, où chacun a une idée. On observe, on juge, on commente. Les conversations se croisent et les interprétations circulent. Même celui qui garde le silence finit par devenir un sujet de conversation.', 'Wharf choisit le café du commerce comme métaphore de la communication des entreprises. Ne pas s’exprimer, c’est laisser aux autres le soin de dire qui l’on est, ce que l’on fait et ce que l’on représente.'] },
    { title: 'Prendre la parole, avec une intention', paragraphs: ['Le film invite à s’exprimer. Une prise de parole commence par un point de vue : ce que l’entreprise veut faire comprendre, à qui elle s’adresse et sur quels faits elle peut s’appuyer. La fiction met cette question en scène dans une situation familière.'] },
    { title: 'De la conviction à la communication', paragraphs: ['Le projet exprime le rôle de Wharf : clarifier une intention, construire les messages et leur donner forme à travers des contenus et des films. La stratégie donne une direction, l’éditorial développe le propos, la vidéo l’incarne.', 'C’est le principe du design narratif : relier la réalité de l’entreprise, ce qu’elle dit et ce que ses publics comprennent.'] },
  ],
};

function textValues(value: unknown): string[] {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(textValues);
  const record = value as Record<string, unknown>;
  return [typeof record.text === 'string' ? record.text : '', ...textValues(record.children)];
}

export function getProjectEditorial(project: { documentId: string; contenu?: unknown }) {
  if (project.documentId !== CAFE_PROJECT_ID) return undefined;
  // CMS content wins as soon as the placeholder has been replaced with substantive copy.
  const blocks = Array.isArray(project.contenu) ? project.contenu : [];
  const text = blocks.flatMap((block: Record<string, unknown>) => textValues(block.contenu))
    .map(value => value.trim().toLowerCase()).filter(Boolean);
  return text.some(value => value !== 'un texte pour voir') ? undefined : cafeCase;
}
