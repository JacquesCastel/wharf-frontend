'use client';

import { useState, useEffect } from 'react';

interface SocialLink {
  id: number;
  plateforme: string;
  url: string;
}

interface FooterData {
  slogan?: string;
  copyright?: string;
  liens_sociaux?: SocialLink[];
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch('http://91.99.170.150/api/footer?populate=*');
        const data = await response.json();
        
        setFooterData({
          slogan: data.data.slogan || '',
          copyright: data.data.copyright || '',
          liens_sociaux: data.data.liens_sociaux || []
        });
      } catch (error) {
        console.error('Error fetching footer:', error);
        // Données par défaut
        setFooterData({
          slogan: 'Design narratif & Communication corporate',
          copyright: `© ${new Date().getFullYear()} Wharf. Tous droits réservés.`,
          liens_sociaux: []
        });
      }
    };
    fetchFooter();
  }, []);

  if (!footerData) {
    return (
      <footer className="footer">
        <div className="footer-container">
          <p>Loading...</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {footerData.slogan && (
          <div className="footer-slogan">
            <p>{footerData.slogan}</p>
          </div>
        )}

        {footerData.liens_sociaux && footerData.liens_sociaux.length > 0 && (
          <div className="footer-social">
            {footerData.liens_sociaux.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                {link.plateforme}
              </a>
            ))}
          </div>
        )}

        {footerData.copyright && (
          <div className="footer-copyright">
            <p>{footerData.copyright}</p>
          </div>
        )}
      </div>
    </footer>
  );
}