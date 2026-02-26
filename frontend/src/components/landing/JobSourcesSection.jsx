import React from 'react';

const sources = [
  { name: 'Adzuna', accent: '#2eb872' },
  { name: 'Google', accent: '#4285f4' },
  { name: 'Meta', accent: '#0668e1' },
  { name: 'Microsoft', accent: '#00a4ef' },
  { name: 'LinkedIn', accent: '#0a66c2' },
  { name: 'Indeed', accent: '#2164f3' },
];

export function JobSourcesSection() {
  return (
    <section className="py-16 border-y border-landing-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8 tracking-wider uppercase">
          Aggregating jobs from top platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {sources.map((source) => (
            <div
              key={source.name}
              className="group flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: source.accent }}
              />
              <span className="text-lg sm:text-xl font-bold text-gray-400 group-hover:text-white transition-colors tracking-tight">
                {source.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
