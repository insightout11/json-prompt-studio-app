import React, { useState } from 'react';
import { useToast } from './useToast';
import SignupModal from './SignupModal';

const SignupPrompt = ({ 
  isVisible = true,
  onDismiss = null,
  exhaustedCount = 3,
  className = "",
  context = "exhausted", // "exhausted" | "immediate"
  title = null,
  subtitle = null
}) => {
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();

  const handleEmailSignup = () => {
    setShowModal(true);
    // Analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'signup_started', {
        method: 'email',
        context: context,
        exhausted_at_count: context === "exhausted" ? exhaustedCount : null
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Analytics event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'signup_started', {
          method: 'google',
          context: context,
          exhausted_at_count: context === "exhausted" ? exhaustedCount : null
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
          // The backend will handle the redirect
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          addToast('Google sign-in failed. Please try again.', 'error');
        }
      });

    } catch (error) {
      console.error('Google OAuth error:', error);
      addToast(error.message || 'Google sign-in failed. Please try again.', 'error');
    }
  };

  const handleMaybeLater = () => {
    if (onDismiss) onDismiss();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'signup_prompt_dismissed', {
        context: context,
        exhausted_at_count: context === "exhausted" ? exhaustedCount : null
      });
    }
  };

  if (!isVisible) return null;

  // Dynamic content based on context
  const getContent = () => {
    if (context === "immediate") {
      return {
        heading: title || "Get 10 Free Premium Generations",
        description: subtitle || "Sign up now to unlock premium AI image generation with advanced features and higher quality outputs."
      };
    } else {
      return {
        heading: title || "Get 10 Pro bonus generations", 
        description: subtitle || `You've used ${exhaustedCount} free previews. Create a free account to try premium quality and edits.`
      };
    }
  };

  const content = getContent();

  return (
    <>
      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 shadow-sm ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {content.heading}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {content.description}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEmailSignup}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Continue with Email
              </button>
              <button
                onClick={handleGoogleSignup}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Continue with Google
              </button>
              {context === "exhausted" && (
                <button
                  onClick={handleMaybeLater}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Maybe later
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default SignupPrompt;