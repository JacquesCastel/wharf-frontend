import Link from 'next/link';
import type { ContextLink } from '../lib/content-paths';
import './content-paths.css';

export default function ContextLinks({ links, label }: { links: ContextLink[]; label: string }) {
  if (!links.length) return null;
  return <nav className="context-routes" aria-label={label}>
    <p className="context-readings-label">{label}</p>
    <ul>{links.map(link => <li key={link.href}><Link href={link.href}><span>{link.label}</span><span aria-hidden="true">→</span></Link></li>)}</ul>
  </nav>;
}
