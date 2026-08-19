import React from 'react';

export default function CorporateProcess() {
  const steps = [
    { num: '01', title: 'Organization Level', desc: 'Centralize your workforce requests across different operational centers.' },
    { num: '02', title: 'Location Planning', desc: 'Map exact workforce requirements to specific deployment sites.' },
    { num: '03', title: 'Role Structuring', desc: 'Define roles, quantities, and specific shift strategies per location.' },
    { num: '04', title: 'Management', desc: 'Future workspace capabilities will handle approvals and deployment reporting.' }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How Enterprise Workforce Management Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <span className="text-5xl font-black text-slate-800 absolute -top-6 -left-2 z-0 select-none">{step.num}</span>
              <div className="relative z-10 pt-4">
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
