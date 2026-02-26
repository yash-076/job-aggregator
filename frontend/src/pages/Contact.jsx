import React, { useState } from 'react';
import { MessageSquare, Mail, Clock, HelpCircle, Send, User } from 'lucide-react';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    console.log('Form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputClass =
    'w-full bg-[#0d1225] border border-landing-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200';

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'contact@jobag.com', href: 'mailto:contact@jobag.com' },
    { icon: Clock, title: 'Response Time', value: 'Within 24 hours', href: null },
    { icon: HelpCircle, title: 'Support', value: 'support@jobag.com', href: 'mailto:support@jobag.com' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <div className="landing-section-badge mb-6 mx-auto">
          <MessageSquare className="w-4 h-4" />
          <span>Contact</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Get in <span className="text-gradient">Touch</span>
        </h1>
        <p className="text-lg text-gray-400">Have a question or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-3 landing-card rounded-2xl p-8 border border-landing-border">
          <h2 className="text-lg font-semibold text-white mb-6">Send a Message</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          {submitted && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400">Thank you! We'll get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputClass + ' pl-11'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputClass + ' pl-11'} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message here..." rows="5" className={inputClass + ' resize-none'} />
            </div>
            <button type="submit" className="landing-btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-2 space-y-4">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="landing-card rounded-xl p-6 border border-landing-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-gray-400">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
