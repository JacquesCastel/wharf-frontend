'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function FilmHero({ videoSrc, children }: { videoSrc: string; children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!video) return;
    const applyPreference = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => setPaused(true));
    };
    applyPreference();
    preference.addEventListener('change', applyPreference);
    return () => preference.removeEventListener('change', applyPreference);
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPaused(true));
    else video.pause();
  }

  return <section className="film-hero" aria-labelledby="home-title">
    <div className="film-hero-media" aria-hidden="true">
      <Image src="/images/manifesto-bg.jpg" alt="" fill priority sizes="100vw" quality={75} />
      <video ref={videoRef} muted loop playsInline preload="metadata" onPlay={() => setPaused(false)} onPause={() => setPaused(true)} onError={() => setUnavailable(true)} hidden={unavailable}>
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
    <div className="film-hero-shade" />
    <div className="film-hero-content">{children}</div>
    <div className="film-hero-bottom">
      <a href="#realisations">Explorer notre travail <span aria-hidden="true">↓</span></a>
      {!unavailable && <button type="button" onClick={togglePlayback} aria-label={paused ? 'Lire la vidéo d’ambiance' : 'Mettre en pause la vidéo d’ambiance'}>
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Lire' : 'Pause'}
      </button>}
    </div>
  </section>;
}
