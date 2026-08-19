import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';

export default function ServiceCard({ service }) {
  const isB2B = service.audiences?.includes('corporate') || service.audiences?.includes('contractor');
  const targetRoute = isB2B ? routes.b2bService.builder(service.slug) : routes.individualService.builder(service.slug);
  
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all p-6 flex flex-col h-full relative">
      {service.status === 'coming-soon' && (
        <span className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          Coming Soon
        </span>
      )}
      
      <div className="flex items-center mb-4 gap-3">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-xl">
          {service.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {isB2B ? 'Business' : 'Individual'}
          </span>
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 flex-grow">{service.description}</p>
      
      <Link 
        to={targetRoute}
        className="w-full text-center bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Request {service.name}
      </Link>
    </div>
  );
}
