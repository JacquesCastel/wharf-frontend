import AccessibilityWidget from './components/AccessibilityWidget'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {/* Votre header */}
        {children}
        {/* Votre footer */}
        
        <AccessibilityWidget />
      </body>
    </html>
  )
}