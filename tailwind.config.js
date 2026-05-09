/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:      '#3B5F82',
        primaryLight: '#7AAFC7',
        secondary:    '#7AAFC7',
        muted:        '#4A6070',
        dark:         '#1A2E3E',
        light:        '#EDF4F9',
        success:      '#10B981',
        warning:      '#F59E0B',
        danger:       '#EF4444',
        surface: {
          DEFAULT: '#EDF4F9',
          card:    '#FFFFFF',
          border:  '#C8D8E4',
        },
      },
      fontFamily: {
        sans:    ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
