import React from 'react';

export default function FAQSection({ faqs }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="py-12 border-t mt-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-slate-50 p-6 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
            <p className="text-slate-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
