import React from 'react';
import { useSubscription } from './StripeIntegration';

const ProBadge = ({ className = "" }) => {
  const { isPro, subscription } = useSubscription();

  if (!isPro) {
    return null;
  }

  const isYearly = subscription?.billingCycle === 'yearly';

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
        <span className="text-xs">✨</span>
        <span>Pro Active</span>
        {isYearly && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
            Yearly
          </span>
        )}
      </div>
    </div>
  );
};

export default ProBadge;