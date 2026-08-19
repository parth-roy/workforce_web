import React from 'react';

export default function RequestSummary({ service, data, locations }) {
  const locName = locations.find(l => l.slug === data.location)?.name || 'Unknown Location';
  
  return (
    <div className="bg-slate-50 border rounded-lg p-6 space-y-4">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Service</p>
        <p className="font-semibold text-slate-900">{service.name}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
        <p className="font-semibold text-slate-900">{locName}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Requirement</p>
        <p className="text-slate-700 whitespace-pre-wrap">{data.requirement}</p>
      </div>
      {data.timing && (
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Timing</p>
          <p className="text-slate-700 capitalize">{data.timing}</p>
        </div>
      )}
    </div>
  );
}
