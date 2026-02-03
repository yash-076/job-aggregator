import React from 'react';
import { Card } from '../components/Card';

export function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Job Aggregator</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your centralized platform for discovering jobs and managing your career
        </p>
      </div>

      <Card title="Our Mission">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Job Aggregator is built to simplify your job search process. We combine multiple job sources, 
          intelligent filtering, and smart matching to help you find the perfect opportunity faster.
        </p>
      </Card>

      <Card title="Features">
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
            <span><strong>Job Search:</strong> Browse jobs from multiple sources with advanced filters</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
            <span><strong>Smart Alerts:</strong> Get email notifications for jobs matching your criteria</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
            <span><strong>Resume Matching:</strong> AI-powered matching between your resume and job listings</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 dark:text-blue-400 mr-3">✓</span>
            <span><strong>Dark Mode:</strong> Comfortable viewing in any lighting condition</span>
          </li>
        </ul>
      </Card>

      <Card title="Why Choose Us?">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          We believe job searching shouldn't be frustrating. That's why we're committed to providing:
        </p>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• A clean, intuitive interface</li>
          <li>• Fast, reliable job aggregation</li>
          <li>• Intelligent job matching technology</li>
          <li>• Privacy-first approach to your data</li>
        </ul>
      </Card>
    </div>
  );
}
