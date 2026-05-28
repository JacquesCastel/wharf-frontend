import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const q = [
    'populate[client][fields][0]=id',
    'populate[client][fields][1]=nom',
    'populate[client][fields][2]=adresse',
    'populate[users_permissions_users][fields][0]=display_name',
    'populate[users_permissions_users][fields][1]=email',
    'populate[users_permissions_users][fields][2]=role_label',
    'populate[users_permissions_users][fields][3]=initials',
    'populate[client_contacts][fields][0]=id',
    'populate[client_contacts][fields][1]=documentId',
    'populate[client_contacts][fields][2]=display_name',
    'populate[client_contacts][fields][3]=email',
    'populate[client_contacts][fields][4]=role_label',
  ].join('&');

  const res = await fetch(`${STRAPI}/api/projet-clients/${id}?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const { data } = await res.json();
  return NextResponse.json(data ?? {});
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { titre, slug, type, kicker, description_courte, deadline, statut, devis, clientId, contactIds } = body;

  const data: Record<string, any> = {};

  if (titre?.trim()) data.titre = titre.trim();
  if (slug?.trim()) data.slug = slug.trim();
  if (type !== undefined) data.type = type || null;
  if (kicker !== undefined) data.kicker = kicker || null;
  if (description_courte !== undefined) data.description_courte = description_courte || null;
  if (deadline !== undefined) data.deadline = deadline || null;
  if (statut) data.statut = statut;
  if (devis !== undefined) data.devis = devis || null;
  if (clientId !== undefined) data.client = clientId || null;
  if (Array.isArray(contactIds)) data.client_contacts = contactIds;

  const res = await fetch(`${STRAPI}/api/projet-clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errors = err?.error?.details?.errors ?? [];
    const isSlugConflict = errors.some(
      (e: any) => e?.path?.includes('slug') && e?.message?.toLowerCase().includes('unique')
    );
    if (isSlugConflict) {
      return NextResponse.json({ error: 'Ce slug est déjà utilisé.' }, { status: 400 });
    }
    return NextResponse.json({ error: err?.error?.message ?? 'Erreur Strapi' }, { status: 500 });
  }

  const json = await res.json();
  return NextResponse.json({ documentId: json.data?.documentId ?? id });
}
