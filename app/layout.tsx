import type { Metadata } from "next";
import Footer from './components/Footer'
import AccessibilityWidget from './components/AccessibilityWidget'
import './globals.css'
import HeaderWrapper from './components/HeaderWrapper';

export const metadata: Metadata = {
  title: "Wharf - Design Narratif",
  description: "Agence de communication corporate et design narratif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <HeaderWrapper />
        {children}
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}