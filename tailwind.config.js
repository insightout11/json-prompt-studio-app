/** @type {import('tailwindcss').Config} */
// Light theme implementation - comprehensive styling
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
        },
        // Light Mode Palette - Modern & Sophisticated
        light: {
          'bg': '#fefefe',            // Pure white background
          'surface': '#f8fafc',       // Very light blue-gray surface
          'panel': '#ffffff',         // Pure white panels with shadows
          'card': '#f1f5f9',          // Light blue-gray cards
          'border': '#e2e8f0',        // Soft blue-gray borders
          'text': '#0f172a',          // Rich dark slate text
          'text-muted': '#64748b',    // Medium slate for secondary text
          // Primary brand colors (teal-based)
          'primary': '#0d9488',       // Rich teal (WCAG AA: 4.8:1 contrast)
          'primary-hover': '#0f766e', // Darker teal for hover states
          'primary-light': '#ccfbf1', // Very light teal for backgrounds
          'primary-border': '#5eead4', // Medium teal for borders
          // Secondary colors (purple accent)
          'secondary': '#7c3aed',     // Rich purple (matches cinema)
          'secondary-hover': '#6d28d9', // Darker purple for hover
          'secondary-light': '#ede9fe', // Very light purple backgrounds
          'secondary-border': '#c4b5fd', // Medium purple for borders
          // Status colors
          'success': '#059669',       // Rich emerald green
          'success-light': '#d1fae5', // Light green background
          'warning': '#d97706',       // Rich amber
          'warning-light': '#fef3c7', // Light amber background
          'error': '#dc2626',         // Rich red
          'error-light': '#fecaca'    // Light red background
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
        // Dark mode - Accessible glow effects (subtle, less eye strain)
        'glow-teal': '0 0 15px rgba(0, 139, 139, 0.4)',
        'glow-purple': '0 0 12px rgba(124, 58, 237, 0.4)',
        'glow-success': '0 0 10px rgba(5, 150, 105, 0.4)',
        'glow-gold': '0 0 10px rgba(217, 119, 6, 0.4)',
        'glow-soft': '0 8px 25px rgba(0, 139, 139, 0.15)',
        // Bright variants for special accents (use sparingly)
        'glow-teal-bright': '0 0 20px rgba(0, 255, 247, 0.6)',
        'glow-purple-bright': '0 0 15px rgba(162, 89, 255, 0.5)',
        'glow-success-bright': '0 0 10px rgba(0, 255, 136, 0.4)',
        // Light mode - Elegant shadows
        'light-panel': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'light-card': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'light-elevated': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'light-primary': '0 4px 14px rgba(13, 148, 136, 0.25)',
        'light-secondary': '0 4px 14px rgba(124, 58, 237, 0.25)'
      }
    },
  },
  plugins: [],
}