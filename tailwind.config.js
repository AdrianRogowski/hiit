/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-elevated': '#262626',
        work: '#FF6B35',
        'work-glow': 'rgba(255, 107, 53, 0.3)',
        rest: '#00D9A5',
        'rest-glow': 'rgba(0, 217, 165, 0.3)',
        paused: '#FFD166',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0A0',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['JetBrains Mono', 'SF Mono', 'monospace'],
        body: ['Outfit', 'DM Sans', 'sans-serif'],
      },
      fontSize: {
        'timer-giant': ['8rem', { lineHeight: '1' }],
        'timer-large': ['4rem', { lineHeight: '1.1' }],
      },
      boxShadow: {
        'glow-work': '0 0 40px rgba(255, 107, 53, 0.3)',
        'glow-rest': '0 0 40px rgba(0, 217, 165, 0.3)',
      },
      animation: {
        'pulse-work': 'pulse-work 2s ease-in-out infinite',
        'pulse-rest': 'pulse-rest 2s ease-in-out infinite',
        'tick': 'tick 1s ease-in-out',
      },
      keyframes: {
        'pulse-work': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(255, 107, 53, 0.3)' },
        },
        'pulse-rest': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 217, 165, 0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(0, 217, 165, 0.3)' },
        },
        'tick': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
