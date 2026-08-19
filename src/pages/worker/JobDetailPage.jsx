import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { routes } from '../../routes/registry';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import { JobDetailSEO } from '../../seo/pageMetadata';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { getJobById } = useWorkforce();
  
  const job = getJobById(jobId);
  
  if (!job) return <div className="text-center py-20 text-2xl font-bold">Job not found or has expired.</div>;

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: job.role?.name || 'Role', path: job.role ? routes.role.builder(job.role.slug) : '#' },
    { label: job.title }
  ];

  return (
    <>
      <SEO {...JobDetailSEO(job)} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs items={breadcrumbs} />

      {job.isDemo && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r">
          <p className="font-bold">Development Mode</p>
          <p className="text-sm">This is a mock job for frontend architecture validation. Do not index.</p>
        </div>
      )}
      
      <div className="bg-white border rounded-2xl shadow-sm p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h1>
            <p className="text-xl text-slate-600 font-medium">{job.employerName}</p>
          </div>
          <span className="uppercase text-sm tracking-wider font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full self-start">
            {job.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-xl border mb-8">
          <div>
            <p className="text-sm text-slate-500 mb-1 font-semibold">Location</p>
            <p className="font-bold text-slate-900 capitalize">{job.location?.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1 font-semibold">Compensation</p>
            <p className="font-bold text-slate-900">{job.compensation}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1 font-semibold">Shift</p>
            <p className="font-bold text-slate-900">{job.shift}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1 font-semibold">Job Type</p>
            <p className="font-bold text-slate-900">{job.employmentType}</p>
          </div>
        </div>

        <div className="prose max-w-none mb-10">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Job Description</h2>
          <p className="text-slate-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4 text-slate-900">Requirements & Eligibility</h3>
          <p className="text-slate-700">{job.requirements}</p>
        </div>
        
        <div className="border-t pt-8">
          <button className="w-full md:w-auto bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-sm">
            Apply in Worker App
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
