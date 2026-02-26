import React from 'react';
import { AppNavbar } from './AppNavbar';
import { LandingFooter } from './LandingFooter';

/**
 * AppDarkLayout - wraps protected/authenticated pages (search, alerts, resume)
 * Uses the same dark theme with an app-specific navbar showing tabs.
 */
export function AppDarkLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#060918] text-white overflow-x-hidden">
      <AppNavbar />
      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
