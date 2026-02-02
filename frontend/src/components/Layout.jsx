import React from 'react';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Job Aggregator</h1>
        <p className="text-blue-100 text-sm">Find jobs • Manage alerts • Match your resume</p>
      </div>
    </header>
  );
}

export function Nav({ active, setActive }) {
  const tabs = [
    { id: 'search', label: 'Search Jobs' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'resume', label: 'Resume Match' },
  ];

  return (
    <nav className="bg-gray-100 border-b">
      <div className="max-w-6xl mx-auto px-4 flex gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`py-3 px-4 font-medium transition ${
              active === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-8">
      <p>&copy; 2026 Job Aggregator. Phase 7 - Minimal Frontend.</p>
    </footer>
  );
}
