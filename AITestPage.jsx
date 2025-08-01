import React, { useState } from 'react';
import AIFeatureTest from './AIFeatureTest';

const AITestPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinema-bg">
      {/* Header */}
      <div className="bg-white dark:bg-cinema-card shadow-sm border-b border-gray-200 dark:border-cinema-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-cinema-border rounded-md shadow-sm bg-white dark:bg-cinema-card text-sm font-medium text-gray-700 dark:text-cinema-text hover:bg-gray-50 dark:hover:bg-cinema-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Main App
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-cinema-text">
                AI Features Test Suite
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Development Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <AIFeatureTest />
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-cinema-card border-t border-gray-200 dark:border-cinema-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500 dark:text-cinema-text-muted">
            <p>AI Features Integration Test - Development Environment</p>
            <p className="mt-1">
              This page tests the integration of Scene Extender, AI Optimizer, and Timeline Manager components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITestPage;