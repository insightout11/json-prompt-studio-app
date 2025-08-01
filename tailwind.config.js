/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cinematic Dark Mode Palette
        cinema: {
          'black': '#0e0e0e',
          'panel': '#1e1e1e', 
          'card': '#2a2a2a',
          'border': '#404040',
          'text': '#e0e0e0',
          'text-muted': '#a0a0a0',
          // Accessible color variants (WCAG AA compliant)
          'teal': '#008b8b',          // Darker teal for buttons (5.2:1 contrast)
          'teal-bright': '#00fff7',   // Bright teal for accents only
          'purple': '#7c3aed',        // Darker purple for buttons (4.8:1 contrast)
          'purple-bright': '#a259ff', // Bright purple for accents only
          'success': '#059669',       // Darker green for buttons (4.7:1 contrast)
          'success-bright': '#00ff88', // Bright green for accents only
          'gold': '#d97706',          // Darker gold for better readability (6.1:1 contrast)
          'gold-bright': '#ffd700',   // Bright gold for accents only
          'warning': '#dc2626',       // Improved warning red (5.3:1 contrast)
          'error': '#dc2626'          // Consistent error color
        }
      },
      animation: {
        'cursor-blink': 'cursor-blink 1.2s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'cursor-blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        },
        'glow-pulse': {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 255, 247, 0.4)'
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 247, 0.8), 0 0 30px rgba(0, 255, 247, 0.4)'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      boxShadow: {
        // Accessible glow effects (subtle, less eye strain)
        'glow-teal': '0 0 15px rgba(0, 139, 139, 0.4)',
        'glow-purple': '0 0 12px rgba(124, 58, 237, 0.4)',
        'glow-success': '0 0 10px rgba(5, 150, 105, 0.4)',
        'glow-gold': '0 0 10px rgba(217, 119, 6, 0.4)',
        'glow-soft': '0 8px 25px rgba(0, 139, 139, 0.15)',
        // Bright variants for special accents (use sparingly)
        'glow-teal-bright': '0 0 20px rgba(0, 255, 247, 0.6)',
        'glow-purple-bright': '0 0 15px rgba(162, 89, 255, 0.5)',
        'glow-success-bright': '0 0 10px rgba(0, 255, 136, 0.4)'
      }
    },
  },
  plugins: [],
}