import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { ServiceHiringFlowSEO } from '../../seo/pageMetadata';
import RequestForm from '../../components/hirer/RequestForm';

export default function ServiceHiringFlowPage() {
  const { service: serviceSlug } = useParams();
  const { getServiceBySlug } = useWorkforce();
  
  const service = getServiceBySlug(serviceSlug);
  
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <SEO {...ServiceHiringFlowSEO(service)} />
      
      {/* We use the existing RequestForm component which is already a 9-step wizard */}
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <Link to={`/services/${service.slug}`} className="text-emerald-600 hover:underline font-medium">
              &larr; Back to {service.name} details
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <h1 className="text-2xl font-bold">Request {service.name}</h1>
              <p className="text-slate-300 text-sm mt-2">Complete the steps below to submit your request.</p>
            </div>
            <div className="p-0">
               {/* Note: In a real app we might pass the service prop to RequestForm to pre-fill it */}
              <RequestForm onClose={() => window.history.back()} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}