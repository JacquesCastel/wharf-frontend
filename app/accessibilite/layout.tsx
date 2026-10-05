import { generateMetadataFromStrapi } from '../lib/metadata';
export const metadata = generateMetadataFromStrapi('Accessibilité — Personnalisez votre navigation | Wharf', 'Adaptez votre expérience sur bywharf.com : taille de police, contraste, interlignage et navigation au clavier.', undefined, '/accessibilite');
export default function AccessibiliteLayout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
