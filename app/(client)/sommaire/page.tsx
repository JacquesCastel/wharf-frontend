import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import { getProjets, getProjectActivity, type ProjetClient, type ActivityItem } from '../lib/api';
import Link from 'next/link';

export const metadata = { title: 'Sommaire — Espace client Wharf' };

function fmtPct(n: number) { return Math.round(n * 100) + '%'; }

function fmtDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 24) return `il y a ${Math.max(1, Math.round(diffH))}h`;
  if (diffH < 48) return 'hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const TYPE_LABEL: Record<string, string> = {
  commentaire: 'msg',
  validation: 'validé',
  refus: 'refusé',
};

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <span className="so-activity-empty">Aucune activité récente</span>;
  }
  return (
    <div className="so-activity-list">
      {items.map((item) => (
        <div key={item.id} className={`so-act-item so-act-${item.type_commentaire}`}>
          <div className="so-act-meta">
            <span className={`so-act-badge ${item.type_commentaire}`}>
              {TYPE_LABEL[item.type_commentaire] ?? item.type_commentaire}
            </span>
            <span className="so-act-date">{fmtDate(item.date)}</span>
          </div>
          <div className="so-act-card-ref">
            {item.columnTitle && <span className="so-act-col">{item.columnTitle}</span>}
            {item.columnTitle && item.cardTitle && <span className="so-act-sep">›</span>}
            {item.cardTitle && <span className="so-act-card-title">{item.cardTitle}</span>}
          </div>
          <p className="so-act-text">{item.contenu}</p>
          <div className={`so-act-author${item.auteur_type === 'admin' ? ' wharf' : ''}`}>
            {item.auteur_nom}
            {item.auteur_type === 'admin' && <span className="so-act-wharf-tag">Wharf</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function SommaireRow({ projet, activity }: { projet: ProjetClient; activity: ActivityItem[] }) {
  const progress = projet.progress ?? 0;
  const statut = projet.statut ?? 'en_cours';
  const progressClass = statut === 'termine' ? 'done' : statut === 'en_pause' ? 'late' : '';
  const statusLabel = statut === 'termine' ? 'Livré' : statut === 'en_pause' ? 'En retard' : 'Avancement';
  const slug = projet.slug ?? String(projet.id);

  // Auteurs uniques de l'activité récente
  const activityAuthors = [...new Map(activity.map((a) => [a.auteur_nom, a])).values()];

  return (
    <Link href={`/projets/${slug}`} className="sommaire-row" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="so-num">{projet.number ?? '—'}</div>

      <div className="so-title-block">
        <div className="so-kicker">
          {[projet.type, projet.kicker].filter(Boolean).join(' · ')}
        </div>
        <h2 className="so-title">{projet.titre}</h2>
        {projet.description_courte && (
          <p className="so-desc">{projet.description_courte}</p>
        )}
        {projet.devis && (
          <span className="so-devis">{projet.devis}</span>
        )}
      </div>

      <div className="so-activity">
        <ActivityFeed items={activity} />
      </div>

      <div className="so-team">
        {projet.lead && (
          <>
            <span className="avatar">{projet.lead.initials ?? '?'}</span>
            <div className="so-team-meta">
              <span className="name">{projet.lead.display_name ?? projet.lead.initials}</span>
              {projet.lead.role_label && <span className="role">{projet.lead.role_label}</span>}
            </div>
          </>
        )}
        {activityAuthors.length > 0 && (
          <div className="so-act-authors">
            {activityAuthors.map((a) => (
              <span
                key={a.auteur_nom}
                className={`avatar so-act-avatar${a.auteur_type === 'admin' ? ' wharf' : ''}`}
                title={`${a.auteur_nom}${a.auteur_type === 'admin' ? ' — Wharf' : ''}`}
              >
                {initials(a.auteur_nom)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`so-progress ${progressClass}`}>
        <div className="prog-meta">
          <span>{statusLabel}</span>
          <span className="val">{fmtPct(progress)}</span>
        </div>
        <div className="prog-bar">
          <div className="prog-fill" style={{ width: fmtPct(progress) }} />
        </div>
        <div className="prog-meta">
          <span>Échéance</span>
          <span className="val">
            {projet.deadline
              ? new Date(projet.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
              : '—'}
          </span>
        </div>
      </div>

      <div className="so-go">→</div>
    </Link>
  );
}

export default async function SommairePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role === 'admin') redirect('/admin');

  let projets: ProjetClient[] = [];
  let fetchError = false;

  try {
    projets = await getProjets(session.user.jwt, session.user.strapiUserId, process.env.STRAPI_ADMIN_TOKEN);
  } catch {
    fetchError = true;
  }

  // Fetch recent activity for each project in parallel
  const activityMap = new Map<number, ActivityItem[]>();
  if (projets.length > 0) {
    const results = await Promise.all(
      projets.map((p) => getProjectActivity(p.columnIds ?? [], session.user.jwt))
    );
    projets.forEach((p, i) => activityMap.set(p.id, results[i]));
  }

  const prenom = session.user.name?.split(' ')[0] ?? 'vous';
  const orgName = session.user.organizationName ?? '';
  const today = new Date();
  const todayLabel = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const year = today.getFullYear();

  const enCours = projets.filter((p) => p.statut === 'en_cours').length;
  const totalActivity = [...activityMap.values()].reduce((s, a) => s + a.length, 0);

  return (
    <div className="page">

      {/* Chapter head */}
      <div className="chapter-head">
        <div>
          <div className="label">— Bienvenue, {prenom}</div>
          <h1>Le sommaire de vos projets, à ce jour.</h1>
        </div>
        <div className="chapter-meta">
          <div>Vol. i · Année {year}</div>
          <div className="big">N°{String(projets.length).padStart(2, '0')} — {todayLabel}</div>
          {orgName && <div>{orgName}</div>}
        </div>
      </div>

      {/* Stat strip */}
      <div className="stat-strip">
        <div className="stat">
          <div className="stat-label">Projets en cours</div>
          <div className="stat-val">{String(enCours).padStart(2, '0')}</div>
          <div className="stat-foot">sur {projets.length} ouverts</div>
        </div>
        <div className="stat">
          <div className="stat-label">Activité récente</div>
          <div className="stat-val">{String(totalActivity).padStart(2, '0')}</div>
          <div className="stat-foot">échanges en cours</div>
        </div>
        <div className="stat">
          <div className="stat-label">Livrables</div>
          <div className="stat-val">{String(projets.filter((p) => p.statut === 'termine').length).padStart(2, '0')}</div>
          <div className="stat-foot">projets terminés</div>
        </div>
        <div className="stat">
          <div className="stat-label">Projets actifs</div>
          <div className="stat-val">{String(projets.length).padStart(2, '0')}</div>
          <div className="stat-foot">au total</div>
        </div>
      </div>

      {/* Liste projets */}
      {fetchError ? (
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-muted)', textAlign: 'center', marginTop: 80 }}>
          Une erreur est survenue lors du chargement des projets.
        </p>
      ) : projets.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-muted)', textAlign: 'center', marginTop: 80 }}>
          Aucun projet en cours. {prenom}, c'est inhabituel.
        </p>
      ) : (
        <>
          <div className="sommaire-head">
            <div>N°</div>
            <div>Projet</div>
            <div>Activité récente</div>
            <div>Équipe Wharf</div>
            <div>Avancement</div>
            <div></div>
          </div>
          <div className="sommaire-list">
            {projets.map((p) => (
              <SommaireRow key={p.id} projet={p} activity={activityMap.get(p.id) ?? []} />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
