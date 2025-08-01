import React, { useState } from 'react';
import { useAuth } from './useAuth';

const InlineAuth = ({ 
  onAuthComplete, 
  className = "",
  title = "Sign up for 10 free AI generations",
  subtitle = "No password required - just verify your email"
}) => {
  const { signup, sendVerificationEmail, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('signup'); // 'signup' | 'verification-sent' | 'verifying'
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      const result = await signup(email);
      
      if (result.needsVerification) {
        setStep('verification-sent');
        // Auto-send verification email
        await sendVerificationEmail(email);
      } else {
        // Signup complete
        onAuthComplete && onAuthComplete(result);
      }
    } catch (err) {
      setLocalError(err.message || 'Signup failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail(email);
      setLocalError('');
    } catch (err) {
      setLocalError('Failed to resend verification email');
    }
  };

  const displayError = localError || error;

  if (step === 'verification-sent') {
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700/50 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-2">
            Check Your Email
          </h3>
          <p className="text-sm text-gray-600 dark:text-cinema-text-muted mb-4">
            We sent a verification link to <strong>{email}</strong>
          </p>
          <p className="text-xs text-gray-500 dark:text-cinema-text-muted mb-4">
            Click the link in your email to activate your 10 free AI generations
          </p>
          
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded text-sm text-red-700 dark:text-red-300">
              {displayError}
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </button>
            
            <button
              onClick={() => setStep('signup')}
              className="text-gray-500 dark:text-cinema-text-muted hover:text-gray-700 dark:hover:text-cinema-text text-sm"
            >
              Use different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700/50 ${className}`}>
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">✨</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-cinema-text mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-cinema-text-muted">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 dark:border-cinema-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-cinema-card text-gray-900 dark:text-cinema-text placeholder-gray-500 dark:placeholder-cinema-text-muted"
            disabled={isLoading}
            required
          />
        </div>

        {displayError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded text-sm text-red-700 dark:text-red-300">
            {displayError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Get My Free Generations</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-cinema-text-muted">
          By signing up, you agree to receive product updates via email.
          <br />
          Unsubscribe anytime. No spam, ever.
        </p>
      </div>

      {/* Features Preview */}
      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700/50">
        <div className="text-xs text-gray-600 dark:text-cinema-text-muted mb-2 text-center font-medium">
          What you'll get:
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span className="text-gray-700 dark:text-cinema-text">10 AI generations/month</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span className="text-gray-700 dark:text-cinema-text">All AI features</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span className="text-gray-700 dark:text-cinema-text">Export & download</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-green-500">✓</span>
            <span className="text-gray-700 dark:text-cinema-text">No credit card</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineAuth;