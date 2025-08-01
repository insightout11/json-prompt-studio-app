import React, { useState, useEffect } from 'react';

const FullScreenToggle = ({ isFullScreen, onToggle, children, className = "" }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        onToggle(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFullScreen, onToggle]);

  // Handle transition animation
  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onToggle(!isFullScreen);
      setIsTransitioning(false);
    }, 150);
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-cinema-black transition-all duration-300">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-cinema-border bg-white dark:bg-cinema-panel">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-cinema-text">
              JSON Prompt Editor
            </h2>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
              Full Screen
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Keyboard Shortcut Hint */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500 dark:text-cinema-text-muted">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-cinema-card rounded border border-gray-300 dark:border-cinema-border">
                F
              </kbd>
              <span>or</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-cinema-card rounded border border-gray-300 dark:border-cinema-border">
                ESC
              </kbd>
            </div>

            {/* Exit Button */}
            <button
              onClick={handleToggle}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-cinema-card hover:bg-gray-200 dark:hover:bg-cinema-border text-gray-700 dark:text-cinema-text rounded-lg transition-colors"
              title="Exit Fullscreen (ESC)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Content */}
        <div className="flex-1 overflow-auto p-4" style={{ height: 'calc(100vh - 73px)' }}>
          {children}
        </div>
      </div>
    );
  }

  // Normal mode - just render children with toggle button
  return (
    <div className={`relative ${className}`}>
      {/* Fullscreen Toggle Button */}
      <button
        onClick={handleToggle}
        className={`absolute top-2 right-2 z-10 p-2 bg-white dark:bg-cinema-card hover:bg-gray-50 dark:hover:bg-cinema-border text-gray-600 dark:text-cinema-text rounded-lg shadow-sm border border-gray-200 dark:border-cinema-border transition-all duration-200 group ${
          isTransitioning ? 'scale-95 opacity-75' : 'hover:scale-105'
        }`}
        title="Enter Fullscreen (F)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span className="sr-only">Toggle Fullscreen</span>
      </button>

      {/* Normal Content */}
      <div className={isTransitioning ? 'opacity-75 scale-98 transition-all duration-150' : ''}>
        {children}
      </div>
    </div>
  );
};

// Utility hook for managing fullscreen state
export const useFullScreen = (initialState = false) => {
  const [isFullScreen, setIsFullScreen] = useState(initialState);

  const toggleFullScreen = (state) => {
    setIsFullScreen(typeof state === 'boolean' ? state : !isFullScreen);
  };

  return [isFullScreen, toggleFullScreen];
};

export default FullScreenToggle;