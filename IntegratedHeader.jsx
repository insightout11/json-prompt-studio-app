import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';
import LibrarySystem from './LibrarySystem';

const IntegratedHeader = ({ showToast }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEnhancedLibrary, setShowEnhancedLibrary] = useState(false);
  const dropdownRef = useRef(null);

  // No store imports needed since everything is handled by LibrarySystem now

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced library handler
  const handleOpenEnhancedLibrary = () => {
    setShowEnhancedLibrary(true);
    setShowDropdown(false); // Close the dropdown menu
  };

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative inline-flex items-center px-3 py-2 rounded-md font-medium text-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cinema-teal ${
          showDropdown
            ? 'bg-light-primary dark:bg-cinema-teal text-white shadow-light-primary dark:shadow-glow-teal border border-light-primary dark:border-cinema-teal'
            : 'bg-light-panel dark:bg-cinema-panel text-light-text dark:text-cinema-text border border-light-border dark:border-cinema-border hover:bg-light-card dark:hover:bg-cinema-card hover:shadow-light-primary dark:hover:shadow-glow-teal'
        }`}
        aria-label="Project and library menu"
        aria-expanded={showDropdown}
        title="Project & Library Menu"
      >
        {/* Hamburger Icon */}
        <div className="w-5 h-5 mr-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        
        <span className="relative z-10">Menu</span>
        
        {/* Subtle glow effect when active */}
        {showDropdown && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-md pointer-events-none" />
        )}
      </button>

      {/* Unified Dropdown Menu */}
      {showDropdown && (
        <div 
          className="absolute top-full left-0 mt-2 w-72 bg-light-panel dark:bg-cinema-panel border border-light-primary/20 dark:border-cinema-teal/20 rounded-lg shadow-light-elevated dark:shadow-glow-soft z-50 overflow-hidden"
          role="menu"
          aria-labelledby="menu-button"
        >
          

          {/* Menu Content */}
          <div className="p-4">
            <button
              onClick={handleOpenEnhancedLibrary}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-card dark:hover:bg-cinema-card rounded-lg transition-all duration-200"
            >
              <span className="text-xl">📚</span>
              <div className="flex-1">
                <div className="font-medium text-light-text dark:text-cinema-text">
                  Library
                </div>
                <div className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                  Manage projects, characters, scenes & more
                </div>
              </div>
              <svg className="w-4 h-4 text-light-text-muted dark:text-cinema-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}


      {/* Enhanced LibrarySystem Modal */}
      <LibrarySystem 
        showToast={showToast}
        headerMode={false}
        isOpen={showEnhancedLibrary}
        onToggle={setShowEnhancedLibrary}
      />
    </div>
  );
};

export default IntegratedHeader;