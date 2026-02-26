import React from 'react';
import { Upload, SlidersHorizontal, Brain, BellRing, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'Upload Resume',
    description: 'Upload your PDF resume. Our parser extracts your skills, experience, and qualifications automatically.',
  },
  {
    icon: SlidersHorizontal,
    number: '02',
    title: 'Set Filters',
    description: 'Choose your preferences — job title, location, company, and type. Narrow down to the roles you want.',
  },
  {
    icon: Brain,
    number: '03',
    title: 'Get AI Matches',
    description: 'Our AI matches your resume against available jobs and ranks them by compatibility score.',
  },
  {
    icon: BellRing,
    number: '04',
    title: 'Set Up Alerts',
    description: 'Create email alerts with custom filters. Get notified instantly when new matching jobs appear.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 landing-gradient-radial-bottom pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="landing-section-badge mb-6 mx-auto">
            <ArrowRight className="w-4 h-4" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            More Powerful With{' '}
            <span className="text-gradient">Automation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From resume upload to job alerts — everything is streamlined for you.
            Just follow these simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="landing-card rounded-xl p-6 h-full transition-all duration-300">
                {/* Step number */}
                <div className="text-4xl font-bold text-blue-500/10 mb-4 group-hover:text-blue-500/20 transition-colors">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <step.icon className="w-5 h-5 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector arrow (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-5 h-5 text-blue-500/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive prompt section */}
        <div className="mt-16 landing-card rounded-xl p-6 sm:p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-[#0a0f1a] rounded-lg px-4 py-3 border border-landing-border mb-6">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-gray-500 text-sm">Type something to improve your search...</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Job Search', count: '500+' },
              { label: 'Resume Match', count: 'AI' },
              { label: 'Email Alerts', count: '∞' },
              { label: 'Filters', count: '10+' },
              { label: 'Sources', count: '6+' },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-300 bg-[#111833] border border-landing-border hover:border-blue-500/30 transition-colors cursor-default"
              >
                {tag.label}
                <span className="text-blue-400">{tag.count}</span>
              </span>
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-4">
            Need your button centered? Want a dark mode variant? Just type it.
            With search-based customization, you're always in control.
          </p>
        </div>
      </div>
    </section>
  );
}
