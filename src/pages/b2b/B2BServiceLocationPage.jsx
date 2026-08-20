import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import { B2BServiceLocationSEO } from '../../seo/pageMetadata';
import { RelatedServices, RelatedLocations, RelatedRoles } from '../../components/seo/RelatedLinks';

export default function B2BServiceLocationPage() {
  const { service: serviceSlug, location: locSlug } = useParams();
  const { getServiceBySlug, getLocationBySlug, roles } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locSlug);
  
  // Guard against missing items or non-B2B services
  if (!service || !location || (!service.audiences?.includes('corporate') && !service.audiences?.includes('contractor'))) {
    return <div className="text-center py-20 text-2xl font-bold">B2B Service or Location not found</div>;
  }

  const breadcrumbs = [
    { label: 'B2B Procurement', path: '/hire-workers' },
    { label: service.name, path: `/hire-workers/${service.slug}` },
    { label: location.name }
  ];

  return (
    <>
      <SEO {...B2BServiceLocationSEO(service, location)} />
      <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-bold">
        DEVELOPMENT GUARDRAIL: Do not index. This location-specific B2B template relies on backend supply data that is not yet implemented.
      </div>
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} theme="dark" />
          <div className="mt-8">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Local Workforce Category</span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              {service.name} in {location.name}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
              Plan and request structural {service.name.toLowerCase()} workforce specifically for your operations based in {location.name}.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white border rounded-xl p-8 mb-12 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to build your requirement?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Choose the operational model that fits your organization's workflow for deploying workforce in {location.name}.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/for-contractors" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Contractor Experience
            </Link>
            <Link to="/for-companies" className="px-8 py-4 border border-slate-600 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition-colors">
              Corporate Experience
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Relevant Workforce Roles</h3>
            <ul className="space-y-3">
              {service.roles.map(rSlug => {
                const roleObj = roles.find(r => r.slug === rSlug);
                if (!roleObj) return null;
                return (
                  <li key={rSlug} className="bg-white p-4 border rounded-lg">
                    <span className="font-bold text-slate-900 block">{roleObj.name}</span>
                    <span className="text-sm text-slate-500">{roleObj.description}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
             <h3 className="text-xl font-bold text-slate-900 mb-4">Local Context ({location.name})</h3>
             <div className="bg-slate-100 p-6 rounded-xl border border-dashed border-slate-300">
               <p className="text-slate-500 italic mb-4">
                 Future integration: Local workforce availability, compliance requirements, and specific industrial zones for {location.name} will be populated dynamically by the backend.
               </p>
             </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
