'use client';
import { useAmbientVideo } from '../lib/use-ambient-video';
export default function ProjectHeroVideo({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const { videoRef, paused, unavailable, togglePlayback, onPlay, onPause, onError } = useAmbientVideo();
  return <>
    <video ref={videoRef} className="projet-hero-video" muted loop playsInline preload="metadata" poster={poster} aria-hidden="true" onPlay={onPlay} onPause={onPause} onError={onError}><source src={src} type="video/mp4" /></video>
    {!unavailable && <button type="button" className="project-video-control" onClick={togglePlayback} aria-label={paused ? `Lire la vidéo d’ambiance : ${title}` : `Mettre en pause la vidéo d’ambiance : ${title}`}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Lire' : 'Pause'}</button>}
  </>;
}
