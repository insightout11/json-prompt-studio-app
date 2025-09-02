import React, { useState, useRef, useEffect } from 'react';
import { useSession } from './useSession';
import { clearSession } from './sessionUtils';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, getDisplayName, getUserUsage, refreshSession } = useSession();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🔓 Logging out user...');
      
      // Clear session cookies
      clearSession();
      
      // Refresh session to update UI state
      await refreshSession();
      
      setIsOpen(false);
      
      console.log('✅ Successfully logged out');
      
      // Optional: Show success message or redirect
      // Could dispatch a custom event here for notifications
      
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const displayName = getDisplayName();
  const userUsage = getUserUsage();

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center space-x-1.5 shadow-sm hover:shadow-md"
        title={`Signed in as ${user?.email || 'User'}`}
      >
        <span className="text-sm">👤</span>
        <span className="hidden lg:inline">{displayName || 'User'}</span>
        <span className="lg:hidden">Menu</span>
        <svg 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          
          {/* User Info Section */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {displayName ? displayName[0].toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Usage Info */}
            <div className="mt-3 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Tier: {userUsage.tier.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {userUsage.limit === -1 
                    ? 'Unlimited' 
                    : `${userUsage.usage}/${userUsage.limit}`
                  }
                </span>
              </div>
              {userUsage.limit > 0 && (
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((userUsage.usage / userUsage.limit) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Account Settings (future feature) */}
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 flex items-center space-x-2"
              onClick={() => {
                // Future: Open account settings
                setIsOpen(false);
              }}
              disabled
            >
              <span>⚙️</span>
              <span>Account Settings</span>
              <span className="ml-auto text-xs text-gray-400">(Soon)</span>
            </button>

            {/* Usage Stats (future feature) */}
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 flex items-center space-x-2"
              onClick={() => {
                // Future: Show detailed usage stats
                setIsOpen(false);
              }}
              disabled
            >
              <span>📊</span>
              <span>Usage Stats</span>
              <span className="ml-auto text-xs text-gray-400">(Soon)</span>
            </button>

            <hr className="my-2 border-gray-200 dark:border-gray-600" />

            {/* Sign Out */}
            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-150 flex items-center space-x-2"
            >
              <span>🔓</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;