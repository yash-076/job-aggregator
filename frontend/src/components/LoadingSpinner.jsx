import React from 'react';

/**
 * Loading spinner for async operations
 * Provides visual feedback during data fetching
 * Dark mode support included
 */
export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-slate-600 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin`} />
      {message && <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{message}</p>}
    </div>
  );
}

/**
 * Inline loading state for buttons
 * Dark mode support included
 */
export function ButtonSpinner({ size = 'sm' }) {
  const sizeClasses = {
    sm: 'w-3 h-3 mr-2',
    md: 'w-4 h-4 mr-2',
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
  );
}
