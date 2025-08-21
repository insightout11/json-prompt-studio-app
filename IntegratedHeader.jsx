import React, { useState, useRef, useEffect } from 'react';
import usePromptStore from './store';
import LibrarySystem from './LibrarySystem';
import TemplateSelector from './TemplateSelector';

const IntegratedHeader = ({ showToast, onViralGenerator, onRandomize, showRandomizeDropdown, randomizeDropdownRef, renderRandomizeDropdown }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEnhancedLibrary, setShowEnhancedLibrary] = useState(false);
  const dropdownRef = useRef(null);
  const templateSelectorRef = useRef(null);

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
        className={`relative inline-flex items-center min-[1280px]:px-4 min-[1280px]:py-2 min-[1024px]:max-[1279px]:px-2.5 min-[1024px]:max-[1279px]:py-1.5 min-[768px]:max-[1023px]:px-2 min-[768px]:max-[1023px]:py-1 max-[767px]:px-3 max-[767px]:py-2 rounded-md font-medium min-[1280px]:text-sm min-[1024px]:max-[1279px]:text-sm min-[768px]:max-[1023px]:text-xs max-[767px]:text-sm transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cinema-teal ${
          showDropdown
            ? 'bg-light-primary dark:bg-cinema-teal text-white shadow-light-primary dark:shadow-glow-teal'
            : 'bg-transparent text-cinema-text hover:bg-cinema-card hover:shadow-glow-teal'
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
          <div className="p-4 space-y-2">
            {/* Library Button */}
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

            {/* Mobile-only buttons (show only on mobile) */}
            <div className="md:hidden space-y-2">
              {/* Templates & Presets Button */}
              <button
                onClick={() => {
                  templateSelectorRef.current?.click();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-card dark:hover:bg-cinema-card rounded-lg transition-all duration-200"
              >
                <span className="text-xl">📋</span>
                <div className="flex-1">
                  <div className="font-medium text-light-text dark:text-cinema-text">
                    Templates & Presets
                  </div>
                  <div className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                    Browse template library
                  </div>
                </div>
                <svg className="w-4 h-4 text-light-text-muted dark:text-cinema-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Viral Video Generator Button */}
              <button
                onClick={() => {
                  if (onViralGenerator) onViralGenerator();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-card dark:hover:bg-cinema-card rounded-lg transition-all duration-200"
              >
                <span className="text-xl">📈</span>
                <div className="flex-1">
                  <div className="font-medium text-light-text dark:text-cinema-text">
                    Viral Video Generator
                  </div>
                  <div className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                    Create viral content ideas
                  </div>
                </div>
                <svg className="w-4 h-4 text-light-text-muted dark:text-cinema-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Randomize Tools Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (onRandomize) onRandomize();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-light-card dark:hover:bg-cinema-card rounded-lg transition-all duration-200"
                >
                  <span className="text-xl">🎲</span>
                  <div className="flex-1">
                    <div className="font-medium text-light-text dark:text-cinema-text">
                      Randomize Tools
                    </div>
                    <div className="text-xs text-light-text-muted dark:text-cinema-text-muted">
                      Generate random scene elements
                    </div>
                  </div>
                  <svg className={`w-4 h-4 text-light-text-muted dark:text-cinema-text-muted transition-transform ${showRandomizeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Randomize Dropdown - rendered inside menu with proper styling */}
                {showRandomizeDropdown && renderRandomizeDropdown && (
                  <div className="mt-2 ml-4 bg-light-panel dark:bg-cinema-panel border border-light-border dark:border-cinema-border rounded-md shadow-lg">
                    {renderRandomizeDropdown()}
                  </div>
                )}
              </div>
            </div>
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

      {/* Hidden Template Selector - triggered by ref click */}
      <div className="hidden">
        <TemplateSelector ref={templateSelectorRef} />
      </div>
    </div>
  );
};

export default IntegratedHeader;