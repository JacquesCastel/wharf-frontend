'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '40px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Une erreur est survenue</h2>
      <p style={{ color: '#86868b', marginBottom: '32px' }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          background: '#1d1d1f',
          color: 'white',
          border: 'none',
          borderRadius: '980px',
          cursor: 'pointer'
        }}
      >
        Réessayer
      </button>
    </div>
  );
}