import React, { useState } from 'react';
import SEO from '../../components/ui/SEO';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    id: 'general',
    title: 'General',
    faqs: [
      { q: 'What is Metro Mitra?', a: 'Metro Mitra is a gig workforce platform that connects skilled workers with individuals and businesses across West Bengal. We serve individual hirers (home services), contractors (multi-worker teams), and corporate clients (enterprise staffing).' },
      { q: 'Which areas does Metro Mitra operate in?', a: 'We are currently active in Barrackpore, Dankuni, Kolkata, and surrounding areas in West Bengal. We are expanding as our worker network grows.' },
      { q: 'How does task completion work?', a: 'Workers complete the assigned task and the hirer confirms completion via a one-time OTP code. Payment or closure is not processed until the hirer confirms.' },
      { q: 'Is Metro Mitra available on mobile?', a: 'The Metro Mitra Worker App is available for workers. Hirers can use the web platform at metromitra.in to browse and book services.' },
    ],
  },
  {
    id: 'workers',
    title: 'For Workers',
    faqs: [
      { q: 'How do I register as a worker?', a: 'Download the Metro Mitra Worker App, create your profile with your name, phone number, and skill category, then complete the basic verification steps.' },
      { q: 'What jobs are available?', a: 'Roles include Warehouse Helper, Electrician, Cleaner, Plumber, Moving Helper, and more. Availability depends on your location and skill profile.' },
      { q: 'How are payments handled?', a: 'Payment details and timing are specified per job. Task completion must be OTP-confirmed before any payment is released. Review the job terms before accepting.' },
      { q: 'Can I choose my own schedule?', a: 'Many gig opportunities offer flexible scheduling. Shift types (day, evening, night) vary by job and employer requirement.' },
    ],
  },
  {
    id: 'hirers',
    title: 'For Individual Hirers',
    faqs: [
      { q: 'How do I book a service?', a: 'Go to metromitra.in/services, select the service you need (electrician, plumber, cleaner, etc.), and complete the booking form with your location and timing.' },
      { q: 'Do I need to create an account?', a: 'The current frontend is a prototype — no account creation is required for the form demo. Live booking will require phone number verification.' },
      { q: 'How are workers matched?', a: 'Workers are matched based on availability in your location and the skill category of the task. You do not manually select individual workers in the current flow.' },
      { q: 'What if the worker does not arrive?', a: 'In the live platform, you can escalate through the app. This escalation system is part of the backend integration currently in progress.' },
    ],
  },
  {
    id: 'contractors',
    title: 'For Contractors',
    faqs: [
      { q: 'Can I hire multiple workers at once?', a: 'Yes. The Contractor pathway at /for-contractors allows you to specify multiple roles and quantities for a single worksite or project.' },
      { q: 'What shift options are available?', a: 'Day, afternoon, and night shifts are available. Rotating shift options can be specified in the workforce requirement builder.' },
      { q: 'Is there a minimum team size?', a: 'No minimum team size is specified. You can request from a single worker up to larger teams depending on availability in your area.' },
      { q: 'How do I describe my workforce requirement?', a: 'Use the Contractor Requirement Builder at /for-contractors to specify roles, quantities, location, and shift preferences.' },
    ],
  },
  {
    id: 'companies',
    title: 'For Companies',
    faqs: [
      { q: 'What is the Corporate workforce solution?', a: 'Corporate clients can request multi-role, multi-location workforce deployments for ongoing operations — logistics, manufacturing, hospitality, and retail.' },
      { q: 'Can I manage workforce across multiple sites?', a: 'The Corporate pathway at /for-companies is designed for multi-location teams. Dashboard features are part of the backend integration roadmap.' },
      { q: 'Are compliance documents available?', a: 'Worker profile verification is built into the platform. Compliance documentation features are part of the enterprise integration scope.' },
      { q: 'How do I start as a corporate client?', a: 'Contact us via the form at /contact with your organization name, workforce requirement, and location. Our team will follow up.' },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});
  const [openSections, setOpenSections] = useState({ general: true, workers: false, hirers: false, contractors: false, companies: false });

  const toggleItem = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (id) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredSections = FAQ_SECTIONS.map(section => ({
    ...section,
    faqs: searchQuery
      ? section.faqs.filter(f =>
          f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : section.faqs,
  })).filter(s => s.faqs.length > 0);

  return (
    <>
      <SEO
        title="FAQ — Metro Mitra Help & Answers"
        description="Answers to common questions about Metro Mitra — for workers, individual hirers, contractors, and corporate clients."
        canonical="https://metromitra.in/faq"
        robots="index, follow"
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-300 mb-8">Find answers across all platform use cases.</p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-slate-900 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-3xl py-16">
        {filteredSections.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg mb-3">No results found for "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-emerald-600 font-semibold hover:underline">Clear search</button>
          </div>
        )}

        <div className="space-y-4">
          {filteredSections.map(section => (
            <div key={section.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900 text-lg">{section.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{section.faqs.length}</span>
                  {openSections[section.id] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* FAQ items */}
              {openSections[section.id] && (
                <div className="border-t border-slate-100">
                  {section.faqs.map((faq, idx) => {
                    const key = `${section.id}-${idx}`;
                    const isOpen = openItems[key];
                    return (
                      <div key={idx} className="border-b border-slate-100 last:border-0">
                        <button
                          onClick={() => toggleItem(section.id, idx)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-slate-800 pr-4">{faq.q}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5">
                            <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h2>
          <p className="text-slate-600 mb-6">Our team is here to help. Reach out via the contact form.</p>
          <a href="/contact" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Contact Us
          </a>
        </div>
      </main>
    </>
  );
}
