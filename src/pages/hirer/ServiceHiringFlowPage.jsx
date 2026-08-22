import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { ServiceHiringFlowSEO } from '../../seo/pageMetadata';
import ServiceCatalogLayout from '../../components/hirer/catalog/ServiceCatalogLayout';

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
      
      {/* We use the newly created ServiceCatalogLayout component designed like an e-commerce catalog */}
      <ServiceCatalogLayout service={service} />
    </>
  );
}

