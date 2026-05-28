import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/cards/${id}?populate[commentaires][sort]=date:asc&populate[item]=*`,
    {
      headers: { Authorization: `Bearer ${session.user.jwt}` },
      cache: 'no-store',
    }
  );

  if (!res.ok) return NextResponse.json({ error: 'Strapi error' }, { status: 500 });
  const json = await res.json();
  return NextResponse.json(json.data ?? {});
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { columnId, title, lede, description, checklist, archived, requires_action } = await req.json();

  const data: Record<string, any> = {};
  if (columnId !== undefined) data.colum = columnId;
  if (title !== undefined) data.title = title;
  if (lede !== undefined) data.lede = lede;
  if (description !== undefined) data.description = description;
  if (checklist !== undefined) data.item = checklist;
  if (archived !== undefined) data.archived = archived;
  if (requires_action !== undefined) data.requires_action = requires_action;

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/cards/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.jwt}`,
      },
      body: JSON.stringify({ data }),
    }
  );

  if (!res.ok) return NextResponse.json({ error: 'Strapi error' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
