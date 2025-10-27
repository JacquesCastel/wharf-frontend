'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBridgeActive, setIsBridgeActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="nav-wrapper">
      <nav className={isScrolled ? 'scrolled' : ''} id="mainNav">
        <div className="nav-container">
          <div className={`bridge-line ${isBridgeActive ? 'active pulse' : ''}`} id="bridgeLine"></div>
          
          <Link href="/" className="nav-logo">
  <Image 
    src="/images/logo-wharf.png" 
    alt="Wharf" 
    width={200} 
    height={83}
  />
</Link>
          
          <ul 
            className="nav-links" 
            id="navLinks"
            onMouseEnter={() => setIsBridgeActive(true)}
            onMouseLeave={() => setIsBridgeActive(false)}
          >
            <li><Link href="/we" className="nav-link">WE</Link></li>
            <li><Link href="/work" className="nav-link">WORK</Link></li>
            <li><Link href="/you" className="nav-link">YOU</Link></li>
          </ul>
          
          <Link href="/contact" className="btn-contact">Contact</Link>
        </div>
      </nav>
    </div>
  );
}