/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F5EFE0',
          light: '#FCF9F2',
          base: '#EFE5CD',
          dark: '#DECFA8',
          deep: '#C9B687',
          line: '#BFA873',
          border: '#A88E55',
        },
        ink: {
          DEFAULT: '#16130F',
          pure: '#0D0B09',
          deep: '#1C1813',
          card: '#241F18',
          light: '#312B22',
          muted: '#52493C',
          border: '#3D3529',
        },
        dnd: {
          crimson: '#6E1B1B',
          'crimson-dark': '#4D1212',
          'crimson-light': '#932828',
          gold: '#C29336',
          'gold-light': '#DFC068',
          'gold-dark': '#9A7124',
          moss: '#425832',
          'moss-light': '#5A7545',
          'moss-dark': '#2E3E23',
          arcane: '#3A4F7A',
          'arcane-light': '#546F9E',
          ruby: '#881F28',
          ember: '#B85D1B',
        }
      },
      fontFamily: {
        serif: ['Spectral', 'Georgia', 'serif'],
        cinzel: ['"Spectral SC"', '"Cinzel"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'dnd-card': '0 4px 14px 0 rgba(0, 0, 0, 0.45)',
        'dnd-glow': '0 0 15px rgba(194, 147, 54, 0.25)',
        'dnd-glow-crimson': '0 0 15px rgba(110, 27, 27, 0.35)',
        'parchment-inset': 'inset 0 1px 4px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}

