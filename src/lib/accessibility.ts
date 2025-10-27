export interface AccessibilitySettings {
  contrast: 'normal' | 'high' | 'inverted';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  letterSpacing: 'tight' | 'normal' | 'loose' | 'looser' | 'loosest';
  fontWeight: '300' | '400' | '600';
  lineHeight: '1.4' | '1.6' | '1.8' | '2.0' | '2.2';
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  contrast: 'normal',
  fontSize: 'medium',
  letterSpacing: 'normal',
  fontWeight: '400',
  lineHeight: '1.6',
};

export function getAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  const stored = localStorage.getItem('wharf_accessibility');
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export function saveAccessibilitySettings(settings: AccessibilitySettings) {
  localStorage.setItem('wharf_accessibility', JSON.stringify(settings));
  applyAccessibilitySettings(settings);
}

export function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  // Contraste
  if (settings.contrast === 'high') {
    root.style.setProperty('--bg-color', '#ffffff');
    root.style.setProperty('--text-color', '#000000');
  } else if (settings.contrast === 'inverted') {
    root.style.setProperty('--bg-color', '#0a0a0b');
    root.style.setProperty('--text-color', '#fafafa');
  } else {
    root.style.setProperty('--bg-color', '#fafafa');
    root.style.setProperty('--text-color', '#09090b');
  }

  // Taille police
  const fontSizes = {
    small: '16px',
    medium: '18px',
    large: '20px',
    xlarge: '22px',
    xxlarge: '24px',
  };
  root.style.setProperty('--font-size-base', fontSizes[settings.fontSize]);

  // Crénage
  const letterSpacings = {
    tight: '-0.02em',
    normal: '0em',
    loose: '0.03em',
    looser: '0.05em',
    loosest: '0.08em',
  };
  root.style.setProperty('--letter-spacing', letterSpacings[settings.letterSpacing]);

  // Graisse
  root.style.setProperty('--font-weight', settings.fontWeight);

  // Interlignage
  root.style.setProperty('--line-height', settings.lineHeight);
}