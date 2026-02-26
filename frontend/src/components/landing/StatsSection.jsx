import React from 'react';
import { Star, ThumbsUp, Users, TrendingUp } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '500+', label: 'Jobs Aggregated' },
  { icon: Users, value: '6+', label: 'Job Sources' },
  { icon: Star, value: '95%', label: 'Match Accuracy' },
  { icon: ThumbsUp, value: '24/7', label: 'Alert Monitoring' },
];

const testimonials = [
  {
    name: 'Felix',
    role: 'Frontend Engineer @Google',
    text: "As a React dev, I was skeptical. But the code is genuinely clean, readable, and instantly useful. I use it daily now.",
    rating: 5,
  },
  {
    name: 'Ava',
    role: 'Full Stack Developer',
    text: "A revolutionary platform for job seekers. The resume matching feature is incredible — found my dream job in weeks.",
    rating: 5,
  },
  {
    name: 'Marcus',
    role: 'Freelance Dev @GitHub',
    text: "The alerts feature is a game-changer. I get notified about relevant jobs before anyone else.",
    rating: 5,
  },
  {
    name: 'Sarah',
    role: 'ML Engineer',
    text: "AI-powered matching actually works. Got relevant job matches that traditional platforms missed completely.",
    rating: 5,
  },
];

export function StatsSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Honest Review from Developers
            </h2>
            <p className="text-gray-400 max-w-lg">
              Hear from developers and job seekers who found their next opportunity using RoleSync.
            </p>
          </div>

          <div className="landing-card rounded-xl px-8 py-6 text-center">
            <div className="text-4xl font-bold text-white mb-1">92%</div>
            <p className="text-sm text-gray-400">Positive feedback<br />after using platform</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="landing-card rounded-xl p-6 text-center transition-all duration-300"
            >
              <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="landing-card rounded-xl p-6 transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
