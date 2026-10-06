'use client';
import { useEffect, useRef } from 'react';
import { measure } from '../lib/measurement';
type Player = { destroy(): void };
type Youtube = { Player: new (iframe: HTMLIFrameElement, options: { events: { onStateChange: (event: { data: number }) => void } }) => Player };
declare global { interface Window { YT?: Youtube; onYouTubeIframeAPIReady?: () => void; } }
let youtubeReady: Promise<void> | undefined;
function loadYoutube() {
  if (window.YT?.Player) return Promise.resolve();
  if (!youtubeReady) youtubeReady = new Promise<void>(resolve => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); };
    const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; document.body.appendChild(script);
  });
  return youtubeReady;
}
export default function TrackedFilm({ src, title, film, native = false }: { src: string; title: string; film: string; native?: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const played = useRef(false);
  const count = () => { if (!played.current) { played.current = true; measure('film_play', { film }); } };
  useEffect(() => {
    if (native || !frame.current) return;
    let url: URL;
    try { url = new URL(src); } catch { return; }
    if (!['www.youtube.com','www.youtube-nocookie.com','youtube.com'].includes(url.hostname)) return;
    let active = true; let player: Player | undefined;
    url.searchParams.set('enablejsapi', '1'); url.searchParams.set('origin', window.location.origin); url.searchParams.delete('autoplay');
    frame.current.src = url.toString();
    void loadYoutube().then(() => { if (active && frame.current && window.YT) player = new window.YT.Player(frame.current, { events: { onStateChange: event => { if (event.data === 1) count(); } } }); });
    return () => { active = false; player?.destroy(); };
  }, [src, native]);
  if (native) return <video controls preload="metadata" playsInline aria-label={title} onPlay={count}><source src={src} type="video/mp4" /></video>;
  return <iframe ref={frame} src={src} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
}
