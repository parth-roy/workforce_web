import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';

export default function JobCard({ job }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full relative">
      {job.isDemo && (
        <span className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
          DEMO
        </span>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{job.title}</h3>
        <p className="text-slate-600 font-medium">{job.employerName}</p>
      </div>
      
      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex items-center text-sm text-slate-700">
          <span className="font-semibold w-24">Pay:</span>
          <span>{job.compensation}</span>
        </div>
        <div className="flex items-center text-sm text-slate-700">
          <span className="font-semibold w-24">Shift:</span>
          <span>{job.shift}</span>
        </div>
        <div className="flex items-center text-sm text-slate-700">
          <span className="font-semibold w-24">Location:</span>
          <span className="capitalize">{job.location?.name || 'Unknown'}</span>
        </div>
      </div>
      
      <Link 
        to={routes.jobDetail.builder(job.id)} 
        className="block w-full text-center bg-slate-100 text-slate-900 font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
}
