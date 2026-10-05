// Public canonical identity is independent of the preview/deployment hostname.
export const SITE_URL = 'https://bywharf.com';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString();
export const webPageId = (path: string) => `${absoluteUrl(path)}#webpage`;
export const serviceId = (id: string) => `${SITE_URL}/work#service-${id}`;
export const privateRobots = { index: false, follow: false, googleBot: { index: false, follow: false } };
