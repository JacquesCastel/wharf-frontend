'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useAmbientVideo } from '../lib/use-ambient-video';

export default function FilmHero({ videoSrc, children }: { videoSrc: string; children: ReactNode }) {
  const { videoRef, paused, unavailable, togglePlayback, onPlay, onPause, onError } = useAmbientVideo();

  return <section className="film-hero" aria-labelledby="home-title">
    <div className="film-hero-media" aria-hidden="true">
      <Image src="/images/manifesto-bg.jpg" alt="" fill priority sizes="100vw" quality={75} />
      <video ref={videoRef} muted loop playsInline preload="metadata" onPlay={onPlay} onPause={onPause} onError={onError} hidden={unavailable}>
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
