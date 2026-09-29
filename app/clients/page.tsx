import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '../lib/auth';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Vidéos et fichiers — Wharf',
  robots: { index: false, follow: false },
};

type Media = { id: number; name: string; mime: string; url: string; size: number; updatedAt: string };
const STRAPI = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'https://admin.bywharf.com';
const types = ['Tous', 'Vidéos', 'Images', 'Audio', 'Documents'] as const;
function category(mime: string) {
  if (mime.startsWith('video/')) return 'Vidéos';
  if (mime.startsWith('image/')) return 'Images';
  if (mime.startsWith('audio/')) return 'Audio';
  return 'Documents';
}
function mediaUrl(path: string) {
  const url = new URL(path, STRAPI);
  if (url.origin !== new URL(STRAPI).origin || !url.pathname.startsWith('/uploads/')) throw new Error('Invalid media URL');
  return url.href;
}
async function loadFiles(): Promise<Media[]> {
  const token = process.env.STRAPI_ADMIN_TOKEN;
  if (!token) throw new Error('Media token unavailable');
  const result: Media[] = [];
  const seen = new Set<number>();
  for (let start = 0; ; start += 100) {
    const response = await fetch(`${STRAPI}/api/upload/files?start=${start}&limit=100&sort=updatedAt:desc`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Media service unavailable');
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Invalid media response');
    for (const file of batch) {
      if (typeof file.id !== 'number' || typeof file.name !== 'string' || typeof file.url !== 'string' || seen.has(file.id)) throw new Error('Invalid media pagination');
      seen.add(file.id);
      result.push({ id: file.id, name: file.name, mime: file.mime || '', url: mediaUrl(file.url), size: Number(file.size) || 0, updatedAt: file.updatedAt });
    }
    if (batch.length < 100) return result;
  }
}

export default async function ClientFilesPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=%2Fclients');
  if (session.user.role !== 'admin') redirect('/sommaire');
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim().slice(0, 200) : '';
  const selected = types.find(type => type === params.type) || 'Tous';
  let files: Media[] = [];
  let failed = false;
  try { files = await loadFiles(); } catch { failed = true; }
  const normalized = query.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr');
  const visible = files.filter(file => (selected === 'Tous' || category(file.mime) === selected) && file.name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr').includes(normalized));
  return <main id="main-content" className={styles.page}>
    <header className={styles.heading}>
      <p>WHARF / MÉDIATHÈQUE</p>
      <h1>Vidéos et fichiers</h1>
      <p>Retrouvez les fichiers hébergés dans la médiathèque Wharf et ouvrez leurs liens de partage.</p>
      <Link href="/admin">Retour à l’administration</Link>
    </header>
    {failed ? <div role="alert"><p>La médiathèque est momentanément indisponible.</p><Link href="/clients">Réessayer</Link></div> : <>
      <form className={styles.filters} action="/clients" method="get">
        <label>Rechercher un fichier<input type="search" name="q" defaultValue={query} placeholder="Nom du fichier…" maxLength={200} /></label>
        <label>Type de fichier<select name="type" defaultValue={selected}>{types.map(type => <option key={type}>{type}</option>)}</select></label>
        <button type="submit">Rechercher</button>
        <Link href="/clients">Tout afficher</Link>
      </form>
      <p>{visible.length} fichier(s) affiché(s) sur {files.length}</p>
      {visible.length === 0 && <p>{files.length ? 'Aucun fichier ne correspond à cette recherche.' : 'Aucun fichier dans la médiathèque pour le moment.'}</p>}
      <ul className={styles.grid}>{visible.map(file => <li className={styles.card} key={file.id}>
        <div className={styles.preview}>
          {file.mime.startsWith('video/') ? <video controls preload="none" playsInline aria-label={file.name}><source src={file.url} type={file.mime} /></video>
            : file.mime.startsWith('image/') ? <img src={file.url} alt={file.name} loading="lazy" />
            : file.mime.startsWith('audio/') ? <audio controls preload="none" aria-label={file.name} src={file.url} />
            : <span>{file.mime === 'application/pdf' ? 'PDF' : 'FICHIER'}</span>}
        </div>
        <div className={styles.details}>
          <h2>{file.name}</h2>
          <p>{category(file.mime)} · {file.size >= 1000 ? `${(file.size / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo` : `${Math.round(file.size)} Ko`}</p>
          <a href={`/clients/${new URL(file.url).pathname.split('/').pop()}`} target="_blank" rel="noopener noreferrer">Ouvrir le fichier ↗</a>
        </div>
      </li>)}</ul>
    </>}
  </main>;
}
