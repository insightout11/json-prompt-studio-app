// React Hook for Session Management
// Provides user authentication state and session data to components

import { useState, useEffect } from 'react';
import { sessionManager, hasJustUpgraded } from './sessionUtils';

export function useSession() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Subscribe to session changes
    const unsubscribe = sessionManager.subscribe((userData) => {
      setUser(userData);
      setIsLoggedIn(!!userData);
      setIsLoading(sessionManager.isSessionLoading());
    });

    // Check session on component mount
    sessionManager.checkSession();

    return unsubscribe;
  }, []);

  // Refresh session data
  const refreshSession = () => {
    return sessionManager.refreshSession();
  };

  // Get user tier for display
  const getUserTier = () => {
    if (!user) return 'anonymous';
    return user.tier;
  };

  // Get user credits/usage info
  const getUserUsage = () => {
    if (!user) return { tier: 'anonymous', usage: 0, limit: 3 };
    
    // Map tiers to their limits and usage
    const tierLimits = {
      anonymous: 3,
      new_user: 10,
      free: -1, // unlimited
      pro: 500,
      team: 1000
    };

    return {
      tier: user.tier,
      usage: user.monthlyUsage || 0,
      limit: tierLimits[user.tier] || 0,
      hasUsedNewUserBonus: user.hasUsedNewUserBonus
    };
  };

  // Check if user just signed up (for welcome toast)
  const checkJustUpgraded = () => {
    return hasJustUpgraded();
  };

  // Get display name for user
  const getDisplayName = () => {
    if (!user) return null;
    return user.email.split('@')[0]; // Use part before @ as display name
  };

  return {
    user,
    isLoading,
    isLoggedIn,
    refreshSession,
    getUserTier,
    getUserUsage,
    checkJustUpgraded,
    getDisplayName
  };
}