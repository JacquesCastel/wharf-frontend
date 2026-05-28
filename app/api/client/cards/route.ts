import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, columnId } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: 'Titre requis' }, { status: 400 });
  if (!columnId) return NextResponse.json({ error: 'columnId requis' }, { status: 400 });

  const res = await fetch(`${process.env.STRAPI_URL}/api/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.jwt}`,
    },
    body: JSON.stringify({
      data: {
        title: title.trim(),
        colum: columnId,
        publishedAt: new Date().toISOString(),
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message ?? err?.message ?? JSON.stringify(err);
    console.error('Strapi card create error:', msg, err);
    return NextResponse.json({ error: msg }, { status: res.status });
  }

  const json = await res.json();
  return NextResponse.json(json.data ?? {});
}
