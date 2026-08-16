/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        card: '#FFFFFF',
        text: {
          main: '#1F2937',
          muted: '#6B7280',
        },
        border: '#E5E7EB',
        primary: {
          DEFAULT: '#0F172A', // Dark Blue
          light: '#1E293B',
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
