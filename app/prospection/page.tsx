import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import { privateRobots } from '../lib/site';
import ProspectPanel from './ProspectPanel';
export const metadata = { title: 'Prospection — Wharf', robots: privateRobots };
export default async function ProspectionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=%2Fprospection');
  if (session.user.role !== 'admin') redirect('/sommaire');
  return <><style>{'.header, footer, .accessibility-widget { display: none !important; }'}</style><ProspectPanel /></>;
}

