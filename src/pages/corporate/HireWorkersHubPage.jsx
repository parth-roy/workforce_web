import React from 'react';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';

export default function HireWorkersHubPage() {
  const { services, loading } = useWorkforce();
  if (loading) return <div>Loading...</div>;

  const b2bServices = services.filter(s => s.audience === 'corporate');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">B2B Workforce Staffing</h1>
      <p className="text-xl text-slate-600 mb-8">Deploy reliable workforce for your business operations.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {b2bServices.map(service => (
          <Link key={service.slug} to={routes.b2bService.builder(service.slug)} className="p-6 border rounded-lg shadow hover:border-blue-500 transition-colors">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-slate-600">{service.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
