import React from 'react';
import { useTheme } from './ThemeContext';

const CinematicModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center px-3 py-2 rounded-md font-medium text-sm transition-all duration-300 group
        ${isDarkMode 
          ? 'bg-cinema-panel text-cinema-text border border-cinema-border hover:bg-cinema-card hover:shadow-glow-teal' 
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'cinematic'} mode`}
      title={`${isDarkMode ? 'Light' : 'Cinematic'} Mode`}
    >
      {/* Icon container with smooth transition */}
      <div className="relative w-5 h-5 mr-2">
        {/* Moon Icon for Dark/Cinematic Mode */}
        <div className={`
          absolute inset-0 transition-all duration-300 transform
          ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-180'}
        `}>
          🌙
        </div>
        
        {/* Sun Icon for Light Mode */}
        <div className={`
          absolute inset-0 transition-all duration-300 transform
          ${!isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-180'}
        `}>
          ☀️
        </div>
      </div>
      
      <span className="relative z-10">
        {isDarkMode ? 'Cinematic' : 'Light'}
      </span>
      
      {/* Subtle glow effect when dark mode is active */}
      {isDarkMode && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-md pointer-events-none" />
      )}
    </button>
  );
};

export default CinematicModeToggle;