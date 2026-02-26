import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const tabs = ['General', 'Features', 'Privacy', 'Pricing'];

const faqData = {
  General: [
    {
      q: 'What is RoleSync?',
      a: 'RoleSync is a platform that collects job listings from multiple sources (Adzuna, company career pages, etc.) into one searchable interface. It also offers AI-powered resume matching and email alerts.',
    },
    {
      q: 'Do I need to create an account?',
      a: 'Yes, you need to sign up to access job search, alerts, and resume matching features. Signing up is free and takes under a minute.',
    },
    {
      q: 'Which job sources do you aggregate from?',
      a: 'We currently aggregate from Adzuna API, Google Careers, Meta Careers, Microsoft Careers, and more sources are being added regularly.',
    },
    {
      q: 'Is RoleSync free to use?',
      a: 'Yes! The free plan gives you access to search, basic filters, up to 3 alerts, and 5 resume matches per month. The Pro plan unlocks unlimited features.',
    },
  ],
  Features: [
    {
      q: 'How does resume matching work?',
      a: 'Upload your PDF resume and our AI parser extracts your skills, experience, and qualifications. It then compares them against available job listings and returns a ranked match score.',
    },
    {
      q: 'What design tools are supported?',
      a: 'We support standard PDF resumes. Simply upload your resume in PDF format and our intelligent parser handles the rest.',
    },
    {
      q: 'Can I customize the generated alerts?',
      a: 'Absolutely! Each alert can have custom filters for job title, company, location, and job type. You can create multiple alerts with different criteria.',
    },
    {
      q: 'What happens to my resume after matching?',
      a: 'Your resume is processed in memory for matching and is not permanently stored on our servers. We only keep the extracted skills for future matches.',
    },
  ],
  Privacy: [
    {
      q: 'Is my data secure?',
      a: 'Yes. We use industry-standard encryption and security practices. Your personal data is never shared with third parties without your consent.',
    },
    {
      q: 'Do you sell my data?',
      a: 'Never. We do not sell, trade, or share your personal information with any third party. Your job search data stays private.',
    },
    {
      q: 'Can I delete my account?',
      a: 'Yes, you can delete your account at any time. All your data, alerts, and search history will be permanently removed from our systems.',
    },
  ],
  Pricing: [
    {
      q: 'What\'s included in the free plan?',
      a: 'The free plan includes job search across all sources, basic filters, up to 3 email alerts, and 5 resume matches per month.',
    },
    {
      q: 'Can I upgrade or downgrade later?',
      a: 'Yes, you can switch plans at any time. When upgrading, you get immediate access. When downgrading, the change takes effect at the end of your billing cycle.',
    },
    {
      q: 'Is there a free trial for Pro?',
      a: 'We occasionally offer free trial periods. Sign up for the free plan and you\'ll be notified about any upcoming trial offers.',
    },
  ],
};

export function FAQSection() {
  const [activeTab, setActiveTab] = useState('General');
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenIndex(null);
  };

  return (
    <section id="faq" className="relative py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="landing-section-badge mb-6 mx-auto">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-gray-400 hover:text-white bg-[#0d1225] border border-landing-border hover:border-blue-500/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqData[activeTab]?.map((faq, index) => (
            <div
              key={index}
              className="landing-card rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <p className="text-center text-sm text-gray-500 mt-10">
          For any unanswered questions, reach out to us at{' '}
          <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">
            Contact page
          </a>
          . We'll be happy to help.
        </p>
      </div>
    </section>
  );
}
