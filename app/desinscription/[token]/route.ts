import { NextRequest, NextResponse } from 'next/server';
import { prospectStore } from '../../lib/prospection';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = {
  'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; form-action 'self'; frame-ancestors 'none'",
};
function page(text: string, form = '') {
  return '<!doctype html><html lang="fr"><head><meta name="viewport" content="width=device-width"><title>Vos choix — Wharf</title></head><body><main><h1>Prospection Wharf</h1><p>' + text + '</p>' + form + '<p>Contact : contact@bywharf.com</p></main></body></html>';
}
export async function GET(_req: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{64}$/.test(token)) return new NextResponse(page('Ce lien est invalide.'), { status: 404, headers });
  // GET is deliberately read-only: scanners must not unsubscribe someone.
  return new NextResponse(page('Confirmez pour ne plus recevoir de sollicitation commerciale de WHARF.', '<form method="post"><button type="submit">Ne plus recevoir de sollicitation</button></form>'), { headers });
}
export async function POST(req: NextRequest, context: { params: Promise<{ token: string }> }) {
  if (req.headers.get('origin') !== req.nextUrl.origin) return new NextResponse(page('Veuillez ouvrir le lien puis confirmer votre choix.'), { status: 403, headers });
  try {
    await prospectStore.unsubscribe((await context.params).token);
    return new NextResponse(page('Votre opposition a été enregistrée. Nous ne vous adresserons plus de sollicitation commerciale.'), { headers });
  } catch {
    return new NextResponse(page('Ce lien n’a pas pu être traité. Écrivez à contact@bywharf.com pour exercer votre opposition.'), { status: 400, headers });
  }
}

