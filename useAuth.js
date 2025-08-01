// React hook for authentication state management
import { useState, useEffect } from 'react';
import { authService } from './authService';

export const useAuth = () => {
  const [auth, setAuth] = useState(() => authService.getCurrentAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = (event) => {
      setAuth(event.detail);
      setError(null);
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Signup function
  const signup = async (email, password = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.signup(email, password);
      setAuth(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      setAuth(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification
  const verifyEmail = async (token) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.verifyEmail(token);
      setAuth(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Send verification email
  const sendVerificationEmail = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.sendVerificationEmail(email);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      setAuth(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Track anonymous usage
  const trackAnonymousUsage = () => {
    return authService.trackAnonymousUsage();
  };

  // Check if can use anonymously
  const canUseAnonymously = () => {
    return authService.canUseAnonymously();
  };

  // Get anonymous usage count
  const getAnonymousUsage = () => {
    return authService.getAnonymousUsage();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Computed properties
  const isAuthenticated = auth !== null;
  const user = auth?.user || null;
  const needsVerification = auth?.needsVerification || false;
  const isEmailVerified = user?.emailVerified || false;

  return {
    // State
    auth,
    user,
    isAuthenticated,
    isEmailVerified,
    needsVerification,
    isLoading,
    error,
    
    // Actions
    signup,
    login,
    logout,
    verifyEmail,
    sendVerificationEmail,
    trackAnonymousUsage,
    canUseAnonymously,
    getAnonymousUsage,
    clearError
  };
};