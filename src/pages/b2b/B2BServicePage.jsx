import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import { B2BServiceSEO } from '../../seo/pageMetadata';
import { RelatedServices, RelatedLocations, RelatedRoles } from '../../components/seo/RelatedLinks';

export default function B2BServicePage() {
  const { service: serviceSlug } = useParams();
  const { getServiceBySlug, roles } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  
  // Guard against missing services or non-B2B services
  if (!service || (!service.audiences?.includes('corporate') && !service.audiences?.includes('contractor'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border max-w-md">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h2>
          <p className="text-slate-500 mb-6">The requested workforce category does not exist or is not available for B2B procurement.</p>
          <Link to="/hire-workers" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Return to Hub
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'B2B Procurement', path: '/hire-workers' },
    { label: service.name }
  ];

  const serviceRoles = service.roles.map(rSlug => roles.find(r => r.slug === rSlug)).filter(Boolean);

  return (
    <>
      <SEO {...B2BServiceSEO(service)} />
      <div className="bg-slate-50 min-h-screen pb-20 font-sans">
        
        {/* Enterprise Hero */}
        <div className="bg-slate-900 text-white pt-12 pb-24 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mask-image:linear-gradient(to_left,black,transparent)"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <Breadcrumbs items={breadcrumbs} theme="dark" />
            <div className="mt-12 max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10">
                  {service.icon}
                </div>
                <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm border-l border-white/20 pl-3">
                  Workforce Category
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
                {service.name} Solutions
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/for-companies" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/50">
                  Plan Corporate Demand
                </Link>
                <Link to="/for-contractors" className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10">
                  Request as Contractor
                </Link>
              </div>
            </div>
          </div>
        </div>
      
        <main className="container mx-auto px-4 -mt-12 max-w-6xl relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
              {/* Roles Section */}
              <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Available Roles</h2>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                    {serviceRoles.length} Roles
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serviceRoles.map(role => (
                    <div key={role.slug} className="group p-5 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{role.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{role.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Use Cases Section */}
              {service.useCases && service.useCases.length > 0 && (
                <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Target Use Cases</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {service.useCases.map((uc, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="mt-1 bg-green-100 text-green-600 p-1 rounded-full shrink-0">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-slate-700 text-sm font-medium">{uc}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Operating Model Section */}
              <section className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white overflow-hidden relative">
                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h2 className="text-2xl font-bold mb-8 relative z-10">Select Procurement Workflow</h2>
                <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Contractor Hub</h3>
                    <p className="text-sm text-slate-400 mb-6 h-10">Rapid deployment for single-location operational needs.</p>
                    <Link to="/for-contractors" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300">
                      Build Request <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                  <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-800/50 hover:bg-blue-900/50 transition-colors">
                    <div className="w-10 h-10 bg-blue-800/50 rounded-lg flex items-center justify-center mb-4 text-blue-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Corporate Workspace</h3>
                    <p className="text-sm text-slate-400 mb-6 h-10">Structural planning for multi-location, multi-shift demands.</p>
                    <Link to="/for-companies" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300">
                      Build Corporate Plan <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Procurement Process
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:h-full before:w-[2px] before:bg-slate-100">
                  {[
                    { title: 'Define Structure', desc: 'Select required roles, headcounts, and specific skill tiers.' },
                    { title: 'Map Locations', desc: 'Assign requirements to specific operational sites and shifts.' },
                    { title: 'Platform Routing', desc: 'Automated matching with verified workforce networks.' },
                    { title: 'Deployment', desc: 'Monitor active headcount and manage roster attendance.' }
                  ].map((step, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="w-8 h-8 shrink-0 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-sm">
                        {i + 1}
                      </div>
                      <div className="pt-1">
                        <p className="font-bold text-sm text-slate-900 mb-1">{step.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 text-center">
                    Need custom API integration? <br/>
                    <a href="#" className="text-blue-600 font-bold hover:underline">Contact Enterprise Sales</a>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
