// Authentication Service
// Handles user signup, login, email verification, and session management
// In production, this would connect to a real backend API

class AuthService {
  constructor() {
    this.storageKey = 'json_prompt_auth';
    this.sessionKey = 'json_prompt_session';
    this.apiBase = '/api/auth'; // Backend API endpoints
    
    // Initialize auth state
    this.initializeAuth();
  }

  // Initialize authentication state
  initializeAuth() {
    const existingAuth = localStorage.getItem(this.storageKey);
    if (existingAuth) {
      const auth = JSON.parse(existingAuth);
      // Check if session is still valid
      if (this.isSessionValid(auth)) {
        return auth;
      } else {
        // Clear invalid session
        this.clearAuth();
      }
    }
    return null;
  }

  // Check if current session is valid (not expired)
  isSessionValid(auth) {
    if (!auth || !auth.token || !auth.expiresAt) return false;
    return new Date(auth.expiresAt) > new Date();
  }

  // Get current authentication state
  getCurrentAuth() {
    const auth = localStorage.getItem(this.storageKey);
    if (!auth) return null;
    
    const parsed = JSON.parse(auth);
    return this.isSessionValid(parsed) ? parsed : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentAuth() !== null;
  }

  // Get current user info
  getCurrentUser() {
    const auth = this.getCurrentAuth();
    return auth ? auth.user : null;
  }

  // Save authentication data
  saveAuth(authData) {
    localStorage.setItem(this.storageKey, JSON.stringify({
      ...authData,
      savedAt: new Date().toISOString()
    }));
    
    // Dispatch event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: authData
      }));
    }
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.sessionKey);
    
    // Dispatch event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: null
      }));
    }
  }

  // Email signup
  async signup(email, password = null) {
    try {
      // In development, simulate API call
      if (import.meta?.env?.DEV) {
        return this.mockSignup(email);
      }

      // Real API call for production
      const response = await fetch(`${this.apiBase}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Signup failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Mock signup for development
  mockSignup(email) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          user: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            email: email,
            emailVerified: false,
            tier: 'free',
            monthlyUsage: 0,
            anonymousUsage: 0,
            createdAt: new Date().toISOString()
          },
          token: 'mock_token_' + Math.random().toString(36),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          needsVerification: true
        };

        // Save to localStorage for development
        this.saveAuth(userData);
        resolve(userData);
      }, 500);
    });
  }

  // Email verification
  async verifyEmail(token) {
    try {
      if (import.meta?.env?.DEV) {
        return this.mockVerifyEmail(token);
      }

      const response = await fetch(`${this.apiBase}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`Email verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.saveAuth(data);
      return data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Mock email verification for development
  mockVerifyEmail(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentAuth = this.getCurrentAuth();
        if (currentAuth) {
          const updatedAuth = {
            ...currentAuth,
            user: {
              ...currentAuth.user,
              emailVerified: true
            },
            needsVerification: false
          };
          this.saveAuth(updatedAuth);
          resolve(updatedAuth);
        } else {
          throw new Error('No current session to verify');
        }
      }, 300);
    });
  }

  // Send verification email
  async sendVerificationEmail(email) {
    try {
      if (import.meta?.env?.DEV) {
        // In development, just log the "email"
        console.log(`Mock verification email sent to: ${email}`);
        console.log('Verification link: /verify?token=mock_token_123');
        return { success: true, message: 'Verification email sent (check console)' };
      }

      const response = await fetch(`${this.apiBase}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(`Failed to send verification email: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Send verification email error:', error);
      throw error;
    }
  }

  // Login (if using passwords)
  async login(email, password) {
    try {
      if (import.meta?.env?.DEV) {
        return this.mockLogin(email);
      }

      const response = await fetch(`${this.apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.saveAuth(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Mock login for development
  mockLogin(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user exists in localStorage (simulate database lookup)
        const existingAuth = this.getCurrentAuth();
        if (existingAuth && existingAuth.user.email === email) {
          resolve(existingAuth);
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  }

  // Logout
  async logout() {
    try {
      if (!import.meta?.env?.DEV) {
        // Call backend to invalidate token
        await fetch(`${this.apiBase}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.getCurrentAuth()?.token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth data
      this.clearAuth();
    }
  }

  // Get or generate browser fingerprint for abuse prevention
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
      canvas: canvas.toDataURL().slice(-50), // Last 50 chars of canvas data
      userAgent: navigator.userAgent.slice(0, 100) // First 100 chars
    };

    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  }

  // Track anonymous usage (before email signup)
  trackAnonymousUsage() {
    const fingerprint = this.getBrowserFingerprint();
    const key = `anonymous_usage_${fingerprint}`;
    const today = new Date().toDateString();
    
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : { count: 0, date: today };
    
    // Reset count if it's a new day
    if (data.date !== today) {
      data.count = 0;
      data.date = today;
    }
    
    data.count += 1;
    data.lastUsed = new Date().toISOString();
    
    localStorage.setItem(key, JSON.stringify(data));
    return data.count;
  }

  // Check if anonymous user has exceeded their limit
  canUseAnonymously() {
    const fingerprint = this.getBrowserFingerprint();
    const key = `anonymous_usage_${fingerprint}`;
    const today = new Date().toDateString();
    
    const stored = localStorage.getItem(key);
    if (!stored) return true;
    
    const data = JSON.parse(stored);
    // Reset if it's a new day
    if (data.date !== today) return true;
    
    return data.count < 3; // 3 anonymous generations allowed
  }

  // Get anonymous usage count
  getAnonymousUsage() {
    const fingerprint = this.getBrowserFingerprint();
    const key = `anonymous_usage_${fingerprint}`;
    const stored = localStorage.getItem(key);
    
    if (!stored) return 0;
    
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    
    return data.date === today ? data.count : 0;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;