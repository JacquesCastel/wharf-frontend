'use client';

import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Identifiants incorrects. Vérifiez votre adresse et mot de passe.');
    } else {
      const session = await getSession();
      router.push(session?.user.role === 'admin' ? '/admin' : '/sommaire');
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-eyebrow">— Connexion</div>
      <h2>Reprenons <em>là où</em> nous en étions.</h2>
      <div className="form-sub">
        Les rendez-vous, fichiers et arbitrages de vos projets, réunis ici.
      </div>

      <div className="login-field">
        <label htmlFor="email">Adresse</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="votre@email.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="login-field">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p style={{
          marginTop: 16,
          color: 'var(--accent)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.12em',
        }}>
          {error}
        </p>
      )}

      <div className="login-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Connexion…' : <>Entrer dans l'espace <span className="arrow">→</span></>}
        </button>
        <button type="button" className="btn-ghost">
          Mot de passe oublié
        </button>
      </div>
    </form>
  );
}
