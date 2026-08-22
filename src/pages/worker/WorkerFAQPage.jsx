import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { WorkerFAQSEO } from '../../seo/pageMetadata';
import {  ChevronDown, ChevronUp , Phone } from "lucide-react";

const FAQ_DATA = [
  {
    category: 'Joining & Onboarding',
    questions: [
      { q: 'How do I join as a worker?', a: 'You need to download the Workforce App, create an account, select your preferred roles, and submit your ID and bank details for verification.' },
      { q: 'What information do I need to provide?', a: 'You must provide your full name, age, active phone number, profile photo, government ID (Aadhaar/Voter ID), proof of address, and bank details.' },
      { q: 'Is there a fee to join?', a: 'No, joining the Metro Mitra platform as a worker is completely free.' }
    ]
  },
  {
    category: 'Finding & Accepting Work',
    questions: [
      { q: 'How do I find jobs?', a: 'Once verified, you can browse available jobs in the app based on your selected roles and location preferences.' },
      { q: 'Can I choose my role?', a: 'Yes. During onboarding, you select the roles you are qualified for (e.g., Warehouse Helper, Electrician). You can only accept jobs matching your approved roles.' },
      { q: 'Can I choose my location?', a: 'Yes. You can filter jobs by location to find work near you.' },
      { q: 'What happens after accepting work?', a: 'You will receive the worksite details. You are expected to arrive on time and complete the assigned tasks or shift.' }
    ]
  },
  {
    category: 'Work Completion',
    questions: [
      { q: 'How is work marked as completed?', a: 'After finishing your tasks or shift, you mark the job as complete in the app. The hirer will then review and confirm completion.' },
      { q: 'Do I need to bring my own tools?', a: 'This depends on the role. Technical roles (like Plumbers or Electricians) typically require you to bring standard tools. General labor roles (like Loaders) do not.' }
    ]
  }
];

export default function WorkerFAQPage() {
  const [openIndex, setOpenIndex] = useState('0-0');

  const toggle = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <>
      <SEO {...WorkerFAQSEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black mb-4">Worker FAQ & Help</h1>
          <p className="text-xl text-slate-300">
            Find answers to common questions about working with Metro Mitra.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-12">
          {FAQ_DATA.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((faq, qIdx) => {
                  const id = `${sIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={qIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => toggle(id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900">{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                          <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <Link to="/contact" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"><Phone size={18} /> Contact Support</Link>
        </div>
      </main>
    </>
  );
}