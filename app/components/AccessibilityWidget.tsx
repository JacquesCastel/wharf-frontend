'use client';

import { useState, useEffect } from 'react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [contrast, setContrast] = useState('normal');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState('normal');

  // Charger les préférences au montage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedContrast = localStorage.getItem('contrast');
    const savedLineHeight = localStorage.getItem('lineHeight');
    const savedLetterSpacing = localStorage.getItem('letterSpacing');
    const savedFontWeight = localStorage.getItem('fontWeight');
    
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.setAttribute('data-font-size', size.toString());
    }
    
    if (savedContrast) {
      setContrast(savedContrast);
      document.documentElement.setAttribute('data-contrast', savedContrast);
    }

    if (savedLineHeight) {
      const height = parseFloat(savedLineHeight);
      setLineHeight(height);
      document.documentElement.setAttribute('data-line-height', height.toString());
    }

    if (savedLetterSpacing) {
      const spacing = parseFloat(savedLetterSpacing);
      setLetterSpacing(spacing);
      document.documentElement.setAttribute('data-letter-spacing', spacing.toString());
    }

    if (savedFontWeight) {
      setFontWeight(savedFontWeight);
      document.documentElement.setAttribute('data-font-weight', savedFontWeight);
    }
  }, []);

  // Changer la taille de police
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.setAttribute('data-font-size', newSize.toString());
    localStorage.setItem('fontSize', newSize.toString());
  };

  // Changer le contraste
  const handleContrastChange = (newContrast: string) => {
    setContrast(newContrast);
    document.documentElement.setAttribute('data-contrast', newContrast);
    localStorage.setItem('contrast', newContrast);
  };

  // Changer l'interlignage
  const handleLineHeightChange = (newHeight: number) => {
    setLineHeight(newHeight);
    document.documentElement.setAttribute('data-line-height', newHeight.toString());
    localStorage.setItem('lineHeight', newHeight.toString());
  };

  // Changer le crénage (letter-spacing)
  const handleLetterSpacingChange = (newSpacing: number) => {
    setLetterSpacing(newSpacing);
    document.documentElement.setAttribute('data-letter-spacing', newSpacing.toString());
    localStorage.setItem('letterSpacing', newSpacing.toString());
  };

  // Changer la graisse
  const handleFontWeightChange = (newWeight: string) => {
    setFontWeight(newWeight);
    document.documentElement.setAttribute('data-font-weight', newWeight);
    localStorage.setItem('fontWeight', newWeight);
  };

  // Réinitialiser tous les paramètres
  const handleReset = () => {
    setFontSize(18);
    setContrast('normal');
    setLineHeight(1.6);
    setLetterSpacing(0);
    setFontWeight('normal');
    
    document.documentElement.setAttribute('data-font-size', '18');
    document.documentElement.setAttribute('data-contrast', 'normal');
    document.documentElement.setAttribute('data-line-height', '1.6');
    document.documentElement.setAttribute('data-letter-spacing', '0');
    document.documentElement.setAttribute('data-font-weight', 'normal');
    
    localStorage.removeItem('fontSize');
    localStorage.removeItem('contrast');
    localStorage.removeItem('lineHeight');
    localStorage.removeItem('letterSpacing');
    localStorage.removeItem('fontWeight');
  };

  // Fermer avec Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accessibility-widget-button"
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}
      >
        ♿
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="widget-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      {isOpen && (
        <div className="widget-panel">
          <div className="widget-header">
            <h2>Accessibilité</h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
              className="widget-close"
            >
              ✕
            </button>
          </div>

          <div className="widget-content">
            
            {/* Contraste */}
            <div className="widget-section">
              <h3>Contraste</h3>
              <div className="widget-buttons">
                <button
                  onClick={() => handleContrastChange('normal')}
                  className={contrast === 'normal' ? 'active' : ''}
                  aria-pressed={contrast === 'normal'}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleContrastChange('high')}
                  className={contrast === 'high' ? 'active' : ''}
                  aria-pressed={contrast === 'high'}
                >
                  Élevé
                </button>
                <button
                  onClick={() => handleContrastChange('inverted')}
                  className={contrast === 'inverted' ? 'active' : ''}
                  aria-pressed={contrast === 'inverted'}
                >
                  Inversé
                </button>
              </div>
            </div>

            {/* Taille de police */}
            <div className="widget-section">
              <h3>Taille de police</h3>
              <div className="widget-slider">
                <button
                  onClick={() => handleFontSizeChange(Math.max(16, fontSize - 2))}
                  aria-label="Diminuer la taille"
                  disabled={fontSize <= 16}
                >
                  −
                </button>
                <input
                  type="range"
                  min="16"
                  max="24"
                  step="2"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  aria-label="Ajuster la taille de police"
                />
                <button
                  onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                  aria-label="Augmenter la taille"
                  disabled={fontSize >= 24}
                >
                  +
                </button>
              </div>
              <p className="widget-value">Taille : {fontSize}px</p>
            </div>

            {/* Interlignage */}
            <div className="widget-section">
              <h3>Interlignage</h3>
              <div className="widget-slider">
                <button
                  onClick={() => handleLineHeightChange(Math.max(1.4, lineHeight - 0.2))}
                  aria-label="Diminuer l'interlignage"
                  disabled={lineHeight <= 1.4}
                >
                  −
                </button>
                <input
                  type="range"
                  min="1.4"
                  max="2.2"
                  step="0.2"
                  value={lineHeight}
                  onChange={(e) => handleLineHeightChange(parseFloat(e.target.value))}
                  aria-label="Ajuster l'interlignage"
                />
                <button
                  onClick={() => handleLineHeightChange(Math.min(2.2, lineHeight + 0.2))}
                  aria-label="Augmenter l'interlignage"
                  disabled={lineHeight >= 2.2}
                >
                  +
                </button>
              </div>
              <p className="widget-value">Hauteur : {lineHeight.toFixed(1)}</p>
            </div>

            {/* Crénage (Letter-spacing) */}
            <div className="widget-section">
              <h3>Crénage (espacement)</h3>
              <div className="widget-slider">
                <button
                  onClick={() => handleLetterSpacingChange(Math.max(-0.02, letterSpacing - 0.01))}
                  aria-label="Diminuer le crénage"
                  disabled={letterSpacing <= -0.02}
                >
                  −
                </button>
                <input
                  type="range"
                  min="-0.02"
                  max="0.05"
                  step="0.01"
                  value={letterSpacing}
                  onChange={(e) => handleLetterSpacingChange(parseFloat(e.target.value))}
                  aria-label="Ajuster le crénage"
                />
                <button
                  onClick={() => handleLetterSpacingChange(Math.min(0.05, letterSpacing + 0.01))}
                  aria-label="Augmenter le crénage"
                  disabled={letterSpacing >= 0.05}
                >
                  +
                </button>
              </div>
              <p className="widget-value">Espacement : {letterSpacing.toFixed(2)}em</p>
            </div>

            {/* Graisse de police */}
            <div className="widget-section">
              <h3>Graisse de police</h3>
              <div className="widget-buttons">
                <button
                  onClick={() => handleFontWeightChange('light')}
                  className={fontWeight === 'light' ? 'active' : ''}
                  aria-pressed={fontWeight === 'light'}
                >
                  Légère
                </button>
                <button
                  onClick={() => handleFontWeightChange('normal')}
                  className={fontWeight === 'normal' ? 'active' : ''}
                  aria-pressed={fontWeight === 'normal'}
                >
                  Normale
                </button>
                <button
                  onClick={() => handleFontWeightChange('bold')}
                  className={fontWeight === 'bold' ? 'active' : ''}
                  aria-pressed={fontWeight === 'bold'}
                >
                  Grasse
                </button>
              </div>
            </div>

            {/* Bouton réinitialiser */}
            <button 
              onClick={handleReset}
              className="widget-reset"
            >
              Réinitialiser tous les paramètres
            </button>

            {/* Lien vers page complète */}
            <a href="/accessibilite" className="widget-link">
              Voir tous les paramètres →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
