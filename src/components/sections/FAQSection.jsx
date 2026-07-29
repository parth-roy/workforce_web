import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection({
  faqs = [],
  heading = 'Frequently Asked Questions',
}) {
  const [open, setOpen] = useState(null)

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="text-center mb-10">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">{heading}</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                id={`faq-btn-${i}`}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-sm md:text-base font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                className={`faq-answer ${open === i ? 'open' : ''}`}
                style={{ maxHeight: open === i ? '400px' : '0' }}
              >
                <div className="px-6 pb-5">
                  <div className="h-px bg-slate-100 mb-4" />
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
