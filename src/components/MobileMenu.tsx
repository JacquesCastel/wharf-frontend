'use client';

import Link from 'next/link';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: Array<{ label: string; href: string }>;
}

export default function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-lg">
        <div className="p-6 space-y-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-2xl text-zinc-950"
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Navigation links */}
          <nav className="space-y-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-lg font-medium text-zinc-950 hover:text-zinc-600"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer link */}
          <div className="pt-6 border-t border-zinc-200">
            <Link
              href="/accessibilite"
              className="text-sm text-zinc-600 hover:text-zinc-950"
              onClick={onClose}
            >
              Accessibilité
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}