import React from 'react';

/**
 * Card component for consistent content containers
 * Provides proper spacing, shadow, and hover effects
 * Supports dark mode
 */
export function Card({
  children,
  title,
  subtitle,
  footer,
  hoverable = false,
  className = '',
}) {
  return (
    <div
      className={`bg-gray-50 dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600' : ''
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="px-6 py-4">{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
