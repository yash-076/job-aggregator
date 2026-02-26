import React from 'react';
import { BookOpen, ArrowRight, Mail } from 'lucide-react';

const posts = [
  {
    id: 1,
    title: 'Top 10 Job Search Tips for 2026',
    date: 'Feb 3, 2026',
    excerpt: 'Learn the most effective strategies to land your dream job in today\'s competitive market.',
    category: 'Career Advice',
    color: 'blue',
  },
  {
    id: 2,
    title: 'How AI is Changing Recruitment',
    date: 'Jan 28, 2026',
    excerpt: 'Explore how artificial intelligence is transforming the hiring process and what it means for job seekers.',
    category: 'Technology',
    color: 'purple',
  },
  {
    id: 3,
    title: 'Building the Perfect Resume',
    date: 'Jan 20, 2026',
    excerpt: 'Essential tips and best practices for creating a resume that stands out to employers.',
    category: 'Career Advice',
    color: 'blue',
  },
  {
    id: 4,
    title: 'Remote Work Guide for 2026',
    date: 'Jan 15, 2026',
    excerpt: 'Everything you need to know about finding and succeeding in remote positions.',
    category: 'Remote Work',
    color: 'green',
  },
];

const categoryColors = {
  blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  green: 'bg-green-500/10 text-green-400 border border-green-500/20',
};

export function Blog() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="landing-section-badge mb-6 mx-auto">
          <BookOpen className="w-4 h-4" />
          <span>Blog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          RoleSync <span className="text-gradient">Blog</span>
        </h1>
        <p className="text-lg text-gray-400">
          Tips, insights, and industry news to help you succeed in your job search
        </p>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="landing-card rounded-xl p-6 border border-landing-border hover:border-blue-500/20 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{post.date}</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[post.color]}`}>
                    {post.category}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Read More <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="landing-card rounded-2xl p-8 border border-blue-500/20 text-center shadow-[0_0_30px_rgba(59,130,246,0.08)]">
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-gray-400 text-sm mb-6">Get job search tips and industry news delivered to your inbox</p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-[#0d1225] border border-landing-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <button className="landing-btn-primary px-6 py-3 rounded-xl text-sm font-semibold shrink-0">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
