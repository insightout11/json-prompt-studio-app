import React, { useState } from 'react';
import { userService } from './userService';

const StripeIntegration = ({ 
  plan = 'pro', 
  billingCycle = 'monthly', 
  trialDays = 0,
  billingCycleAnchor = null,
  customerEmail = null,
  onSuccess, 
  onError,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock Stripe configuration - replace with actual Stripe keys
  const STRIPE_CONFIG = {
    publishableKey: import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    priceIds: {
      pro_monthly: import.meta?.env?.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_1234567890',
      pro_yearly: import.meta?.env?.VITE_STRIPE_PRICE_PRO_YEARLY || 'price_0987654321',
      team_monthly: import.meta?.env?.VITE_STRIPE_PRICE_TEAM_MONTHLY || 'price_team_monthly',
      team_yearly: import.meta?.env?.VITE_STRIPE_PRICE_TEAM_YEARLY || 'price_team_yearly'
    }
  };

  const prices = {
    pro_monthly: 15,
    pro_yearly: 150,  // 10 months for the price of 12 if yearly is offered
    team_monthly: 30,
    team_yearly: 300
  };

  const currentPriceId = STRIPE_CONFIG.priceIds[`${plan}_${billingCycle}`];
  const currentPrice = prices[`${plan}_${billingCycle}`];

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the plan directly (only 'pro' plan available)
      const lookupKey = `${plan}_${billingCycle}`; // e.g., "pro_monthly"
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookup_key: lookupKey,
          trial_days: trialDays,
          billing_cycle_anchor: billingCycleAnchor,
          customer_email: customerEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create checkout session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      onError && onError(err);
    } finally {
      setIsLoading(false);
    }
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className={`stripe-integration ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>
              Subscribe for {formatPrice(currentPrice)}
              {billingCycle === 'yearly' ? '/year' : '/month'}
            </span>
          </>
        )}
      </button>

      {/* Security & Trust Indicators */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-cinema-text-muted">
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>💳</span>
          <span>Stripe Protected</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🔄</span>
          <span>Cancel Anytime</span>
        </div>
      </div>

      {/* Payment Method Icons */}
      <div className="mt-3 flex items-center justify-center space-x-2">
        <span className="text-xs text-gray-500 dark:text-cinema-text-muted">Accepted:</span>
        <div className="flex space-x-1">
          <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
            V
          </div>
          <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-red-800 rounded text-white text-xs flex items-center justify-center font-bold">
            M
          </div>
          <div className="w-8 h-5 bg-gradient-to-r from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            A
          </div>
          <div className="w-8 h-5 bg-gradient-to-r from-orange-500 to-orange-700 rounded text-white text-xs flex items-center justify-center font-bold">
            D
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for managing subscription state uses userService imported above

// Hook for managing subscription state
export const useSubscription = () => {
  const [user, setUser] = useState(() => userService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  // Refresh user data from userService
  const refreshUser = () => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  // Listen for localStorage changes to sync state across components
  React.useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to changes to our user storage key
      if (e.key === userService.storageKey || e.key === null) {
        refreshUser();
      }
    };

    // Listen for localStorage changes (for cross-tab sync)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates (since storage event doesn't fire in same tab)
    const handleCustomUserUpdate = () => {
      refreshUser();
    };

    window.addEventListener('userDataUpdated', handleCustomUserUpdate);

    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleCustomUserUpdate);
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      // In real implementation, this would call your backend to verify subscription
      // GET /api/subscription/status
      
      // For development, use local user service
      const currentUser = userService.getCurrentUser();
      setUser(currentUser);
      return currentUser.subscription;
    } catch (error) {
      console.error('Failed to check subscription:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeSubscription = (subscriptionData) => {
    const updatedUser = userService.upgradeToProSubscription(subscriptionData);
    setUser(updatedUser);
    return updatedUser;
  };

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      // In real implementation, call backend to cancel subscription
      // await fetch('/api/subscription/cancel', { method: 'POST' });
      
      const updatedUser = userService.cancelSubscription();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Track Pro feature usage
  const trackFeatureUsage = (featureName) => {
    try {
      const updatedUser = userService.trackProFeatureUsage(featureName);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Failed to track feature usage:', error);
      return false;
    }
  };

  // Get usage statistics
  const getUsageStats = () => {
    return userService.getUsageStats();
  };

  // Development helper to toggle Pro status
  const toggleProStatus = () => {
    console.log('🔧 DEV: toggleProStatus clicked - Current isPro:', user?.isPro);
    const updatedUser = userService.toggleProStatus();
    console.log('🔧 DEV: toggleProStatus result - New isPro:', updatedUser?.isPro);
    setUser(updatedUser);
    return updatedUser;
  };

  // Development helper to force Pro status
  const forceProStatus = () => {
    console.log('🔧 DEV: forceProStatus called - Current isPro:', user?.isPro);
    const updatedUser = userService.forceProStatus();
    console.log('🔧 DEV: forceProStatus result - New isPro:', updatedUser?.isPro);
    setUser(updatedUser);
    return updatedUser;
  };

  // Development helper to reset user
  const resetUser = () => {
    const updatedUser = userService.resetUser();
    setUser(updatedUser);
    return updatedUser;
  };

  // All users now have pro access - no restrictions
  const isPro = true;
  const isYearly = user?.subscription?.billingCycle === 'yearly';
  const subscription = user?.subscription || null;

  return {
    user,
    subscription,
    isPro,
    isYearly,
    isLoading,
    checkSubscriptionStatus,
    upgradeSubscription,
    cancelSubscription,
    trackFeatureUsage,
    getUsageStats,
    toggleProStatus, // Development only
    forceProStatus, // Development only
    resetUser, // Development only
    refreshUser
  };
};

export default StripeIntegration;