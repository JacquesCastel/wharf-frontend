'use client';

import { useEffect, useRef, useState } from 'react';

export default function MotionPlayer({ id, title }: { id: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type !== 'wharf-motion-size') return;
      const value = event.data.height;
      if (typeof value === 'number' && Number.isFinite(value) && value >= 100 && value <= 2400) setHeight(value);
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);
  return <iframe ref={frame} className="insight-motion-player" src={`/motions/${id}.html`}
    title={`Motion Wharf : ${title}`} loading="lazy" style={height ? { height } : undefined} />;
}
