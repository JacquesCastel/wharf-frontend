import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import NewProjectForm from './NewProjectForm';

export const metadata = { title: 'Nouveau projet — Administration Wharf' };

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';

async function getClients() {
  if (!ADMIN_TOKEN) return [];
  const q = [
    'fields[0]=id',
    'fields[1]=nom',
    'sort=nom:asc',
    'pagination[limit]=100',
    'publicationState=live',
  ].join('&');

  const res = await fetch(`${STRAPI}/api/clients?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const { data } = await res.json();
  return (data ?? []).map((c: any) => ({
    id: c.id,
    nom: c.nom,
  }));
}

export default async function NouveauProjetPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/login');

  const clients = await getClients();

  return (
    <div className="page">
      <div className="chapter-head">
        <div>
          <div className="label">— Nouveau projet</div>
          <h1>Créer un projet client.</h1>
        </div>
      </div>

      <NewProjectForm clients={clients} />
    </div>
  );
}
