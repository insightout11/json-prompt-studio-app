import React, { useState } from 'react';
import CharacterEngine from './CharacterEngine';
import WorldBuilder from './WorldBuilder';
import StoryboardGenerator from './StoryboardGenerator';
import ImageToJson from './ImageToJson';
import SceneExtender from './SceneExtender';
import SceneExtenderInterface from './SceneExtenderInterface';
import TextToJson from './TextToJson';
import UsageMeter from './UsageMeter';
import UpgradeButton from './UpgradeButton';
import InlineAuth from './InlineAuth';
import { useSubscription } from './StripeIntegration';
import { useAuth } from './useAuth';
import { userService } from './userService';

const ProFeaturesHub = ({ isPro, onShowPricing, currentJson, onJsonUpdate, onSceneExtenderClick, sceneOptions, onApplySceneOption, onDismissSceneOptions, extensionLoading, extensionError }) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const { trackFeatureUsage, getUsageStats } = useSubscription();
  const { isAuthenticated, isEmailVerified, user } = useAuth();
  
  // Get current user stats from enhanced user service
  const usageStats = userService.getUsageStats();
  const canUseAI = userService.canUseAIFeatures();
  const requirement = userService.getUsageRequirement();

  const proFeatures = [
    {
      id: 'character-engine',
      name: 'AI Character Engine',
      icon: '🎭',
      description: 'Generate detailed characters with backstories and traits',
      component: CharacterEngine
    },
    {
      id: 'world-builder',
      name: 'AI World Builder',
      icon: '🌍',
      description: 'Create immersive environments with consistent lore',
      component: WorldBuilder
    },
    {
      id: 'storyboard-generator',
      name: 'Storyboard Generator',
      icon: '🎬',
      description: 'Break a script or JSON into a full storyboard sequence',
      component: StoryboardGenerator
    },
    {
      id: 'scene-extender',
      name: 'Scene Extender',
      icon: '🎬',
      description: 'Generate 5 different scene continuations with AI',
      component: SceneExtenderInterface
    }
  ];

  const handleFeatureResult = (result) => {
    if (result && typeof result === 'object') {
      onJsonUpdate(result);
    }
  };

  const handleFeatureClick = (featureId) => {
    // Check if user can use AI features based on new tier system
    if (!canUseAI) {
      if (requirement.type === 'signup_required') {
        setShowAuthRequired(true);
        return;
      } else if (requirement.type === 'verification_required') {
        // TODO: Show verification reminder
        alert('Please verify your email to use AI features');
        return;
      } else if (requirement.type === 'upgrade_required') {
        // TODO: Show upgrade modal
        onShowPricing && onShowPricing();
        return;
      }
    }

    try {
      // Track usage using the enhanced user service
      userService.trackAIFeatureUsage(featureId);
      
      // Toggle feature active state
      setActiveFeature(activeFeature === featureId ? null : featureId);
    } catch (error) {
      console.error('Failed to track feature usage:', error);
      alert(error.message);
    }
  };

  const handleAuthComplete = (authData) => {
    setShowAuthRequired(false);
    // User is now signed up, they can use AI features
  };

  // Show inline auth if required
  if (showAuthRequired) {
    return (
      <div className="mt-6">
        <InlineAuth 
          onAuthComplete={handleAuthComplete}
          title="Sign up for 10 free AI generations"
          subtitle="No password required - just verify your email"
        />
      </div>
    );
  }

  // For users who need to upgrade (hit their limits)
  if (requirement.type === 'upgrade_required') {
    return (
      <div className="mt-6">
        {/* Usage Limit Reached Banner */}
        <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/50 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-cinema-text mb-2">
              You've Used All Your Free Generations!
            </h3>
            <p className="text-gray-600 dark:text-cinema-text-muted mb-4">
              {requirement.message}
            </p>
            <div className="bg-white dark:bg-cinema-card rounded-lg p-4 mb-4 inline-block">
              <div className="text-sm text-gray-600 dark:text-cinema-text-muted mb-1">This month's usage:</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-cinema-text">
                {usageStats.monthly_usage}/{usageStats.usage_limit}
              </div>
              <div className="text-xs text-gray-500 dark:text-cinema-text-muted">
                {usageStats.days_remaining} days until reset
              </div>
            </div>
          </div>
          <div className="text-center">
            <UpgradeButton />
          </div>
        </div>

        {/* Show Locked Features */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-4 text-center">
            Upgrade for unlimited access to these features:
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {proFeatures.map((feature) => (
              <div 
                key={feature.id} 
                className="bg-white dark:bg-cinema-card rounded-lg p-4 border border-gray-200 dark:border-cinema-border relative opacity-75"
              >
                <div className="absolute top-2 right-2 text-gray-400 dark:text-cinema-text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-800 dark:text-cinema-text mb-2">
                  {feature.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🤖</span>  
            <h3 className="text-2xl font-bold text-gray-800 dark:text-cinema-text">
              AI Features
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            {/* Usage Counter */}
            <div className="bg-white dark:bg-cinema-card px-3 py-1 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-700/50">
              <span className="text-gray-600 dark:text-cinema-text-muted">
                {requirement.type === 'available' ? (
                  <span className="text-green-600 dark:text-green-400">
                    {requirement.remaining} remaining
                  </span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400">
                    {usageStats.monthly_usage}/{usageStats.usage_limit} used
                  </span>
                )}
              </span>
            </div>
            
            {/* Tier Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${
              usageStats.tier === 'pro' || usageStats.tier === 'team' 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                : usageStats.tier === 'free' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              <span>
                {usageStats.tier === 'pro' ? '✨' : 
                 usageStats.tier === 'team' ? '👥' : 
                 usageStats.tier === 'free' ? '🆓' : '👤'}
              </span>
              <span className="capitalize">{usageStats.tier === 'anonymous' ? 'Visitor' : usageStats.tier}</span>
            </div>
          </div>
        </div>
        
        {/* Feature Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
          {proFeatures.map((feature) => {
            const isActive = activeFeature === feature.id;
            const isAvailable = canUseAI || usageStats.tier === 'pro' || usageStats.tier === 'team';
            
            return (
              <div 
                key={feature.id}
                data-feature={feature.id}
                className={`bg-white dark:bg-cinema-card rounded-lg p-2 border transition-all duration-300 relative ${
                  isAvailable 
                    ? `cursor-pointer ${
                        isActive 
                          ? 'border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800' 
                          : 'border-blue-200 dark:border-blue-700/30 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                      }`
                    : 'cursor-not-allowed opacity-60 border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleFeatureClick(feature.id)}
                title={isAvailable ? feature.description : requirement.message}
              >
                {/* Show lock icon if not available */}
                {!isAvailable && (
                  <div className="absolute top-1 right-1 text-gray-400 dark:text-cinema-text-muted">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-lg mb-1">{feature.icon}</div>
                  <h4 className="font-medium text-gray-800 dark:text-cinema-text text-xs leading-tight">
                    {feature.name}
                  </h4>
                  
                  {isActive && (
                    <div className="flex items-center justify-center space-x-1 text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Active</span>
                    </div>
                  )}
                  
                  {!isAvailable && requirement.type === 'signup_required' && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Sign up required
                    </div>
                  )}
                  
                  {!isAvailable && requirement.type === 'upgrade_required' && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Upgrade needed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Usage Progress Bar for Free/Anonymous Users */}
        {(usageStats.tier === 'free' || usageStats.tier === 'anonymous') && (
          <div className="mb-4 bg-white dark:bg-cinema-card rounded-lg p-3 border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-cinema-text-muted">
                {usageStats.tier === 'anonymous' ? 'Anonymous usage' : 'Monthly usage'}
              </span>
              <span className="font-medium text-gray-800 dark:text-cinema-text">
                {usageStats.monthly_usage}/{usageStats.usage_limit}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  usageStats.usage_percentage >= 100 
                    ? 'bg-gradient-to-r from-red-500 to-red-600' 
                    : usageStats.usage_percentage >= 80 
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                }`}
                style={{ width: `${Math.min(usageStats.usage_percentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-cinema-text-muted">
              <span>
                {usageStats.tier === 'anonymous' 
                  ? 'Sign up for 10 free generations per month' 
                  : usageStats.days_remaining > 0 
                    ? `Resets in ${usageStats.days_remaining} days`
                    : 'Cycle ended'
                }
              </span>
              {usageStats.tier !== 'pro' && usageStats.tier !== 'team' && (
                <button
                  onClick={() => onShowPricing && onShowPricing()}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Upgrade for more →
                </button>
              )}
            </div>
          </div>
        )}
      
      {/* Full-Width Active Feature Component */}
      {activeFeature && (
        <div className="border-t border-blue-200 dark:border-blue-700/50 pt-6 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white dark:bg-cinema-card rounded-lg p-6 border border-blue-200 dark:border-blue-700/30 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {proFeatures.find(f => f.id === activeFeature)?.icon}
                </span>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-cinema-text">
                  {proFeatures.find(f => f.id === activeFeature)?.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveFeature(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-cinema-border rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-cinema-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Render the active feature component */}
            {(() => {
              const activeFeatureData = proFeatures.find(f => f.id === activeFeature);
              if (activeFeatureData && activeFeatureData.component) {
                const FeatureComponent = activeFeatureData.component;
                
                // Special props for Scene Extender
                if (activeFeature === 'scene-extender') {
                  return (
                    <FeatureComponent 
                      currentJson={currentJson} 
                      onResult={handleFeatureResult}
                      onSceneExtenderClick={onSceneExtenderClick}
                      sceneOptions={sceneOptions}
                      onApplyOption={onApplySceneOption}
                      onDismissOptions={onDismissSceneOptions}
                      extensionLoading={extensionLoading}
                      extensionError={extensionError}
                    />
                  );
                }
                
                // Regular props for other features
                return (
                  <FeatureComponent 
                    currentJson={currentJson} 
                    onResult={handleFeatureResult} 
                  />
                );
              }
              return null;
            })()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProFeaturesHub;