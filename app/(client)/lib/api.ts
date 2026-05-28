const STRAPI = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

export async function fetchClient<T>(
  path: string,
  jwt: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${STRAPI}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
      ...options?.headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Strapi error ${res.status} on ${path}`);
  return res.json();
}

export interface StrapiUser {
  id: number;
  display_name?: string;
  initials?: string;
  role_label?: string;
}

export interface ActivityItem {
  id: number;
  contenu: string;
  date: string;
  type_commentaire: 'commentaire' | 'validation' | 'refus';
  auteur_nom: string;
  auteur_type?: 'client' | 'admin';
  cardTitle?: string;
  cardNumber?: string;
  columnTitle?: string;
}

export interface ProjetClient {
  id: number;
  documentId: string;
  titre: string;
  number?: string;
  slug?: string;
  type?: string;
  kicker?: string;
  description_courte?: string;
  description?: string;
  devis?: string;
  facture?: string;
  statut?: 'en_cours' | 'termine' | 'en_pause';
  deadline?: string;
  date_debut?: string;
  progress?: number;
  lead?: StrapiUser;
  team?: StrapiUser[];
  columns?: Column[];
  columnIds?: number[];
}

export interface Card {
  id: number;
  documentId: string;
  title: string;
  number?: string;
  description?: string;
  lede?: string;
  order?: number;
  due?: string;
  requires_action?: boolean;
  tag?: string;
  archived?: boolean;
  assignee?: StrapiUser;
  checklist?: { txt: string; done: boolean }[];
}

export interface Column {
  id: number;
  documentId: string;
  title: string;
  kicker?: string;
  order: number;
  accent?: string;
  cards?: Card[];
}

function formatDue(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return "Aujourd'hui";
  if (d < today) {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ' (retard)';
  }
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function normalizeCard(c: any): Card {
  return {
    id: c.id,
    documentId: c.documentId,
    title: c.title,
    number: c.number,
    description: c.description,
    lede: c.lede,
    order: c.order,
    due: formatDue(c.due),
    requires_action: c.requires_action,
    tag: c.tag,
    archived: c.archived ?? false,
    assignee: c.assignee
      ? {
          id: c.assignee.id,
          display_name: c.assignee.display_name,
          initials: c.assignee.initials,
        }
      : undefined,
    checklist: c.item ?? c.checklist ?? [],
  };
}

function normalizeColumn(col: any): Column {
  return {
    id: col.id,
    documentId: col.documentId,
    title: col.title,
    kicker: col.kicker,
    order: col.order ?? 0,
    accent: col.accent,
    cards: (col.cards ?? []).map(normalizeCard),
  };
}

function normalizeProjet(p: any): ProjetClient {
  // Strapi stores lead as users_permissions_user, team as users_permissions_users, columns as colums
  const lead = p.users_permissions_user ?? p.lead;
  const team = p.users_permissions_users ?? p.team ?? [];
  const colums = p.colums ?? p.columns ?? [];

  // Deduplicate columns by accent, keeping the one with the most cards (in case lifecycle fired twice)
  const seen = new Map<string, any>();
  for (const col of colums) {
    const key = col.accent ?? String(col.id);
    const existing = seen.get(key);
    const colCards = (col.cards ?? []).length;
    const existCards = existing ? (existing.cards ?? []).length : -1;
    if (!existing || colCards > existCards || (colCards === existCards && col.id > existing.id)) {
      seen.set(key, col);
    }
  }
  const uniqueColumns = [...seen.values()];

  return {
    id: p.id,
    documentId: p.documentId,
    titre: p.titre,
    number: p.number,
    slug: p.slug,
    type: p.type,
    kicker: p.kicker,
    statut: p.statut,
    deadline: p.deadline,
    date_debut: p.date_debut,
    description_courte: p.description_courte,
    description: p.description,
    devis: p.devis,
    facture: p.facture,
    progress: p.progress,
    lead: lead ? { id: lead.id, display_name: lead.display_name, initials: lead.initials } : undefined,
    team: Array.isArray(team)
      ? team.map((u: any) => ({ id: u.id, display_name: u.display_name, initials: u.initials }))
      : [],
    columns: uniqueColumns.map(normalizeColumn),
    columnIds: colums.map((c: any) => c.id),
  };
}

function userPopulate(key: string): string[] {
  return [
    `populate[${key}][fields][0]=id`,
    `populate[${key}][fields][1]=username`,
    `populate[${key}][fields][2]=display_name`,
    `populate[${key}][fields][3]=initials`,
  ];
}

export async function getProjets(jwt: string, strapiUserId?: string | null, adminToken?: string): Promise<ProjetClient[]> {
  // Use adminToken server-side to filter by client_contacts (client JWT cannot filter on this relation)
  const effectiveJwt = (strapiUserId && adminToken) ? adminToken : jwt;
  const q = [
    strapiUserId ? `filters[client_contacts][id][$eq]=${strapiUserId}` : '',
    ...userPopulate('users_permissions_user'),
    ...userPopulate('users_permissions_users'),
    'populate[colums][fields][0]=id',
    'sort=createdAt:desc',
  ].filter(Boolean).join('&');
  const data = await fetchClient<{ data: any[] }>(`/api/projet-clients?${q}`, effectiveJwt);
  return (data.data ?? []).map(normalizeProjet);
}

export async function getProjet(slug: string, jwt: string): Promise<ProjetClient | null> {
  const q = [
    `filters[slug][$eq]=${slug}`,
    ...userPopulate('users_permissions_user'),
    ...userPopulate('users_permissions_users'),
    'populate[colums][populate]=cards',
  ].join('&');
  const data = await fetchClient<{ data: any[] }>(`/api/projet-clients?${q}`, jwt);
  return data.data?.[0] ? normalizeProjet(data.data[0]) : null;
}

export async function getProjetById(id: string, jwt: string): Promise<ProjetClient | null> {
  const q = [
    ...userPopulate('users_permissions_user'),
    ...userPopulate('users_permissions_users'),
    'populate[colums][populate]=cards',
  ].join('&');
  const data = await fetchClient<{ data: any }>(`/api/projet-clients/${id}?${q}`, jwt);
  return data.data ? normalizeProjet(data.data) : null;
}

export async function getProjectActivity(columnIds: number[], jwt: string): Promise<ActivityItem[]> {
  if (columnIds.length === 0) return [];
  try {
    const colFilters = columnIds
      .map((id, i) => `filters[card][colum][id][$in][${i}]=${id}`)
      .join('&');
    const q = [
      colFilters,
      'sort=date:desc',
      'pagination[limit]=3',
      'populate[card][populate][colum][fields][0]=title',
    ].join('&');
    const data = await fetchClient<{ data: any[] }>(`/api/commentaires?${q}`, jwt);
    return (data.data ?? []).map((c: any) => ({
      id: c.id,
      contenu: c.contenu,
      date: c.date,
      type_commentaire: c.type_commentaire,
      auteur_nom: c.auteur_nom,
      auteur_type: c.auteur_type,
      cardTitle: c.card?.title,
      cardNumber: c.card?.number,
      columnTitle: c.card?.colum?.title,
    }));
  } catch {
    return [];
  }
}
