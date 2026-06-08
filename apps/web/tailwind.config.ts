import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FEFDFB',
          100: '#FDFBF0',
          200: '#F5EDD3',
          300: '#EDE0C4',
          400: '#D4BC8B',
          500: '#B09060',
          600: '#8B7050',
          700: '#6A5038',
          800: '#4A3020',
          900: '#2C1A0E',
        },
        ink: { DEFAULT: '#2C1A0E', dark: '#1A1209', medium: '#4A3020' },
        lumen: {
          100: '#FEFCE8', 200: '#FEF9C3', 300: '#FEF08A',
          400: '#F2D574', 500: '#EAB308', 600: '#D4A017',
          700: '#A37800', 800: '#7A5A00', 900: '#5A4000',
        },
        vesper: {
          100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE',
          400: '#C084DC', 500: '#A855F7', 600: '#7B2FBE',
          700: '#6D28D9', 800: '#4C1D95', 900: '#3B0A6A',
        },
        aether: {
          100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
          400: '#7EC8E3', 500: '#38BDF8', 600: '#0284C7',
          700: '#0369A1', 800: '#075985', 900: '#0C3A6A',
        },
        humus: {
          100: '#F5F0E8', 200: '#E8D9C4', 300: '#D4BA96',
          400: '#A8895A', 500: '#8B6A3E', 600: '#78532A',
          700: '#5E3D1A', 800: '#4A2E10', 900: '#3D2510',
        },
        sanguis: {
          100: '#FFF0F0', 200: '#FFD7D7', 300: '#FFA8A8',
          400: '#F87171', 500: '#EF4444', 600: '#C41E3A',
          700: '#991B1B', 800: '#7F1D1D', 900: '#4A0010',
        },
        nihil: {
          100: '#F8F8F8', 200: '#E5E7EB', 300: '#D1D5DB',
          400: '#9CA3AF', 500: '#6B7280', 600: '#374151',
          700: '#1F2937', 800: '#111827', 900: '#0D0D0D',
        },
      },
      fontFamily: {
        heading: ['var(--font-cinzel)', 'serif'],
        body: ['var(--font-crimson)', 'serif'],
        ui: ['var(--font-inter)', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'parchment-texture': "url('/textures/parchment.png')",
        'dark-texture': "url('/textures/dark-paper.png')",
        'force-lumen': 'radial-gradient(ellipse, #F2D574 0%, #D4A017 100%)',
        'force-vesper': 'radial-gradient(ellipse, #C084DC 0%, #7B2FBE 100%)',
        'force-aether': 'radial-gradient(ellipse, #7EC8E3 0%, #0284C7 100%)',
        'force-humus': 'radial-gradient(ellipse, #A8895A 0%, #78532A 100%)',
        'force-sanguis': 'radial-gradient(ellipse, #F87171 0%, #C41E3A 100%)',
        'force-nihil': 'radial-gradient(ellipse, #9CA3AF 0%, #374151 100%)',
      },
      animation: {
        'glow-lumen': 'glowLumen 2s ease-in-out infinite alternate',
        'glow-vesper': 'glowVesper 2s ease-in-out infinite alternate',
        'glow-sanguis': 'glowSanguis 2s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        glowLumen: {
          '0%': { boxShadow: '0 0 5px #F2D574' },
          '100%': { boxShadow: '0 0 20px #D4A017, 0 0 40px #D4A01744' },
        },
        glowVesper: {
          '0%': { boxShadow: '0 0 5px #C084DC' },
          '100%': { boxShadow: '0 0 20px #7B2FBE, 0 0 40px #7B2FBE44' },
        },
        glowSanguis: {
          '0%': { boxShadow: '0 0 5px #F87171' },
          '100%': { boxShadow: '0 0 20px #C41E3A, 0 0 40px #C41E3A44' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
