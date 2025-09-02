// Session Management Utilities
// Handles cookie-based session detection and user state

// Get cookie value by name
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Check if user has an active session
export function hasActiveSession() {
  const sessionId = getCookie('session');
  return sessionId && sessionId.length > 0;
}

// Get session ID from cookie
export function getSessionId() {
  return getCookie('session');
}

// Check if user just upgraded (for welcome toast)
export function hasJustUpgraded() {
  return getCookie('justUpgraded') === 'true';
}

// Remove session cookies (logout)
export function clearSession() {
  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'justUpgraded=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// Session state for React components
export class SessionManager {
  constructor() {
    this.listeners = [];
    this.currentUser = null;
    this.isLoading = false;
  }

  // Subscribe to session changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all subscribers of session changes
  notify() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }

  // Check session status and fetch user data
  async checkSession() {
    const sessionId = getSessionId();
    
    console.log('🔍 SessionManager.checkSession() called');
    console.log('🍪 All cookies:', document.cookie);
    console.log('🍪 Session ID found:', sessionId ? `${sessionId.substring(0, 20)}...` : 'NONE');
    
    // IMPORTANT: Even if JavaScript can't read the HttpOnly session cookie,
    // we still need to try the API call because the browser will send the HttpOnly cookie to the server!
    console.log('🔄 Attempting session API call (HttpOnly cookies sent automatically)...');

    // Fetch user data from API
    try {
      this.isLoading = true;
      console.log('🌐 Making request to /api/auth/session...');
      
      let response;
      try {
        response = await fetch('/api/auth/session', {
          credentials: 'include' // Include cookies
        });
        console.log('🌐 Fetch completed successfully');
      } catch (fetchError) {
        console.error('🚨 FETCH FAILED:', fetchError);
        console.error('🚨 FETCH ERROR TYPE:', fetchError.constructor.name);
        console.error('🚨 FETCH ERROR MESSAGE:', fetchError.message);
        throw fetchError;
      }

      console.log('🌐 Session API response:', response.status, response.statusText);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Session data received:', userData);
        this.currentUser = userData;
      } else {
        console.log('❌ Session API failed:', response.status);
        const errorText = await response.text();
        console.log('❌ Session API error:', errorText);
        this.currentUser = null;
        // Clear invalid session cookies
        clearSession();
      }
    } catch (error) {
      console.error('🚨 Session check failed:', error);
      console.error('🚨 ERROR TYPE:', error.constructor.name);
      console.error('🚨 ERROR MESSAGE:', error.message);
      console.error('🚨 ERROR STACK:', error.stack);
      this.currentUser = null;
    } finally {
      this.isLoading = false;
    }

    this.notify();
    return this.currentUser;
  }

  // Force refresh session data
  async refreshSession() {
    return this.checkSession();
  }

  // Get current user data
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Check if loading
  isSessionLoading() {
    return this.isLoading;
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();