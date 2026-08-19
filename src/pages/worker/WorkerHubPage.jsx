import React from 'react';
import SEO from '../../components/ui/SEO';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import WorkerHero from '../../components/worker/WorkerHero';
import RoleCard from '../../components/worker/RoleCard';
import LocationCard from '../../components/worker/LocationCard';
import WorkerCTA from '../../components/worker/WorkerCTA';
import FAQSection from '../../components/shared/FAQSection';
import { WorkerHubSEO } from '../../seo/pageMetadata';

export default function WorkerHubPage() {
  const { roles, locations } = useWorkforce();

  const faqs = [
    { question: 'How do I apply for a job?', answer: 'Download the Metro Mitra Worker app, create your profile, and start applying for jobs.' },
    { question: 'When do I get paid?', answer: 'Payment timing depends on the terms of the specific opportunity. Check the job details before applying.' }
  ];

  return (
    <>
      <SEO {...WorkerHubSEO()} />
    
      <WorkerHero 
        title="Find flexible work opportunities near you" 
        subtitle="Join Metro Mitra to discover warehouse, logistics, and helper roles tailored to your schedule."
      />
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Available Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map(role => (
              <RoleCard key={role.slug} role={role} />
            ))}
          </div>
        </section>

        <section className="mb-16 bg-slate-50 py-12 -mx-4 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Local Workforce Opportunities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {locations.map(loc => (
                <LocationCard key={loc.slug} location={loc} />
              ))}
            </div>
          </div>
        </section>

        <WorkerCTA />
        
        <FAQSection faqs={faqs} />
        
        <div className="max-w-4xl mx-auto text-center py-8 border-t mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-slate-600 mb-2">Need a specific service?</p>
            <Link to="/services" className="text-blue-600 font-bold hover:underline">Explore everyday services &rarr;</Link>
          </div>
          <div>
            <p className="text-slate-600 mb-2">Need to hire multiple workers?</p>
            <Link to="/for-contractors" className="text-blue-600 font-bold hover:underline">For Contractors & Proprietors &rarr;</Link>
          </div>
        </div>
      </main>
    </>
  );
}
