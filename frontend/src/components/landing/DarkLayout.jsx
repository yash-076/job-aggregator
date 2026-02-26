import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';

/**
 * DarkLayout - wraps public pages (signin, signup, about, blog, etc.)
 * Uses the same dark theme as the landing page with shared navbar/footer.
 */
export function DarkLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#060918] text-white overflow-x-hidden">
      <LandingNavbar />
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
