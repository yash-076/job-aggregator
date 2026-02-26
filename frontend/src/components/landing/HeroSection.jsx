import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 landing-gradient-radial pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 landing-section-badge mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Job Search</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
          Find Your Dream Job{' '}
          <br className="hidden sm:block" />
          Faster With{' '}
          <span className="text-gradient">AI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          Aggregate jobs from multiple sources, get intelligent alerts,
          and match your resume with the perfect opportunities — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => navigate('/signup')}
            className="landing-btn-primary flex items-center gap-2 text-base"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const el = document.querySelector('#features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="landing-btn-secondary flex items-center gap-2 text-base"
          >
            See Features
          </button>
        </div>

        {/* Hero visual — mockup of the app */}
        <div className="relative max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative rounded-xl overflow-hidden landing-card p-1">
            <div className="rounded-lg bg-[#0a0f1a] p-6 sm:p-8">
              {/* Fake search bar */}
              <div className="flex items-center gap-3 bg-[#111833] rounded-lg px-4 py-3 border border-landing-border mb-6">
                <div className="w-4 h-4 rounded-full bg-blue-500/30" />
                <span className="text-gray-500 text-sm sm:text-base">Search for "Software Engineer" in San Francisco...</span>
              </div>

              {/* Fake job cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', type: 'Full-time', match: '95%' },
                  { title: 'Full Stack Developer', company: 'Meta', location: 'Menlo Park, CA', type: 'Full-time', match: '91%' },
                  { title: 'Backend Engineer', company: 'Microsoft', location: 'Redmond, WA', type: 'Full-time', match: '88%' },
                  { title: 'ML Engineer', company: 'Startup', location: 'Remote', type: 'Contract', match: '85%' },
                ].map((job, i) => (
                  <div
                    key={i}
                    className="bg-[#111833] rounded-lg p-4 border border-landing-border hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                      <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                        {job.match}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{job.company}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glow effect behind the mockup */}
          <div className="absolute -inset-4 bg-blue-500/5 rounded-2xl blur-3xl -z-10" />
        </div>
      </div>
    </section>
  );
}
