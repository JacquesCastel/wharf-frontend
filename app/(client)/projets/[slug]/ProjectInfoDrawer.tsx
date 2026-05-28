'use client';

import { useState } from 'react';
import type { ProjetClient } from '../../lib/api';

function fmtDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProjectInfoDrawer({ projet }: { projet: ProjetClient }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="filter-btn" onClick={() => setOpen(true)}>
        Lire le projet
      </button>

      {open && (
        <div className="drawer-scrim open" onClick={() => setOpen(false)}>
          <div className="drawer open" onClick={(e) => e.stopPropagation()}>

            <div className="drawer-head">
              <div>
                <span className="d-num">Dossier de projet</span>
                {projet.number && (
                  <><span style={{ margin: '0 10px', color: 'var(--ink-faint)' }}>·</span>
                  <span>N°{projet.number}</span></>
                )}
              </div>
              <button className="close-btn" onClick={() => setOpen(false)}>Fermer ✕</button>
            </div>

            <div className="drawer-scroll">
              <div className="drawer-body">
                {projet.type && <div className="d-tag" style={{ marginBottom: 12 }}>{projet.type}</div>}
                <h2 className="d-title">{projet.titre}</h2>
                {projet.kicker && <p className="d-lede">{projet.kicker}</p>}

                {/* Infos clés */}
                <div className="proj-info-grid">
                  {fmtDate(projet.date_debut) && (
                    <div className="proj-info-row">
                      <span className="proj-info-label">Date de lancement</span>
                      <span className="proj-info-val">{fmtDate(projet.date_debut)}</span>
                    </div>
                  )}
                  {fmtDate(projet.deadline) && (
                    <div className="proj-info-row">
                      <span className="proj-info-label">Date de livraison</span>
                      <span className="proj-info-val">{fmtDate(projet.deadline)}</span>
                    </div>
                  )}
                  {projet.devis && (
                    <div className="proj-info-row">
                      <span className="proj-info-label">Devis</span>
                      <span className="proj-info-val">{projet.devis}</span>
                    </div>
                  )}
                  {(projet as any).facture && (
                    <div className="proj-info-row">
                      <span className="proj-info-label">Facture</span>
                      <span className="proj-info-val">{(projet as any).facture}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {(projet.description_courte || (projet as any).description) && (
                  <>
                    <div className="dc-head">— À propos du projet</div>
                    {projet.description_courte && (
                      <p className="d-lede" style={{ fontStyle: 'normal' }}>{projet.description_courte}</p>
                    )}
                    {(projet as any).description && (
                      <p className="d-desc">{(projet as any).description}</p>
                    )}
                  </>
                )}

                {/* Équipe */}
                {(projet.lead || (projet.team ?? []).length > 0) && (
                  <>
                    <div className="dc-head" style={{ marginTop: 32 }}>— Équipe Wharf</div>
                    {projet.lead && (
                      <div className="proj-info-row">
                        <span className="proj-info-label">Lead</span>
                        <span className="proj-info-val">{projet.lead.display_name}</span>
                      </div>
                    )}
                    {(projet.team ?? []).filter((u) => u.id !== projet.lead?.id).map((u) => (
                      <div key={u.id} className="proj-info-row">
                        <span className="proj-info-label">{u.role_label ?? 'Collaborateur'}</span>
                        <span className="proj-info-val">{u.display_name}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
