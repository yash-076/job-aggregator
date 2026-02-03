import React from 'react';
import { Card } from '../components/Card';

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: February 4, 2026</p>
      </div>

      <Card title="1. Introduction">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Job Aggregator ("we", "us", or "our") operates the platform. This page informs you of our policies 
          regarding the collection, use, and disclosure of personal data when you use our Service.
        </p>
      </Card>

      <Card title="2. Information Collection and Use">
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p><strong>Email Address:</strong> We collect your email address to send you job alerts and notifications.</p>
          <p><strong>Resume Data:</strong> If you use our resume matching feature, we process your resume to match it with job listings.</p>
          <p><strong>Usage Data:</strong> We automatically collect information about how you interact with our Service (pages visited, time spent, etc.).</p>
        </div>
      </Card>

      <Card title="3. Data Security">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The security of your data is important to us but remember that no method of transmission over the Internet 
          is 100% secure. We strive to use commercially acceptable means to protect your personal data.
        </p>
      </Card>

      <Card title="4. Third-Party Services">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We may use third-party service providers for:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-3 space-y-2">
          <li>Email delivery and notifications</li>
          <li>Data analysis and analytics</li>
          <li>Job data aggregation from various sources</li>
        </ul>
      </Card>

      <Card title="5. Your Rights">
        <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
          You have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Access your personal data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Port your data in a structured format</li>
        </ul>
      </Card>

      <Card title="6. Changes to Privacy Policy">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
          Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
        </p>
      </Card>

      <Card title="7. Contact Us">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          If you have questions about this Privacy Policy, please contact us at:{' '}
          <a href="mailto:privacy@jobag.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            privacy@jobag.com
          </a>
        </p>
      </Card>
    </div>
  );
}
