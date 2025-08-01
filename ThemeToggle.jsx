import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 group
        ${isDarkMode 
          ? 'bg-cinema-panel text-cinema-text border border-cinema-border hover:bg-cinema-card hover:shadow-glow-teal' 
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {/* Icon container with smooth transition */}
      <div className="relative w-5 h-5 mr-2">
        {/* Sun icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
        
        {/* Moon icon */}
        <svg 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      </div>

      {/* Text label */}
      <span className="hidden sm:inline">
        {isDarkMode ? 'Cinematic Mode' : 'Light Mode'}
      </span>

      {/* Mobile-only film icon */}
      <span className="sm:hidden">
        🎬
      </span>

      {/* Subtle glow effect for dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cinema-teal/20 to-cinema-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      )}
    </button>
  );
};

export default ThemeToggle;