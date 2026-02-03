import React from 'react';

/**
 * EmptyState component for when no data is available
 * Provides helpful messaging and optional actions
 * Dark mode support included
 */
export function EmptyState({
  title = 'No results found',
  description = '',
  icon = '📭',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
