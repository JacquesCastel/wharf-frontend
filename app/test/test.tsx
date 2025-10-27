export default function TestPage() {
  return (
    <html>
      <head>
        <title>Test Widget</title>
      </head>
      <body style={{ margin: 0, padding: '50px', fontFamily: 'Arial' }}>
        <h1>Test du Widget d'Accessibilité</h1>
        <p>Le widget devrait apparaître en bas à droite de cette page.</p>

        {/* WIDGET - Style inline pour être sûr */}
        <button 
          id="accessibility-widget" 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#09090b',
            color: '#fafafa',
            border: 'none',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          ♿
        </button>

        {/* Overlay */}
        <div id="widget-overlay" style={{ display: 'none' }}></div>

        {/* Panel */}
        <div 
          id="widget-panel" 
          style={{ 
            display: 'none',
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '280px',
            backgroundColor: '#ffffff',
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 9998
          }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Accessibilité</h2>
            <button 
              id="widget-close" 
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '24px', 
                cursor: 'pointer' 
              }}>
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '12px', marginBottom: '10px', textTransform: 'uppercase' }}>CONTRASTE</h3>
            <button data-widget-contrast="normal" style={{ padding: '8px 16px', marginRight: '8px', cursor: 'pointer' }}>Normal</button>
            <button data-widget-contrast="high" style={{ padding: '8px 16px', marginRight: '8px', cursor: 'pointer' }}>Élevé</button>
            <button data-widget-contrast="inverted" style={{ padding: '8px 16px', cursor: 'pointer' }}>Inversé</button>
          </div>

          <a href="/accessibilite" style={{ display: 'block', textAlign: 'center', padding: '10px', border: '2px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#000' }}>
            Voir tous les paramètres
          </a>
        </div>

        {/* Charger le JavaScript */}
        <script src="/accessibility.js" async></script>
      </body>
    </html>
  );
}