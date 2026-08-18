/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgba(var(--bg-background), <alpha-value>)',
        card: 'rgba(var(--bg-card), <alpha-value>)',
        text: {
          main: 'rgba(var(--text-main), <alpha-value>)',
          muted: 'rgba(var(--text-muted), <alpha-value>)',
        },
        border: 'rgba(var(--border), <alpha-value>)',
        primary: {
          DEFAULT: '#0F172A', // Dark Blue
          light: '#1E293B',
          text: 'rgba(var(--primary-text), <alpha-value>)',
        },
        accent: {
          DEFAULT: '#D4AF37', // Gold
          hover: '#C5A059',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
