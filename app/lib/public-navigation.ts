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
  const links = (items.length ? items : defaults).filter(item => pathOf(item.url) !== '/contact');
  if (!links.some(item => pathOf(item.url) === '/insights')) links.push({ id: -1, label: 'INSIGHTS', url: '/insights' });
  if (!links.some(item => pathOf(item.url) === '/manifeste')) {
    const we = links.findIndex(item => pathOf(item.url) === '/we');
    links.splice(we < 0 ? links.length : we + 1, 0, { id: -2, label: 'MANIFESTE', url: '/manifeste' });
  }
  const agency = links.find(item => pathOf(item.url) === '/agence') ?? { id: -3, label: 'L’AGENCE', url: '/agence' };
  const result = links.filter(item => pathOf(item.url) !== '/agence');
  const manifesto = result.findIndex(item => pathOf(item.url) === '/manifeste');
  result.splice(manifesto + 1, 0, agency);
  return result;
}
