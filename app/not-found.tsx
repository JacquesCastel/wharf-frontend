import Link from 'next/link';

export default function NotFound() {
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
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Page non trouvée</h2>
      <p style={{ color: '#86868b', marginBottom: '32px' }}>La page que vous cherchez n'existe pas.</p>
      <Link 
        href="/"
        style={{
          padding: '12px 24px',
          background: '#1d1d1f',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '980px'
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}