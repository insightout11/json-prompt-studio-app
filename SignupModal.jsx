import React, { useState } from 'react';
import { useToast } from './useToast';

const SignupModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('email'); // 'email' or 'sent'
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const { addToast } = useToast();

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
      
      setStep('sent');
      
      // Prevent resend for 60 seconds
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);

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

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setIsLoading(false);
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
                      Check your email
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      We've sent a sign-in link to <strong>{email}</strong>. Open it on this device.
                    </p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {canResend ? 'Resend link' : 'Wait 60s'}
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