import motions from './insight-motions.json';

export type InsightMotion = typeof motions[number];

export function articleMotion(theme: string, slug: string, preview = false): InsightMotion | undefined {
  return motions.find(motion => motion.theme === theme && motion.slug === slug &&
    (motion.status === 'approved' || preview));
}

/** Embed only reviewed first-party motions; other CMS video links keep their existing behavior. */
export function motionForVideoUrl(value?: string): InsightMotion | undefined {
  if (!value) return undefined;
  return motions.find(motion => motion.status === 'approved' &&
    [`/motions/${motion.id}.html`, `https://bywharf.com/motions/${motion.id}.html`].includes(value.trim()));
}
