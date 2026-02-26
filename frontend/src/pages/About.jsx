import React from 'react';
import { Target, Zap, Shield, Search, Bell, FileText, Sparkles } from 'lucide-react';

const features = [
  { icon: Search, title: 'Job Search', desc: 'Browse jobs from multiple sources with advanced filters' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Get email notifications for jobs matching your criteria' },
  { icon: FileText, title: 'Resume Matching', desc: 'AI-powered matching between your resume and job listings' },
  { icon: Sparkles, title: 'AI Powered', desc: 'Intelligent analysis for better job recommendations' },
];

const values = [
  { icon: Zap, title: 'Fast & Reliable', desc: 'Quick job aggregation from multiple sources in real-time' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data is never shared with third parties without consent' },
  { icon: Target, title: 'Smart Matching', desc: 'Intelligent algorithms to match you with the right jobs' },
];

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center">
        <div className="landing-section-badge mb-4 mx-auto">
          <Target className="w-4 h-4" />
          <span>About Us</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          About Role<span className="text-gradient">Sync</span>
        </h1>
        <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Your centralized platform for discovering jobs, managing alerts, and finding your perfect career match with AI.
        </p>
      </div>

      {/* Mission */}
      <div className="landing-card rounded-2xl p-6 sm:p-8 border border-landing-border">
        <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed">
          RoleSync is built to simplify your job search process. We combine multiple job sources,
          intelligent filtering, and smart matching to help you find the perfect opportunity faster.
          No more switching between dozens of job boards — everything you need in one place.
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="landing-card rounded-xl p-5 border border-landing-border hover:border-blue-500/30 transition-all group">
                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-shadow">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="landing-card rounded-xl p-5 border border-landing-border text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-400">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
