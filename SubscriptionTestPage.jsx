import React, { useState } from 'react';
import StripeSubscriptionOptions from './StripeSubscriptionOptions';

const SubscriptionTestPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleSuccess = (subscriptionData) => {
    console.log('Subscription successful:', subscriptionData);
    alert('Subscription successful! Check console for details.');
  };

  const handleError = (error) => {
    console.error('Subscription error:', error);
    alert('Subscription failed: ' + error.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to Pro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unlock advanced AI features and unlimited exports
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save $30
              </span>
            </button>
          </div>
        </div>

        {/* Subscription Options */}
        <StripeSubscriptionOptions
          plan="pro"
          billingCycle={billingCycle}
          onSuccess={handleSuccess}
          onError={handleError}
        />

        {/* Feature Comparison */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Free vs Pro Comparison
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Features */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Free Features
              </h4>
              <ul className="space-y-2">
                {[
                  'Basic prompt generation',
                  'Template library access',
                  'JSON export (5/day)',
                  'Character presets',
                  'Community support'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Features */}
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-3">
                Pro Features
              </h4>
              <ul className="space-y-2">
                {[
                  'Advanced AI optimization',
                  'Unlimited exports',
                  'Professional templates',
                  'Cloud save & sync',
                  'Priority support',
                  'Commercial usage'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-900 dark:text-white font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-green-600 dark:text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTestPage;