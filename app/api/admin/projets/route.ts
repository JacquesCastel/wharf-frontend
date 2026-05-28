import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ADMIN_TOKEN) {
    return NextResponse.json({ error: 'STRAPI_ADMIN_TOKEN manquant' }, { status: 500 });
  }

  const body = await req.json();
  const { titre, slug, type, kicker, description_courte, deadline, clientId, contactIds } = body;

  if (!titre?.trim() || !slug?.trim()) {
    return NextResponse.json({ error: 'Titre et slug requis' }, { status: 400 });
  }

  // Calcul du prochain numéro
  const countRes = await fetch(`${STRAPI}/api/projet-clients?pagination[limit]=1&pagination[withCount]=true`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });
  const countJson = countRes.ok ? await countRes.json() : null;
  const total = countJson?.meta?.pagination?.total ?? 0;
  const number = String(total + 1).padStart(2, '0');

  const data: Record<string, any> = {
    titre: titre.trim(),
    slug: slug.trim(),
    number,
    statut: 'en_cours',
  };

  if (type?.trim()) data.type = type.trim();
  if (kicker?.trim()) data.kicker = kicker.trim();
  if (description_courte?.trim()) data.description_courte = description_courte.trim();
  if (deadline) data.deadline = deadline;
  if (clientId) data.client = clientId;
  if (Array.isArray(contactIds) && contactIds.length > 0) data.client_contacts = contactIds;

  const res = await fetch(`${STRAPI}/api/projet-clients`, {
    method: 'POST',
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
      return NextResponse.json({ error: 'Ce slug est déjà utilisé. Modifiez-le pour le rendre unique.' }, { status: 400 });
    }
    const strapiMsg = err?.error?.message ?? JSON.stringify(err);
    return NextResponse.json({ error: `Erreur Strapi : ${strapiMsg}` }, { status: 500 });
  }

  const json = await res.json();
  return NextResponse.json({ slug: json.data?.slug ?? slug, documentId: json.data?.documentId });
}
