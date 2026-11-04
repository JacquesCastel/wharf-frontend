import { SITE_URL } from './site';

export const contentUsagePath = '/utilisation-des-contenus';
export const contentUsageUpdatedAt = '2026-11-04';
export const contentUsagePolicyUrl = `${SITE_URL}${contentUsagePath}`;

// Rights are reserved; the linked policy grants limited search/answer uses
// of Wharf's own public editorial texts, without licensing third-party media.
export const tdmReservationRules = [{
  location: '/',
  'tdm-reservation': 1,
  'tdm-policy': contentUsagePolicyUrl,
}];

export function contentUsageRobotsText(): string {
  return [
    '# Content-use preferences for Wharf-owned public editorial texts only.',
    '# Search indexing and source-based AI answers are permitted under the policy.',
    '# AI training requires prior permission; applicable legal exceptions remain.',
    '# No licence is granted for portfolio media, third-party or private content.',
    `# Full scope and conditions: ${contentUsagePolicyUrl}`,
    '',
    'User-Agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    'Disallow: /api/',
    'Disallow: /mesure/',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
}
