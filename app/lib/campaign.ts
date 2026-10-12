/** Only authored, public campaign codes may enter audience statistics. */
export const CAMPAIGN_KEY = 'wharf-linkedin-campaign-v1';
export const CAMPAIGN_MAX_AGE = 30 * 60 * 1000;
export type CampaignState = { content: string; at: number; visitSent: boolean };

function codes(content: string): { account: string; publication: string } | null {
  if (content === 'profil_jacques') return { account: 'profil_jacques', publication: 'profil' };
  if (content === 'page_wharf') return { account: 'page_wharf', publication: 'page' };
  const personal = /^profil_jacques_(p0[1-9]|p1[0-2])$/.exec(content);
  if (personal) return { account: 'profil_jacques', publication: personal[1] };
  const company = /^page_wharf_(e0[1-6])$/.exec(content);
  return company ? { account: 'page_wharf', publication: company[1] } : null;
}

export function campaignContent(search: string): string | null {
  const params = new URLSearchParams(search);
  if (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].some(key => params.getAll(key).length !== 1)) return null;
  if (params.get('utm_source') !== 'linkedin' || params.get('utm_medium') !== 'organic_social' || params.get('utm_campaign') !== 'nouveau_wharf') return null;
  const content = params.get('utm_content') || '';
  return codes(content) ? content : null;
}

export function activeCampaign(value: unknown, now: number): CampaignState | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Partial<CampaignState>;
  if (typeof record.content !== 'string' || !codes(record.content) || typeof record.at !== 'number' || !Number.isFinite(record.at) || record.at > now || now - record.at >= CAMPAIGN_MAX_AGE) return null;
  // Build a new object: never forward additional properties from storage.
  return { content: record.content, at: record.at, visitSent: record.visitSent === true };
}

export function readCampaign(value: string | null, now: number): CampaignState | null {
  try { return activeCampaign(JSON.parse(value || 'null'), now); } catch { return null; }
}

/** A new marked link replaces the previous attribution; unmarked internal pages inherit it. */
export function resolveCampaign(content: string | null, previous: unknown, now: number): CampaignState | null {
  const current = activeCampaign(previous, now);
  if (content && codes(content) && content !== current?.content) return { content, at: now, visitSent: false };
  return current;
}

export function campaignEventData(value: unknown, now: number): Record<string, string> {
  const record = activeCampaign(value, now);
  const details = record && codes(record.content);
  return details ? { source: 'linkedin', medium: 'organic_social', campaign: 'nouveau_wharf', account: details.account, publication: details.publication } : {};
}
