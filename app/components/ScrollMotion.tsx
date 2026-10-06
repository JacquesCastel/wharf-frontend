"use client";

import { useEffect, useRef } from 'react';

/** Native scroll stays in charge; only decorative layers receive bounded transforms. */
export default function ScrollMotion() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = marker.current?.closest('main, footer');
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    const readScenes = () => Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-scene]')).map(element => ({
      element,
      layers: Array.from(element.querySelectorAll<HTMLElement | SVGElement>('[data-scroll-shift]'))
        .filter(layer => layer.closest('[data-scroll-scene]') === element),
    }));
    let scenes = readScenes();
    const visible = new Set<HTMLElement>();
    let frame = 0;
    const motionAllowed = () => !preference.matches && !['high', 'inverted'].includes(document.documentElement.dataset.contrast || '');
    const reset = () => scenes.forEach(({ element, layers }) => {
      delete element.dataset.scrollActive;
      element.style.removeProperty('--scene-reveal');
      layers.forEach(layer => {
        layer.style.removeProperty('--scroll-y');
        layer.style.removeProperty('--scroll-x');
        layer.style.removeProperty('--scroll-turn');
        layer.style.removeProperty('--scroll-scale');
      });
    });
    const update = () => {
      frame = 0;
      if (!motionAllowed()) { reset(); return; }
      if (document.hidden) return;
      const viewport = window.innerHeight;
      const scale = mobile.matches ? 0.35 : 1;
      scenes.forEach(({ element, layers }) => {
        if (!visible.has(element)) return;
        const rect = element.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / (viewport * 0.85)));
        const reveal = Math.max(0, Math.min(1, (viewport - rect.top) / Math.min(rect.height, viewport * 0.7)));
        element.dataset.scrollActive = 'true';
        element.style.setProperty('--scene-reveal', reveal.toFixed(4));
        layers.forEach(layer => {
          const shift = Math.max(-220, Math.min(220, Number(layer.dataset.scrollShift) || 0));
          const drift = Math.max(-100, Math.min(100, Number(layer.dataset.scrollDrift) || 0));
          const turn = Math.max(-30, Math.min(30, Number(layer.dataset.scrollTurn) || 0));
          const zoom = Math.max(-0.12, Math.min(0.12, Number(layer.dataset.scrollZoom) || 0));
          layer.style.setProperty('--scroll-x', `${(progress * drift * scale).toFixed(2)}px`);
          layer.style.setProperty('--scroll-scale', (1 + progress * zoom * scale).toFixed(4));
          layer.style.setProperty('--scroll-y', `${(progress * shift * scale).toFixed(2)}px`);
          layer.style.setProperty('--scroll-turn', `${(progress * turn * scale).toFixed(2)}deg`);
        });
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
        else {
          visible.delete(entry.target as HTMLElement);
          delete (entry.target as HTMLElement).dataset.scrollActive;
        }
      });
      schedule();
    }, { rootMargin: '200px 0px' });
    scenes.forEach(({ element }) => observer.observe(element));
    // Server streaming and portfolio filters can replace scene nodes after mount.
    const contentObserver = new MutationObserver(() => {
      const nextScenes = readScenes();
      const unchanged = nextScenes.length === scenes.length && nextScenes.every((scene, index) =>
        scene.element === scenes[index].element && scene.layers.length === scenes[index].layers.length &&
        scene.layers.every((layer, layerIndex) => layer === scenes[index].layers[layerIndex]));
      if (unchanged) return;
      reset();
      observer.disconnect();
      visible.clear();
      scenes = nextScenes;
      scenes.forEach(({ element }) => observer.observe(element));
      schedule();
    });
    contentObserver.observe(root, { childList: true, subtree: true });
    const contrastObserver = new MutationObserver(schedule);
    contrastObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-contrast'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    preference.addEventListener('change', schedule);
    mobile.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      contrastObserver.disconnect();
      contentObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      preference.removeEventListener('change', schedule);
      mobile.removeEventListener('change', schedule);
      reset();
    };
  }, []);

  return <span ref={marker} hidden aria-hidden="true" />;
}
