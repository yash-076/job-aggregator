import React from 'react';

/**
 * Button component with multiple variants and states
 * Ensures consistent styling and accessibility across the app
 * Supports dark mode
 */
export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600 focus:ring-gray-500 dark:focus:ring-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:ring-red-500',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700 focus:ring-blue-500 dark:focus:ring-blue-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
