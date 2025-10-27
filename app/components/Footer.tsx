// components/Footer.tsx
// Composant Footer dynamique connecté à Strapi

import Link from 'next/link';
import Image from 'next/image';
import { getFooter } from '../lib/strapi';

export default async function Footer() {
  const footerData = await getFooter();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Logo et infos */}
          <div className="footer-brand">
            {footerData.logo && (
              <Link href="/" className="footer-logo">
                <Image
                  src={footerData.logo.url}
                  alt={footerData.logo.alternativeText}
                  width={120}
                  height={120}
                />
              </Link>
            )}
            <div className="footer-contact">
              <a href={`mailto:${footerData.email}`} className="footer-contact-link">
                {footerData.email}
              </a>
              <a href={`tel:${footerData.telephone}`} className="footer-contact-link">
                {footerData.telephone}
              </a>
            </div>
          </div>

          {/* Sections dynamiques */}
          {footerData.sections.map((section: any, index: number) => (
            <div key={index} className="footer-section">
              <h3 className="footer-section-title">{section.titre}</h3>
              <ul className="footer-links">
                {section.liens.map((lien: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <Link href={lien.url} className="footer-link">
                      {lien.texte}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Wharf. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}