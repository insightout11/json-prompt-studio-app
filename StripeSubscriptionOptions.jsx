import React, { useState } from 'react';
import StripeIntegration from './StripeIntegration';

const StripeSubscriptionOptions = ({ 
  plan = 'pro', 
  billingCycle = 'monthly',
  onSuccess,
  onError,
  className = ""
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [trialDays, setTrialDays] = useState(0);
  const [billingAnchor, setBillingAnchor] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const prices = {
    pro_monthly: 15,
    pro_yearly: 150
  };

  const currentPrice = prices[`${plan}_${billingCycle}`];
  const isYearly = billingCycle === 'yearly';
  const monthlySavings = isYearly ? (15 * 12 - 150) : 0;

  return (
    <div className={`stripe-subscription-options ${className}`}>
      {/* Main Subscription Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            JSON Prompt Studio Pro
          </h3>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            ${currentPrice}
            <span className="text-lg text-gray-600 dark:text-gray-400">
              /{isYearly ? 'year' : 'month'}
            </span>
          </div>
          {isYearly && monthlySavings > 0 && (
            <div className="text-green-600 dark:text-green-400 font-medium mt-1">
              Save ${monthlySavings}/year!
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {[
            'Advanced AI prompt optimization',
            'Unlimited prompt exports',
            'Professional video templates',
            'Cloud save & sync',
            'Priority email support',
            'Commercial usage rights'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Trial Period Display */}
        {trialDays > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                {trialDays}-day free trial included!
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              Your subscription will start after the trial period ends.
            </p>
          </div>
        )}

        {/* Advanced Options Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <span className="text-sm font-medium">Advanced Options</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6">
            
            {/* Trial Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Free Trial Period
              </label>
              <select
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={0}>No trial</option>
                <option value={3}>3 days free</option>
                <option value={7}>7 days free</option>
                <option value={14}>14 days free</option>
                <option value={30}>30 days free</option>
              </select>
            </div>

            {/* Billing Cycle Anchor */}
            {billingCycle === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Billing Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={billingAnchor}
                  onChange={(e) => setBillingAnchor(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Set a specific date for billing to start (e.g., 1st of each month)
                </p>
              </div>
            )}

            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Pre-fill your email at checkout
              </p>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <StripeIntegration
          plan={plan}
          billingCycle={billingCycle}
          trialDays={trialDays}
          billingCycleAnchor={billingAnchor || null}
          customerEmail={customerEmail || null}
          onSuccess={onSuccess}
          onError={onError}
          className="w-full"
        />

        {/* Tax Notice */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          * Tax calculated automatically based on your location. Promotional codes accepted at checkout.
        </p>
      </div>
    </div>
  );
};

export default StripeSubscriptionOptions;