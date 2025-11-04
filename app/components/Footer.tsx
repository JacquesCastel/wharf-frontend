'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterData {
  Logo?: {
    url: string;
    alternativeText: string;
  };
  slogan?: string;
  copyright?: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch('https://admin.bywharf.com/api/footer?populate=*');
        const data = await response.json();
        
        setFooterData({
          Logo: data.data.Logo ? {
           url: `https://admin.bywharf.com${data.data.Logo.url}`,
           alternativeText: data.data.Logo.alternativeText || 'Logo Wharf'
  } : undefined,
          slogan: data.data.slogan || 'Design narratif & Communication corporate',
          copyright: data.data.copyright || `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`
        });
      } catch (error) {
        console.error('Error fetching footer:', error);
        setFooterData({
          Logo: undefined,
          slogan: 'Design narratif & Communication corporate',
          copyright: `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`
        });
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Logo + Slogan à gauche */}
          <div className="footer-left">
            <Link href="/" className="footer-logo">
  {footerData?.Logo ? (
    <img 
      src={footerData.Logo.url} 
      alt={footerData.Logo.alternativeText || 'Logo Wharf'}
      style={{ height: '200px' }}
    />
  ) : (
    'WHARF'
  )}
</Link>
            {footerData?.slogan && (
              <p className="footer-slogan">{footerData.slogan}</p>
            )}
          </div>

          {/* 2 colonnes de navigation à droite */}
          <div className="footer-right">
            {/* Colonne 1 : Pages principales */}
            <div className="footer-column">
              <h3 className="footer-column-title">Navigation</h3>
              <nav className="footer-nav">
                <Link href="/we" className="footer-link">WE</Link>
                <Link href="/work" className="footer-link">WORK</Link>
                <Link href="/you" className="footer-link">YOU</Link>
                <Link href="/contact" className="footer-link">CONTACT</Link>
              </nav>
            </div>

            {/* Colonne 2 : Accessibilité */}
            <div className="footer-column">
              <h3 className="footer-column-title">Accessibilité</h3>
              <nav className="footer-nav">
                <Link href="/accessibilite" className="footer-link">Accessibilité</Link>
                <Link href="/accessibilite/engagement" className="footer-link">Engagement</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Copyright en bas */}
        {footerData?.copyright && (
          <div className="footer-bottom">
            <p className="footer-copyright">{footerData.copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}