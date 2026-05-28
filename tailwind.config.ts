import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Espace client — design tokens
        paper:     "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        ink:       "var(--ink)",
        "ink-2":   "var(--ink-2)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        accent:    "var(--accent)",
        highlight: "var(--highlight)",
        "highlight-deep": "var(--highlight-deep)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans:  ["var(--font-sans)"],
        mono:  ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
