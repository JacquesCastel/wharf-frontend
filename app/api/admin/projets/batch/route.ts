import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const STRAPI = process.env.STRAPI_URL ?? '';
const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN ?? '';

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { documentIds, archived } = await req.json();

  if (!Array.isArray(documentIds) || documentIds.length === 0) {
    return NextResponse.json({ error: 'documentIds requis' }, { status: 400 });
  }

  // Fetch each project's required fields before updating (titre required by Strapi)
  const projects = await Promise.all(
    documentIds.map(async (docId: string) => {
      const res = await fetch(`${STRAPI}/api/projet-clients/${docId}?fields[0]=titre&fields[1]=slug`, {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const { data } = await res.json();
      return data ? { docId, titre: data.titre, slug: data.slug } : null;
    })
  );

  const results = await Promise.allSettled(
    projects.filter(Boolean).map((p: any) =>
      fetch(`${STRAPI}/api/projet-clients/${p.docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ data: { titre: p.titre, slug: p.slug, archived } }),
      })
    )
  );

  const failed = results.filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok)).length;

  if (failed > 0) {
    return NextResponse.json({ error: `${failed} mise(s) à jour échouée(s)` }, { status: 500 });
  }

  return NextResponse.json({ updated: documentIds.length });
}
