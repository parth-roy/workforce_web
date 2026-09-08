import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { useCity } from '../../context/CityContext';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import { B2BServiceLocationSEO } from '../../seo/pageMetadata';
import { RelatedServices, RelatedLocations, RelatedRoles } from '../../components/seo/RelatedLinks';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function B2BServiceLocationPage() {
  const { service: serviceSlug, location: locSlug } = useParams();
  const { getServiceBySlug, getLocationBySlug, roles } = useWorkforce();
  const { currentCity, setCity } = useCity();
  
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locSlug) || (locSlug ? {
    id: `loc-${locSlug}`,
    slug: locSlug,
    name: locSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    state: 'India',
    localPricingConfig: { minimumFare: 300 },
    description: `Enterprise and contractor ${service?.name || 'workforce'} solutions in ${locSlug.replace(/-/g, ' ')}.`,
    context: `${locSlug.replace(/-/g, ' ')} has active industrial, commercial, and residential construction sites requiring dependable staffing.`
  } : null);

  // Synchronize global CityContext with viewed location
  useEffect(() => {
    if (location && currentCity?.slug !== location.slug) {
      setCity({
        name: location.name,
        slug: location.slug,
        state: location.state || 'India',
        region: location.state || 'India',
      }, true);
    }
  }, [location, currentCity?.slug, setCity]);
  
  if (!service || !location) {
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
        <div className="bg-slate-900 text-white py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <Breadcrumbs items={breadcrumbs} theme="dark" />
            <div className="mt-8">
              <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Commercial Workforce Procurement</span>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Bulk {service.name} Workforce in {location.name}
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mb-8 leading-relaxed">
                Deploy verified {service.name.toLowerCase()} crews, shift workers, and skilled manpower for your projects and facilities in {location.name}, {location.state}.
              </p>
            </div>
          </div>
        </div>
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Direct Worker Contact Banner — Right After Hero */}
        <div className="mb-10">
          <DirectContactBanner
            serviceName={service.name}
            cityName={location.name}
            serviceSlug={service.slug}
            citySlug={location.slug}
            variant="default"
          />
        </div>

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
