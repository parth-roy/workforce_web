import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { routes } from '../../routes/registry';
import WorkerHero from '../../components/worker/WorkerHero';
import JobGrid from '../../components/worker/JobGrid';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import SEO from '../../components/ui/SEO';
import { WorkerRoleLocationSEO } from '../../seo/pageMetadata';

export default function RoleLocationPage() {
  const { role: roleSlug, location: locSlug } = useParams();
  const { getRoleBySlug, getLocationBySlug, getJobsByRoleAndLocation } = useWorkforce();
  
  const role = getRoleBySlug(roleSlug);
  const loc = getLocationBySlug(locSlug);
  
  if (!role || !loc) return <div className="text-center py-20 text-2xl font-bold">Page not found</div>;
  
  const jobs = getJobsByRoleAndLocation(roleSlug, locSlug);

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: role.name, path: routes.role.builder(role.slug) },
    { label: loc.name }
  ];

  return (
    <>
      <SEO {...WorkerRoleLocationSEO(role, loc)} />
      <div>
      <WorkerHero 
        title={`${role.name} Jobs in ${loc.name}`} 
        subtitle={`Find the best ${role.name.toLowerCase()} opportunities in ${loc.name}.`}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Available Gigs</h2>
          <JobGrid 
            jobs={jobs} 
            emptyMessage={`There are currently no open ${role.name.toLowerCase()} positions in ${loc.name}. Please check back later or explore other roles.`} 
          />
        </div>

        <WorkerCTA />
      </main>
    </div>
    </>
  );
}
