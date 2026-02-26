import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown } from 'lucide-react';

const plans = [
  {
    name: 'For personals',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for casual job seekers getting started.',
    features: [
      'Search jobs from all sources',
      'Basic filters (title, location)',
      'Up to 3 email alerts',
      'Resume match (5/month)',
      'Community support',
    ],
    cta: 'Free Access',
    highlighted: false,
  },
  {
    name: 'For entrepreneurs',
    price: { monthly: 12, annual: 8 },
    description: 'Unlimited access for serious job seekers.',
    features: [
      'Everything in Free plan',
      'Unlimited email alerts',
      'Advanced filters & sorting',
      'Unlimited resume matches',
      'Priority email support',
      'Export matches as CSV',
      'Early access to new features',
    ],
    cta: 'Subscribe Now',
    highlighted: true,
  },
];

export function PricingSection() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-20 lg:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 landing-gradient-radial pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="landing-section-badge mb-6 mx-auto">
            <Crown className="w-4 h-4" />
            <span>Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find Your Perfect Plan
          </h2>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? 'bg-blue-600' : 'bg-[#1a2344]'
              }`}
              aria-label="Toggle annual pricing"
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual{' '}
              <span className="text-green-400 text-xs font-bold">Save 33%</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'landing-card border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                  : 'landing-card'
              }`}
            >
              {/* Badge for highlighted */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-blue-600">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-sm font-medium text-gray-400 mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-gray-500 text-sm">/month</span>
              </div>
              <p className="text-sm text-gray-400 mb-8">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate('/signup')}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  plan.highlighted
                    ? 'landing-btn-primary'
                    : 'landing-btn-secondary'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
