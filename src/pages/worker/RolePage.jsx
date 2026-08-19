import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import WorkerHero from '../../components/worker/WorkerHero';
import JobGrid from '../../components/worker/JobGrid';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import SEO from '../../components/ui/SEO';
import { WorkerRoleSEO } from '../../seo/pageMetadata';

export default function RolePage() {
  const { role: roleSlug } = useParams();
  const { getRoleBySlug, getJobsByRoleAndLocation } = useWorkforce();
  
  const role = getRoleBySlug(roleSlug);
  if (!role) return <div className="text-center py-20 text-2xl font-bold">Role not found</div>;

  const jobs = getJobsByRoleAndLocation(roleSlug, null);

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: role.name }
  ];

  return (
    <>
      <SEO {...WorkerRoleSEO(role)} />
      <div>
      <WorkerHero 
        title={`${role.name} Jobs`} 
        subtitle={role.description}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Current Opportunities</h2>
            <JobGrid jobs={jobs} emptyMessage={`No active ${role.name} opportunities at the moment.`} />
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl h-fit border">
            <h3 className="text-xl font-bold mb-4">About this Role</h3>
            <div className="mb-6">
              <h4 className="font-bold text-slate-700 mb-2">Requirements</h4>
              <ul className="list-disc pl-5 text-slate-600 space-y-1">
                {role.requirements.map((req, i) => <li key={i}>{req}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2">Earning Model</h4>
              <p className="text-slate-600">{role.earningModel}</p>
            </div>
          </div>
        </div>

        <WorkerCTA />
      </main>
    </div>
    </>
  );
}
