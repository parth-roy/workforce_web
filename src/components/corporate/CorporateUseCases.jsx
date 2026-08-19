import React from 'react';

export default function CorporateUseCases() {
  const useCases = [
    { title: 'Warehouse Staffing', desc: 'Deploy loaders, pickers, and helpers across multiple warehouse locations.' },
    { title: 'Logistics Workforce', desc: 'Structure workforce requirements for regional distribution centers.' },
    { title: 'Temporary Manpower', desc: 'Manage seasonal spikes with structured temporary staffing requests.' },
    { title: 'Industrial Workforce', desc: 'Centralize procurement for industrial site helpers and technicians.' }
  ];

  return (
    <section className="py-16 bg-white border-y">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Workforce Solutions by Industry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 border rounded-xl bg-slate-50 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-slate-900 mb-2">{uc.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
