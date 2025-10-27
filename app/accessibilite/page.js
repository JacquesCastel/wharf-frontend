'use client';

import { useEffect } from 'react';

export default function AccessibilityPage() {
  // Charger CSS et JS au montage du composant
  useEffect(() => {
    // Charger le CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/accessibility.css';
    document.head.appendChild(cssLink);

    // Charger le JavaScript
    const script = document.createElement('script');
    script.src = '/accessibility.js';
    script.async = true;
    document.body.appendChild(script);

    // Nettoyage
    return () => {
      if (cssLink.parentNode) {
        document.head.removeChild(cssLink);
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <main className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* TITRE */}
        <h1 className="text-5xl md:text-6xl mb-6">Accessibilité</h1>
        
        <p className="text-lg mb-12" style={{ opacity: 0.7 }}>
          Personnalisez votre expérience de navigation pour améliorer votre confort.
        </p>

        {/* BANDEAU ENGAGEMENT */}
        <div className="info-banner" style={{ 
          backgroundColor: 'var(--hover)', 
          border: '1px solid var(--border)', 
          borderRadius: '8px', 
          padding: '24px', 
          marginBottom: '48px' 
        }}>
          <p style={{ marginBottom: '12px' }}>
            Vous voulez en savoir plus sur notre engagement envers l'accessibilité ?
          </p>
          <a href="/accessibilite/engagement" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '18px' 
          }}>
            Notre engagement inclusif
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* SÉPARATEUR */}
        <div style={{ borderTop: '2px solid var(--border)', margin: '48px 0' }}></div>

        {/* CONTRÔLE 1 : CONTRASTE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Contraste</h2>
          <p className="mb-6" style={{ opacity: 0.7 }}>
            Choisissez le mode qui vous convient le mieux.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-contrast-mode="normal"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Normal</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
            
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-contrast-mode="high"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Élevé</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
            
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-contrast-mode="inverted"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Inversé</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>(Sombre)</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
          </div>

          <ul style={{ fontSize: '14px', opacity: 0.7, listStyle: 'none', padding: 0, marginTop: '24px' }}>
            <li>• Normal : Noir #09090b sur blanc cassé (contraste 13.5:1 - WCAG AAA)</li>
            <li>• Élevé : Noir pur sur blanc pur (contraste 21:1 - Maximum)</li>
            <li>• Inversé : Blanc sur noir (contraste 13.5:1 - WCAG AAA)</li>
          </ul>
        </section>

        <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0' }}></div>

        {/* CONTRÔLE 2 : TAILLE DE POLICE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Taille de police</h2>
          <p className="mb-6" style={{ opacity: 0.7 }}>
            Ajustez la taille du texte pour une meilleure lisibilité.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', width: '80px' }}>Petit</span>
              <input 
                type="range" 
                id="font-size-slider"
                min="16" 
                max="24" 
                step="2" 
                defaultValue="18"
                aria-label="Ajuster la taille de police"
                style={{ flex: 1, height: '8px' }}
              />
              <span style={{ fontSize: '14px', width: '80px', textAlign: 'right' }}>Grand</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.5, marginTop: '8px' }}>
              <span>16px</span>
              <span>18px</span>
              <span>20px</span>
              <span>22px</span>
              <span>24px</span>
            </div>
          </div>

          <p id="font-size-value" style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
            Taille actuelle : 18px (Moyen)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
            <button 
              id="font-size-decrease" 
              className="slider-button" 
              aria-label="Diminuer la taille"
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid var(--border)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px'
              }}>−</button>
            <button 
              id="font-size-increase" 
              className="slider-button" 
              aria-label="Augmenter la taille"
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid var(--border)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px'
              }}>+</button>
          </div>
        </section>

        <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0' }}></div>

        {/* CONTRÔLE 3 : INTERLETTRAGE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Interlettrage</h2>
          <p className="mb-6" style={{ opacity: 0.7 }}>
            Augmentez l'espace entre les lettres pour faciliter la lecture.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', width: '80px' }}>Serré</span>
              <input 
                type="range" 
                id="letter-spacing-slider"
                min="-0.02" 
                max="0.05" 
                step="0.01" 
                defaultValue="0.01"
                aria-label="Ajuster l'interlettrage"
                style={{ flex: 1, height: '8px' }}
              />
              <span style={{ fontSize: '14px', width: '80px', textAlign: 'right' }}>Large</span>
            </div>
          </div>

          <p id="letter-spacing-value" style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
            Crénage actuel : 0.01em (Normal)
          </p>
        </section>

        <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0' }}></div>

        {/* CONTRÔLE 4 : GRAISSE DE POLICE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Graisse de police</h2>
          <p className="mb-6" style={{ opacity: 0.7 }}>
            Modifiez l'épaisseur du texte selon votre préférence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-font-weight="300"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 300
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Léger</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>300</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
            
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-font-weight="400"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 400
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Normal</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>400</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
            
            <button 
              className="control-button p-6 border-2 rounded-lg transition-all" 
              data-font-weight="600"
              aria-pressed="false"
              style={{
                border: '2px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                padding: '24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>Gras</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>600</div>
              <div className="checkmark" style={{ display: 'none', fontSize: '24px', marginTop: '8px' }}>✓</div>
            </button>
          </div>
        </section>

        <div style={{ borderTop: '1px solid var(--border)', margin: '32px 0' }}></div>

        {/* CONTRÔLE 5 : INTERLIGNAGE */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Interlignage</h2>
          <p className="mb-6" style={{ opacity: 0.7 }}>
            Modifiez l'espacement entre les lignes de texte.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', width: '80px' }}>Serré</span>
              <input 
                type="range" 
                id="line-height-slider"
                min="1.4" 
                max="2.2" 
                step="0.2" 
                defaultValue="1.6"
                aria-label="Ajuster l'interlignage"
                style={{ flex: 1, height: '8px' }}
              />
              <span style={{ fontSize: '14px', width: '80px', textAlign: 'right' }}>Large</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', opacity: 0.5, marginTop: '8px' }}>
              <span>1.4</span>
              <span>1.6</span>
              <span>1.8</span>
              <span>2.0</span>
              <span>2.2</span>
            </div>
          </div>

          <p id="line-height-value" style={{ marginTop: '16px', fontSize: '18px', textAlign: 'center' }}>
            Interlignage actuel : 1.6 (Normal)
          </p>
        </section>

        {/* BOUTON RÉINITIALISER */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '32px' }}>
          <button 
            id="reset-button" 
            className="reset-button"
            style={{
              padding: '16px 32px',
              border: '2px solid var(--text)',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--text)',
              fontSize: '18px',
              cursor: 'pointer'
            }}>
            Réinitialiser tous les réglages
          </button>
        </div>

        <div style={{ borderTop: '2px solid var(--border)', margin: '48px 0' }}></div>

        {/* NAVIGATION CLAVIER */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Navigation au clavier</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
              <span style={{ opacity: 0.7 }}>•</span>
              <span><strong>Tab</strong> : naviguer entre les éléments</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
              <span style={{ opacity: 0.7 }}>•</span>
              <span><strong>Entrée</strong> : activer un lien ou bouton</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
              <span style={{ opacity: 0.7 }}>•</span>
              <span><strong>Échap</strong> : fermer un menu ou modal</span>
            </li>
          </ul>
        </section>

        <div style={{ borderTop: '2px solid var(--border)', margin: '48px 0' }}></div>

        {/* LECTEURS D'ÉCRAN */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Lecteurs d'écran</h2>
          <p className="text-lg">
            Ce site est optimisé pour les lecteurs d'écran avec une structure 
            sémantique HTML5 et des descriptions alternatives pour toutes les images.
          </p>
        </section>

        <div style={{ borderTop: '2px solid var(--border)', margin: '48px 0' }}></div>

        {/* NORMES RESPECTÉES */}
        <section style={{ marginBottom: '48px' }}>
          <h2 className="text-3xl mb-4">Normes respectées</h2>
          <p className="text-lg mb-4">
            Ce site respecte les recommandations <strong>WCAG 2.1 niveau AA</strong> pour 
            l'accessibilité web.
          </p>
          <p className="text-lg" style={{ opacity: 0.7 }}>
            Les contrastes proposés assurent une lisibilité optimale pour tous, 
            y compris les personnes malvoyantes ou daltoniennes.
          </p>
        </section>

      </div>

      {/* WIDGET FLOTTANT */}
      <button 
        id="accessibility-widget" 
        className="accessibility-widget"
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded="false"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--text)',
          color: 'var(--bg)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          cursor: 'pointer'
        }}>
        <span role="img" aria-label="Accessibilité">♿</span>
      </button>

      {/* PANEL DU WIDGET */}
      <div 
        id="widget-overlay" 
        className="widget-overlay" 
        style={{ 
          display: 'none',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 998
        }}></div>
      
      <div 
        id="widget-panel" 
        className="widget-panel" 
        style={{ 
          display: 'none',
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '280px',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          zIndex: 999
        }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Accessibilité</h2>
          <button 
            id="widget-close" 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer', 
              padding: 0, 
              lineHeight: 1,
              color: 'var(--text)'
            }}
            aria-label="Fermer">
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', marginBottom: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CONTRASTE</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              data-widget-contrast="normal"
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                fontSize: '14px', 
                border: '2px solid var(--border)', 
                borderRadius: '4px', 
                background: 'transparent', 
                cursor: 'pointer',
                color: 'var(--text)'
              }}
              aria-pressed="false">
              Normal
            </button>
            <button 
              data-widget-contrast="high"
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                fontSize: '14px', 
                border: '2px solid var(--border)', 
                borderRadius: '4px', 
                background: 'transparent', 
                cursor: 'pointer',
                color: 'var(--text)'
              }}
              aria-pressed="false">
              Élevé
            </button>
            <button 
              data-widget-contrast="inverted"
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                fontSize: '14px', 
                border: '2px solid var(--border)', 
                borderRadius: '4px', 
                background: 'transparent', 
                cursor: 'pointer',
                color: 'var(--text)'
              }}
              aria-pressed="false">
              Inversé
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', marginBottom: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TAILLE DE POLICE</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              id="widget-font-size-decrease"
              className="slider-button"
              aria-label="Diminuer la taille de police"
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid var(--border)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--text)'
              }}>
              −
            </button>
            <input 
              type="range" 
              id="widget-font-size-slider"
              min="16" 
              max="24" 
              step="2" 
              defaultValue="18"
              aria-label="Ajuster la taille de police"
              style={{ flex: 1 }}
            />
            <button 
              id="widget-font-size-increase"
              className="slider-button"
              aria-label="Augmenter la taille de police"
              style={{
                width: '32px',
                height: '32px',
                border: '2px solid var(--border)',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px',
                color: 'var(--text)'
              }}>
              +
            </button>
          </div>
          <p id="widget-font-size-value" style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7, textAlign: 'center' }}>
            Taille actuelle : 18px
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0' }}></div>

        <a 
          href="/accessibilite" 
          style={{ 
            display: 'block', 
            textAlign: 'center', 
            padding: '12px 16px', 
            border: '2px solid var(--border)', 
            borderRadius: '4px', 
            fontSize: '14px',
            color: 'var(--text)',
            textDecoration: 'none'
          }}>
          Voir tous les paramètres
        </a>
      </div>

    </main>
  );
}