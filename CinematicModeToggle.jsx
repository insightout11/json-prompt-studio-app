import React from 'react';
import { useTheme } from './ThemeContext';

const CinematicModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center min-[1280px]:px-4 min-[1280px]:py-2 min-[1024px]:max-[1279px]:px-2.5 min-[1024px]:max-[1279px]:py-1.5 min-[768px]:max-[1023px]:px-2 min-[768px]:max-[1023px]:py-1 max-[767px]:px-3 max-[767px]:py-2 rounded-md font-medium min-[1280px]:text-sm min-[1024px]:max-[1279px]:text-sm min-[768px]:max-[1023px]:text-xs max-[767px]:text-sm transition-all duration-300 group
        bg-cinema-panel text-cinema-text border border-cinema-border hover:bg-cinema-card hover:shadow-glow-teal
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