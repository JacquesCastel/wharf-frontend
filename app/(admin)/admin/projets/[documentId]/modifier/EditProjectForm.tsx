'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Client {
  id: number;
  nom: string;
}

interface Contact {
  id: number;
  documentId: string;
  display_name: string;
  email: string;
  role_label?: string | null;
}

export default function EditProjectForm({
  documentId,
  projet,
  clients,
}: {
  documentId: string;
  projet: any;
  clients: Client[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [selectedContactDocIds, setSelectedContactDocIds] = useState<string[]>(
    (projet.client_contacts ?? []).map((c: any) => c.documentId ?? String(c.id))
  );

  const [form, setForm] = useState({
    titre: projet.titre ?? '',
    slug: projet.slug ?? '',
    type: projet.type ?? '',
    kicker: projet.kicker ?? '',
    description_courte: projet.description_courte ?? '',
    deadline: projet.deadline ?? '',
    statut: projet.statut ?? 'en_cours',
    devis: projet.devis ?? '',
    clientId: projet.client?.id ? String(projet.client.id) : '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    if (!form.clientId) {
      setContacts([]);
      return;
    }
    setLoadingContacts(true);
    fetch(`/api/admin/clients/${form.clientId}/contacts`)
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, [form.clientId]);

  // When client changes, reset contacts selection
  const [prevClientId, setPrevClientId] = useState(form.clientId);
  useEffect(() => {
    if (form.clientId !== prevClientId) {
      setSelectedContactDocIds([]);
      setPrevClientId(form.clientId);
    }
  }, [form.clientId, prevClientId]);

  function toggleContact(docId: string) {
    setSelectedContactDocIds((prev) =>
      prev.includes(docId) ? prev.filter((x) => x !== docId) : [...prev, docId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titre.trim() || !form.slug.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/projets/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          clientId: form.clientId ? Number(form.clientId) : null,
          contactIds: selectedContactDocIds,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? `Erreur ${res.status}`);
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>

      <div className="adm-form-section">
        <div className="adm-form-label">— Identité du projet</div>

        <div className="adm-field">
          <label htmlFor="titre">Titre <span className="adm-required">*</span></label>
          <input
            id="titre"
            type="text"
            value={form.titre}
            onChange={(e) => set('titre', e.target.value)}
            required
          />
        </div>

        <div className="adm-field">
          <label htmlFor="slug">
            Slug <span className="adm-required">*</span>
            <span className="adm-field-hint">— URL : {form.slug ? `/projets/${form.slug}` : '…'}</span>
          </label>
          <input
            id="slug"
            type="text"
            value={form.slug}
            onChange={(e) => set('slug', e.target.value)}
            required
          />
        </div>

        <div className="adm-field-row">
          <div className="adm-field">
            <label htmlFor="type">Type</label>
            <select id="type" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="">— Sélectionner un type</option>
              <option value="brand-narrative">Brand narrative</option>
              <option value="editorial">Éditorial</option>
              <option value="identity">Identité</option>
              <option value="content">Contenu</option>
              <option value="film">Film</option>
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="kicker">Kicker</label>
            <input
              id="kicker"
              type="text"
              value={form.kicker}
              onChange={(e) => set('kicker', e.target.value)}
            />
          </div>
        </div>

        <div className="adm-field">
          <label htmlFor="description_courte">Description courte</label>
          <textarea
            id="description_courte"
            value={form.description_courte}
            onChange={(e) => set('description_courte', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="adm-form-section">
        <div className="adm-form-label">— Statut & calendrier</div>

        <div className="adm-field-row">
          <div className="adm-field">
            <label htmlFor="statut">Statut</label>
            <select id="statut" value={form.statut} onChange={(e) => set('statut', e.target.value)}>
              <option value="en_cours">En cours</option>
              <option value="en_pause">En pause</option>
              <option value="termine">Livré</option>
            </select>
          </div>
          <div className="adm-field">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
            />
          </div>
        </div>

        <div className="adm-field">
          <label htmlFor="devis">Devis</label>
          <input
            id="devis"
            type="text"
            value={form.devis}
            onChange={(e) => set('devis', e.target.value)}
            placeholder="DEV-2026-001"
          />
        </div>
      </div>

      <div className="adm-form-section">
        <div className="adm-form-label">— Client & contacts</div>

        <div className="adm-field">
          <label htmlFor="clientId">Client assigné</label>
          <select
            id="clientId"
            value={form.clientId}
            onChange={(e) => set('clientId', e.target.value)}
          >
            <option value="">— Aucun client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>

        {form.clientId && (
          <div className="adm-field">
            <label>
              Contacts du projet
              {contacts.length > 0 && (
                <span className="adm-field-hint">— {selectedContactDocIds.length} sélectionné{selectedContactDocIds.length > 1 ? 's' : ''}</span>
              )}
            </label>

            {loadingContacts ? (
              <p className="adm-contacts-empty">Chargement…</p>
            ) : contacts.length === 0 ? (
              <p className="adm-contacts-empty">Aucun contact pour ce client</p>
            ) : (
              <div className="adm-contacts-list">
                {contacts.map((c) => (
                  <label key={c.id} className="adm-contact-check">
                    <input
                      type="checkbox"
                      checked={selectedContactDocIds.includes(c.documentId)}
                      onChange={() => toggleContact(c.documentId)}
                    />
                    <span className="adm-contact-check-info">
                      <span className="adm-contact-check-name">{c.display_name}</span>
                      {c.role_label && <span className="adm-contact-check-role">{c.role_label}</span>}
                      <span className="adm-contact-check-email">{c.email}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="adm-form-error">{error}</p>}

      <div className="adm-form-actions">
        <button type="submit" className="btn-primary" disabled={saving || !form.titre.trim() || !form.slug.trim()}>
          {saving ? 'Enregistrement…' : 'Enregistrer les modifications →'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.push('/admin')} disabled={saving}>
          Annuler
        </button>
      </div>

    </form>
  );
}
