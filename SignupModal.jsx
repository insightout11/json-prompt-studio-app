import React, { useState, useEffect } from 'react';
import { useToast } from './useToast';

const SignupModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('signup'); // 'signup', 'email', or 'sent'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [magicLinkUrl, setMagicLinkUrl] = useState('');
  const { addToast } = useToast();

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendLink = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      addToast('Please enter your email address', 'error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          redirectUrl: window.location.origin
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send sign-in link');
      }
      
      const result = await response.json();
      setStep('sent');
      
      // For development, show the magic link
      if (result.devMode && result.magicLink) {
        setMagicLinkUrl(result.magicLink);
      }
      
      // Start 60-second countdown
      setCanResend(false);
      setCountdown(60);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'magic_link_sent', {
          email_domain: email.split('@')[1]
        });
      }

    } catch (error) {
      console.error('Magic link error:', error);
      addToast(error.message || 'Failed to send sign-in link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    handleSendLink({ preventDefault: () => {} });
  };

  const handleChangeEmail = () => {
    setStep('email');
    setEmail('');
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      
      // Analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'signup_started', {
          method: 'google',
          context: 'immediate_modal'
        });
      }

      // Get Google OAuth URL from backend
      const response = await fetch('/api/auth/google', {
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to initiate Google OAuth');
      }

      const { authUrl } = await response.json();

      // Open Google OAuth in a popup window
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if authentication was successful by checking for session cookie
          // The parent window will be redirected by the OAuth callback
          window.location.reload();
        }
      }, 1000);

      // Handle popup message (alternative method)
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          addToast('Successfully signed in with Google!', 'success');
          onClose();
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          addToast('Google sign-in failed. Please try again.', 'error');
        }
      });

    } catch (error) {
      console.error('Google OAuth error:', error);
      addToast(error.message || 'Google sign-in failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('signup');
    setEmail('');
    setIsLoading(false);
    setMagicLinkUrl('');
    setCountdown(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                {step === 'signup' && (
                  <>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Get 10 Free Premium Generations
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Sign up now to unlock premium AI image generation with advanced features.
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLoading ? 'Signing up...' : 'Continue with Google'}
                      </button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setStep('email')}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Continue with Email
                      </button>
                    </div>
                  </>
                )}

                {step === 'email' && (
                  <>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      Get your sign-in link
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Enter your email to get a sign-in link. No password required.
                    </p>
                    
                    <form onSubmit={handleSendLink}>
                      <div className="mb-4">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          disabled={isLoading}
                          autoFocus
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Sending...' : 'Send me a sign-in link'}
                        </button>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {step === 'sent' && (
                  <>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      {magicLinkUrl ? 'Your sign-in link is ready!' : 'Check your email'}
                    </h3>
                    
                    {magicLinkUrl ? (
                      <>
                        <p className="text-sm text-gray-500 mb-3">
                          <strong>Development mode:</strong> Click the link below to sign in:
                        </p>
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <a 
                            href={magicLinkUrl}
                            className="text-blue-600 hover:text-blue-700 text-sm break-all underline"
                            target="_self"
                          >
                            {magicLinkUrl}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">
                        We've sent a sign-in link to <strong>{email}</strong>. Open it on this device.
                      </p>
                    )}
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {canResend ? 'Resend link' : `Wait ${countdown}s`}
                      </button>
                      <button
                        onClick={handleChangeEmail}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        Change email
                      </button>
                    </div>
                    
                    <button
                      onClick={handleClose}
                      className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;