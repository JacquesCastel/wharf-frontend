import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminProjectList from './components/AdminProjectList';


export const metadata = { title: 'Administration — Wharf' };

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';


async function getProjetsAdmin(showArchived: boolean) {
  if (!ADMIN_TOKEN) return [];
  const q = [
    showArchived
      ? 'filters[archived][$eq]=true'
      : 'filters[$or][0][archived][$eq]=false&filters[$or][1][archived][$null]=true',
    'populate[client][fields][0]=id',
    'populate[client][fields][1]=nom',
    'sort=createdAt:desc',
    'pagination[limit]=200',
  ].join('&');

  const res = await fetch(`${STRAPI}/api/projet-clients?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const { data } = await res.json();
  return (data ?? []).map((p: any) => ({
    id: p.id,
    documentId: p.documentId,
    number: p.number,
    titre: p.titre,
    slug: p.slug,
    statut: p.statut ?? 'en_cours',
    archived: p.archived ?? false,
    deadline: p.deadline,
    type: p.type,
    kicker: p.kicker,
    client: p.client ? { display_name: p.client.nom, email: '' } : null,
  }));
}

async function getArchivedCount() {
  if (!ADMIN_TOKEN) return 0;
  const res = await fetch(
    `${STRAPI}/api/projet-clients?filters[archived][$eq]=true&pagination[limit]=1&pagination[withCount]=true`,
    { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }, cache: 'no-store' }
  );
  if (!res.ok) return 0;
  const json = await res.json();
  return json?.meta?.pagination?.total ?? 0;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ archives?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') redirect('/login');

  const { archives } = await searchParams;
  const showArchived = archives === '1';

  const [projets, archivedCount] = await Promise.all([
    getProjetsAdmin(showArchived),
    showArchived ? Promise.resolve(0) : getArchivedCount(),
  ]);

  const noToken = !ADMIN_TOKEN;

  const enCours = projets.filter((p: any) => p.statut === 'en_cours').length;
  const termine = projets.filter((p: any) => p.statut === 'termine').length;
  const pause = projets.filter((p: any) => p.statut === 'en_pause').length;

  return (
    <div className="page">

      <div className="chapter-head">
        <div>
          <div className="label">— Administration Wharf</div>
          <h1>{showArchived ? 'Projets archivés.' : 'Tous les projets clients.'}</h1>
        </div>
        <div className="chapter-meta">
          <div>Espace interne</div>
          <div className="big">
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {!showArchived && (
        <div className="stat-strip">
          <div className="stat">
            <div className="stat-label">En cours</div>
            <div className="stat-val">{String(enCours).padStart(2, '0')}</div>
            <div className="stat-foot">projets actifs</div>
          </div>
          <div className="stat">
            <div className="stat-label">Livrés</div>
            <div className="stat-val">{String(termine).padStart(2, '0')}</div>
            <div className="stat-foot">projets terminés</div>
          </div>
          <div className="stat">
            <div className="stat-label">En pause</div>
            <div className="stat-val">{String(pause).padStart(2, '0')}</div>
            <div className="stat-foot">projets suspendus</div>
          </div>
          <div className="stat">
            <div className="stat-label">Total</div>
            <div className="stat-val">{String(projets.length).padStart(2, '0')}</div>
            <div className="stat-foot">projets ouverts</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          {showArchived ? (
            <Link href="/admin" className="btn-ghost" style={{ textDecoration: 'none' }}>
              ← Projets actifs
            </Link>
          ) : archivedCount > 0 ? (
            <Link href="/admin?archives=1" className="adm-link" style={{ fontSize: 12 }}>
              Voir les archives ({archivedCount})
            </Link>
          ) : (
            <span />
          )}
        </div>
        {!showArchived && (
          <Link href="/admin/projets/nouveau" className="btn-primary" style={{ textDecoration: 'none' }}>
            + Nouveau projet
          </Link>
        )}
      </div>

      {noToken && (
        <div className="adm-warn">
          <strong>Configuration manquante.</strong> Ajoutez <code>STRAPI_ADMIN_TOKEN</code> dans votre <code>.env.local</code> (Strapi Admin → Settings → API Tokens → Full Access).
        </div>
      )}

      {!noToken && projets.length === 0 && (
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-muted)', textAlign: 'center', marginTop: 80 }}>
          {showArchived ? 'Aucun projet archivé.' : 'Aucun projet pour l\'instant.'}
        </p>
      )}

      {projets.length > 0 && (
        <AdminProjectList projets={projets} showArchived={showArchived} />
      )}

    </div>
  );
}
