/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0a0a0a',
          charcoal: '#1a1a1a',
          dark: '#111111',
          surface: 'rgba(255,255,255,0.05)',
          'surface-hover': 'rgba(255,255,255,0.08)',
          'surface-elevated': 'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.08)',
          'border-hover': 'rgba(255,255,255,0.15)',
          white: '#faf9f6',
          'white-muted': 'rgba(255,255,255,0.6)',
          'white-subtle': 'rgba(255,255,255,0.4)',
          gold: '#c9a84c',
          'gold-bright': '#d4af37',
          'gold-muted': 'rgba(201,168,76,0.2)',
          'gold-glow': 'rgba(201,168,76,0.05)',
          peach: '#e8a87c',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3.5rem, 8vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'card-title': ['1.25rem', { lineHeight: '1.4' }],
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.1em' }],
      },
      backdropBlur: {
        'glass': '20px',
        'glass-heavy': '30px',
      },
      borderRadius: {
        'glass': '16px',
        'glass-lg': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
        'glass-elevated': '0 8px 32px rgba(0,0,0,0.4)',
        'gold-glow': '0 0 40px rgba(201,168,76,0.08)',
        'card': '0 4px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.7s ease-out forwards',
        'slide-in-right': 'slideInRight 0.7s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
