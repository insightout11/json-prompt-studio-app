import React, { useState } from 'react';
import { useSession } from './useSession';
import { clearSession } from './sessionUtils';

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, refreshSession } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'danger', name: 'Account', icon: '⚠️' }
  ];

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
              {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user?.name || 'User'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your display name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Type
          </label>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              user?.tier === 'pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
              user?.tier === 'free' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {(user?.tier || 'free').replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • Authenticated via {(user?.authMethod || 'email').charAt(0).toUpperCase() + (user?.authMethod || 'email').slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled
        >
          Save Changes (Coming Soon)
        </button>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          
          {/* Usage Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Usage Alerts</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when approaching usage limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Feature Updates */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Feature Updates</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new features and improvements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tips, tutorials, and promotional content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled
        >
          Save Preferences (Coming Soon)
        </button>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data & Privacy</h3>
        
        <div className="space-y-6">
          {/* Data Collection */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔒 Data Collection</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              We collect minimal data to provide our service: your email, usage statistics, and generated content for quality improvement.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View Privacy Policy →
            </button>
          </div>

          {/* Data Export */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📦 Export Your Data</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Download all your account data, including usage history and saved content.
            </p>
            <button className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors">
              Request Data Export (Coming Soon)
            </button>
          </div>

          {/* Data Deletion */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-medium text-red-900 dark:text-red-200 mb-2">🗑️ Delete All Data</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Permanently delete all your data from our servers. This action cannot be undone.
            </p>
            <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors">
              Request Data Deletion (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DangerTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account Actions</h3>
        
        <div className="space-y-4">
          {/* Sign Out All Devices */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Sign Out All Devices</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Sign out from all devices and browsers. You'll need to sign in again.
                </p>
              </div>
              <button
                onClick={handleLogoutAllDevices}
                disabled={isLoading}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm rounded-lg transition-colors"
              >
                {isLoading ? 'Signing Out...' : 'Sign Out All'}
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-200">Delete Account</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
          
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                ⚙️ Settings
              </h2>
            </div>
            <nav className="space-y-1 px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'privacy' && <PrivacyTab />}
              {activeTab === 'danger' && <DangerTab />}
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Account</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. All your data, including usage history and saved content, will be permanently deleted.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  disabled
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountSettingsModal;