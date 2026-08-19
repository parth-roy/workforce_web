import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';

export default function B2BServicePage() {
  const { service: serviceSlug } = useParams();
  const { getServiceBySlug, loading } = useWorkforce();
  
  if (loading) return <div>Loading...</div>;
  const service = getServiceBySlug(serviceSlug);
  if (!service) return <div>Service not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
      <p className="text-xl text-slate-600 mb-8">{service.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Roles Included</h2>
          <ul className="list-disc pl-5 space-y-2">
            {service.roles.map(role => <li key={role} className="capitalize">{role.replace('-', ' ')}</li>)}
          </ul>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Enterprise Structure</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Workforce coordination</li>
            <li>Shift-based staffing</li>
            <li>Workforce management support</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700">Request Workforce</button>
      </div>
    </div>
  );
}
