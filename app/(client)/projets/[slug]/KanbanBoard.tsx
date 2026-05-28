'use client';

import { useState, useRef, useEffect } from 'react';
import type { Column, Card } from '../../lib/api';

const NUMERALS = ['i', 'ii', 'iii', 'iv', 'v'];
const COL_DOT_CLASS: Record<string, string> = {
  brief: 'col-brief',
  writing: 'col-writing',
  layout: 'col-active',
  validation: 'col-validation',
  done: 'col-done',
};

interface Comment {
  id: number;
  contenu: string;
  date: string;
  type_commentaire: 'commentaire' | 'validation' | 'refus';
  auteur_nom: string;
  auteur_type: 'client' | 'admin';
}

interface ChecklistItem { txt: string; done: boolean; }

// ── Editable field ──────────────────────────────────────────────────────────

function EField({
  value, onChange, tag, className, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  tag: 'h2' | 'p';
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value.trim()) onChange(trimmed);
  }

  if (editing) {
    const shared = {
      className: tag === 'h2' ? 'ef-input ef-h2' : `ef-input ef-p ${className ?? ''}`,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      autoFocus: true,
    };
    if (tag === 'h2') {
      return (
        <input
          {...shared}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setDraft(value); setEditing(false); }
          }}
        />
      );
    }
    return (
      <textarea
        {...(shared as any)}
        rows={4}
        onKeyDown={(e) => { if (e.key === 'Escape') { setDraft(value); setEditing(false); } }}
      />
    );
  }

  const isEmpty = !value;
  if (tag === 'h2') {
    return (
      <h2 className={`d-title ${isEmpty ? 'ef-empty' : ''}`} onClick={() => setEditing(true)} title="Cliquer pour modifier">
        {value || placeholder}
      </h2>
    );
  }
  return (
    <p className={`${className ?? ''} ${isEmpty ? 'ef-empty' : ''}`} onClick={() => setEditing(true)} title="Cliquer pour modifier">
      {value || <span className="ef-placeholder">{placeholder}</span>}
    </p>
  );
}

// ── Checklist ───────────────────────────────────────────────────────────────

function Checklist({ items, onUpdate }: {
  items: ChecklistItem[];
  onUpdate: (items: ChecklistItem[]) => void;
}) {
  const [newItem, setNewItem] = useState('');
  const done = items.filter((i) => i.done).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  function toggle(idx: number) {
    onUpdate(items.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  }

  function remove(idx: number) {
    onUpdate(items.filter((_, i) => i !== idx));
  }

  function add() {
    if (!newItem.trim()) return;
    onUpdate([...items, { txt: newItem.trim(), done: false }]);
    setNewItem('');
  }

  return (
    <div className="cl-section">
      <div className="dc-head">
        — Checklist
        {items.length > 0 && <span className="cl-count">{done}/{items.length}</span>}
      </div>
      {items.length > 0 && (
        <div className="cl-bar-wrap">
          <div className="cl-bar"><div className="cl-fill" style={{ width: `${pct}%` }} /></div>
          <span className="cl-pct">{pct}%</span>
        </div>
      )}
      <div className="cl-list">
        {items.map((item, i) => (
          <div key={i} className={`cl-item${item.done ? ' done' : ''}`}>
            <input type="checkbox" className="cl-check" checked={item.done} onChange={() => toggle(i)} />
            <span className="cl-txt">{item.txt}</span>
            <button className="cl-del" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
      <div className="cl-add-row">
        <input
          className="cl-add-input"
          placeholder="Ajouter un élément…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
        />
        <button className="cl-add-btn" onClick={add} disabled={!newItem.trim()}>+</button>
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function Avatar({ initials, name }: { initials?: string; name?: string }) {
  return <span className="avatar-sm" title={name}>{initials ?? '?'}</span>;
}

function CommentBadge({ type }: { type: Comment['type_commentaire'] }) {
  const labels: Record<string, string> = { commentaire: 'message', validation: 'validé', refus: 'refusé' };
  return <span className={`comment-badge ${type}`}>{labels[type] ?? type}</span>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

// ── Card Drawer ──────────────────────────────────────────────────────────────

function CardDrawer({
  card, onClose, userName, onUpdate,
}: {
  card: Card;
  onClose: () => void;
  userName: string;
  onUpdate: (id: number, updates: Partial<Card>) => void;
}) {
  const [localCard, setLocalCard] = useState<Card>(card);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/client/cards/${card.documentId}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data?.commentaires ?? []);
        setLocalCard((prev) => ({
          ...prev,
          title: data.title ?? prev.title,
          lede: data.lede ?? prev.lede,
          description: data.description ?? prev.description,
          checklist: data.item ?? prev.checklist ?? [],
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [card.documentId]);

  async function save(field: string, value: any) {
    setLocalCard((prev) => ({ ...prev, [field]: value }));
    onUpdate(card.id, { [field]: value } as Partial<Card>);
    setSaveStatus('saving');
    try {
      const res = await fetch(`/api/client/cards/${card.documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      setSaveStatus(res.ok ? 'ok' : 'err');
    } catch {
      setSaveStatus('err');
    }
    setTimeout(() => setSaveStatus('idle'), 2000);
  }

  async function submitComment(type: Comment['type_commentaire']) {
    if (!text.trim() && type === 'commentaire') return;
    const contenu = text.trim() || (type === 'validation' ? 'Validé.' : 'Refusé.');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/client/cards/${card.documentId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenu, type_commentaire: type, cardNumericId: card.id }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments((prev) => [...prev, {
          id: created.id, contenu, date: new Date().toISOString(),
          type_commentaire: type, auteur_nom: userName, auteur_type: 'client',
        }]);
        setText('');
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const checklist: ChecklistItem[] = (localCard as any).checklist ?? [];

  return (
    <div className="drawer-scrim open" onClick={onClose}>
      <div className="drawer open" onClick={(e) => e.stopPropagation()}>

        <div className="drawer-head">
          <div>
            <span className="d-num">Carte N°{localCard.number ?? '—'}</span>
            {localCard.tag && (
              <><span style={{ margin: '0 12px', color: 'var(--ink-faint)' }}>·</span>
              <span className="d-tag">{localCard.tag}</span></>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {saveStatus === 'saving' && <span className="save-status">Enregistrement…</span>}
            {saveStatus === 'ok' && <span className="save-status ok">Enregistré ✓</span>}
            {saveStatus === 'err' && <span className="save-status err">Erreur ✕</span>}
            <button
              className={`archive-btn${localCard.archived ? ' archived' : ''}`}
              onClick={() => save('archived', !localCard.archived)}
            >
              {localCard.archived ? 'Désarchiver' : 'Archiver'}
            </button>
            <button className="close-btn" onClick={onClose}>Fermer ✕</button>
          </div>
        </div>

        <div className="drawer-scroll">
          <div className="drawer-body">
            {localCard.requires_action && (
              <div className="d-action-banner">— Votre décision est attendue</div>
            )}

            <EField
              value={localCard.title}
              onChange={(v) => save('title', v)}
              tag="h2"
              placeholder="Titre de la carte"
            />
            <EField
              value={localCard.lede ?? ''}
              onChange={(v) => save('lede', v)}
              tag="p"
              className="d-lede"
              placeholder="Accroche — cliquer pour ajouter…"
            />
            <EField
              value={localCard.description ?? ''}
              onChange={(v) => save('description', v)}
              tag="p"
              className="d-desc"
              placeholder="Description — cliquer pour ajouter…"
            />

            {localCard.due && (
              <div className="d-meta-row">
                <span>Échéance</span>
                <span className="d-meta-val">{localCard.due}</span>
              </div>
            )}

            <Checklist
              items={checklist}
              onUpdate={(items) => save('checklist', items)}
            />
          </div>

          <div className="drawer-comments">
            <div className="dc-head">— Échanges</div>
            {loading ? (
              <p className="dc-empty">Chargement…</p>
            ) : comments.length === 0 ? (
              <p className="dc-empty">Aucun échange pour le moment.</p>
            ) : (
              <div className="dc-list">
                {comments.map((c) => (
                  <div key={c.id} className={`dc-item ${c.auteur_type}`}>
                    <div className="dc-meta">
                      <span className="dc-author">{c.auteur_nom}</span>
                      <CommentBadge type={c.type_commentaire} />
                      <span className="dc-date">{c.date ? fmtDate(c.date) : ''}</span>
                    </div>
                    <p className="dc-text">{c.contenu}</p>
                  </div>
                ))}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          <div className="drawer-form">
            <textarea
              className="dc-textarea"
              placeholder="Votre message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              disabled={submitting}
            />
            <div className="dc-actions">
              <button
                className="dc-btn secondary"
                onClick={() => submitComment('commentaire')}
                disabled={submitting || !text.trim()}
              >
                Envoyer
              </button>
              {localCard.requires_action && (
                <>
                  <button className="dc-btn validate" onClick={() => submitComment('validation')} disabled={submitting}>
                    ✓ Valider
                  </button>
                  <button className="dc-btn refuse" onClick={() => submitComment('refus')} disabled={submitting}>
                    ✕ Refuser
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({ card, onOpen, dragging, onDragStart, onDragEnd }: {
  card: Card;
  onOpen: (card: Card) => void;
  dragging: boolean;
  onDragStart: (e: React.DragEvent, card: Card) => void;
  onDragEnd: () => void;
}) {
  const isLate = (card.due ?? '').includes('retard');
  const tagClass = card.tag === 'review' ? 'review' : card.tag === 'story' ? 'story' : '';
  const checklist: ChecklistItem[] = (card as any).checklist ?? [];
  const clDone = checklist.filter((i) => i.done).length;

  return (
    <div
      className={`kan-card${card.requires_action ? ' requires-action' : ''}${card.archived ? ' archived' : ''}${dragging ? ' dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(card)}
    >
      <div className="kc-top">
        <span className="kc-num">N°{card.number ?? '—'}</span>
        {card.tag && <span className={`kc-tag ${tagClass}`}>{card.tag}</span>}
      </div>
      <h3 className="kc-title">{card.title}</h3>
      {card.description && <p className="kc-desc">{card.description}</p>}
      <div className="kc-foot">
        <div className="left">
          {card.assignee && <Avatar initials={card.assignee.initials} name={card.assignee.display_name} />}
          {checklist.length > 0 && (
            <span className="kc-cl-badge">{clDone}/{checklist.length}</span>
          )}
        </div>
        {card.due && <span className={`meta-ic${isLate ? ' urgent' : ''}`}>{card.due}</span>}
      </div>
    </div>
  );
}

// ── Add Card Form ────────────────────────────────────────────────────────────

function AddCardForm({ columnId, onAdd }: { columnId: number; onAdd: (card: Card) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/client/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), columnId }),
      });
      const json = await res.json();
      if (res.ok) {
        onAdd({ id: json.id, documentId: json.documentId, title: title.trim(), number: json.number });
        setTitle('');
        setOpen(false);
      } else {
        setError(json.error ?? `Erreur ${res.status}`);
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="add-card-btn" onClick={() => setOpen(true)}>
        + Ajouter une carte
      </button>
    );
  }

  return (
    <div className="add-card-form">
      <input
        autoFocus
        className="add-card-input"
        placeholder="Titre de la carte…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') { setOpen(false); setTitle(''); }
        }}
        disabled={saving}
      />
      <div className="add-card-actions">
        <button className="add-card-ok" onClick={submit} disabled={saving || !title.trim()}>Créer</button>
        <button className="add-card-cancel" onClick={() => { setOpen(false); setTitle(''); setError(null); }}>Annuler</button>
      </div>
      {error && <p className="add-card-error">{error}</p>}
    </div>
  );
}

// ── Kanban Board ─────────────────────────────────────────────────────────────

export default function KanbanBoard({ columns: initialColumns, projectId, jwt, userName }: {
  columns: Column[];
  projectId: string;
  jwt: string;
  userName: string;
}) {
  const [columns, setColumns] = useState(initialColumns);
  const [dragCardId, setDragCardId] = useState<number | null>(null);
  const [overColId, setOverColId] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const sorted = [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const archivedCount = columns.flatMap((c) => c.cards ?? []).filter((c) => c.archived).length;

  function onDragStart(e: React.DragEvent, card: Card) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(card.id));
    setDragCardId(card.id);
  }

  function onDragEnd() { setDragCardId(null); setOverColId(null); }

  async function onDrop(e: React.DragEvent, targetColId: number) {
    e.preventDefault();
    const cardId = Number(e.dataTransfer.getData('text/plain'));
    if (!cardId) return;

    const targetCol = columns.find((c) => c.id === targetColId);
    const sourceCol = columns.find((c) => (c.cards ?? []).some((card) => card.id === cardId));
    const movingToValidation = targetCol?.accent === 'validation';
    const movingFromValidation = sourceCol?.accent === 'validation' && !movingToValidation;
    const requiresActionUpdate = movingToValidation ? true : movingFromValidation ? false : undefined;

    setColumns((prev) => {
      const next = prev.map((col) => ({ ...col, cards: (col.cards ?? []).filter((c) => c.id !== cardId) }));
      return next.map((col) => {
        if (col.id !== targetColId) return col;
        const card = prev.flatMap((c) => c.cards ?? []).find((c) => c.id === cardId);
        if (!card) return col;
        const updatedCard = requiresActionUpdate !== undefined
          ? { ...card, requires_action: requiresActionUpdate }
          : card;
        return { ...col, cards: [...(col.cards ?? []), updatedCard] };
      });
    });

    if (requiresActionUpdate !== undefined) {
      handleCardUpdate(cardId, { requires_action: requiresActionUpdate });
    }

    setOverColId(null);

    try {
      const body: Record<string, any> = { columnId: targetColId };
      if (requiresActionUpdate !== undefined) body.requires_action = requiresActionUpdate;
      await fetch(`/api/client/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch { /* rollback silencieux */ }
  }

  function handleCardUpdate(cardId: number, updates: Partial<Card>) {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: (col.cards ?? []).map((c) => c.id === cardId ? { ...c, ...updates } : c),
      }))
    );
    if (activeCard?.id === cardId) {
      setActiveCard((prev) => prev ? { ...prev, ...updates } : prev);
    }
  }

  return (
    <>
      {archivedCount > 0 && (
        <div className="kanban-toolbar">
          <button
            className={`archive-toggle${showArchived ? ' active' : ''}`}
            onClick={() => setShowArchived((v) => !v)}
          >
            {showArchived ? 'Masquer les archives' : `Voir les archives (${archivedCount})`}
          </button>
        </div>
      )}
      <div className="kanban">
        {sorted.map((col, idx) => {
          const cards = (col.cards ?? [])
            .filter((c) => showArchived || !c.archived)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          const dotClass = COL_DOT_CLASS[col.accent ?? ''] ?? '';

          return (
            <div
              key={col.id}
              className={`kan-col${overColId === col.id ? ' drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOverColId(col.id); }}
              onDragLeave={() => { if (overColId === col.id) setOverColId(null); }}
              onDrop={(e) => onDrop(e, col.id)}
            >
              <div className={`kan-col-head ${dotClass}`}>
                <div className="row1">
                  <span className="col-num">{NUMERALS[idx] ?? idx + 1}.</span>
                  <span className="col-count">
                    <span className="col-dot" />{' '}{(col.cards ?? []).filter((c) => !c.archived).length}
                  </span>
                </div>
                <div className="col-title">{col.title}</div>
                <div className="col-count" style={{ marginTop: 2 }}>{col.kicker}</div>
              </div>
              <div className="kan-list">
                {cards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    onOpen={setActiveCard}
                    dragging={dragCardId === card.id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                ))}
                <AddCardForm
                  columnId={col.id}
                  onAdd={(card) =>
                    setColumns((prev) =>
                      prev.map((c) => c.id === col.id ? { ...c, cards: [...(c.cards ?? []), card] } : c)
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {activeCard && (
        <CardDrawer
          card={activeCard}
          onClose={() => setActiveCard(null)}
          userName={userName}
          onUpdate={handleCardUpdate}
        />
      )}
    </>
  );
}
