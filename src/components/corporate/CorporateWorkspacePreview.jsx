import React from 'react';

export default function CorporateWorkspacePreview() {
  return (
    <div id="dashboard-preview" className="bg-slate-50 border rounded-xl overflow-hidden shadow-xl max-w-5xl mx-auto my-12" aria-label="Corporate Workspace Preview">
      <div className="bg-slate-900 p-4 flex items-center justify-between text-white border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-black">C</div>
          <span className="font-bold tracking-wide">Corporate Workspace</span>
          <span className="px-2 py-1 bg-slate-800 text-xs font-bold rounded text-slate-400 ml-2">Preview</span>
        </div>
        <div className="hidden sm:flex gap-6 text-sm font-semibold text-slate-400">
          <span className="text-white">Requests</span>
          <span>Locations</span>
          <span>Reports</span>
          <span>Members</span>
        </div>
      </div>
      <div className="flex">
        <div className="hidden md:block w-64 bg-slate-100 border-r p-6 min-h-[400px]">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Locations</h4>
          <ul className="space-y-3 text-sm font-semibold text-slate-700">
            <li className="flex justify-between items-center p-2 text-slate-500 italic border border-dashed rounded bg-slate-50">
              Workspace location management will appear after backend integration.
            </li>
          </ul>
          
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-8">Reports</h4>
          <ul className="space-y-3 text-sm font-semibold text-slate-700">
            <li className="flex justify-between items-center p-2 text-slate-500 italic border border-dashed rounded bg-slate-50">
              Analytics will appear after backend integration.
            </li>
          </ul>
        </div>
        <div className="flex-1 p-6 md:p-8 bg-white">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Active Workforce Requests</h3>
              <p className="text-slate-500 text-sm mt-1">Manage and track your structural workforce requirements.</p>
            </div>
            <button className="hidden sm:block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm disabled:opacity-50" disabled>New Request (Planned)</button>
          </div>
          
          <div className="space-y-4">
            <div className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center bg-slate-50 text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <span className="text-slate-400 text-2xl">📋</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">No live requests connected yet</h4>
              <p className="text-slate-500 text-sm max-w-sm">
                This is a structural prototype. Future requests submitted through the builder will appear here once backend integration is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
