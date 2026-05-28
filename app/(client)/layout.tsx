import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import SessionProvider from './components/SessionProvider';
import RunningHead from './components/RunningHead';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <SessionProvider>
      <style>{`
        /* Masquer le header/footer public dans l'espace client */
        .header, footer, .accessibility-widget { display: none !important; }
        body { background: var(--paper); }
      `}</style>
      <div className="shell">
        <RunningHead />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
