import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
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
    `filters[client][id][$eq]=${id}`,
    'fields[0]=id',
    'fields[1]=documentId',
    'fields[2]=display_name',
    'fields[3]=email',
    'fields[4]=role_label',
    'pagination[limit]=100',
  ].join('&');

  const res = await fetch(`${STRAPI}/api/users?${q}`, {
    headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    cache: 'no-store',
  });

  if (!res.ok) return NextResponse.json([], { status: 200 });
  const data = await res.json();
  return NextResponse.json(
    (Array.isArray(data) ? data : []).map((u: any) => ({
      id: u.id,
      documentId: u.documentId,
      display_name: u.display_name ?? u.email,
      email: u.email,
      role_label: u.role_label ?? null,
    }))
  );
}
