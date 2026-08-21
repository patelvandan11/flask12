/** @type {import('next').NextConfig} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc',
          dark: '#0b0f19',
        },
        card: {
          light: 'rgba(255, 255, 255, 0.9)',
          dark: 'rgba(15, 23, 42, 0.75)',
        },
        text: {
          primaryLight: '#0f172a',
          primaryDark: '#f8fafc',
          secondaryLight: '#475569',
          secondaryDark: '#cbd5e1',
          muted: '#64748b',
        },
        aesthetic: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          teal: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        code: ['var(--font-code)', 'monospace'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(99, 102, 241, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
