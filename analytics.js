// Basic Analytics Integration for AI Video Prompt Generator
// Supports Google Analytics 4 and other tracking services

class Analytics {
  constructor() {
    this.isEnabled = false;
    this.gaId = null;
    this.init();
  }

  init() {
    // Check for GA4 tracking ID in environment variables
    this.gaId = import.meta?.env?.VITE_GA4_ID || null;
    
    if (this.gaId && typeof window !== 'undefined') {
      this.initGA4();
    }
    
    // Initialize other tracking services
    this.initSearchConsole();
  }

  // Google Analytics 4 initialization
  initGA4() {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isEnabled = true;
    console.log('📊 Analytics: GA4 initialized');
  }

  // Google Search Console verification
  initSearchConsole() {
    const searchConsoleId = import.meta?.env?.VITE_SEARCH_CONSOLE_ID;
    if (searchConsoleId && typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = searchConsoleId;
      document.head.appendChild(meta);
    }
  }

  // Track page views
  trackPageView(path, title) {
    if (!this.isEnabled || typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('config', this.gaId, {
        page_path: path,
        page_title: title,
      });
    }
  }

  // Track custom events
  trackEvent(eventName, parameters = {}) {
    if (!this.isEnabled || typeof window === 'undefined') return;

    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'User Interaction',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        ...parameters
      });
    }

    // Log for development
    if (import.meta?.env?.DEV) {
      console.log('📊 Analytics Event:', eventName, parameters);
    }
  }

  // Track Pro feature usage
  trackProFeature(featureName, isProUser = false) {
    this.trackEvent('pro_feature_used', {
      category: 'Pro Features',
      label: featureName,
      user_tier: isProUser ? 'pro' : 'free',
      feature_name: featureName
    });
  }

  // Track AI feature usage
  trackAIFeature(featureName, success = true) {
    this.trackEvent('ai_feature_used', {
      category: 'AI Features',
      label: featureName,
      success: success,
      feature_name: featureName
    });
  }

  // Track prompt generation
  trackPromptGeneration(method, fieldsCount = 0) {
    this.trackEvent('prompt_generated', {
      category: 'Prompt Generation',
      label: method, // 'manual', 'text_to_json', 'image_to_json', 'template'
      value: fieldsCount,
      generation_method: method
    });
  }

  // Track export actions
  trackExport(format = 'json') {
    this.trackEvent('prompt_exported', {
      category: 'Export',
      label: format,
      export_format: format
    });
  }

  // Track subscription events
  trackSubscription(action, tier = '') {
    this.trackEvent('subscription_' + action, {
      category: 'Subscription',
      label: tier,
      subscription_tier: tier,
      action: action // 'viewed', 'started', 'completed', 'cancelled'
    });
  }

  // Track errors
  trackError(errorType, errorMessage = '') {
    this.trackEvent('error_occurred', {
      category: 'Errors',
      label: errorType,
      error_type: errorType,
      error_message: errorMessage.substring(0, 100) // Limit message length
    });
  }

  // Performance tracking
  trackPerformance() {
    if (!this.isEnabled || typeof window === 'undefined' || !window.performance) return;

    // Track Core Web Vitals when available
    if ('web-vitals' in window) {
      // This would require the web-vitals library
      // For now, just track basic timing
    }

    // Basic performance metrics
    const navigation = window.performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.trackEvent('page_timing', {
        category: 'Performance',
        dom_load_time: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        page_load_time: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        non_interaction: true
      });
    }
  }
}

// Create singleton instance
const analytics = new Analytics();

// Auto-track performance on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => analytics.trackPerformance(), 1000);
  });
}

export default analytics;