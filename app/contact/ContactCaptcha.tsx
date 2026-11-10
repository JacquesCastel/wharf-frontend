'use client';

import { useEffect, useRef, useState } from 'react';
import { loadRecaptcha } from '../lib/recaptcha';

export default function ContactCaptcha({ siteKey, resetKey, onChange }: {
  siteKey: string;
  resetKey: number;
  onChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onChange);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [compact, setCompact] = useState(false);

  useEffect(() => { callbackRef.current = onChange; }, [onChange]);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 360px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let active = true;
    let dispose: (() => void) | undefined;
    callbackRef.current('');
    setStatus('loading');
    loadRecaptcha().then(api => {
      if (!active || !containerRef.current) return;
      const container = containerRef.current;
      const widget = api.render(container, {
        sitekey: siteKey,
        size: compact ? 'compact' : 'normal',
        callback: token => { if (active) callbackRef.current(token); },
        'expired-callback': () => { if (active) callbackRef.current(''); },
        'error-callback': () => {
          if (active) { callbackRef.current(''); setStatus('error'); }
        },
      });
      dispose = () => {
        try { api.reset(widget); } catch { /* The previous iframe may already be detached. */ }
        container.replaceChildren();
      };
      setStatus('ready');
    }).catch(() => {
      if (active) { callbackRef.current(''); setStatus('error'); }
    });
    return () => { active = false; dispose?.(); };
  }, [siteKey, resetKey, attempt, compact]);

  return <div className="contact-captcha" aria-labelledby="contact-captcha-label">
    <p id="contact-captcha-label">Vérification antispam *</p>
    <div key={`${siteKey}:${compact}:${resetKey}:${attempt}`} className="contact-captcha-widget" ref={containerRef} />
    <p className="contact-captcha-status" role="status" aria-live="polite">
      {status === 'loading' ? 'Chargement de la vérification…' : status === 'error'
        ? 'La vérification n’a pas pu être chargée. Réessayez ou utilisez le lien email ci-dessous.'
        : 'Cochez « Je ne suis pas un robot » avant d’envoyer votre message.'}
    </p>
    {status === 'error' && <button type="button" className="contact-reset-button" onClick={() => setAttempt(value => value + 1)}>Réessayer la vérification →</button>}
    <p className="contact-captcha-privacy">Ce formulaire utilise Google reCAPTCHA. <a href="https://policies.google.com/privacy">Confidentialité Google</a> · <a href="https://policies.google.com/terms">Conditions d’utilisation</a>.</p>
  </div>;
}
