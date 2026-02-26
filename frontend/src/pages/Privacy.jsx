import React from 'react';
import { Shield } from 'lucide-react';

const sections = [
  {
    title: '1. Introduction',
    content: 'RoleSync ("we", "us", or "our") operates the platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.',
  },
  {
    title: '2. Information Collection and Use',
    items: [
      { label: 'Email Address', text: 'We collect your email address to send you job alerts and notifications.' },
      { label: 'Resume Data', text: 'If you use our resume matching feature, we process your resume to match it with job listings.' },
      { label: 'Usage Data', text: 'We automatically collect information about how you interact with our Service (pages visited, time spent, etc.).' },
    ],
  },
  {
    title: '3. Data Security',
    content: 'The security of your data is important to us but remember that no method of transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect your personal data.',
  },
  {
    title: '4. Third-Party Services',
    content: 'We may use third-party service providers for:',
    list: ['Email delivery and notifications', 'Data analysis and analytics', 'Job data aggregation from various sources'],
  },
  {
    title: '5. Your Rights',
    content: 'You have the right to:',
    list: ['Access your personal data', 'Request deletion of your data', 'Opt-out of marketing communications', 'Port your data in a structured format'],
  },
  {
    title: '6. Changes to Privacy Policy',
    content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
  },
  {
    title: '7. Contact Us',
    content: 'If you have questions about this Privacy Policy, please contact us at:',
    email: 'privacy@jobag.com',
  },
];

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="landing-section-badge mb-6 mx-auto">
          <Shield className="w-4 h-4" />
          <span>Legal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: February 4, 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="landing-card rounded-xl p-6 border border-landing-border">
            <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
            {section.content && <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>}
            {section.items && (
              <div className="space-y-3">
                {section.items.map((item) => (
                  <p key={item.label} className="text-sm text-gray-400"><span className="font-medium text-gray-300">{item.label}:</span> {item.text}</p>
                ))}
              </div>
            )}
            {section.list && (
              <ul className="mt-3 space-y-2">
                {section.list.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.email && (
              <a href={`mailto:${section.email}`} className="inline-block mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">{section.email}</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
