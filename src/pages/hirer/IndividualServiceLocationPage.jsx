import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import ServiceHero from '../../components/hirer/ServiceHero';
import RequestForm from '../../components/hirer/RequestForm';
import SEO from '../../components/ui/SEO';
import { IndividualServiceLocationSEO } from '../../seo/pageMetadata';

export default function IndividualServiceLocationPage() {
  const { service: serviceSlug, location: locSlug } = useParams();
  const { getServiceBySlug, getLocationBySlug } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locSlug);
  
  if (!service || !location) return <div className="text-center py-20 text-2xl font-bold">Service or Location not found</div>;

  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: service.name, path: `/services/${service.slug}` },
    { label: location.name }
  ];

  return (
    <>
      <SEO {...IndividualServiceLocationSEO(service, location)} />
      <div>
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm font-bold">
        DEVELOPMENT GUARDRAIL: Do not index. This location-specific template relies on backend supply data that is not yet implemented.
      </div>
      <ServiceHero 
        title={`${service.name} in ${location.name}`} 
        subtitle={`Request ${service.name.toLowerCase()} workforce services locally in ${location.name}.`}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Local Availability Prototype</h2>
            <p className="text-slate-700 mb-8 leading-relaxed">
              This location-specific template is ready for future service availability data. Live availability will be shown when Workforce supply data becomes available.
            </p>
            
            <div className="bg-slate-50 border p-6 rounded-xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Service Note</h3>
              <p className="text-slate-700 text-sm">
                Pricing, exact availability, and matching timelines are deferred until backend connectivity is established for {location.name}.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-[450px] order-1 lg:order-2">
            <div className="sticky top-6">
              <RequestForm service={service} initialLocationSlug={location.slug} />
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
