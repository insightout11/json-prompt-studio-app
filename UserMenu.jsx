import React, { useState, useRef, useEffect } from 'react';
import { useSession } from './useSession';
import { clearSession } from './sessionUtils';
import UsageStatsModal from './UsageStatsModal';
import AccountSettingsModal from './AccountSettingsModal';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUsageStats, setShowUsageStats] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    setShowLogoutConfirm(true);
    setIsOpen(false);
  };

  const confirmLogout = async () => {
    try {
      console.log('🔓 Logging out user...');
      
      // Clear session cookies
      clearSession();
      
      // Refresh session to update UI state
      await refreshSession();
      
      setShowLogoutConfirm(false);
      
      console.log('✅ Successfully logged out');
      
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
            {/* Account Settings */}
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 flex items-center space-x-2"
              onClick={() => {
                setShowAccountSettings(true);
                setIsOpen(false);
              }}
            >
              <span>⚙️</span>
              <span>Account Settings</span>
            </button>

            {/* Usage Stats */}
            <button 
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150 flex items-center space-x-2"
              onClick={() => {
                setShowUsageStats(true);
                setIsOpen(false);
              }}
            >
              <span>📊</span>
              <span>Usage Stats</span>
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🔓</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sign Out Confirmation
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Stats Modal */}
      <UsageStatsModal
        isOpen={showUsageStats}
        onClose={() => setShowUsageStats(false)}
      />

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
      />
    </div>
  );
};

export default UserMenu;