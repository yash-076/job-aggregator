import React from 'react';
import { Search, Bell, FileText, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Smart Job Search',
    description: 'Search across multiple job sources with powerful filters. Filter by title, company, location, and job type to find exactly what you need.',
    highlights: ['Multi-source aggregation', 'Advanced filters', 'Real-time results'],
  },
  {
    icon: Bell,
    title: 'Intelligent Alerts',
    description: 'Set up custom job alerts and get notified via email when new jobs match your criteria. Never miss an opportunity again.',
    highlights: ['Custom filters', 'Email notifications', 'Instant matching'],
  },
  {
    icon: FileText,
    title: 'AI Resume Matching',
    description: 'Upload your resume and let our AI match it with available jobs. Get a compatibility score and find positions that fit your skills.',
    highlights: ['PDF parsing', 'Skill matching', 'Ranked results'],
  },
];

const subFeatures = [
  { icon: Zap, label: 'Fast & Reliable' },
  { icon: Shield, label: 'Privacy First' },
  { icon: Globe, label: 'Multiple Sources' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="landing-section-badge mb-6 mx-auto">
            <Zap className="w-4 h-4" />
            <span>AI Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Unleash Your Job Search With{' '}
            <span className="text-gradient">AI Precision</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Combine cutting-edge AI with an intuitive interface. Discover jobs,
            set alerts, and match your resume — all from one platform.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="landing-card rounded-xl p-6 lg:p-8 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{feature.description}</p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Card glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Sub-features */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {subFeatures.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-gray-400">
              <item.icon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
