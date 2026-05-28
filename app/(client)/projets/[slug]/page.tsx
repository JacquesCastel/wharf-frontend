import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getProjets, getProjet } from '../../lib/api';
import Link from 'next/link';
import KanbanBoard from './KanbanBoard';
import ProjectInfoDrawer from './ProjectInfoDrawer';

function fmtPct(n: number) { return Math.round(n * 100) + '%'; }

export default async function ProjetPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const { slug } = await params;

  // L'admin utilise le token full-access, le client utilise son JWT
  const jwt = session.user.role === 'admin'
    ? (process.env.STRAPI_ADMIN_TOKEN ?? session.user.jwt)
    : session.user.jwt;

  // Tenter par slug, fallback par id
  let projet = await getProjet(slug, jwt).catch(() => null);
  if (!projet) {
    const { getProjetById } = await import('../../lib/api');
    projet = await getProjetById(slug, jwt).catch(() => null);
  }
  if (!projet) notFound();

  const progress = projet.progress ?? 0;
  const columns = projet.columns ?? [];

  return (
    <div className="page">

      {/* Project head */}
      <div className="project-head">
        <div>
          <div className="ph-eyebrow">
            <Link href={session.user.role === 'admin' ? '/admin' : '/sommaire'} className="ph-back">← {session.user.role === 'admin' ? 'Administration' : 'Sommaire'}</Link>
            {projet.type && <><span>·</span><span>{projet.type}</span></>}
            {session.user.organizationName && <><span>·</span><span>{session.user.organizationName}</span></>}
            {projet.date_debut && (
              <><span>·</span>
              <span>Démarré le {new Date((projet as any).date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></>
            )}
          </div>
          <h1>{projet.titre}</h1>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
          {projet.number && (
            <div className="ph-num">N°{projet.number}</div>
          )}
          <div className="ph-meta">
            {projet.lead && (
              <div className="row">
                <span>Lead</span>
                <span className="v">{projet.lead.display_name}</span>
              </div>
            )}
            {projet.deadline && (
              <div className="row">
                <span>Échéance</span>
                <span className="v">
                  {new Date(projet.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </span>
              </div>
            )}
            <div className="row">
              <span>Avancement</span>
              <span className="v">{fmtPct(progress)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="project-meta-strip">
        <div className="group">
          <span>— Équipe</span>
          <span className="so-avatars">
            {projet.team?.map((m: any) => (
              <span key={m.id} className="avatar" title={m.display_name}>
                {m.initials ?? '?'}
              </span>
            ))}
          </span>
        </div>
        <div className="spacer" />
        <ProjectInfoDrawer projet={projet} />
        <button className="filter-btn">Exporter le journal de projet</button>
      </div>

      {/* Kanban */}
      {columns.length > 0 ? (
        <KanbanBoard
          columns={columns}
          projectId={String(projet.id)}
          jwt={session.user.jwt}
          userName={session.user.name ?? 'Anonyme'}
        />
      ) : (
        <p style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          color: 'var(--ink-muted)', textAlign: 'center', marginTop: 80
        }}>
          Ce projet n'a pas encore de colonnes. Configurez-le dans l'administration.
        </p>
      )}

    </div>
  );
}
