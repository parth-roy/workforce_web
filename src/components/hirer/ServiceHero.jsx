import React from 'react';

export default function ServiceHero({ title, subtitle, children }) {
  return (
    <div className="bg-white border-b py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
