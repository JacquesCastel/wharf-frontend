/* ============================================
   WHARF - Accessibilité JavaScript
   Gestion complète des contrôles d'accessibilité
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const STORAGE_KEYS = {
  CONTRAST: 'wharf_contrast',
  FONT_SIZE: 'wharf_font_size',
  LETTER_SPACING: 'wharf_letter_spacing',
  FONT_WEIGHT: 'wharf_font_weight',
  LINE_HEIGHT: 'wharf_line_height'
};

const DEFAULTS = {
  contrast: 'normal',
  fontSize: 18,
  letterSpacing: 0.01,
  fontWeight: 400,
  lineHeight: 1.6
};

// ============================================
// ÉTAT GLOBAL
// ============================================

let currentSettings = { ...DEFAULTS };

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Initialisation du système d\'accessibilité WHARF');
  
  // Charger les préférences sauvegardées
  loadSettings();
  
  // Appliquer les préférences
  applyAllSettings();
  
  // Initialiser les contrôles
  initializeControls();
  
  // Initialiser le widget (si présent)
  initializeWidget();
  
  console.log('✅ Système d\'accessibilité initialisé');
});

// ============================================
// CHARGEMENT DES PRÉFÉRENCES
// ============================================

function loadSettings() {
  try {
    currentSettings.contrast = localStorage.getItem(STORAGE_KEYS.CONTRAST) || DEFAULTS.contrast;
    currentSettings.fontSize = parseFloat(localStorage.getItem(STORAGE_KEYS.FONT_SIZE)) || DEFAULTS.fontSize;
    currentSettings.letterSpacing = parseFloat(localStorage.getItem(STORAGE_KEYS.LETTER_SPACING)) || DEFAULTS.letterSpacing;
    currentSettings.fontWeight = parseInt(localStorage.getItem(STORAGE_KEYS.FONT_WEIGHT)) || DEFAULTS.fontWeight;
    currentSettings.lineHeight = parseFloat(localStorage.getItem(STORAGE_KEYS.LINE_HEIGHT)) || DEFAULTS.lineHeight;
    
    console.log('📦 Préférences chargées:', currentSettings);
  } catch (error) {
    console.warn('⚠️ Erreur lors du chargement des préférences:', error);
    currentSettings = { ...DEFAULTS };
  }
}

// ============================================
// SAUVEGARDE DES PRÉFÉRENCES
// ============================================

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTRAST, currentSettings.contrast);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, currentSettings.fontSize);
    localStorage.setItem(STORAGE_KEYS.LETTER_SPACING, currentSettings.letterSpacing);
    localStorage.setItem(STORAGE_KEYS.FONT_WEIGHT, currentSettings.fontWeight);
    localStorage.setItem(STORAGE_KEYS.LINE_HEIGHT, currentSettings.lineHeight);
    
    console.log('💾 Préférences sauvegardées');
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
}

// ============================================
// APPLICATION DES STYLES
// ============================================

function applyAllSettings() {
  applyContrast(currentSettings.contrast);
  applyFontSize(currentSettings.fontSize);
  applyLetterSpacing(currentSettings.letterSpacing);
  applyFontWeight(currentSettings.fontWeight);
  applyLineHeight(currentSettings.lineHeight);
}

// Appliquer le contraste
function applyContrast(mode) {
  document.documentElement.setAttribute('data-contrast', mode);
  currentSettings.contrast = mode;
  console.log('🎨 Contraste appliqué:', mode);
}

// Appliquer la taille de police
function applyFontSize(size) {
  const root = document.documentElement;
  
  root.style.setProperty('--font-size-base', `${size}px`);
  
  // Adapter les titres proportionnellement
  root.style.setProperty('--font-size-h1', `${size * 3.33}px`);
  root.style.setProperty('--font-size-h2', `${size * 2.33}px`);
  root.style.setProperty('--font-size-h3', `${size * 1.67}px`);
  root.style.setProperty('--font-size-h4', `${size * 1.33}px`);
  
  currentSettings.fontSize = size;
  console.log('📏 Taille de police appliquée:', size);
}

// Appliquer l'interlettrage
function applyLetterSpacing(spacing) {
  document.documentElement.style.setProperty('--letter-spacing', `${spacing}em`);
  currentSettings.letterSpacing = spacing;
  console.log('🔤 Interlettrage appliqué:', spacing);
}

// Appliquer la graisse
function applyFontWeight(weight) {
  document.documentElement.style.setProperty('--font-weight', weight);
  currentSettings.fontWeight = weight;
  console.log('💪 Graisse appliquée:', weight);
}

// Appliquer l'interlignage
function applyLineHeight(height) {
  document.documentElement.style.setProperty('--line-height', height);
  currentSettings.lineHeight = height;
  console.log('📐 Interlignage appliqué:', height);
}

// ============================================
// INITIALISATION DES CONTRÔLES
// ============================================

function initializeControls() {
  // Contraste
  initializeContrastControls();
  
  // Taille de police
  initializeFontSizeControls();
  
  // Interlettrage
  initializeLetterSpacingControls();
  
  // Graisse
  initializeFontWeightControls();
  
  // Interlignage
  initializeLineHeightControls();
  
  // Bouton réinitialiser
  initializeResetButton();
}

// ============================================
// CONTRÔLES DE CONTRASTE
// ============================================

function initializeContrastControls() {
  const buttons = document.querySelectorAll('[data-contrast-mode]');
  
  buttons.forEach(button => {
    const mode = button.getAttribute('data-contrast-mode');
    
    // Marquer le bouton actif
    if (mode === currentSettings.contrast) {
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    }
    
    // Ajouter l'événement
    button.addEventListener('click', () => {
      // Retirer l'état actif de tous les boutons
      buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      // Activer le bouton cliqué
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      
      // Appliquer et sauvegarder
      applyContrast(mode);
      saveSettings();
    });
  });
}

// ============================================
// CONTRÔLES DE TAILLE DE POLICE
// ============================================

function initializeFontSizeControls() {
  const slider = document.getElementById('font-size-slider');
  const decreaseBtn = document.getElementById('font-size-decrease');
  const increaseBtn = document.getElementById('font-size-increase');
  const valueDisplay = document.getElementById('font-size-value');
  
  if (!slider) return;
  
  // Initialiser la valeur
  slider.value = currentSettings.fontSize;
  updateFontSizeDisplay(currentSettings.fontSize);
  
  // Slider
  slider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    applyFontSize(size);
    updateFontSizeDisplay(size);
  });
  
  slider.addEventListener('change', () => {
    saveSettings();
  });
  
  // Bouton diminuer
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const newSize = Math.max(16, currentSettings.fontSize - 2);
      slider.value = newSize;
      applyFontSize(newSize);
      updateFontSizeDisplay(newSize);
      saveSettings();
    });
  }
  
  // Bouton augmenter
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const newSize = Math.min(24, currentSettings.fontSize + 2);
      slider.value = newSize;
      applyFontSize(newSize);
      updateFontSizeDisplay(newSize);
      saveSettings();
    });
  }
}

function updateFontSizeDisplay(size) {
  const display = document.getElementById('font-size-value');
  if (!display) return;
  
  const labels = {
    16: 'Petit',
    18: 'Moyen',
    20: 'Grand',
    22: 'Très grand',
    24: 'Maximum'
  };
  
  display.textContent = `${size}px (${labels[size] || ''})`;
}

// ============================================
// CONTRÔLES D'INTERLETTRAGE
// ============================================

function initializeLetterSpacingControls() {
  const slider = document.getElementById('letter-spacing-slider');
  const valueDisplay = document.getElementById('letter-spacing-value');
  
  if (!slider) return;
  
  // Initialiser la valeur
  slider.value = currentSettings.letterSpacing;
  updateLetterSpacingDisplay(currentSettings.letterSpacing);
  
  // Slider
  slider.addEventListener('input', (e) => {
    const spacing = parseFloat(e.target.value);
    applyLetterSpacing(spacing);
    updateLetterSpacingDisplay(spacing);
  });
  
  slider.addEventListener('change', () => {
    saveSettings();
  });
}

function updateLetterSpacingDisplay(spacing) {
  const display = document.getElementById('letter-spacing-value');
  if (!display) return;
  
  const labels = {
    '-0.02': 'Très serré',
    '0.00': 'Serré',
    '0.01': 'Normal',
    '0.03': 'Large',
    '0.05': 'Très large'
  };
  
  const key = spacing.toFixed(2);
  display.textContent = `${spacing.toFixed(2)}em (${labels[key] || 'Normal'})`;
}

// ============================================
// CONTRÔLES DE GRAISSE
// ============================================

function initializeFontWeightControls() {
  const buttons = document.querySelectorAll('[data-font-weight]');
  
  buttons.forEach(button => {
    const weight = parseInt(button.getAttribute('data-font-weight'));
    
    // Marquer le bouton actif
    if (weight === currentSettings.fontWeight) {
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    }
    
    // Ajouter l'événement
    button.addEventListener('click', () => {
      // Retirer l'état actif de tous les boutons
      buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      // Activer le bouton cliqué
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      
      // Appliquer et sauvegarder
      applyFontWeight(weight);
      saveSettings();
    });
  });
}

// ============================================
// CONTRÔLES D'INTERLIGNAGE
// ============================================

function initializeLineHeightControls() {
  const slider = document.getElementById('line-height-slider');
  const valueDisplay = document.getElementById('line-height-value');
  
  if (!slider) return;
  
  // Initialiser la valeur
  slider.value = currentSettings.lineHeight;
  updateLineHeightDisplay(currentSettings.lineHeight);
  
  // Slider
  slider.addEventListener('input', (e) => {
    const height = parseFloat(e.target.value);
    applyLineHeight(height);
    updateLineHeightDisplay(height);
  });
  
  slider.addEventListener('change', () => {
    saveSettings();
  });
}

function updateLineHeightDisplay(height) {
  const display = document.getElementById('line-height-value');
  if (!display) return;
  
  const labels = {
    '1.4': 'Serré',
    '1.6': 'Normal',
    '1.8': 'Large',
    '2.0': 'Très large',
    '2.2': 'Maximum'
  };
  
  const key = height.toFixed(1);
  display.textContent = `${key} (${labels[key] || 'Normal'})`;
}

// ============================================
// BOUTON RÉINITIALISER
// ============================================

function initializeResetButton() {
  const button = document.getElementById('reset-button');
  
  if (!button) return;
  
  button.addEventListener('click', () => {
    if (confirm('Voulez-vous réinitialiser tous les paramètres d\'accessibilité ?')) {
      resetAllSettings();
    }
  });
}

function resetAllSettings() {
  // Réinitialiser l'état
  currentSettings = { ...DEFAULTS };
  
  // Supprimer du localStorage
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Appliquer les paramètres par défaut
  applyAllSettings();
  
  // Mettre à jour l'interface
  updateAllControls();
  
  console.log('🔄 Paramètres réinitialisés');
  
  // Message de confirmation (optionnel)
  // alert('Les paramètres ont été réinitialisés');
}

function updateAllControls() {
  // Mettre à jour les boutons de contraste
  document.querySelectorAll('[data-contrast-mode]').forEach(btn => {
    const mode = btn.getAttribute('data-contrast-mode');
    if (mode === currentSettings.contrast) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
  
  // Mettre à jour le slider de taille
  const fontSizeSlider = document.getElementById('font-size-slider');
  if (fontSizeSlider) {
    fontSizeSlider.value = currentSettings.fontSize;
    updateFontSizeDisplay(currentSettings.fontSize);
  }
  
  // Mettre à jour le slider d'interlettrage
  const letterSpacingSlider = document.getElementById('letter-spacing-slider');
  if (letterSpacingSlider) {
    letterSpacingSlider.value = currentSettings.letterSpacing;
    updateLetterSpacingDisplay(currentSettings.letterSpacing);
  }
  
  // Mettre à jour les boutons de graisse
  document.querySelectorAll('[data-font-weight]').forEach(btn => {
    const weight = parseInt(btn.getAttribute('data-font-weight'));
    if (weight === currentSettings.fontWeight) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
  
  // Mettre à jour le slider d'interlignage
  const lineHeightSlider = document.getElementById('line-height-slider');
  if (lineHeightSlider) {
    lineHeightSlider.value = currentSettings.lineHeight;
    updateLineHeightDisplay(currentSettings.lineHeight);
  }
}

// ============================================
// WIDGET FLOTTANT
// ============================================

function initializeWidget() {
  const widget = document.getElementById('accessibility-widget');
  const panel = document.getElementById('widget-panel');
  const overlay = document.getElementById('widget-overlay');
  const closeBtn = document.getElementById('widget-close');
  
  if (!widget) return;
  
  let isOpen = false;
  
  // Ouvrir/Fermer le widget
  widget.addEventListener('click', () => {
    toggleWidget();
  });
  
  // Bouton de fermeture
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeWidget();
    });
  }
  
  // Clic sur l'overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeWidget();
    });
  }
  
  // Fermer avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeWidget();
    }
  });
  
  function toggleWidget() {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  }
  
  function openWidget() {
    if (panel) panel.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
    widget.setAttribute('aria-expanded', 'true');
    isOpen = true;
    
    // Focus sur le premier élément du panel
    if (panel) {
      const firstButton = panel.querySelector('button');
      if (firstButton) firstButton.focus();
    }
  }
  
  function closeWidget() {
    if (panel) panel.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    widget.setAttribute('aria-expanded', 'false');
    isOpen = false;
    
    // Remettre le focus sur le widget
    widget.focus();
  }
  
  // Initialiser les contrôles du widget (versions simplifiées)
  initializeWidgetControls();
}

// ============================================
// CONTRÔLES DU WIDGET (versions simplifiées)
// ============================================

function initializeWidgetControls() {
  // Contraste dans le widget
  document.querySelectorAll('[data-widget-contrast]').forEach(button => {
    const mode = button.getAttribute('data-widget-contrast');
    
    if (mode === currentSettings.contrast) {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-widget-contrast]').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      applyContrast(mode);
      saveSettings();
      
      // Mettre à jour aussi les contrôles de la page complète
      updateAllControls();
    });
  });
  
  // Taille dans le widget
  const widgetSlider = document.getElementById('widget-font-size-slider');
  const widgetDecrease = document.getElementById('widget-font-size-decrease');
  const widgetIncrease = document.getElementById('widget-font-size-increase');
  const widgetValue = document.getElementById('widget-font-size-value');
  
  if (widgetSlider) {
    widgetSlider.value = currentSettings.fontSize;
    if (widgetValue) widgetValue.textContent = `${currentSettings.fontSize}px`;
    
    widgetSlider.addEventListener('input', (e) => {
      const size = parseInt(e.target.value);
      applyFontSize(size);
      if (widgetValue) widgetValue.textContent = `${size}px`;
    });
    
    widgetSlider.addEventListener('change', () => {
      saveSettings();
      updateAllControls();
    });
  }
  
  if (widgetDecrease) {
    widgetDecrease.addEventListener('click', () => {
      const newSize = Math.max(16, currentSettings.fontSize - 2);
      if (widgetSlider) widgetSlider.value = newSize;
      if (widgetValue) widgetValue.textContent = `${newSize}px`;
      applyFontSize(newSize);
      saveSettings();
      updateAllControls();
    });
  }
  
  if (widgetIncrease) {
    widgetIncrease.addEventListener('click', () => {
      const newSize = Math.min(24, currentSettings.fontSize + 2);
      if (widgetSlider) widgetSlider.value = newSize;
      if (widgetValue) widgetValue.textContent = `${newSize}px`;
      applyFontSize(newSize);
      saveSettings();
      updateAllControls();
    });
  }
}

// ============================================
// UTILITAIRES
// ============================================

// Exporter les fonctions pour usage externe (optionnel)
window.WharfAccessibility = {
  applyContrast,
  applyFontSize,
  applyLetterSpacing,
  applyFontWeight,
  applyLineHeight,
  resetAllSettings,
  getCurrentSettings: () => ({ ...currentSettings })
};

console.log('✅ Module d\'accessibilité WHARF chargé');
