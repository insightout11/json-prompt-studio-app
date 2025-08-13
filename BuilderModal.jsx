import React, { useEffect, useRef } from 'react';

const BuilderModal = ({ 
  isOpen, 
  onClose, 
  title, 
  size = 'large', 
  showProgress = false,
  progress = null,
  children,
  className = ''
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc, false);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl', 
    large: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`rounded-2xl border border-white/10 bg-slate-900/60 shadow-[0_0_40px_-12px_rgba(59,130,246,0.25)] w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col animate-slideUp backdrop-blur-md ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-slate-200">
              {title}
            </h2>
            {showProgress && progress && (
              <div className="flex items-center space-x-3">
                <div className="w-px h-6 bg-slate-600"></div>
                <div className="text-sm text-slate-400">
                  Round {progress.current} of {progress.total}
                </div>
                {progress.label && (
                  <>
                    <div className="w-px h-6 bg-slate-600"></div>
                    <div className="text-sm font-medium text-violet-400">
                      {progress.label}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        {showProgress && progress && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {Array.from({ length: progress.total }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index < progress.current
                        ? 'bg-teal-500 w-6'
                        : index === progress.current - 1
                        ? 'bg-violet-500 w-8'
                        : 'bg-slate-700 w-4'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-slate-400">
                {Math.round((progress.current / progress.total) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BuilderModal;