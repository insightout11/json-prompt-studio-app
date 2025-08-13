import React from 'react';

// Base button styling to match your slate design system
const baseBtn = "rounded-lg px-3 py-2 text-sm font-medium transition shadow hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed";

export const BtnPrimary = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-indigo-500/90 hover:bg-indigo-600/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnPurple = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-violet-600/90 hover:bg-violet-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnTeal = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-teal-600/90 hover:bg-teal-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnPink = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-pink-600/90 hover:bg-pink-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Additional buttons for your slate design system
export const BtnSlate = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-slate-700/90 hover:bg-slate-800/90 text-slate-200 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnAmber = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-amber-600/90 hover:bg-amber-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnRed = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-rose-600/90 hover:bg-rose-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export const BtnGreen = ({ children, disabled = false, onClick, className = "", ...props }) => (
  <button 
    className={`${baseBtn} bg-emerald-600/90 hover:bg-emerald-700/90 text-white ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);