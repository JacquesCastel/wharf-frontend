"use client";

import { useEffect, useRef, useState } from 'react';

export default function FogBackdrop() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setMotionAllowed(!preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);

    const scene = sceneRef.current;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    if (scene) observer.observe(scene);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
    };
  }, []);

  return <>
    <div ref={sceneRef} className="ai-fog-scene" data-running={motionAllowed && inView && !paused} aria-hidden="true">
      <div className="ai-fog-layer ai-fog-layer-far" />
      <div className="ai-fog-layer ai-fog-layer-near" />
      <div className="ai-fog-shade" />
    </div>
    {motionAllowed && <button type="button" className="ai-fog-control" onClick={() => setPaused(value => !value)}
      aria-label={paused ? 'Animer la brume' : 'Mettre en pause l’animation de brume'}>
      <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Animer' : 'Pause'}
    </button>}
  </>;
}
