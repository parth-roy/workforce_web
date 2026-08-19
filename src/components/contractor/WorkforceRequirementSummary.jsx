import React from 'react';

export default function WorkforceRequirementSummary({ data, roles, locations }) {
  const locName = locations.find(l => l.slug === data.worksite.locationSlug)?.name || 'Unknown Location';
  
  return (
    <div className="bg-slate-50 border rounded-lg p-6 space-y-4" aria-live="polite">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Workforce Needs</p>
        <ul className="space-y-1">
          {data.roles.map((r, i) => {
            const roleObj = roles.find(ro => ro.slug === r.roleSlug);
            return (
              <li key={i} className="font-semibold text-slate-900">
                {r.quantity}x {roleObj?.name || r.roleSlug}
                {r.shift?.preset && <span className="ml-2 text-sm text-slate-500 font-normal">({r.shift.preset})</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Worksite</p>
          <p className="font-semibold text-slate-900">{locName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Shift</p>
          <p className="font-semibold text-slate-900 capitalize">{data.globalShift.preset || 'Any'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p>
          <p className="font-semibold text-slate-900 capitalize">{data.duration.type || 'Any'}</p>
        </div>
      </div>
      {data.requirements && (
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Additional Requirements</p>
          <p className="text-slate-700 whitespace-pre-wrap text-sm">{data.requirements}</p>
        </div>
      )}
    </div>
  );
}
