'use client';
import { useEffect, useRef, useState } from 'react';

// Shared playback policy for the existing decorative films.
export function useAmbientVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [paused, setPaused] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = true;
    const synchronize = () => {
      if (preference.matches || !inView || document.hidden || manuallyPaused.current) video.pause();
      else void video.play().catch(() => setPaused(true));
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; synchronize(); });
    observer.observe(video);
    synchronize();
    preference.addEventListener('change', synchronize);
    document.addEventListener('visibilitychange', synchronize);
    return () => { observer.disconnect(); preference.removeEventListener('change', synchronize); document.removeEventListener('visibilitychange', synchronize); };
  }, []);
  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    manuallyPaused.current = !video.paused;
    if (video.paused) void video.play().catch(() => setPaused(true));
    else video.pause();
  }
  return { videoRef, paused, unavailable, togglePlayback, onPlay: () => setPaused(false), onPause: () => setPaused(true), onError: () => setUnavailable(true) };
}
