import motions from './insight-motions.json';

export type InsightMotion = typeof motions[number];

export function articleMotion(theme: string, slug: string, preview = false): InsightMotion | undefined {
  return motions.find(motion => motion.theme === theme && motion.slug === slug &&
    (motion.status === 'approved' || preview));
}
