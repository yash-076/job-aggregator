import React from 'react';

/**
 * Error message component for displaying validation and API errors
 * Can be inline in forms or as an alert
 * Dark mode support included
 */
export function ErrorMessage({ message, onDismiss, dismissible = false }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-red-800 dark:text-red-300 flex items-start justify-between transition-colors duration-200">
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">⚠️</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm transition-colors duration-200"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Success message component
 * Dark mode support included
 */
export function SuccessMessage({ message, onDismiss, dismissible = true }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 text-green-800 dark:text-green-300 flex items-start justify-between transition-colors duration-200">
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">✓</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm transition-colors duration-200"
          aria-label="Dismiss message"
        >
          ✕
        </button>
      )}
    </div>
  );
}
