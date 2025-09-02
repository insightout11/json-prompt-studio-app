import React from 'react';
import { useSession } from './useSession';
import Portal from './Portal';

const UsageStatsModal = ({ isOpen, onClose }) => {
  const { user, getUserUsage } = useSession();
  
  if (!isOpen) return null;

  const usageData = getUserUsage();
  const usagePercentage = usageData.limit > 0 ? Math.round((usageData.usage / usageData.limit) * 100) : 0;

  // Calculate days remaining in cycle
  const getDaysRemaining = () => {
    if (!user?.billing_cycle_end) return null;
    const cycleEnd = new Date(user.billing_cycle_end);
    const now = new Date();
    const diffTime = cycleEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();

  // Get tier information
  const getTierInfo = () => {
    const tierConfigs = {
      anonymous: {
        name: "Trial User",
        color: "gray-500",
        bgColor: "gray-100",
        description: "Limited trial access",
        features: ["3 premium generations", "No signup required"]
      },
      new_user: {
        name: "Welcome Bonus",
        color: "green-600", 
        bgColor: "green-100",
        description: "One-time bonus for new users",
        features: ["10 premium generations", "Account features", "Full quality"]
      },
      free: {
        name: "Free Tier",
        color: "blue-600",
        bgColor: "blue-100", 
        description: "Unlimited free generations",
        features: ["Unlimited generations", "Community queue", "Email support"]
      },
      pro: {
        name: "Pro",
        color: "purple-600",
        bgColor: "purple-100",
        description: "Professional features and priority",
        features: ["500 premium generations/month", "Priority queue", "Advanced templates", "API access"]
      },
      team: {
        name: "Team",
        color: "indigo-600", 
        bgColor: "indigo-100",
        description: "Team collaboration features",
        features: ["1000 premium generations/month", "Team workspace", "User management", "Admin controls"]
      }
    };

    return tierConfigs[usageData.tier] || tierConfigs.free;
  };

  const tierInfo = getTierInfo();

  return (
    <Portal>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[9999]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            📊 Usage Statistics
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

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Current Tier */}
          <div className={`bg-${tierInfo.bgColor} dark:bg-${tierInfo.color}/20 rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold text-${tierInfo.color} dark:text-${tierInfo.color}`}>
                  {tierInfo.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tierInfo.description}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${tierInfo.color} text-white`}>
                  {usageData.tier.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Usage This Month */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">This Month</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Generations Used</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {usageData.usage}{usageData.limit > 0 ? ` / ${usageData.limit}` : ''}
                  </span>
                </div>
                
                {usageData.limit > 0 && (
                  <>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          usagePercentage > 90 ? 'bg-red-500' : 
                          usagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{usagePercentage}% used</span>
                      <span>{usageData.limit - usageData.usage} remaining</span>
                    </div>
                  </>
                )}
                
                {usageData.limit === -1 && (
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                    ∞ Unlimited
                  </div>
                )}
              </div>
            </div>

            {/* Billing Cycle */}
            {daysRemaining !== null && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Billing Cycle</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</span>
                    <span className="font-medium text-gray-900 dark:text-white">{daysRemaining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Resets On</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.billing_cycle_end).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                  <span className="text-sm text-gray-900 dark:text-white font-mono">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Auth Method</span>
                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                    {user?.authMethod || 'Email'}
                  </span>
                </div>
                {user?.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
              <div className="space-y-2">
                {usageData.tier === 'anonymous' && (
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-md transition-colors">
                    🎯 Sign Up for 10 Bonus Generations
                  </button>
                )}
                {(usageData.tier === 'new_user' || usageData.tier === 'free') && (
                  <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-md transition-colors">
                    ⚡ Upgrade to Pro
                  </button>
                )}
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 rounded-md transition-colors">
                  📧 Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Tier Features */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Current Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tierInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Usage Tips */}
          {usagePercentage > 80 && usageData.limit > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Running Low on Generations
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You've used {usagePercentage}% of your monthly limit. Consider upgrading to Pro for 500 generations per month!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </Portal>
  );
};

export default UsageStatsModal;