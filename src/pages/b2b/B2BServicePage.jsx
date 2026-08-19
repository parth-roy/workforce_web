import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import { B2BServiceSEO } from '../../seo/pageMetadata';

export default function B2BServicePage() {
  const { service: serviceSlug } = useParams();
  const { getServiceBySlug, roles } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  
  // Guard against missing services or non-B2B services
  if (!service || (!service.audiences?.includes('corporate') && !service.audiences?.includes('contractor'))) {
    return <div className="text-center py-20 text-2xl font-bold">B2B Service not found</div>;
  }

  const breadcrumbs = [
    { label: 'B2B Procurement', path: '/hire-workers' },
    { label: service.name }
  ];

  const serviceRoles = service.roles.map(rSlug => roles.find(r => r.slug === rSlug)).filter(Boolean);

  return (
    <>
      <SEO {...B2BServiceSEO(service)} />
      <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} theme="dark" />
          <div className="mt-8">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Workforce Category</span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {service.name} Services
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Roles Supported</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceRoles.map(role => (
                  <div key={role.slug} className="bg-white p-4 border rounded-xl shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{role.name}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{role.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {service.useCases && service.useCases.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Use Cases</h2>
                <ul className="space-y-3">
                  {service.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-4 border rounded-lg">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span className="text-slate-700">{uc}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="bg-white p-8 border rounded-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Choose your operating model</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Contractor Model</h3>
                  <p className="text-sm text-slate-600 mb-4">Fast operational deployment for a single worksite.</p>
                  <Link to="/for-contractors" className="text-sm font-bold text-blue-600 hover:underline">Build Contractor Request →</Link>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Corporate Model</h3>
                  <p className="text-sm text-slate-600 mb-4">Structural planning across multiple locations and shifts.</p>
                  <Link to="/for-companies" className="text-sm font-bold text-blue-600 hover:underline">Build Corporate Request →</Link>
                </div>
              </div>
            </section>
          </div>
          
          <div>
            <div className="bg-white p-6 border rounded-xl sticky top-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Workforce Request Process</h3>
              <ol className="space-y-4 relative">
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Define Structure</p>
                    <p className="text-xs text-slate-500 mt-1">Select roles, quantities, and operational shifts.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Specify Locations</p>
                    <p className="text-xs text-slate-500 mt-1">Map requirements to your specific deployment sites.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Platform Matching</p>
                    <p className="text-xs text-slate-500 mt-1">Requests are routed to the workforce network (Planned capability).</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
