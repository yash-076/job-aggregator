import React from 'react';
import { ScrollText } from 'lucide-react';

const sections = [
  {
    title: '1. Agreement to Terms',
    content: 'By accessing and using RoleSync, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
  },
  {
    title: '2. Use License',
    content: 'Permission is granted to temporarily download one copy of the materials on RoleSync for personal, non-commercial transitory viewing only. Under this license you may not:',
    list: [
      'Modify or copy the materials',
      'Use the materials for any commercial purpose or for any public display',
      'Attempt to decompile or reverse engineer any software contained on the platform',
      'Remove any copyright or other proprietary notations from the materials',
      'Transfer the materials to another person or "mirror" the materials on any other server',
    ],
  },
  {
    title: '3. Disclaimer',
    content: 'The materials on RoleSync are provided on an "as is" basis. RoleSync makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.',
  },
  {
    title: '4. Limitations',
    content: 'In no event shall RoleSync or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform.',
  },
  {
    title: '5. Accuracy of Materials',
    content: 'The materials appearing on RoleSync could include technical, typographical, or photographic errors. RoleSync does not warrant that any of the materials on the platform are accurate, complete, or current. RoleSync may make changes to the materials at any time without notice.',
  },
  {
    title: '6. Links',
    content: 'RoleSync has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement. Use of any such linked website is at the user\'s own risk.',
  },
  {
    title: '7. Modifications',
    content: 'RoleSync may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.',
  },
  {
    title: '8. Contact',
    content: 'If you have any questions about these Terms of Service, please contact us at:',
    email: 'legal@jobag.com',
  },
];

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="landing-section-badge mb-6 mx-auto">
          <ScrollText className="w-4 h-4" />
          <span>Legal</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: February 4, 2026</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="landing-card rounded-xl p-6 border border-landing-border">
            <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
            {section.content && <p className="text-sm text-gray-400 leading-relaxed">{section.content}</p>}
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
