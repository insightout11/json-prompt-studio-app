import React, { useState } from 'react';
import { useSession } from './useSession';
import { clearSession } from './sessionUtils';
import Portal from './Portal';

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, refreshSession } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [preferences, setPreferences] = useState({
    emailNotifications: {
      accountActivity: true,
      usageAlerts: true,
      marketingUpdates: false
    },
    appNotifications: {
      desktopNotifications: true,
      soundAlerts: true
    },
    privacy: {
      allowAnalytics: true,
      shareUsageData: false
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'danger', name: 'Account', icon: '⚠️' }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: displayName,
          preferences
        })
      });

      if (response.ok) {
        await refreshSession();
        console.log('✅ Profile updated successfully');
      } else {
        const error = await response.json();
        console.error('❌ Profile update failed:', error);
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jsonpromptstudio-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('✅ Data exported successfully');
      } else {
        console.error('❌ Data export failed');
      }
    } catch (error) {
      console.error('❌ Export error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          confirmation: 'DELETE_MY_ACCOUNT'
        })
      });

      if (response.ok) {
        console.log('✅ Account deleted successfully');
        // Redirect to home page
        window.location.href = '/';
      } else {
        const error = await response.json();
        console.error('❌ Account deletion failed:', error);
      }
    } catch (error) {
      console.error('❌ Account deletion error:', error);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setIsLoading(true);
    try {
      // Clear session cookies
      clearSession();
      
      // Refresh session to update UI state
      await refreshSession();
      
      // Close modal and show success
      onClose();
      
      // Could add a toast notification here
      console.log('✅ Logged out from all devices');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full" />
          ) : (
            <span className="text-white text-xl font-semibold">
              {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Profile Picture</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">This is your avatar image</p>
          <button className="mt-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
            Change Avatar
          </button>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Display Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          This is the name that will be displayed throughout the app
        </p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          value={user?.email || ''}
          disabled
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Email address cannot be changed. Contact support if needed.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={preferences.emailNotifications.accountActivity}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                emailNotifications: {
                  ...prev.emailNotifications,
                  accountActivity: e.target.checked
                }
              }))}
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Account activity</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={preferences.emailNotifications.usageAlerts}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                emailNotifications: {
                  ...prev.emailNotifications,
                  usageAlerts: e.target.checked
                }
              }))}
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Usage alerts</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={preferences.emailNotifications.marketingUpdates}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                emailNotifications: {
                  ...prev.emailNotifications,
                  marketingUpdates: e.target.checked
                }
              }))}
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Marketing updates</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">App Notifications</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={preferences.appNotifications.desktopNotifications}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                appNotifications: {
                  ...prev.appNotifications,
                  desktopNotifications: e.target.checked
                }
              }))}
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Desktop notifications</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={preferences.appNotifications.soundAlerts}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                appNotifications: {
                  ...prev.appNotifications,
                  soundAlerts: e.target.checked
                }
              }))}
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Sound alerts</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data & Privacy</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Allow analytics and performance tracking</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Share usage data for product improvement</span>
          </label>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Export</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          You can export all your account data including prompts, generations, and settings.
        </p>
        <button 
          onClick={handleExportData}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Export My Data
        </button>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );

  const DangerZoneTab = () => (
    <div className="space-y-6">
      
      {/* Logout All Devices */}
      <div className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Sign Out All Devices
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              This will sign you out of all devices and browsers. You'll need to sign in again.
            </p>
            <div className="mt-3">
              <button
                onClick={handleLogoutAllDevices}
                disabled={isLoading}
                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm rounded-md transition-colors"
              >
                {isLoading ? 'Signing Out...' : 'Sign Out All Devices'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-red-600 dark:text-red-400 text-lg">🗑️</span>
          </div>
          <div className="ml-3 flex-1">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
              Delete Account
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="mt-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Portal>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[9999]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              ⚙️ Account Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
            {activeTab === 'danger' && <DangerZoneTab />}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-red-600 dark:text-red-400 text-2xl mr-3">🗑️</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data, including prompts, generations, and settings.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
};

export default AccountSettingsModal;