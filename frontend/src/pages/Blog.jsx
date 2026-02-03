import React from 'react';
import { Card } from '../components/Card';

export function Blog() {
  const posts = [
    {
      id: 1,
      title: 'Top 10 Job Search Tips for 2025',
      date: 'Feb 3, 2025',
      excerpt: 'Learn the most effective strategies to land your dream job in today\'s competitive market.',
      category: 'Career Advice',
    },
    {
      id: 2,
      title: 'How AI is Changing Recruitment',
      date: 'Jan 28, 2025',
      excerpt: 'Explore how artificial intelligence is transforming the hiring process and what it means for job seekers.',
      category: 'Technology',
    },
    {
      id: 3,
      title: 'Building the Perfect Resume',
      date: 'Jan 20, 2025',
      excerpt: 'Essential tips and best practices for creating a resume that stands out to employers.',
      category: 'Career Advice',
    },
    {
      id: 4,
      title: 'Remote Work Guide for 2025',
      date: 'Jan 15, 2025',
      excerpt: 'Everything you need to know about finding and succeeding in remote positions.',
      category: 'Remote Work',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Job Aggregator Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tips, insights, and industry news to help you succeed in your job search
        </p>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{post.date}</span>
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
            <a href="#" className="inline-flex text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Read More →
            </a>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get job search tips and industry news delivered to your inbox</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
