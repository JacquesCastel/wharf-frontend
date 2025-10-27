'use client';

import { useState, useEffect } from 'react';

export default function AccessibilitePage() {
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
    document.documentElement.setAttribute('data-font-size', size.toString()); // ← AJOUTEZ
  }
  
  if (savedContrast) {
    setContrast(savedContrast);
    document.documentElement.setAttribute('data-contrast', savedContrast); // ← AJOUTEZ
  }

  if (savedLineHeight) {
    const height = parseFloat(savedLineHeight);
    setLineHeight(height);
    document.documentElement.setAttribute('data-line-height', height.toString()); // ← AJOUTEZ
  }

  if (savedLetterSpacing) {
    const spacing = parseFloat(savedLetterSpacing);
    setLetterSpacing(spacing);
    document.documentElement.setAttribute('data-letter-spacing', spacing.toString()); // ← AJOUTEZ
  }

  if (savedFontWeight) {
    setFontWeight(savedFontWeight);
    document.documentElement.setAttribute('data-font-weight', savedFontWeight); // ← AJOUTEZ
  }
}, []);

  // Fonctions de changement (identiques au widget)
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.setAttribute('data-font-size', newSize.toString());
    localStorage.setItem('fontSize', newSize.toString());
  };

  const handleContrastChange = (newContrast: string) => {
    setContrast(newContrast);
    document.documentElement.setAttribute('data-contrast', newContrast);
    localStorage.setItem('contrast', newContrast);
  };

  const handleLineHeightChange = (newHeight: number) => {
    setLineHeight(newHeight);
    document.documentElement.setAttribute('data-line-height', newHeight.toString());
    localStorage.setItem('lineHeight', newHeight.toString());
  };

  const handleLetterSpacingChange = (newSpacing: number) => {
    setLetterSpacing(newSpacing);
    document.documentElement.setAttribute('data-letter-spacing', newSpacing.toString());
    localStorage.setItem('letterSpacing', newSpacing.toString());
  };

  const handleFontWeightChange = (newWeight: string) => {
    setFontWeight(newWeight);
    document.documentElement.setAttribute('data-font-weight', newWeight);
    localStorage.setItem('fontWeight', newWeight);
  };

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
    
    localStorage.clear();
  };

  return (
    <main className="accessibility-page">
      
      {/* Hero */}
      <section className="accessibility-hero">
        <div className="container">
          <h1>Accessibilité</h1>
          <p className="accessibility-intro">
            Personnalisez votre expérience de navigation pour améliorer votre confort. 
            Tous les réglages sont automatiquement sauvegardés.
          </p>
        </div>
      </section>

      {/* Contrôles */}
      <section className="accessibility-controls">
        <div className="container">

          {/* Contraste */}
          <div className="control-block">
            <div className="control-header">
              <h2>Contraste</h2>
              <p>Ajustez le contraste pour améliorer la lisibilité selon vos besoins visuels.</p>
            </div>
            <div className="control-options">
              <button
                onClick={() => handleContrastChange('normal')}
                className={`control-card ${contrast === 'normal' ? 'active' : ''}`}
                aria-pressed={contrast === 'normal'}
              >
                <div className="control-card-icon">◐</div>
                <h3>Normal</h3>
                <p>Contraste standard adapté à la plupart des situations</p>
                {contrast === 'normal' && <span className="checkmark">✓</span>}
              </button>

              <button
                onClick={() => handleContrastChange('high')}
                className={`control-card ${contrast === 'high' ? 'active' : ''}`}
                aria-pressed={contrast === 'high'}
              >
                <div className="control-card-icon">●</div>
                <h3>Élevé</h3>
                <p>Contraste maximum (noir pur sur blanc pur)</p>
                {contrast === 'high' && <span className="checkmark">✓</span>}
              </button>

              <button
                onClick={() => handleContrastChange('inverted')}
                className={`control-card ${contrast === 'inverted' ? 'active' : ''}`}
                aria-pressed={contrast === 'inverted'}
              >
                <div className="control-card-icon">◑</div>
                <h3>Inversé</h3>
                <p>Mode sombre pour réduire la fatigue oculaire</p>
                {contrast === 'inverted' && <span className="checkmark">✓</span>}
              </button>
            </div>
          </div>

          {/* Taille de police */}
          <div className="control-block">
            <div className="control-header">
              <h2>Taille de police</h2>
              <p>Augmentez la taille du texte pour faciliter la lecture.</p>
            </div>
            <div className="control-slider-wrapper">
              <div className="slider-controls">
                <button
                  onClick={() => handleFontSizeChange(Math.max(16, fontSize - 2))}
                  disabled={fontSize <= 16}
                  aria-label="Diminuer la taille"
                  className="slider-btn"
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
                  className="slider-input"
                />
                <button
                  onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                  disabled={fontSize >= 24}
                  aria-label="Augmenter la taille"
                  className="slider-btn"
                >
                  +
                </button>
              </div>
              <div className="slider-value">
                Taille actuelle : <strong>{fontSize}px</strong>
              </div>
              <div className="slider-preview">
                <p style={{ fontSize: `${fontSize}px` }}>
                  Aperçu du texte à cette taille
                </p>
              </div>
            </div>
          </div>

          {/* Interlignage */}
          <div className="control-block">
            <div className="control-header">
              <h2>Interlignage</h2>
              <p>Ajustez l'espace entre les lignes pour améliorer le confort de lecture.</p>
            </div>
            <div className="control-slider-wrapper">
              <div className="slider-controls">
                <button
                  onClick={() => handleLineHeightChange(Math.max(1.4, lineHeight - 0.2))}
                  disabled={lineHeight <= 1.4}
                  aria-label="Diminuer l'interlignage"
                  className="slider-btn"
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
                  className="slider-input"
                />
                <button
                  onClick={() => handleLineHeightChange(Math.min(2.2, lineHeight + 0.2))}
                  disabled={lineHeight >= 2.2}
                  aria-label="Augmenter l'interlignage"
                  className="slider-btn"
                >
                  +
                </button>
              </div>
              <div className="slider-value">
                Hauteur actuelle : <strong>{lineHeight.toFixed(1)}</strong>
              </div>
              <div className="slider-preview">
                <p style={{ lineHeight: lineHeight }}>
                  Ceci est un exemple de texte avec l'interlignage sélectionné. 
                  L'espace entre les lignes s'adapte pour améliorer votre confort de lecture 
                  selon vos préférences personnelles.
                </p>
              </div>
            </div>
          </div>

          {/* Crénage */}
          <div className="control-block">
            <div className="control-header">
              <h2>Crénage (espacement des lettres)</h2>
              <p>Ajustez l'espace entre les caractères pour faciliter la distinction des lettres.</p>
            </div>
            <div className="control-slider-wrapper">
              <div className="slider-controls">
                <button
                  onClick={() => handleLetterSpacingChange(Math.max(-0.02, letterSpacing - 0.01))}
                  disabled={letterSpacing <= -0.02}
                  aria-label="Diminuer le crénage"
                  className="slider-btn"
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
                  className="slider-input"
                />
                <button
                  onClick={() => handleLetterSpacingChange(Math.min(0.05, letterSpacing + 0.01))}
                  disabled={letterSpacing >= 0.05}
                  aria-label="Augmenter le crénage"
                  className="slider-btn"
                >
                  +
                </button>
              </div>
              <div className="slider-value">
                Espacement actuel : <strong>{letterSpacing.toFixed(2)}em</strong>
              </div>
              <div className="slider-preview">
                <p style={{ letterSpacing: `${letterSpacing}em` }}>
                  Aperçu de l'espacement entre les lettres
                </p>
              </div>
            </div>
          </div>

          {/* Graisse */}
          <div className="control-block">
            <div className="control-header">
              <h2>Graisse de police</h2>
              <p>Modifiez l'épaisseur du texte selon vos préférences de lecture.</p>
            </div>
            <div className="control-options">
              <button
                onClick={() => handleFontWeightChange('light')}
                className={`control-card ${fontWeight === 'light' ? 'active' : ''}`}
                aria-pressed={fontWeight === 'light'}
              >
                <div className="control-card-icon" style={{ fontWeight: 300 }}>A</div>
                <h3>Légère</h3>
                <p>Texte fin et léger</p>
                {fontWeight === 'light' && <span className="checkmark">✓</span>}
              </button>

              <button
                onClick={() => handleFontWeightChange('normal')}
                className={`control-card ${fontWeight === 'normal' ? 'active' : ''}`}
                aria-pressed={fontWeight === 'normal'}
              >
                <div className="control-card-icon" style={{ fontWeight: 400 }}>A</div>
                <h3>Normale</h3>
                <p>Graisse standard</p>
                {fontWeight === 'normal' && <span className="checkmark">✓</span>}
              </button>

              <button
                onClick={() => handleFontWeightChange('bold')}
                className={`control-card ${fontWeight === 'bold' ? 'active' : ''}`}
                aria-pressed={fontWeight === 'bold'}
              >
                <div className="control-card-icon" style={{ fontWeight: 700 }}>A</div>
                <h3>Grasse</h3>
                <p>Texte épais et marqué</p>
                {fontWeight === 'bold' && <span className="checkmark">✓</span>}
              </button>
            </div>
          </div>

          {/* Bouton réinitialiser */}
          <div className="control-block">
            <button onClick={handleReset} className="reset-button">
              Réinitialiser tous les paramètres
            </button>
          </div>

        </div>
      </section>

      {/* Informations complémentaires */}
      <section className="accessibility-info">
        <div className="container">
          
          <div className="info-grid">
            
            <div className="info-card">
              <h3>Navigation au clavier</h3>
              <ul>
                <li><kbd>Tab</kbd> : Naviguer entre les éléments</li>
                <li><kbd>Entrée</kbd> : Activer un lien ou bouton</li>
                <li><kbd>Échap</kbd> : Fermer un menu ou modal</li>
                <li><kbd>Espace</kbd> : Cocher une case ou activer un bouton</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Lecteurs d'écran</h3>
              <p>
                Ce site est optimisé pour les lecteurs d'écran avec une structure 
                sémantique HTML5 et des descriptions alternatives pour toutes les images.
              </p>
            </div>

            <div className="info-card">
              <h3>Normes respectées</h3>
              <p>
                Ce site respecte les recommandations <strong>WCAG 2.1 niveau AA</strong> 
                pour l'accessibilité web.
              </p>
            </div>

          </div>

          <div className="engagement-link">
            <p>Vous voulez en savoir plus sur notre engagement envers l'accessibilité ?</p>
            <a href="/accessibilite/engagement" className="btn btn-primary">
              Notre engagement inclusif →
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}