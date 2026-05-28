import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { redirect, notFound } from 'next/navigation';
import EditProjectForm from './EditProjectForm';

export const metadata = { title: 'Modifier le projet — Administration Wharf' };

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';

async function getClients() {
  if (!ADMIN_TOKEN) return [];
  const q = ['fields[0]=id', 'fields[1]=nom', 'sort=nom:asc', 'pagination[limit]=100'].join('&');
  const res = await fetch(`${STRAPI}/api/clients?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const { data } = await res.json();
  return (data ?? []).map((c: any) => ({ id: c.id, nom: c.nom }));
}

async function getProjet(documentId: string) {
  if (!ADMIN_TOKEN) return null;
  const q = [
    'populate[client][fields][0]=id',
    'populate[client][fields][1]=nom',
    'populate[client_contacts][fields][0]=id',
    'populate[client_contacts][fields][1]=display_name',
    'populate[client_contacts][fields][2]=email',
    'populate[client_contacts][fields][3]=role_label',
  ].join('&');
  const res = await fetch(`${STRAPI}/api/projet-clients/${documentId}?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const { data } = await res.json();
  return data ?? null;
}

export default async function ModifierProjetPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/login');

  const { documentId } = await params;
  const [projet, clients] = await Promise.all([getProjet(documentId), getClients()]);

  if (!projet) notFound();

  return (
    <div className="page">
      <div className="chapter-head">
        <div>
          <div className="label">— Modifier le projet</div>
          <h1>{projet.titre}</h1>
        </div>
        <div className="chapter-meta">
          <div>N°{projet.number ?? '—'}</div>
        </div>
      </div>

      <EditProjectForm documentId={documentId} projet={projet} clients={clients} />
    </div>
  );
}
