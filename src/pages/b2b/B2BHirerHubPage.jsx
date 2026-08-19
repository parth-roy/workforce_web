import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import ServiceCard from '../../components/hirer/ServiceCard';
import SEO from '../../components/ui/SEO';
import { B2BHirerHubSEO } from '../../seo/pageMetadata';

export default function B2BHirerHubPage() {
  const { services } = useWorkforce();
  // B2B should show services for corporate or contractor
  const b2bServices = services.filter(s => s.audiences?.includes('corporate') || s.audiences?.includes('contractor'));

  return (
    <>
      <SEO {...B2BHirerHubSEO()} />
      <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">B2B Workforce Procurement</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Scale your operations with structural workforce solutions
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            From temporary manpower for warehouse spikes to centralized workforce request management for corporate logistics hubs.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Workforce Categories</h2>
          <p className="text-slate-600">Select a workforce category to structure your operational requirements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {b2bServices.map(service => (
            <div key={service.slug} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{service.icon}</span>
                  <h3 className="font-bold text-lg text-slate-900">{service.name}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.roles.slice(0, 3).map(roleSlug => (
                    <span key={roleSlug} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                      {roleSlug.replace('-', ' ')}
                    </span>
                  ))}
                  {service.roles.length > 3 && <span className="text-xs text-slate-400 py-1">+{service.roles.length - 3} more</span>}
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                <Link to={`/hire-workers/${service.slug}`} className="text-sm font-bold text-blue-600 hover:underline">
                  View capabilities →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-4">Contractor & Proprietor Operations</h3>
            <p className="text-slate-600 mb-6">Manage multi-role, single-location operational requests rapidly.</p>
            <Link to="/for-contractors" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
              Contractor Experience
            </Link>
          </div>
          <div className="bg-slate-900 text-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-4">Corporate & Enterprise Workflows</h3>
            <p className="text-slate-300 mb-6">Structure complex multi-location, multi-shift workforce demand centrally.</p>
            <Link to="/for-companies" className="inline-block px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100">
              Corporate Experience
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
