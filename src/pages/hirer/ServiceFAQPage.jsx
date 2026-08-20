import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ServiceFAQSEO } from '../../seo/pageMetadata';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Requesting a Service',
    questions: [
      { q: 'How does hiring work?', a: 'You select the service you need, provide details about the task, location, and timing, and submit a request. We then match your request with verified workers.' },
      { q: 'What can I request?', a: 'You can request a wide variety of services including general labor (loaders, packers), technical work (electricians, plumbers), and logistics support (delivery associates).' },
      { q: 'Can I choose a specific worker type?', a: 'Yes. When requesting a service, you can specify exactly which roles you need (e.g., requesting both loaders and a supervisor).' }
    ]
  },
  {
    category: 'Location & Scheduling',
    questions: [
      { q: 'How do I provide my location?', a: 'During the request flow, you will be asked to select your city/hub and provide the specific address or landmark for the worksite.' },
      { q: 'How does scheduling work?', a: 'You can schedule a service immediately (ASAP) or for a future date and time. You also specify the expected duration (e.g., a 4-hour shift or a full day).' }
    ]
  },
  {
    category: 'Fulfillment & Review',
    questions: [
      { q: 'How do I review a request?', a: 'Before submitting, you will see a final review screen summarizing the roles, location, timing, and any special instructions you provided.' },
      { q: 'What happens after confirmation?', a: 'Once confirmed, your request is sent to eligible workers nearby. You will be notified when workers accept the job and when they arrive on site.' }
    ]
  }
];

export default function ServiceFAQPage() {
  const [openIndex, setOpenIndex] = useState('0-0');

  const toggle = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <>
      <SEO {...ServiceFAQSEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black mb-4">Hiring FAQ & Help</h1>
          <p className="text-xl text-slate-300">
            Find answers to common questions about hiring services and workers on Metro Mitra.
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
      </main>
    </>
  );
}