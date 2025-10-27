'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
export const dynamic = 'force-dynamic';
interface NavigationData {
  logo: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | null;
  liens: {
    texte: string;
    url: string;
  }[];
  cta_text: string;
  cta_url: string;
}

interface HeaderProps {
  navigationData: NavigationData;
}

export default function Header({ navigationData }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        
        {/* Logo */}
        <Link href="/" className="header-logo">
          {navigationData.logo ? (
            <Image
  src={navigationData.logo.url}
  alt={navigationData.logo.alternativeText}
  width={60}
  height={60}
  priority
  className="header-logo-img"
/>
          ) : (
            <span className="header-logo-text">WHARF</span>
          )}
        </Link>

        {/* Navigation Desktop */}
        <nav className="header-nav">
          {navigationData.liens.map((lien: any, index: number) => (
            <Link
              key={index}
              href={lien.url}
              className={`header-link ${pathname === lien.url ? 'active' : ''}`}
            >
              {lien.Texte}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <Link href={navigationData.cta_url} className="header-cta">
          {navigationData.cta_text}
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="header-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="header-mobile-nav">
            {navigationData.liens.map((lien: any, index: number) => (
              <Link
                key={index}
                href={lien.url}
                className={`header-mobile-link ${pathname === lien.url ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {lien.texte}
              </Link>
            ))}
            <Link
              href={navigationData.cta_url}
              className="header-mobile-cta"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {navigationData.cta_text}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
