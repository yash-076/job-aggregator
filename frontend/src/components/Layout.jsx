import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * Header component with improved branding and visual hierarchy
 * Uses a more modern, minimal design with better contrast
 * Includes theme toggle button
 */
export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            {/* Logo/Brand */}
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Aggregator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Discover opportunities • Manage alerts • Match your resume
          </p>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

/**
 * Navigation component with improved active state and accessibility
 * Uses semantic HTML and better focus management
 */
export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'search', label: 'Search Jobs', icon: '🔍', path: '/search' },
    { id: 'alerts', label: 'Alerts', icon: '🔔', path: '/alerts' },
    { id: 'resume', label: 'Resume Match', icon: '📄', path: '/resume' },
  ];

  const isActive = (path) => location.pathname === path || (path === '/search' && location.pathname === '/');

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              aria-current={isActive(tab.path) ? 'page' : undefined}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                isActive(tab.path)
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/**
 * Footer component with meaningful content and links
 * Provides useful information and maintains brand consistency
 */
export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleLinkClick('/search')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Search Jobs
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/alerts')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Alerts
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/resume')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Resume Match
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleLinkClick('/about')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/blog')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/contact')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleLinkClick('/privacy')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Privacy
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('/terms')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer">
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            &copy; {currentYear} Job Aggregator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
