// app/contact/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Wharf',
  description: "Contactez Wharf…",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
