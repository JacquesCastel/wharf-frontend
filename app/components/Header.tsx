'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

interface NavigationData {
  logo?: {
    url: string;
    alternativeText: string;
  };
  liens_menu?: MenuItem[];
}

export default function Header() {
  const [navData, setNavData] = useState<NavigationData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const response = await fetch('http://91.99.170.150/api/navigation?populate=*');
        const data = await response.json();
        
        setNavData({
          logo: data.data.logo ? {
            url: `http://91.99.170.150${data.data.logo.url}`,
            alternativeText: data.data.logo.alternativeText || 'Logo'
          } : undefined,
          liens_menu: data.data.liens_menu || []
        });
      } catch (error) {
        console.error('Error fetching navigation:', error);
        // Données par défaut
        setNavData({
          liens_menu: [
            { id: 1, label: 'WE', url: '/we' },
            { id: 2, label: 'WORK', url: '/work' },
            { id: 3, label: 'YOU', url: '/you' }
          ]
        });
      }
    };
    fetchNav();
  }, []);

  if (!navData) {
    return (
      <header className="header">
        <div className="header-container">
          <Link href="/" className="header-logo">
            WHARF
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="header-logo">
          {navData.logo ? (
            <img 
              src={navData.logo.url} 
              alt={navData.logo.alternativeText}
              style={{ height: '40px' }}
            />
          ) : (
            'WHARF'
          )}
        </Link>

        {/* Menu Desktop */}
        <nav className="header-nav">
          {navData.liens_menu?.map((item) => (
            <Link 
              key={item.id} 
              href={item.url}
              className="header-nav-link"
            >
              {item.label}
            </Link>
          ))}
          {/* Bouton Contact séparé */}
          <Link href="/contact" className="header-contact-btn">
            CONTACT
          </Link>
        </nav>

        {/* Burger Mobile */}
        <button 
          className="header-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu">
            <nav className="header-mobile-nav">
              {navData.liens_menu?.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.url}
                  className="header-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/contact"
                className="header-mobile-link header-mobile-contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}