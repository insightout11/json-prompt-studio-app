// User Management Service with Authentication Integration
// Integrates with authService for authentication and tiered usage limits
// In production, this would connect to a real database

import { authService } from './authService';

class UserService {
  constructor() {
    // Usage limits per tier
    this.USAGE_LIMITS = {
      anonymous: 3,  // 3 generations before email required
      free: 10,      // 10 generations per month after email verification
      pro: 500,      // 500 generations per month
      team: 1000     // 1000 generations per month (shared among team)
    };

    // Tier configurations
    this.TIER_CONFIGS = {
      free: {
        name: 'Free',
        price: 0,
        features: ['Email support', 'Basic templates', 'JSON export'],
        limitations: ['10 AI generations/month', 'No API key included']
      },
      pro: {
        name: 'Pro', 
        price: 15,
        features: ['500 AI generations/month', 'API key included', 'Priority support', 'All AI features', 'Advanced templates'],
        limitations: []
      },
      team: {
        name: 'Team',
        price: 30,
        features: ['1000 AI generations/month', 'Team workspace', 'User management', 'Shared templates', 'Admin controls'],
        limitations: []
      }
    };
  }

  // Get current user (integrates with auth service)
  getCurrentUser() {
    const auth = authService.getCurrentAuth();
    
    if (auth && auth.user) {
      // User is authenticated - return auth user data
      const user = {
        ...auth.user,
        isPro: auth.user.tier === 'pro' || auth.user.tier === 'team',
        isTeam: auth.user.tier === 'team',
        tier: auth.user.tier,
        monthlyUsage: auth.user.monthlyUsage || 0,
        billing_cycle_end: auth.user.billingCycleEnd,
        subscription: auth.user.subscription
      };
      
      // Check if we need to reset usage for new billing cycle
      return this.checkAndResetUsage(user);
    }
    
    // User not authenticated - return anonymous user
    return {
      id: 'anonymous',
      email: null,
      emailVerified: false,
      tier: 'anonymous',
      isPro: false,
      isTeam: false,
      monthlyUsage: authService.getAnonymousUsage(),
      anonymousUsage: authService.getAnonymousUsage(),
      created_at: null,
      billing_cycle_end: null,
      subscription: null
    };
  }

  // Get user tier information
  getUserTier() {
    const user = this.getCurrentUser();
    return {
      tier: user.tier || 'anonymous',
      config: this.TIER_CONFIGS[user.tier] || this.TIER_CONFIGS.free,
      usage: user.monthlyUsage || user.anonymousUsage || 0,
      limit: this.USAGE_LIMITS[user.tier] || this.USAGE_LIMITS.anonymous,
      remaining: Math.max(0, (this.USAGE_LIMITS[user.tier] || this.USAGE_LIMITS.anonymous) - (user.monthlyUsage || user.anonymousUsage || 0))
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
      return authService.canUseAnonymously();
    }
    
    // Authenticated users need email verification
    if (!user.emailVerified) {
      return false;
    }
    
    // Check if user has remaining usage in their tier
    return tierInfo.remaining > 0;
  }

  // Get usage requirement (what user needs to do to use AI features)
  getUsageRequirement() {
    const user = this.getCurrentUser();
    const tierInfo = this.getUserTier();
    
    if (user.tier === 'anonymous') {
      if (authService.canUseAnonymously()) {
        return { 
          type: 'available', 
          message: `${3 - authService.getAnonymousUsage()} anonymous generations remaining`,
          remaining: 3 - authService.getAnonymousUsage()
        };
      } else {
        return { 
          type: 'signup_required', 
          message: 'Sign up for 10 free AI generations per month' 
        };
      }
    }
    
    if (!user.emailVerified) {
      return { 
        type: 'verification_required', 
        message: 'Please verify your email to use AI features' 
      };
    }
    
    if (tierInfo.remaining > 0) {
      return { 
        type: 'available', 
        message: `${tierInfo.remaining} generations remaining this month`,
        remaining: tierInfo.remaining
      };
    } else {
      return { 
        type: 'upgrade_required', 
        message: `You've used all ${tierInfo.limit} free generations this month. Upgrade for more!`,
        upgradeTo: user.tier === 'free' ? 'pro' : 'team'
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
      const newCount = authService.trackAnonymousUsage();
      return {
        ...user,
        anonymousUsage: newCount,
        last_feature_used: featureName,
        last_feature_used_at: new Date().toISOString()
      };
    } else {
      // Track authenticated user usage (would be server-side in production)
      const auth = authService.getCurrentAuth();
      if (auth && auth.user) {
        const updatedUser = {
          ...auth.user,
          monthlyUsage: (auth.user.monthlyUsage || 0) + 1,
          last_feature_used: featureName,
          last_feature_used_at: new Date().toISOString()
        };
        
        // Update auth service (in production, this would be an API call)
        authService.saveAuth({
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
      'basic-templates': ['anonymous', 'free', 'pro', 'team'],
      'ai-generation': ['anonymous', 'free', 'pro', 'team'], // But with usage limits
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
}

// Export singleton instance
export const userService = new UserService();
export default userService;