import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import ServiceHero from '../../components/hirer/ServiceHero';
import RequestForm from '../../components/hirer/RequestForm';
import SEO from '../../components/ui/SEO';
import { IndividualServiceSEO } from '../../seo/pageMetadata';

export default function IndividualServicePage() {
  const { service: serviceSlug } = useParams();
  const { getServiceBySlug } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  
  if (!service) return <div className="text-center py-20 text-2xl font-bold">Service not found</div>;

  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: service.name }
  ];

  return (
    <>
      <SEO {...IndividualServiceSEO(service)} />
      <div>
      <ServiceHero 
        title={`${service.name} Services`} 
        subtitle={service.description}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-12 mt-8">
          <div className="flex-1 order-2 lg:order-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Overview</h2>
            <p className="text-slate-700 mb-8 leading-relaxed">
              Our {service.name.toLowerCase()} category connects you with local workforce capable of handling personal, household, and small-scale {service.name.toLowerCase()} requirements safely and efficiently.
            </p>
            
            {service.useCases && service.useCases.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Common Use Cases</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.useCases.map((uc, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <span className="text-blue-600">✓</span> {uc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.whoIsItFor && service.whoIsItFor.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Who is this for?</h3>
                <div className="flex flex-wrap gap-2">
                  {service.whoIsItFor.map((who, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">{who}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-blue-900 mb-2">What to expect</h3>
              <p className="text-blue-800 text-sm">
                Describe your requirement, location, and preferred timing. The live request and matching flow will be connected to Workforce services later.
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-[450px] order-1 lg:order-2">
            <div className="sticky top-6">
              <RequestForm service={service} />
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
