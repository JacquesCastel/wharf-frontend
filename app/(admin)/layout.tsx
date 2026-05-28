import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import SessionProvider from '../(client)/components/SessionProvider';
import AdminRunningHead from './components/AdminRunningHead';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') redirect('/login');

  return (
    <SessionProvider>
      <style>{`
        .header, footer, .accessibility-widget { display: none !important; }
        body { background: var(--paper); }
      `}</style>
      <div className="shell">
        <AdminRunningHead />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
