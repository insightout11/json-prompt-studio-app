import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { userService } from './userService';
import StripeIntegration from './StripeIntegration';
import { useSubscription } from './StripeIntegration';

const InstantUpgradeModal = ({ 
  isOpen, 
  onClose, 
  trigger = 'limit_reached' // 'limit_reached' | 'feature_locked' | 'manual'
}) => {
  const { user, isAuthenticated } = useAuth();
  const { upgradeSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState('pro'); // Only pro plan available
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [expandedPlans, setExpandedPlans] = useState({}); // Track which plan cards are expanded
  
  const stats = userService.getUsageStats();
  const requirement = userService.getUsageRequirement();

  if (!isOpen) return null;

  const handleUpgradeSuccess = (subscriptionData) => {
    upgradeSubscription(subscriptionData);
    onClose();
    // Show success message
  };

  const handleUpgradeError = (error) => {
    console.error('Upgrade failed:', error);
  };

  const plans = {
    pro: {
      name: 'Pro',
      monthlyPrice: 15,
      yearlyPrice: 150,
      features: [
        '500 AI generations per month',
        'API key included (no setup required)',
        'All AI features unlocked',
        'Priority processing',
        'Email support',
        'Advanced templates',
        'Character Engine & World Builder',
        'Storyboard Generator',
        'Viral Video Templates'
      ],
      highlight: 'Everything You Need',
      color: 'from-purple-500 to-indigo-600'
    }
  };

  const currentPlan = plans[selectedPlan];
  const isYearly = billingCycle === 'yearly';
  const currentPrice = isYearly ? currentPlan.yearlyPrice : currentPlan.monthlyPrice;
  const savings = isYearly ? Math.round(((currentPlan.monthlyPrice * 12) - currentPlan.yearlyPrice) / (currentPlan.monthlyPrice * 12) * 100) : 0;

  // Toggle feature expansion for a specific plan
  const togglePlanExpansion = (planKey) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planKey]: !prev[planKey]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 lg:p-4">
      <div className="bg-white dark:bg-cinema-panel rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentPlan.color} text-white p-4 lg:p-6 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2">
                {trigger === 'limit_reached' 
                  ? "You've hit your limit!" 
                  : trigger === 'feature_locked'
                    ? "Unlock Premium Features"
                    : "Upgrade Your Plan"
                }
              </h2>
              <p className="text-white/90">
                {trigger === 'limit_reached' 
                  ? `You've used all ${stats.usage_limit} free generations this month.`
                  : "Get unlimited access to all AI features and more."
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Current Usage Display */}
          {trigger === 'limit_reached' && (
            <div className="mt-4 bg-white/20 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>This month's usage:</span>
                <span className="font-semibold">{stats.monthly_usage}/{stats.usage_limit}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="h-2 bg-white rounded-full transition-all duration-300"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <div className="text-xs text-white/80 mt-1">
                Resets in {stats.days_remaining} days
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Pro Plan Details */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text">
                Pro Plan Features
              </h3>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="max-w-md w-full">
                {Object.entries(plans).map(([planKey, plan]) => (
                  <div
                    key={planKey}
                    className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 shadow-lg"
                  >
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-cinema-text mr-3">
                        {plan.name}
                      </h4>
                      {plan.highlight && (
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {plan.highlight}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-3xl font-bold text-gray-800 dark:text-cinema-text">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg font-normal text-gray-500 ml-1">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-center font-semibold text-gray-800 dark:text-cinema-text mb-3">What's Included:</h5>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-cinema-text">
                    {/* Always show first 3 features */}
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                    
                    {/* Expandable additional features */}
                    {expandedPlans[planKey] && plan.features.slice(3).map((feature, index) => (
                      <li key={index + 3} className="flex items-start space-x-2 animate-in slide-in-from-top-1 duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                    
                    {/* Show/Hide toggle button */}
                    {plan.features.length > 3 && (
                      <li>
                        <button
                          onClick={() => togglePlanExpansion(planKey)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs font-medium flex items-center space-x-1 mt-1 transition-colors duration-200"
                        >
                          <span>
                            {expandedPlans[planKey] 
                              ? 'Show less features' 
                              : `+${plan.features.length - 3} more features`
                            }
                          </span>
                          <svg 
                            className={`w-3 h-3 transition-transform duration-200 ${expandedPlans[planKey] ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </li>
                    )}
                  </ul>
                  </div>
                </div>
                ))}
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-100 dark:bg-cinema-border rounded-lg p-1 flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text shadow-sm'
                      : 'text-gray-600 dark:text-cinema-text-muted hover:text-gray-900 dark:hover:text-cinema-text'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text shadow-sm'
                      : 'text-gray-600 dark:text-cinema-text-muted hover:text-gray-900 dark:hover:text-cinema-text'
                  }`}
                >
                  <span>Yearly</span>
                  {savings > 0 && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 py-0.5 rounded text-xs">
                      Save {savings}%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Selected Plan Summary */}
          <div className="bg-gray-50 dark:bg-cinema-card rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 dark:text-cinema-text mb-2">
              You're upgrading to {currentPlan.name} {isYearly ? 'Yearly' : 'Monthly'}
            </h4>
            <div className="text-sm text-gray-600 dark:text-cinema-text-muted space-y-1">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-medium">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Billing:</span>
                <span className="font-medium">{isYearly ? 'Yearly' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-cinema-text pt-2 border-t border-gray-200 dark:border-cinema-border">
                <span>Total:</span>
                <span>${currentPrice}{isYearly ? '/year' : '/month'}</span>
              </div>
              {isYearly && savings > 0 && (
                <div className="text-green-600 dark:text-green-400 text-xs">
                  You save ${(currentPlan.monthlyPrice * 12) - currentPlan.yearlyPrice} per year!
                </div>
              )}
            </div>
          </div>

          {/* Stripe Payment */}
          <StripeIntegration
            plan={selectedPlan}
            billingCycle={billingCycle}
            onSuccess={handleUpgradeSuccess}
            onError={handleUpgradeError}
          />

          <div className="mt-4 text-center text-xs text-gray-500 dark:text-cinema-text-muted">
            Cancel anytime. No hidden fees. Immediate access after payment.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantUpgradeModal;