import React, { useState } from 'react';
import { useSubscription } from './StripeIntegration';
import { useAuth } from './useAuth';
import { userService } from './userService';
import InstantUpgradeModal from './InstantUpgradeModal';
import StripeIntegration from './StripeIntegration';

const UpgradeButton = ({ 
  className = "", 
  variant = "default", // "default", "compact", "banner", "modal"
  showPricing = false,
  onShowPricing,
  trigger = "manual" // "manual", "limit_reached", "feature_locked"
}) => {
  const { isPro, upgradeSubscription } = useSubscription();
  const { user, isAuthenticated } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const stats = userService.getUsageStats();
  const requirement = userService.getUsageRequirement();

  // Don't show upgrade button if user is already Pro/Team
  if (stats.tier === 'pro' || stats.tier === 'team') {
    return null;
  }

  const handleUpgradeSuccess = (subscriptionData) => {
    upgradeSubscription(subscriptionData);
    setShowCheckout(false);
    setShowUpgradeModal(false);
    // Show success message or redirect
  };

  const handleUpgradeError = (error) => {
    console.error('Upgrade failed:', error);
    // Show error message to user
  };

  // Use modal variant for better UX
  if (variant === "modal" || trigger !== "manual") {
    return (
      <>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className={`px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm flex items-center space-x-2 ${className}`}
        >
          <span>✨</span>
          <span>
            {trigger === "limit_reached" ? "Upgrade for More" : 
             trigger === "feature_locked" ? "Unlock Features" : 
             "Upgrade to Pro"}
          </span>
        </button>
        
        <InstantUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger={trigger}
        />
      </>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${
              stats.tier === 'free' ? 'bg-green-500' : 'bg-blue-500'
            } text-white rounded-full p-2`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800 dark:text-cinema-text">
                {stats.tier === 'free' 
                  ? `You have ${stats.usage_remaining} of ${stats.usage_limit} AI generations remaining`
                  : stats.tier === 'anonymous'
                    ? `${3 - (stats.monthly_usage || 0)} anonymous generations remaining`
                    : "Unlimited JSON creation, limited AI features"
                }
              </div>
              <div className="text-xs text-gray-600 dark:text-cinema-text-muted">
                {stats.tier === 'free' 
                  ? "Upgrade to Pro for 500 generations/month + API key included"
                  : "Upgrade to Pro for 500 AI generations/month, no setup required"
                }
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm"
          >
            Upgrade to Pro
          </button>
        </div>

        <InstantUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger="manual"
        />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className={`px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm flex items-center space-x-2 ${className}`}
        >
          <span>✨</span>
          <span>Upgrade to Pro</span>
        </button>
        
        <InstantUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger="manual"
        />
      </>
    );
  }

  // Default variant
  return (
    <div className={className}>
      <button
        onClick={() => setShowUpgradeModal(true)}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <span className="text-lg">✨</span>
        <span>
          {stats.tier === 'free' 
            ? `Upgrade to Pro - 500 generations/month`
            : `Upgrade to Pro - $15/month`
          }
        </span>
      </button>
      
      <InstantUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        trigger="manual"
      />
    </div>
  );
};

export default UpgradeButton;