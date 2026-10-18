import { Bodoni_Moda, IBM_Plex_Mono, IBM_Plex_Sans, Lora, Playfair_Display } from 'next/font/google';

// Font files are fetched at build time and served by Wharf, never by Google at runtime.
export const lora = Lora({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-lora', display: 'swap' });
export const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-bodoni', display: 'swap', preload: false });
export const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-playfair', display: 'swap', preload: false });
export const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-plex-sans', display: 'swap', preload: false });
export const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap', preload: false });
