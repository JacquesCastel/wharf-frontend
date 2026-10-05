import { generateMetadataFromStrapi } from '../lib/metadata';
import { pageSeo } from '../lib/editorial';

export const metadata = generateMetadataFromStrapi(pageSeo.contact.title, pageSeo.contact.description, undefined, '/contact');

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
