export type ProjectMedia = { url: string; mime?: string; alternativeText?: string; width?: number; height?: number; createdAt?: string };
export type ProjectMediaItem = { id?: number; titre?: string; media?: ProjectMedia; video_url?: string; affiche?: ProjectMedia; legende?: string };
export function mediaKind(media?: ProjectMedia): 'image' | 'video' | undefined {
  if (!media?.url) return undefined;
  if (media.mime?.startsWith('image/')) return 'image';
  if (media.mime?.startsWith('video/')) return 'video';
  const path = media.url.split(/[?#]/)[0].toLowerCase();
  if (/\.(png|jpe?g|webp|avif|gif|svg)$/.test(path)) return 'image';
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(path)) return 'video';
  return undefined;
}
// Only known players are embedded; other URLs remain ordinary links.
export function videoEmbed(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return undefined;
    if (url.hostname === 'youtu.be' || ['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v');
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : undefined;
    }
    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) { const result = new URL(`https://player.vimeo.com/video/${id}`); const hash = url.searchParams.get('h'); if (hash && /^[a-z0-9]+$/i.test(hash)) result.searchParams.set('h', hash); return result.toString(); }
    }
  } catch { return undefined; }
  return undefined;
}
export function safeVideoLink(value?: string): string | undefined {
  try { const url = new URL(value || ''); return ['http:', 'https:'].includes(url.protocol) ? url.toString() : undefined; } catch { return undefined; }
}
export function seriesColumns(value?: number): number { return value && [1, 2, 3].includes(value) ? value : 2; }
export function projectPopulate() {
  const query = new URLSearchParams({ status: 'published' });
  for (const field of ['vignette', 'hero_media', 'categories']) query.set(`populate[${field}]`, 'true');
  query.set('populate[contenu][on][bloc.texte-bloc][populate]', '*');
  query.set('populate[contenu][on][bloc.image-bloc][populate][image]', 'true');
  query.set('populate[contenu][on][bloc.video-bloc][populate][video]', 'true');
  query.set('populate[contenu][on][bloc.galerie-bloc][populate][images]', 'true');
  query.set('populate[contenu][on][bloc.citation-bloc][populate]', '*');
  query.set('populate[contenu][on][bloc.serie-media][populate][elements][populate]', '*');
  return query;
}
