'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

interface NavigationData {
  logo: { url: string; alternativeText: string; width?: number; height?: number } | null;
  liens: MenuItem[];
  cta_text: string;
  cta_url: string;
}

export default function Header({ navigationData }: { navigationData: NavigationData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const burgerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);
  const defaultLinks = [
    { id: 1, label: 'WE', url: '/we' },
    { id: 2, label: 'WORK', url: '/work' },
    { id: 3, label: 'YOU', url: '/you' },
  ];
  const links = (navigationData.liens.length ? navigationData.liens : defaultLinks)
    .filter(item => item.url.replace(/\/$/, '') !== '/contact');
  const navData = {
    logo: navigationData.logo,
    liens_menu: links.some(item => item.url.replace(/\/$/, '') === '/insights') ? links : [...links, { id: -1, label: 'INSIGHTS', url: '/insights' }],
  };

  return (
    <header className={`header wharf-header${pathname === '/' ? ' wharf-header-film' : ''}`}>
      <a className="wharf-skip-link" href="#main-content">Aller au contenu</a>
      <div className="header-container">
        <Link href="/" className="header-logo" aria-label="Wharf — accueil">
          {navData.logo ? (
            <img 
              src={navData.logo.url} 
              alt={navData.logo.alternativeText || 'Wharf'}
              width={navData.logo.width}
              height={navData.logo.height}
              decoding="async"
              style={{ height: '40px' }}
            />
          ) : (
            'WHARF'
          )}
        </Link>

        {/* Menu Desktop */}
        <nav className="header-nav" aria-label="Navigation principale">
          {navData.liens_menu?.map((item) => (
            <Link 
              key={item.id} 
              href={item.url}
              className="header-nav-link"
              aria-current={pathname === item.url || pathname.startsWith(`${item.url}/`) ? 'page' : undefined}
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
          ref={burgerRef}
          className="header-burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
            <nav className="header-mobile-nav" aria-label="Navigation principale mobile">
              {navData.liens_menu?.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.url}
                  className="header-mobile-link"
                  aria-current={pathname === item.url || pathname.startsWith(`${item.url}/`) ? 'page' : undefined}
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