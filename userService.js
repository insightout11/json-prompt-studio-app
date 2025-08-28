// User Management Service with Session Integration
// Integrates with session management for authentication and tiered usage limits
// In production, this would connect to a real database

import { sessionManager } from './sessionUtils.js';

class UserService {
  constructor() {
    this.storageKey = 'json_prompt_auth';
    this.initializeService();
  }

  // Anonymous usage tracking methods (moved from authService)
  getBrowserFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.fillText('Browser fingerprint', 2, 2);

    const fingerprint = {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL().slice(-50),
      userAgent: navigator.userAgent.slice(0, 100)
    };

    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  getAnonymousUsage() {
    const key = `anonymous_usage_${this.getBrowserFingerprint()}`;
    const data = localStorage.getItem(key);
    if (!data) return 0;

    const parsed = JSON.parse(data);
    const today = new Date().toDateString();
    return parsed.date === today ? parsed.count : 0;
  }

  canUseAnonymously() {
    const key = `anonymous_usage_${this.getBrowserFingerprint()}`;
    const today = new Date().toDateString();
    const data = localStorage.getItem(key);
    
    if (!data) return true;
    
    const parsed = JSON.parse(data);
    if (parsed.date !== today) return true;
    
    return parsed.count < 3;
  }

  trackAnonymousUsage() {
    const key = `anonymous_usage_${this.getBrowserFingerprint()}`;
    const today = new Date().toDateString();
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : { count: 0, date: today };

    if (parsed.date !== today) {
      parsed.count = 0;
      parsed.date = today;
    }

    parsed.count += 1;
    parsed.lastUsed = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(parsed));

    return parsed.count;
  }

  getCurrentAuth() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  saveAuth(authData) {
    localStorage.setItem(this.storageKey, JSON.stringify(authData));
  }

  initializeService() {
    // Storage key for localStorage (different key for user service data)
    this.userStorageKey = 'userService_data';
    
    // Usage limits per tier
    this.USAGE_LIMITS = {
      anonymous: 3,     // 3 premium generations (Gemini trial)
      new_user: 10,     // 10 premium generations for new signups (Gemini bonus)
      free: -1,         // Unlimited free tier (Horde/alternative) - use -1 for unlimited
      pro: 500,         // 500 premium generations per month (Gemini)
      team: 1000        // 1000 premium generations per month (Gemini)
    };

    // Tier configurations
    this.TIER_CONFIGS = {
      anonymous: {
        name: 'Trial',
        price: 0,
        features: ['3 premium quality trials', 'No signup required', 'Full quality preview'],
        limitations: ['Limited to 3 generations', 'No account features']
      },
      new_user: {
        name: 'Welcome Bonus',
        price: 0,
        features: ['10 premium generations', 'Full quality images', 'Account features'],
        limitations: ['One-time bonus', 'Limited to 10 generations']
      },
      free: {
        name: 'Free',
        price: 0,
        features: ['Unlimited generations', 'Email support', 'Basic templates', 'JSON export'],
        limitations: ['Standard quality', 'Community queue']
      },
      pro: {
        name: 'Pro', 
        price: 15,
        features: ['500 premium generations/month', 'Premium quality', 'Priority support', 'Natural language editing', 'Advanced templates'],
        limitations: []
      },
      team: {
        name: 'Team',
        price: 30,
        features: ['1000 premium generations/month', 'Team workspace', 'User management', 'Shared templates', 'Admin controls'],
        limitations: []
      }
    };
  }

  // Get current user (integrates with session management)
  getCurrentUser() {
    const sessionUser = sessionManager.getCurrentUser();
    
    // Check for dev override in localStorage first (for both authenticated and anonymous users)
    let devUser = null;
    try {
      const devUserData = localStorage.getItem(this.storageKey);
      if (devUserData) {
        devUser = JSON.parse(devUserData);
        console.log('🔧 DEV: getCurrentUser - Found dev override data:', devUser);
      } else {
        console.log('🔧 DEV: getCurrentUser - No dev override data found');
      }
    } catch (error) {
      console.error('Error loading dev user data:', error);
    }
    
    if (sessionUser) {
      console.log('🔧 DEV: getCurrentUser - Processing authenticated user, tier:', sessionUser.tier);
      console.log('🔧 DEV: getCurrentUser - devUser?.isPro:', devUser?.isPro);
      
      // User is authenticated - return session user data with dev overrides applied
      const finalIsPro = devUser?.isPro !== undefined ? devUser.isPro : (sessionUser.tier === 'pro' || sessionUser.tier === 'team');
      console.log('🔧 DEV: getCurrentUser - Final isPro value:', finalIsPro);
      
      // Determine user tier with new user bonus logic
      let userTier = devUser?.tier || sessionUser.tier;
      
      // Check if this is a new user who should get bonus credits
      if (userTier === 'free' && sessionUser.monthlyUsage === 0 && !sessionUser.hasUsedNewUserBonus) {
        userTier = 'new_user';
      }

      const user = {
        ...sessionUser,
        isPro: finalIsPro,
        isTeam: sessionUser.tier === 'team',
        tier: userTier,
        monthlyUsage: sessionUser.monthlyUsage || 0,
        billing_cycle_end: sessionUser.billingCycleEnd,
        subscription: devUser?.subscription || sessionUser.subscription,
        hasUsedNewUserBonus: sessionUser.hasUsedNewUserBonus || false
      };
      
      // Check if we need to reset usage for new billing cycle
      return this.checkAndResetUsage(user);
    }
    
    // User not authenticated - return anonymous user with dev overrides

    return {
      id: 'anonymous',
      email: null,
      emailVerified: false,
      tier: devUser?.tier || 'anonymous',
      isPro: devUser?.isPro || false,
      isTeam: false,
      monthlyUsage: this.getAnonymousUsage(),
      anonymousUsage: this.getAnonymousUsage(),
      created_at: null,
      billing_cycle_end: null,
      subscription: devUser?.subscription || null
    };
  }

  // Get user tier information
  getUserTier() {
    const user = this.getCurrentUser();
    const limit = this.USAGE_LIMITS[user.tier] || this.USAGE_LIMITS.anonymous;
    const usage = user.monthlyUsage || user.anonymousUsage || 0;
    
    return {
      tier: user.tier || 'anonymous',
      config: this.TIER_CONFIGS[user.tier] || this.TIER_CONFIGS.free,
      usage: usage,
      limit: limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - usage), // -1 means unlimited
      isUnlimited: limit === -1
    };
  }

  // Check if user can use AI features
  canUseAIFeatures() {
    // Dev override - check for dev override flag in localStorage
    if (typeof window !== 'undefined' && 
        localStorage.getItem('DEV_PRO_OVERRIDE') === 'true') {
      return true;
    }
    
    const user = this.getCurrentUser();
    const tierInfo = this.getUserTier();
    
    // Anonymous users can use up to 3 generations
    if (user.tier === 'anonymous') {
      return this.canUseAnonymously();
    }
    
    // Free tier has unlimited usage (no email verification required for free tier)
    if (user.tier === 'free') {
      return true; // Unlimited free tier access
    }
    
    // Other authenticated users need email verification
    if (!user.emailVerified) {
      return false;
    }
    
    // Check if user has remaining usage in their tier (or unlimited)
    return tierInfo.isUnlimited || tierInfo.remaining > 0;
  }

  // Get usage requirement (what user needs to do to use AI features)
  getUsageRequirement() {
    const user = this.getCurrentUser();
    const tierInfo = this.getUserTier();
    
    if (user.tier === 'anonymous') {
      if (this.canUseAnonymously()) {
        return { 
          type: 'available', 
          message: `${3 - this.getAnonymousUsage()} premium trial generations remaining`,
          remaining: 3 - this.getAnonymousUsage()
        };
      } else {
        return { 
          type: 'signup_required', 
          message: 'Sign up for 10 premium bonus generations!' 
        };
      }
    }
    
    if (user.tier === 'new_user') {
      return { 
        type: 'available', 
        message: `${tierInfo.remaining} premium bonus generations remaining`,
        remaining: tierInfo.remaining
      };
    }
    
    if (user.tier === 'free') {
      return { 
        type: 'available', 
        message: 'Unlimited free generations available',
        remaining: -1,
        isUnlimited: true
      };
    }
    
    if (!user.emailVerified && user.tier !== 'free') {
      return { 
        type: 'verification_required', 
        message: 'Please verify your email to use premium features' 
      };
    }
    
    if (tierInfo.isUnlimited || tierInfo.remaining > 0) {
      const message = tierInfo.isUnlimited 
        ? 'Unlimited premium generations' 
        : `${tierInfo.remaining} premium generations remaining this month`;
      return { 
        type: 'available', 
        message: message,
        remaining: tierInfo.remaining
      };
    } else {
      return { 
        type: 'upgrade_required', 
        message: `You've used all ${tierInfo.limit} premium generations this month. Continue with free tier or upgrade!`,
        upgradeTo: user.tier === 'new_user' ? 'pro' : 'team'
      };
    }
  }

  // Update user subscription status (called after successful Stripe payment)
  upgradeToProSubscription(subscriptionData) {
    const user = this.getCurrentUser();
    const updatedUser = {
      ...user,
      isPro: true,
      monthly_usage: 0, // Reset usage on upgrade
      billing_cycle_end: subscriptionData.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      subscription: {
        id: subscriptionData.id || 'sub_' + Math.random().toString(36).substr(2, 9),
        status: 'active',
        plan: 'pro',
        billingCycle: subscriptionData.billingCycle || 'monthly',
        price: 15,
        current_period_start: new Date().toISOString(),
        current_period_end: subscriptionData.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      last_usage_reset: new Date().toISOString()
    };
    
    this.saveUser(updatedUser);
    return updatedUser;
  }

  // Downgrade user (called when subscription cancelled)
  cancelSubscription() {
    const user = this.getCurrentUser();
    const updatedUser = {
      ...user,
      isPro: false,
      subscription: user.subscription ? {
        ...user.subscription,
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      } : null
    };
    
    this.saveUser(updatedUser);
    return updatedUser;
  }

  // Track AI feature usage (works for all tiers)
  trackAIFeatureUsage(featureName) {
    const user = this.getCurrentUser();
    
    // Check if user can use AI features
    if (!this.canUseAIFeatures()) {
      const requirement = this.getUsageRequirement();
      throw new Error(requirement.message);
    }
    
    // Track usage based on user type
    if (user.tier === 'anonymous') {
      // Track anonymous usage
      const newCount = this.trackAnonymousUsage();
      return {
        ...user,
        anonymousUsage: newCount,
        last_feature_used: featureName,
        last_feature_used_at: new Date().toISOString()
      };
    } else {
      // Track authenticated user usage (would be server-side in production)
      const auth = this.getCurrentAuth();
      if (auth && auth.user) {
        const newUsage = (auth.user.monthlyUsage || 0) + 1;
        let updatedUser = {
          ...auth.user,
          monthlyUsage: newUsage,
          last_feature_used: featureName,
          last_feature_used_at: new Date().toISOString()
        };

        // If user is new_user and has exhausted their bonus, transition to free tier
        if (user.tier === 'new_user' && newUsage >= 10) {
          updatedUser = {
            ...updatedUser,
            tier: 'free',
            hasUsedNewUserBonus: true
          };
        }
        
        // Update auth service (in production, this would be an API call)
        this.saveAuth({
          ...auth,
          user: updatedUser
        });
        
        return updatedUser;
      }
    }
    
    throw new Error('Unable to track usage');
  }

  // Legacy method for backward compatibility
  trackProFeatureUsage(featureName) {
    return this.trackAIFeatureUsage(featureName);
  }

  // Check if usage should be reset (new billing cycle)
  checkAndResetUsage(user) {
    if (!user.billing_cycle_end) return user;

    const now = new Date();
    const cycleEnd = new Date(user.billing_cycle_end);
    
    // If we've passed the billing cycle end, reset usage
    if (now > cycleEnd) {
      const nextCycleEnd = new Date(cycleEnd);
      nextCycleEnd.setMonth(nextCycleEnd.getMonth() + 1); // Add 1 month
      
      const updatedUser = {
        ...user,
        monthly_usage: 0,
        billing_cycle_end: nextCycleEnd.toISOString(),
        last_usage_reset: now.toISOString()
      };
      
      this.saveUser(updatedUser);
      return updatedUser;
    }
    
    return user;
  }

  // Get usage statistics (enhanced for new tier system)
  getUsageStats() {
    const user = this.getCurrentUser();
    const tierInfo = this.getUserTier();
    const now = new Date();
    const cycleEnd = user.billing_cycle_end ? new Date(user.billing_cycle_end) : null;
    
    let daysRemaining = 0;
    if (cycleEnd) {
      daysRemaining = Math.max(0, Math.ceil((cycleEnd - now) / (1000 * 60 * 60 * 24)));
    } else if (user.tier === 'free' && user.emailVerified) {
      // For free users, assume monthly cycle from signup/last reset
      const lastReset = user.last_usage_reset ? new Date(user.last_usage_reset) : new Date(user.created_at);
      const nextReset = new Date(lastReset);
      nextReset.setMonth(nextReset.getMonth() + 1);
      daysRemaining = Math.max(0, Math.ceil((nextReset - now) / (1000 * 60 * 60 * 24)));
    }

    return {
      tier: tierInfo.tier,
      monthly_usage: tierInfo.usage,
      usage_limit: tierInfo.limit,
      usage_remaining: tierInfo.remaining,
      days_remaining: daysRemaining,
      cycle_end: user.billing_cycle_end,
      isPro: user.isPro,
      isTeam: user.isTeam,
      last_reset: user.last_usage_reset,
      usage_percentage: tierInfo.limit > 0 ? Math.round((tierInfo.usage / tierInfo.limit) * 100) : 0,
      can_use_ai: this.canUseAIFeatures(),
      requirement: this.getUsageRequirement()
    };
  }

  // Simulate webhook handling (called when Stripe sends events)
  handleWebhookEvent(eventType, data) {
    const user = this.getCurrentUser();
    
    switch (eventType) {
      case 'invoice.payment_succeeded':
        // Subscription renewed successfully
        return this.upgradeToProSubscription({
          id: data.subscription_id,
          current_period_end: data.current_period_end,
          billingCycle: 'monthly'
        });
        
      case 'invoice.payment_failed':
        // Payment failed - could implement grace period
        console.warn('Payment failed for user:', user.id);
        return user;
        
      case 'customer.subscription.deleted':
        // Subscription cancelled
        return this.cancelSubscription();
        
      default:
        console.log('Unhandled webhook event:', eventType);
        return user;
    }
  }

  // Check if user can use Pro features (legacy compatibility)
  canUseProFeatures() {
    const user = this.getCurrentUser();
    return user.isPro && (user.subscription?.status === 'active' || user.tier === 'pro' || user.tier === 'team');
  }

  // New method to check tier-specific access
  hasFeatureAccess(feature) {
    const user = this.getCurrentUser();
    
    // Define feature access by tier
    const featureAccess = {
      'basic-templates': ['anonymous', 'new_user', 'free', 'pro', 'team'],
      'ai-generation': ['anonymous', 'new_user', 'free', 'pro', 'team'], // But with usage limits
      'premium-quality': ['anonymous', 'new_user', 'pro', 'team'], // High-quality Gemini generations
      'natural-language-editing': ['pro', 'team'],
      'api-key': ['pro', 'team'],
      'priority-support': ['pro', 'team'],
      'team-workspace': ['team'],
      'user-management': ['team'],
      'advanced-templates': ['pro', 'team']
    };
    
    const allowedTiers = featureAccess[feature] || [];
    return allowedTiers.includes(user.tier);
  }

  // For development: toggle Pro status
  toggleProStatus() {
    const user = this.getCurrentUser();
    console.log('🔧 DEV: userService.toggleProStatus - Current user:', user);
    console.log('🔧 DEV: userService.toggleProStatus - Current isPro:', user.isPro);
    
    if (user.isPro) {
      console.log('🔧 DEV: User is Pro, switching to Free');
      return this.cancelSubscription();
    } else {
      console.log('🔧 DEV: User is Free, switching to Pro');
      return this.upgradeToProSubscription({
        billingCycle: 'monthly'
      });
    }
  }

  // Reset all data (for testing)
  resetUser() {
    localStorage.removeItem(this.storageKey);
    return this.initializeUser();
  }

  // Force Pro status for development
  forceProStatus() {
    const user = this.getCurrentUser();
    console.log('🔧 DEV: userService.forceProStatus - Current user:', user);
    console.log('🔧 DEV: userService.forceProStatus - Current isPro:', user.isPro);
    
    if (!user.isPro) {
      console.log('🔧 DEV: User is not Pro, forcing upgrade');
      return this.upgradeToProSubscription({
        billingCycle: 'monthly',
        dev_override: true
      });
    }
    console.log('🔧 DEV: User already Pro, returning existing user');
    return user;
  }

  // Save user data to localStorage (for development/testing)
  saveUser(userData) {
    try {
      // For dev purposes, we'll store in localStorage
      // In production, this would update the database through authService
      const currentAuth = this.getCurrentAuth();
      if (currentAuth && currentAuth.user) {
        // Update auth service with new user data
        const updatedAuth = {
          ...currentAuth,
          user: {
            ...currentAuth.user,
            ...userData,
            tier: userData.isPro ? 'pro' : 'free'
          }
        };
        localStorage.setItem('auth', JSON.stringify(updatedAuth));
        console.log('🔧 DEV: saveUser - Updated user data in auth');
      } else {
        // Anonymous user case - use the correct storage key
        localStorage.setItem(this.storageKey, JSON.stringify(userData));
        console.log('🔧 DEV: saveUser - Saved anonymous user data');
      }
      
      // Trigger React component updates
      window.dispatchEvent(new CustomEvent('userDataUpdated'));
      console.log('🔧 DEV: saveUser - Dispatched userDataUpdated event');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;