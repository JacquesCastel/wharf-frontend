'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-2xl font-bold mb-2">WHARF</h3>
            <p className="text-zinc-400">Design narratif</p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <nav className="space-y-2 text-sm">
              <div><Link href="/we" className="text-zinc-400 hover:text-white">WE</Link></div>
              <div><Link href="/work" className="text-zinc-400 hover:text-white">WORK</Link></div>
              <div><Link href="/you" className="text-zinc-400 hover:text-white">YOU</Link></div>
              <div><Link href="/contact" className="text-zinc-400 hover:text-white">CONTACT</Link></div>
            </nav>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-zinc-400 text-sm">
              contact@wharf.fr
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <nav className="flex flex-wrap gap-6 text-xs text-zinc-400 mb-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="hover:text-white">Politique de confidentialité</Link>
            <Link href="/accessibilite" className="hover:text-white">Accessibilité</Link>
            <Link href="/accessibilite/engagement" className="hover:text-white">Notre engagement inclusif</Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="text-center text-xs text-zinc-500">
          <p className="mb-2">© 2025 Wharf</p>
          <p className="italic">Là où la marque retrouve son sens</p>
        </div>
      </div>
    </footer>
  );
}
