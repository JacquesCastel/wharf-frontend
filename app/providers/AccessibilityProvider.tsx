'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilitySettings {
  contrast: 'normal' | 'high' | 'inverted';
  fontSize: number;
  letterSpacing: number;
  fontWeight: number;
  lineHeight: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  contrast: 'normal',
  fontSize: 18,
  letterSpacing: 0.01,
  fontWeight: 400,
  lineHeight: 1.6,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('a11y-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres d\'accessibilité', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;

    if (settings.contrast === 'high') {
      root.style.setProperty('--color-primary', '#000000');
      root.style.setProperty('--color-bg', '#ffffff');
      root.style.filter = 'none';
    } else if (settings.contrast === 'inverted') {
      root.style.setProperty('--color-primary', '#ffffff');
      root.style.setProperty('--color-bg', '#000000');
      root.style.filter = 'invert(1)';
    } else {
      root.style.setProperty('--color-primary', '#09090b');
      root.style.setProperty('--color-bg', '#faf8f3');
      root.style.filter = 'none';
    }

    root.style.fontSize = `${settings.fontSize}px`;
    root.style.letterSpacing = `${settings.letterSpacing}em`;
    document.body.style.fontWeight = settings.fontWeight.toString();
    root.style.lineHeight = settings.lineHeight.toString();

    localStorage.setItem('a11y-settings', JSON.stringify(settings));
  }, [settings, isClient]);

  const updateSettings = (key: keyof AccessibilitySettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('a11y-settings');
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility doit être utilisé dans un AccessibilityProvider');
  }
  return context;
}