'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Contact {
  id?: number;
  documentId?: string;
  display_name?: string;
  email: string;
  role_label?: string;
}

interface ClientEntreprise {
  id: number;
  nom: string;
  adresse?: string;
}

interface ProjectDetail {
  id: number;
  documentId: string;
  titre: string;
  number?: string;
  slug?: string;
  type?: string;
  kicker?: string;
  statut?: string;
  deadline?: string;
  description_courte?: string;
  description?: string;
  devis?: string;
  client?: ClientEntreprise | null;
  client_contacts?: Contact[];
  team?: { display_name?: string; email: string; role_label?: string; initials?: string }[];
}

const STATUT_LABEL: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Livré',
  en_pause: 'En pause',
};

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminProjectDrawer({
  documentId,
  onClose,
}: {
  documentId: string;
  onClose: () => void;
}) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/projets/${documentId}`)
      .then((r) => r.json())
      .then((data) => {
        setProject({
          id: data.id,
          documentId: data.documentId,
          titre: data.titre,
          number: data.number,
          slug: data.slug,
          type: data.type,
          kicker: data.kicker,
          statut: data.statut,
          deadline: data.deadline,
          description_courte: data.description_courte,
          description: data.description,
          devis: data.devis,
          client: data.client ?? null,
          client_contacts: data.client_contacts ?? [],
          team: data.users_permissions_users ?? [],
        });
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [documentId]);

  return (
    <div className="drawer-scrim open" onClick={onClose}>
      <div className="drawer open adm-drawer" onClick={(e) => e.stopPropagation()}>

        <div className="drawer-head">
          <div>
            {project && (
              <>
                <span className="d-num">Projet N°{project.number ?? '—'}</span>
                {project.type && (
                  <><span style={{ margin: '0 12px', color: 'var(--ink-faint)' }}>·</span>
                  <span className="d-tag">{project.type}</span></>
                )}
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {project && (
              <Link
                href={`/admin/projets/${project.documentId}/modifier`}
                className="adm-link"
                style={{ fontSize: 12 }}
                onClick={onClose}
              >
                Modifier →
              </Link>
            )}
            <button className="close-btn" onClick={onClose}>Fermer ✕</button>
          </div>
        </div>

        <div className="drawer-scroll">
          {loading ? (
            <div className="drawer-body">
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-muted)' }}>Chargement…</p>
            </div>
          ) : !project ? (
            <div className="drawer-body">
              <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>Erreur de chargement.</p>
            </div>
          ) : (
            <div className="drawer-body">

              {project.kicker && <div className="adm-drawer-kicker">{project.kicker}</div>}
              <h2 className="d-title">{project.titre}</h2>

              {(project.description_courte || project.description) && (
                <div className="adm-drawer-section">
                  <div className="dc-head">— Description</div>
                  {project.description_courte && (
                    <p className="adm-drawer-desc-short">{project.description_courte}</p>
                  )}
                  {project.description && (
                    <p className="adm-drawer-desc">{project.description}</p>
                  )}
                </div>
              )}

              <div className="adm-drawer-section">
                <div className="dc-head">— Contacts</div>

                {project.client ? (
                  <div className="adm-drawer-contact">
                    <div className="adm-drawer-contact-role">Entreprise</div>
                    <div className="adm-drawer-contact-name">{project.client.nom}</div>
                    {project.client.adresse && (
                      <div className="adm-drawer-contact-email">{project.client.adresse}</div>
                    )}
                  </div>
                ) : (
                  <p className="adm-drawer-empty">Aucun client assigné</p>
                )}

                {project.client_contacts && project.client_contacts.length > 0 && (
                  <>
                    <div style={{ height: 16 }} />
                    <div className="adm-drawer-contact-role" style={{ marginBottom: 8 }}>Contacts projet</div>
                    {project.client_contacts.map((c, i) => (
                      <div key={i} className="adm-drawer-contact">
                        <div className="adm-drawer-contact-role">{c.role_label ?? 'Contact'}</div>
                        <div className="adm-drawer-contact-name">{c.display_name ?? c.email}</div>
                        <div className="adm-drawer-contact-email">{c.email}</div>
                      </div>
                    ))}
                  </>
                )}

                {project.team && project.team.length > 0 && (
                  <>
                    <div style={{ height: 16 }} />
                    <div className="adm-drawer-contact-role" style={{ marginBottom: 8 }}>Équipe Wharf</div>
                    {project.team.map((m, i) => (
                      <div key={i} className="adm-drawer-contact">
                        <div className="adm-drawer-contact-role">{m.role_label ?? '—'}</div>
                        <div className="adm-drawer-contact-name">{m.display_name ?? m.email}</div>
                        <div className="adm-drawer-contact-email">{m.email}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="adm-drawer-section">
                <div className="dc-head">— Informations</div>
                <div className="adm-drawer-meta-grid">
                  <span className="adm-drawer-meta-label">Statut</span>
                  <span>{STATUT_LABEL[project.statut ?? ''] ?? project.statut ?? '—'}</span>
                  <span className="adm-drawer-meta-label">Deadline</span>
                  <span>{fmtDate(project.deadline)}</span>
                  {project.devis && (
                    <>
                      <span className="adm-drawer-meta-label">Devis</span>
                      <span>{project.devis}</span>
                    </>
                  )}
                </div>
              </div>

              {project.slug && (
                <div style={{ marginTop: 32 }}>
                  <Link href={`/projets/${project.slug}`} className="adm-link">
                    Voir le kanban client →
                  </Link>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
