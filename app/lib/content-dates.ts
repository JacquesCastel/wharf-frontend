// Dernières révisions des pages dans le code, combinées aux dates du CMS dans le sitemap.
export const pageUpdatedAt = {
  home: '2026-10-05',
  we: '2026-10-05',
  work: '2026-11-03',
  you: '2026-11-03',
  insights: '2026-10-05',
  contact: '2026-11-10',
};

export function latestContentDate(...dates: (string | undefined)[]): Date | undefined {
  const timestamps = dates.filter((date): date is string => Boolean(date)).map(Date.parse).filter(Number.isFinite);
  return timestamps.length ? new Date(Math.max(...timestamps)) : undefined;
}
