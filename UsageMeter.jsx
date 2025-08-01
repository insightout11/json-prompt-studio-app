import React from 'react';
import { useSubscription } from './StripeIntegration';
import { useAuth } from './useAuth';
import { userService } from './userService';

const UsageMeter = ({ className = "", compact = false }) => {
  const { isAuthenticated } = useAuth();
  
  // Get enhanced usage stats from user service
  const stats = userService.getUsageStats();
  const requirement = userService.getUsageRequirement();
  
  // Always show usage meter (for all tiers)
  const { 
    tier, 
    monthly_usage, 
    usage_limit, 
    usage_remaining, 
    usage_percentage,
    days_remaining 
  } = stats;

  const getTierIcon = () => {
    switch (tier) {
      case 'pro': return '✨';
      case 'team': return '👥';
      case 'free': return '🆓';
      default: return '👤';
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case 'pro':
      case 'team':
        return 'from-purple-500 to-indigo-600';
      case 'free':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getUsageColor = () => {
    if (usage_percentage >= 100) return 'from-red-500 to-red-600';
    if (usage_percentage >= 80) return 'from-orange-500 to-yellow-500';
    return 'from-green-500 to-blue-500';
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-cinema-card rounded-lg px-3 py-2 border border-gray-200 dark:border-cinema-border flex items-center space-x-3 ${className}`}>
        {/* Tier Badge */}
        <div className={`bg-gradient-to-r ${getTierColor()} text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1`}>
          <span>{getTierIcon()}</span>
          <span className="capitalize">{tier === 'anonymous' ? 'Visitor' : tier}</span>
        </div>
        
        {/* Usage Display */}
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-gray-800 dark:text-cinema-text">
            {requirement.type === 'available' ? (
              <span className="text-green-600 dark:text-green-400">
                {usage_remaining} left
              </span>
            ) : (
              <span className="text-orange-600 dark:text-orange-400">
                {monthly_usage}/{usage_limit}
              </span>
            )}
          </div>
          
          {/* Mini Progress Bar */}
          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className={`h-1 rounded-full bg-gradient-to-r ${getUsageColor()} transition-all duration-300`}
              style={{ width: `${Math.min(usage_percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-cinema-text">
            {tier === 'anonymous' ? 'Anonymous Usage' : `${tier.charAt(0).toUpperCase() + tier.slice(1)} Usage`}
          </h3>
        </div>
        
        {/* Tier Badge */}
        <div className={`bg-gradient-to-r ${getTierColor()} text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1`}>
          <span>{getTierIcon()}</span>
          <span className="capitalize">{tier === 'anonymous' ? 'Visitor' : tier}</span>
        </div>
      </div>

      {/* Usage Counter */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-cinema-text-muted">
            AI Generations This Month
          </span>
          <span className="font-medium text-gray-800 dark:text-cinema-text">
            {monthly_usage}/{usage_limit}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-cinema-border rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getUsageColor()} transition-all duration-300`}
            style={{ width: `${Math.min(usage_percentage, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-cinema-text-muted mt-1 flex justify-between">
          <span>
            {tier === 'pro' || tier === 'team' 
              ? 'High usage limits included' 
              : tier === 'free'
                ? 'Free tier - upgrade for more'
                : 'Sign up for 10 free per month'
            }
          </span>
          <span className="font-medium">
            {usage_remaining} remaining
          </span>
        </div>
      </div>

      {/* Status Message */}
      {requirement.type !== 'available' && (
        <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${
          requirement.type === 'signup_required' 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50'
            : requirement.type === 'upgrade_required'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700/50'
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700/50'
        }`}>
          {requirement.message}
        </div>
      )}

      {/* Cycle Information */}
      {days_remaining > 0 && (
        <div className="text-xs text-gray-500 dark:text-cinema-text-muted border-t border-gray-200 dark:border-cinema-border pt-2">
          <div className="flex justify-between">
            <span>Usage resets in:</span>
            <span className="font-medium">{days_remaining} days</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageMeter;