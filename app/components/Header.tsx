'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

interface NavigationData {
  logo: { url: string; alternativeText: string } | null;
  liens: MenuItem[];
  cta_text: string;
  cta_url: string;
}

export default function Header({ navigationData }: { navigationData: NavigationData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const defaultLinks = [
    { id: 1, label: 'WE', url: '/we' },
    { id: 2, label: 'WORK', url: '/work' },
    { id: 3, label: 'YOU', url: '/you' },
  ];
  const links = navigationData.liens.length ? navigationData.liens : defaultLinks;
  const navData = {
    logo: navigationData.logo,
    liens_menu: links.some(item => item.url.replace(/\/$/, '') === '/insights') ? links : [...links, { id: -1, label: 'INSIGHTS', url: '/insights' }],
  };

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
          <Link href="/login" className="header-client-btn">
            Espace client
          </Link>
        </nav>

        {/* Burger Mobile */}
        <button 
          className="header-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="main-mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu" id="main-mobile-menu">
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
                className="header-mobile-link header-mobile-contact header-contact-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT
              </Link>
              <Link
                href="/login"
                className="header-mobile-link header-client-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Espace client
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}