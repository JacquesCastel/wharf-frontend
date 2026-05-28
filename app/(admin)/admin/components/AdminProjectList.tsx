'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminProjectDrawer from './AdminProjectDrawer';

interface AdminProject {
  id: number;
  documentId: string;
  number?: string;
  titre: string;
  slug?: string;
  statut: string;
  archived?: boolean;
  deadline?: string;
  type?: string;
  kicker?: string;
  client?: { display_name?: string; email: string } | null;
}

const STATUT_LABEL: Record<string, string> = {
  en_cours: 'En cours',
  termine: 'Livré',
  en_pause: 'En pause',
};

const STATUT_CLASS: Record<string, string> = {
  en_cours: 'adm-statut-encours',
  termine: 'adm-statut-done',
  en_pause: 'adm-statut-pause',
};

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminProjectList({
  projets,
  showArchived,
}: {
  projets: AdminProject[];
  showArchived: boolean;
}) {
  const router = useRouter();
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [batchError, setBatchError] = useState<string | null>(null);

  const allSelected = selected.size === projets.length && projets.length > 0;
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(projets.map((p) => p.documentId)));
    }
  }

  function toggleOne(docId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  }

  async function handleBatchArchive(archive: boolean) {
    setBatchError(null);
    const documentIds = [...selected];
    try {
      const res = await fetch('/api/admin/projets/batch', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds, archived: archive }),
      });
      if (!res.ok) {
        const json = await res.json();
        setBatchError(json.error ?? 'Erreur');
        return;
      }
      setSelected(new Set());
      startTransition(() => router.refresh());
    } catch {
      setBatchError('Erreur réseau');
    }
  }

  return (
    <>
      <div className="adm-list-head">
        <div className="adm-col-check">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
            onChange={toggleAll}
            className="adm-check"
            title="Tout sélectionner"
          />
        </div>
        <div>N°</div>
        <div>Projet</div>
        <div>Client</div>
        <div>Statut</div>
        <div>Deadline</div>
        <div></div>
      </div>

      <div className="adm-list">
        {projets.map((p) => (
          <div
            key={p.id}
            className={`adm-row${activeDocId === p.documentId ? ' adm-row-active' : ''}${selected.has(p.documentId) ? ' adm-row-selected' : ''}`}
            onClick={() => setActiveDocId(p.documentId)}
            style={{ cursor: 'pointer' }}
          >
            <div className="adm-col-check" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selected.has(p.documentId)}
                onChange={() => toggleOne(p.documentId)}
                className="adm-check"
              />
            </div>
            <div className="adm-num">{p.number ?? '—'}</div>
            <div className="adm-title-block">
              <div className="adm-kicker">{[p.type, p.kicker].filter(Boolean).join(' · ')}</div>
              <div className="adm-title">{p.titre}</div>
            </div>
            <div className="adm-client">
              {p.client ? (
                <span className="adm-client-name">{p.client.display_name ?? p.client.email}</span>
              ) : (
                <span className="adm-no-client">— Non assigné</span>
              )}
            </div>
            <div>
              <span className={`adm-statut ${STATUT_CLASS[p.statut] ?? ''}`}>
                {STATUT_LABEL[p.statut] ?? p.statut}
              </span>
            </div>
            <div className="adm-deadline">{fmtDate(p.deadline)}</div>
            <div className="adm-actions" onClick={(e) => e.stopPropagation()}>
              <Link href={`/admin/projets/${p.documentId}/modifier`} className="adm-link">
                Modifier
              </Link>
              {p.slug && (
                <Link href={`/projets/${p.slug}`} className="adm-link">
                  Kanban →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {someSelected && (
        <div className="adm-batch-bar">
          <span className="adm-batch-count">
            {selected.size} projet{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
          </span>
          {batchError && <span className="adm-batch-error">{batchError}</span>}
          <div className="adm-batch-actions">
            {showArchived ? (
              <button
                className="btn-primary"
                onClick={() => handleBatchArchive(false)}
                disabled={isPending}
              >
                {isPending ? '…' : 'Désarchiver'}
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => handleBatchArchive(true)}
                disabled={isPending}
              >
                {isPending ? '…' : 'Archiver'}
              </button>
            )}
            <button className="btn-ghost" onClick={() => setSelected(new Set())} disabled={isPending}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {activeDocId && (
        <AdminProjectDrawer
          documentId={activeDocId}
          onClose={() => setActiveDocId(null)}
        />
      )}
    </>
  );
}
