export type PublicMenuItem = { id: number; label: string; url: string };
const pathOf = (url: string) => {
  try {
    const value = new URL(url, 'https://bywharf.com');
    return ['bywharf.com', 'www.bywharf.com'].includes(value.hostname) ? value.pathname.replace(/\/$/, '') : '';
  } catch { return ''; }
};
/** Both menus share the same order, including when links come from Strapi. */
export function publicMenuLinks(items: PublicMenuItem[]): PublicMenuItem[] {
  const defaults = [{ id: 1, label: 'WE', url: '/we' }, { id: 2, label: 'WORK', url: '/work' }, { id: 3, label: 'YOU', url: '/you' }];
  const source = items.length ? items : defaults;
  const manifesto = source.find(item => pathOf(item.url) === '/manifeste') ?? { id: -2, label: 'MANIFESTE', url: '/manifeste' };
  const agency = source.find(item => pathOf(item.url) === '/agence') ?? { id: -3, label: 'L’AGENCE', url: '/agence' };
  const links = source.filter(item => !['/contact', '/manifeste', '/agence'].includes(pathOf(item.url)));
  if (!links.some(item => pathOf(item.url) === '/insights')) links.push({ id: -1, label: 'INSIGHTS', url: '/insights' });
  const insights = links.findIndex(item => pathOf(item.url) === '/insights');
  links.splice(insights + 1, 0, manifesto, agency);
  return links;
}
