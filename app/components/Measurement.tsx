'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CONSENT_KEY, readChoice, publicPath, safeReferrer, eventData, type AudienceChoice, type MeasureEvent, type MeasurePayload } from '../lib/measurement';

declare global { interface Window { umami?: { track: (payload: MeasurePayload) => Promise<unknown> }; } }

export function AudiencePreferencesButton() {
  return <button type="button" className="footer-link audience-preferences" onClick={() => window.dispatchEvent(new Event('wharf:preferences'))}>Mes préférences de mesure</button>;
}

export default function Measurement({ websiteId, paths }: { websiteId?: string; paths: string[] }) {
  const pathname = usePathname();
  const [choice, setChoice] = useState<AudienceChoice | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const queue = useRef<MeasurePayload[]>([]);
  const allowed = useRef(false);
  const visited = useRef('');
  const referrer = useRef('');
  const panel = useRef<HTMLDivElement>(null);
  const path = publicPath(pathname, paths);
  const production = typeof window !== 'undefined' && ['bywharf.com', 'www.bywharf.com'].includes(window.location.hostname);

  useEffect(() => {
    let saved: AudienceChoice | null = null;
    try { saved = readChoice(localStorage.getItem(CONSENT_KEY), Date.now()); } catch { /* storage unavailable: no consent */ }
    referrer.current = safeReferrer(document.referrer);
    setChoice(saved); setLoaded(true);
    const show = () => { setOpen(true); requestAnimationFrame(() => panel.current?.focus()); };
    const syncChoice = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) {
        const next = readChoice(event.newValue, Date.now());
        if (next !== 'accepted') { allowed.current = false; queue.current = []; }
        setChoice(next);
      }
      if (event.key === 'umami.disabled' && event.newValue === '1') { allowed.current = false; queue.current = []; }
    };
    window.addEventListener('wharf:preferences', show);
    window.addEventListener('storage', syncChoice);
    return () => { window.removeEventListener('wharf:preferences', show); window.removeEventListener('storage', syncChoice); };
  }, []);

  useEffect(() => {
    let optedOut = true;
    try { optedOut = localStorage.getItem('umami.disabled') === '1'; } catch { /* fail closed */ }
    allowed.current = Boolean(websiteId && production && path && choice === 'accepted' && navigator.doNotTrack !== '1' && !optedOut);
    if (!allowed.current) { queue.current = []; visited.current = ''; return; }
    if (window.umami) { setReady(true); return; }
    let script = document.getElementById('wharf-audience-script') as HTMLScriptElement | null;
    const onLoad = () => setReady(Boolean(window.umami));
    if (!script) {
      script = document.createElement('script'); script.id = 'wharf-audience-script';
      script.src = '/mesure/script.js'; script.defer = true;
      script.dataset.websiteId = websiteId!; script.dataset.autoTrack = 'false';
      script.dataset.doNotTrack = 'true'; script.dataset.excludeSearch = 'true'; script.dataset.excludeHash = 'true';
      script.addEventListener('load', onLoad); document.body.appendChild(script);
    } else script.addEventListener('load', onLoad);
    return () => script?.removeEventListener('load', onLoad);
  }, [choice, path, production, websiteId]);

  useEffect(() => {
    if (!allowed.current || !ready || !path || !window.umami) return;
    if (visited.current !== path) {
      visited.current = path;
      void window.umami.track({ website: websiteId!, hostname: 'bywharf.com', url: path, referrer: referrer.current, language: navigator.language.split('-')[0] }).catch(() => {});
    }
    queue.current.splice(0).forEach(payload => { void window.umami?.track(payload).catch(() => {}); });
  }, [ready, choice, path, websiteId]);

  useEffect(() => {
    const send = (name: MeasureEvent, data: Record<string, string> = {}) => {
      if (!allowed.current || !path) return;
      const payload: MeasurePayload = { website: websiteId!, hostname: 'bywharf.com', url: path, referrer: referrer.current, language: navigator.language.split('-')[0], name, data: eventData(name, data, path) };
      if (window.umami) void window.umami.track(payload).catch(() => {});
      else if (queue.current.length < 20) queue.current.push(payload);
    };
    const custom = (event: Event) => { const detail = (event as CustomEvent).detail; if (['contact_form_success', 'film_play'].includes(detail?.name)) send(detail.name, detail.data || {}); };
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]'); if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.startsWith('mailto:')) send('email_click');
      else if (publicPath(href, paths) === '/contact' && path !== '/contact') send('contact_click');
    };
    window.addEventListener('wharf:measure', custom); document.addEventListener('click', click);
    return () => { window.removeEventListener('wharf:measure', custom); document.removeEventListener('click', click); };
  }, [path, websiteId, paths]);

  function choose(value: AudienceChoice) {
    // Stop pending sends immediately when withdrawing consent.
    if (value === 'refused') { allowed.current = false; queue.current = []; }
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice: value, at: Date.now() })); } catch { setChoice(null); setOpen(false); return; }
    setChoice(value); setOpen(false);
  }
  if (!loaded || !path || !websiteId || (!open && choice !== null)) return null;
  return <div className="audience-panel" role="region" aria-labelledby="audience-title" tabIndex={-1} ref={panel}>
    <p id="audience-title"><strong>Mesure d’audience</strong></p>
    <p>Nous mesurons les visites et les actions utiles pour améliorer le site, avec Umami hébergé sur notre serveur. Aucun contenu de formulaire n’est enregistré dans ces statistiques.</p>
    <Link href="/confidentialite">En savoir plus</Link>
    <div className="audience-actions"><button type="button" onClick={() => choose('refused')}>Refuser</button><button type="button" onClick={() => choose('accepted')}>Accepter</button>{open && choice && <button type="button" onClick={() => setOpen(false)}>Fermer</button>}</div>
  </div>;
}
