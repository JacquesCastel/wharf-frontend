import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../lib/auth';
import { ContactStatus, prospectStore, ProspectError } from '../../lib/prospection';
import { mailSettings, sendDraft } from '../../lib/gandi-mail';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' };
export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== 'admin') return NextResponse.json({ error: 'Accès réservé à Wharf.' }, { status: 403, headers });
  try { return NextResponse.json({ ...(await prospectStore.snapshot()), settings: mailSettings() }, { headers }); }
  catch { return NextResponse.json({ error: 'Le stockage privé est indisponible.' }, { status: 503, headers }); }
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== 'admin') return NextResponse.json({ error: 'Accès réservé à Wharf.' }, { status: 403, headers });
  if (req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({ error: 'Origine refusée.' }, { status: 403, headers });
  try {
    const raw = await req.text();
    if (raw.length > 12000) throw new ProspectError('Message trop volumineux.', 413);
    const input = JSON.parse(raw);
    switch (input.action) {
      case 'contact': await prospectStore.addContact(input); break;
      case 'draft': { const id = await prospectStore.saveDraft(input); return NextResponse.json({ id, preview: await prospectStore.preview(id, 'https://bywharf.com') }, { headers }); }
      case 'preview': return NextResponse.json({ preview: await prospectStore.preview(String(input.id), 'https://bywharf.com') }, { headers });
      case 'send':
        if (input.confirm !== true) throw new ProspectError('Validez explicitement ce message avant envoi.');
        await sendDraft(String(input.id), String(input.reviewHash)); break;
      case 'status': await prospectStore.setStatus(String(input.id), input.status as ContactStatus); break;
      default: throw new ProspectError('Action inconnue.');
    }
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    return NextResponse.json({ error: error instanceof ProspectError ? error.message : 'Opération impossible. Aucun renvoi automatique.' }, { status: error instanceof ProspectError ? error.status : 500, headers });
  }
}
