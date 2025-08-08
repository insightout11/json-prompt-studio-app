import React, { useState, useEffect } from 'react';

const ModeToggle = ({ isAdvancedMode, onModeChange, className = "" }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    onModeChange(!isAdvancedMode);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-cinema-text">
        🧠
      </span>
      
      <div className="relative">
        {/* Toggle Container */}
        <button
          onClick={handleToggle}
          className={`
            relative inline-flex items-center px-1 py-1 rounded-full border-2 transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-teal dark:focus:ring-offset-gray-800
            ${isAdvancedMode 
              ? 'bg-cinema-teal border-cinema-teal' 
              : 'bg-cinema-teal border-cinema-teal'
            }
            ${isAnimating ? 'shadow-lg shadow-green-400/50 scale-105' : 'hover:shadow-md'}
            w-24 h-8
          `}
          aria-label={`Switch to ${isAdvancedMode ? 'Simple' : 'Advanced'} mode`}
        >
          {/* Sliding Background */}
          <div
            className={`
              absolute inset-1 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out
              ${isAdvancedMode ? 'transform translate-x-8' : 'transform translate-x-0'}
            `}
            style={{ width: '42px' }}
          />
          
          {/* Simple Label */}
          <span
            className={`
              relative z-10 text-xs font-medium transition-colors duration-300 px-2
              ${!isAdvancedMode ? 'text-cinema-teal' : 'text-white'}
            `}
          >
            Simple
          </span>
          
          {/* Advanced Label */}
          <span
            className={`
              relative z-10 text-xs font-medium transition-colors duration-300 px-1
              ${isAdvancedMode ? 'text-cinema-teal' : 'text-white'}
            `}
          >
            Advanced
          </span>
        </button>
        
        {/* Green Glow Animation */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping" />
        )}
      </div>
      
      {/* Current Mode Indicator */}
      <span className="text-xs text-gray-500 dark:text-cinema-text-muted font-medium">
        {isAdvancedMode ? 'Advanced' : 'Simple'}
      </span>
    </div>
  );
};

export default ModeToggle;