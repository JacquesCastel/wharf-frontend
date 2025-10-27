import { getNavigation } from '../lib/strapi';
import Header from './Header';
export default async function HeaderWrapper() {
  const navigationData = await getNavigation();
  return <Header navigationData={navigationData} />;
}