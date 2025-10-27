'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FooterData {
  slogan?: string;
  copyright?: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch('http://91.99.170.150/api/footer?populate=*');
        const data = await response.json();
        
        setFooterData({
          slogan: data.data.slogan || 'Design narratif & Communication corporate',
          copyright: data.data.copyright || `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`
        });
      } catch (error) {
        console.error('Error fetching footer:', error);
        setFooterData({
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
              WHARF
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