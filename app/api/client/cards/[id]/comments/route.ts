import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { contenu, type_commentaire, cardNumericId } = await req.json();

  if (!contenu?.trim()) {
    return NextResponse.json({ error: 'Contenu requis' }, { status: 400 });
  }

  const res = await fetch(`${process.env.STRAPI_URL}/api/commentaires`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.jwt}`,
    },
    body: JSON.stringify({
      data: {
        contenu: contenu.trim(),
        date: new Date().toISOString(),
        type_commentaire: type_commentaire ?? 'commentaire',
        auteur_nom: session.user.name ?? 'Client',
        auteur_type: 'client',
        card: cardNumericId ?? Number(id),
        publishedAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Strapi commentaire error:', err);
    return NextResponse.json({ error: 'Strapi error' }, { status: 500 });
  }

  const json = await res.json();
  return NextResponse.json(json.data ?? {});
}
