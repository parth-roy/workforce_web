import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import WorkerHero from '../../components/worker/WorkerHero';
import JobGrid from '../../components/worker/JobGrid';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import SEO from '../../components/ui/SEO';
import { WorkerLocationSEO } from '../../seo/pageMetadata';

export default function LocationPage() {
  const { location: locSlug } = useParams();
  const { getLocationBySlug, getJobsByRoleAndLocation } = useWorkforce();
  
  const loc = getLocationBySlug(locSlug);
  if (!loc) return <div className="text-center py-20 text-2xl font-bold">Location not found</div>;

  const jobs = getJobsByRoleAndLocation(null, locSlug);

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: loc.name }
  ];

  return (
    <>
      <SEO {...WorkerLocationSEO(loc)} />
      <div>
      <WorkerHero 
        title={`Jobs in ${loc.name}`} 
        subtitle={`Explore flexible workforce opportunities across ${loc.name}, ${loc.state}.`}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={breadcrumbs} />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Current Opportunities in {loc.name}</h2>
          <JobGrid jobs={jobs} emptyMessage={`No active jobs found in ${loc.name} matching your criteria.`} />
        </div>

        <WorkerCTA />
      </main>
    </div>
    </>
  );
}
