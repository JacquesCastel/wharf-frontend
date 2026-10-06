export const CONSENT_KEY = 'wharf-audience-choice-v1';
export const CONSENT_MAX_AGE = 183 * 24 * 60 * 60 * 1000;
export type AudienceChoice = 'accepted' | 'refused';
export type MeasureEvent = 'contact_form_success' | 'email_click' | 'contact_click' | 'film_play';
export type MeasurePayload = { website: string; hostname: string; url: string; referrer: string; language: string; name?: MeasureEvent; data?: Record<string, string> };

export function publicPath(value: string, paths: readonly string[]): string | null {
  try {
    const parsed = new URL(value, 'https://bywharf.com');
    if (!['bywharf.com', 'www.bywharf.com', 'localhost', '127.0.0.1'].includes(parsed.hostname)) return null;
    const path = parsed.pathname.replace(/\/$/, '') || '/';
    return paths.includes(path) ? path : null;
  } catch { return null; }
}
export function safeReferrer(value: string): string {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.origin : ''; } catch { return ''; }
}
export function readChoice(value: string | null, now: number): AudienceChoice | null {
  try {
    const saved = JSON.parse(value || 'null');
    return saved && ['accepted', 'refused'].includes(saved.choice) && Number.isFinite(saved.at) && now >= saved.at && now - saved.at < CONSENT_MAX_AGE ? saved.choice : null;
  } catch { return null; }
}
export function needCode(value: string): string {
  const codes: Record<string, string> = {
    'Stratégie de communication': 'strategy', 'Création de contenus B2B': 'content',
    'Film ou série vidéo': 'video', 'Création d’images et de films par l’IA': 'creation_ia',
    'Marque employeur ou recrutement': 'employer_brand', 'Communication interne ou transformation': 'internal',
    'Autre besoin / À définir': 'other',
  };
  return codes[value] || 'other';
}
export function eventData(name: MeasureEvent, data: Record<string, string>, path: string): Record<string, string> {
  const result: Record<string, string> = { page: path };
  if (name === 'contact_form_success') result.offer = ['strategy','content','video','creation_ia','employer_brand','internal','other'].includes(data.offer) ? data.offer : 'other';
  if (name === 'contact_click') result.origin = path.startsWith('/insights/') ? 'article' : path.startsWith('/work/') ? 'portfolio' : 'site';
  if (name === 'film_play' && /^[a-zA-Z0-9_-]{1,80}$/.test(data.film || '')) result.film = data.film;
  return result;
}
/** Dispatch only fixed event names/codes. Never include form fields or email addresses. */
export function measure(name: MeasureEvent, data: Record<string, string> = {}): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('wharf:measure', { detail: { name, data } }));
}
