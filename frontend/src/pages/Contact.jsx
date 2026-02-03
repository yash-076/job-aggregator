import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorMessage, SuccessMessage } from '../components/ErrorMessage';

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

    // Here you would typically send the form data to a backend
    console.log('Form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Get in Touch">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} />}
            {submitted && <SuccessMessage message="Thank you for your message! We'll get back to you soon." />}

            <Input
              label="Name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                placeholder="Your message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>

        <Card title="Contact Information">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <a href="mailto:contact@jobag.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                contact@jobag.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
              <p className="text-gray-600 dark:text-gray-400">We typically respond within 24 hours</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Support</h3>
              <p className="text-gray-600 dark:text-gray-400">For technical support, please check our FAQ or email support@jobag.com</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
