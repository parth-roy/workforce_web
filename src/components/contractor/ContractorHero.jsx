import React from 'react';

export default function ContractorHero({ title, subtitle }) {
  return (
    <div className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}
