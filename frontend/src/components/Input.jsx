import React from 'react';

/**
 * Input component with consistent styling and accessibility
 * Supports text, email, number, password, and select inputs
 * Dark mode support included
 */
export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error = '',
  required = false,
  className = '',
  ...props
}) {
  const inputId = props.id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
          error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

/**
 * Select component with consistent styling
 * Dark mode support included
 */
export function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error = '',
  required = false,
  className = '',
  ...props
}) {
  const selectId = props.id || `select-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed bg-white dark:bg-slate-800 text-gray-900 dark:text-white ${
          error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
        } ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
