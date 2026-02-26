import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, Sparkles } from 'lucide-react';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 landing-gradient-radial opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="landing-card rounded-2xl p-10 sm:p-14 border border-blue-500/20 shadow-[0_0_60px_rgba(59,130,246,0.1)]">
          <div className="landing-section-badge mb-6 mx-auto">
            <Sparkles className="w-4 h-4" />
            <span>Get Started Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Your Job Search{' '}
            <span className="text-gradient">Today</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of job seekers who use AI-powered matching to find their perfect role. It's free, fast, and intelligent.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="landing-btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/alerts')}
              className="landing-btn-secondary px-8 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Bell className="w-4 h-4" />
              Set Up Alerts
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            No credit card required · Free plan available forever
          </p>
        </div>
      </div>
    </section>
  );
}
