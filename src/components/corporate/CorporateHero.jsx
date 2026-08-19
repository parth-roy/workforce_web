import React from 'react';

export default function CorporateHero({ title, subtitle }) {
  return (
    <div className="bg-slate-900 text-white py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Metro Mitra for Enterprise</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById('requirement-builder')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
            Build a Workforce Requirement
          </button>
          <button onClick={() => document.getElementById('dashboard-preview')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 border border-slate-600 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
            Explore Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
