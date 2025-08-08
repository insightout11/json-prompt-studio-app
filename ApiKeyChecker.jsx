import React, { useState, useEffect } from 'react';
import aiApiService from './aiApiService';

const ApiKeyChecker = () => {
  const [keyStatus, setKeyStatus] = useState({
    groq: { exists: false, valid: null, testing: false },
    openai: { exists: false, valid: null, testing: false }
  });

  useEffect(() => {
    checkKeyExistence();
  }, []);

  const checkKeyExistence = () => {
    setKeyStatus({
      groq: { 
        exists: aiApiService.hasGroqApiKey(), 
        valid: null, 
        testing: false 
      },
      openai: { 
        exists: aiApiService.hasOpenaiApiKey(), 
        valid: null, 
        testing: false 
      }
    });
  };

  const testApiKey = async (provider) => {
    setKeyStatus(prev => ({
      ...prev,
      [provider]: { ...prev[provider], testing: true, valid: null }
    }));

    try {
      const testMessage = [{ role: 'user', content: 'Say "test successful"' }];
      const options = {
        maxTokens: 10,
        temperature: 0
      };

      if (provider === 'openai') {
        options.forceOpenAI = true;
      }

      const response = await aiApiService.makeRequest(testMessage, options);
      
      const isValid = response.content.toLowerCase().includes('test successful');
      
      setKeyStatus(prev => ({
        ...prev,
        [provider]: { ...prev[provider], testing: false, valid: isValid }
      }));

    } catch (error) {
      console.error(`${provider} test failed:`, error);
      setKeyStatus(prev => ({
        ...prev,
        [provider]: { ...prev[provider], testing: false, valid: false }
      }));
    }
  };

  const getStatusIcon = (providerStatus) => {
    if (!providerStatus.exists) return '❌';
    if (providerStatus.testing) return '🔄';
    if (providerStatus.valid === true) return '✅';
    if (providerStatus.valid === false) return '❌';
    return '❓';
  };

  const getStatusText = (providerStatus) => {
    if (!providerStatus.exists) return 'No API Key';
    if (providerStatus.testing) return 'Testing...';
    if (providerStatus.valid === true) return 'Valid & Working';
    if (providerStatus.valid === false) return 'Invalid or Error';
    return 'Not Tested';
  };

  if (import.meta?.env?.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 min-w-64">
      <h3 className="text-sm font-bold mb-3 text-gray-800 dark:text-white">
        🔑 API Key Status
      </h3>
      
      <div className="space-y-2">
        {/* Groq Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(keyStatus.groq)}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Groq
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {getStatusText(keyStatus.groq)}
            </span>
            {keyStatus.groq.exists && (
              <button
                onClick={() => testApiKey('groq')}
                disabled={keyStatus.groq.testing}
                className="text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-2 py-1 rounded"
              >
                Test
              </button>
            )}
          </div>
        </div>

        {/* OpenAI Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(keyStatus.openai)}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              OpenAI
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {getStatusText(keyStatus.openai)}
            </span>
            {keyStatus.openai.exists && (
              <button
                onClick={() => testApiKey('openai')}
                disabled={keyStatus.openai.testing}
                className="text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded"
              >
                Test
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        <button
          onClick={checkKeyExistence}
          className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded w-full"
        >
          Refresh Status
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        💡 Groq for text, OpenAI for images
      </div>
    </div>
  );
};

export default ApiKeyChecker;