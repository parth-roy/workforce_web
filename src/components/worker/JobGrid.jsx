import React from 'react';
import JobCard from './JobCard';

export default function JobGrid({ jobs, emptyMessage }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
        <h3 className="text-xl font-bold text-slate-700 mb-2">No opportunities found</h3>
        <p className="text-slate-500">{emptyMessage || "No matching opportunities are available in this view yet."}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
