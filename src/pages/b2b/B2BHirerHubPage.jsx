import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { B2BHirerHubSEO } from '../../seo/pageMetadata';

export default function B2BHirerHubPage() {
  const { services } = useWorkforce();
  const b2bServices = services.filter(s => s.audiences?.includes('corporate') || s.audiences?.includes('contractor'));

  return (
    <>
      <SEO {...B2BHirerHubSEO()} />
      <div className="bg-slate-50 min-h-screen pb-20 font-sans">
        
        {/* Enterprise Hero Section */}
        <div className="bg-slate-900 text-white pt-24 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-900"></div>
          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 border border-blue-700 text-blue-300 font-semibold tracking-wider uppercase text-xs mb-6 shadow-sm">
              B2B Workforce Procurement Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Scale your operations with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">structural workforce solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Enterprise-grade manpower procurement for logistics hubs, manufacturing sites, and complex supply chain operations. Connect with verified workforce providers at scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/for-companies" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-600/20">
                Corporate Workspace
              </Link>
              <Link to="/for-contractors" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors">
                Contractor Hub
              </Link>
            </div>
          </div>
        </div>

        {/* Trust/Stats Banner */}
        <div className="border-b bg-white">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-slate-900">Scale</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Workforce Network</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-slate-900">Speed</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Deployment Focus</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-slate-900">Trust</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Verified Profiles</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-black text-slate-900">B2B</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">Enterprise Partners</div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container mx-auto px-4 py-16 max-w-6xl">
          
          {/* Path Selection */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose your operating model</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">We provide tailored procurement workflows based on your operational complexity and geographic scale.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link to="/for-contractors" className="group block bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-blue-700 transition-colors">Contractor & Proprietor</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">Fast, single-location workforce requests. Ideal for site managers needing immediate multi-role deployments.</p>
                <span className="inline-flex items-center text-sm font-bold text-blue-600">
                  Explore Contractor Tools <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
              
              <Link to="/for-companies" className="group block bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-slate-600 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Corporate & Enterprise</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">Centralized procurement for multi-location, multi-shift workforce demand. Build structured supply workflows.</p>
                  <span className="inline-flex items-center text-sm font-bold text-white">
                    Explore Corporate Workspace <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Workforce Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {b2bServices.map(service => (
                <div key={service.slug} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all flex flex-col group">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {service.icon}
                      </div>
                      <h3 className="font-bold text-xl text-slate-900">{service.name}</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.roles.slice(0, 3).map(roleSlug => (
                        <span key={roleSlug} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-md font-medium border border-slate-200">
                          {roleSlug.replace('-', ' ')}
                        </span>
                      ))}
                      {service.roles.length > 3 && <span className="text-xs text-slate-500 py-1.5 font-medium">+{service.roles.length - 3} more</span>}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50/50 border-t flex justify-between items-center group-hover:bg-blue-50/50 transition-colors">
                    <Link to={`/hire-workers/${service.slug}`} className="text-sm font-bold text-blue-600 group-hover:text-blue-700 flex items-center">
                      View full catalog <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </main>
      </div>
    </>
  );
}
