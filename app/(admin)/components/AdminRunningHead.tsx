'use client';

import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { getFeteduJour } from '../../(client)/lib/ephemeride';

export default function AdminRunningHead() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.initials ?? 'W';
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="running-head">
      <div className="rh-left">
        <Link href="/admin" className="wharf-mark">Wharf</Link>
        <span>Administration</span>
        <span className="rh-dot" />
        <span className="admin-badge">Équipe Wharf</span>
      </div>
      <div className="rh-center">
        <span>{today}</span>
        <span style={{ color: 'var(--rule-strong)' }}>·</span>
        <span>{getFeteduJour()}</span>
      </div>
      <div className="rh-right">
        <Link href="/admin" className={pathname === '/admin' ? 'nav-active' : ''}>
          Projets
        </Link>
        <Link href="/admin/projets/nouveau" className={pathname === '/admin/projets/nouveau' ? 'nav-active' : ''}>
          + Nouveau projet
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })}>
          Déconnexion
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink)', textTransform: 'none', fontSize: 13 }}>
          {initials}
        </span>
      </div>
    </div>
  );
}
