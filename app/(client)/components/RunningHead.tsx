'use client';

import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { getFeteduJour } from '../lib/ephemeride';

export default function RunningHead() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const initials = session?.user?.initials ?? '—';
  const isAdmin = session?.user?.role === 'admin';
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pathLabel =
    pathname.startsWith('/projets/') ? `Sommaire · Projet` :
    pathname === '/sommaire' ? 'Sommaire' : '—';

  return (
    <div className="running-head">
      <div className="rh-left">
        <Link href="/sommaire" className="wharf-mark">Wharf</Link>
        <span>Espace client</span>
        <span className="rh-dot" />
        <span>{pathLabel}</span>
      </div>
      <div className="rh-center">
        <span>{today}</span>
        <span style={{ color: 'var(--rule-strong)' }}>·</span>
        <span>{getFeteduJour()}</span>
      </div>
      <div className="rh-right">
        <Link
          href={isAdmin ? '/admin' : '/sommaire'}
          className={pathname === '/sommaire' || pathname === '/admin' ? 'nav-active' : ''}
        >
          {isAdmin ? 'Administration' : 'Mon tableau de bord'}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Déconnexion
        </button>
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink)', textTransform: 'none', fontSize: 13 }}>
          {initials}
        </span>
      </div>
    </div>
  );
}
