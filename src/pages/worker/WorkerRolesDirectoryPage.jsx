import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { WorkerRolesDirectorySEO } from '../../seo/pageMetadata';
import { Briefcase, ArrowRight } from 'lucide-react';

export default function WorkerRolesDirectoryPage() {
  const { roles } = useWorkforce();
  
  return (
    <>
      <SEO {...WorkerRolesDirectorySEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-black mb-4">Work Opportunities & Roles</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Explore the different types of gig work available on Metro Mitra. Find the right role for your skills and experience.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link key={role.id} to={`/jobs/${role.slug}`} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{role.name}</h2>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">{role.description}</p>
              <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                View Role Details <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to start working?</h2>
          <p className="text-slate-600 mb-6">Learn how our verification and onboarding process works.</p>
          <Link to="/join-as-worker" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
            Learn How to Join
          </Link>
        </div>
      </main>
    </>
  );
}