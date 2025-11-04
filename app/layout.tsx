import type { Metadata } from "next";
import Footer from './components/Footer'
import AccessibilityWidget from './components/AccessibilityWidget'
import './globals.css'
import HeaderWrapper from './components/HeaderWrapper';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "Wharf - Design Narratif",
  description: "Agence de design narratif et de production audiovisuelle",
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