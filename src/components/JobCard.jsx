import React from 'react'
import { MapPin, IndianRupee, Clock, ShieldCheck } from 'lucide-react'

export default function JobCard({ title, location, wage, type, urgent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-slate-900">{title}</h3>
        {urgent && <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded">Urgent</span>}
      </div>
      
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="text-slate-400" />
          {location}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IndianRupee size={16} className="text-slate-400" />
          {wage} / day
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={16} className="text-slate-400" />
          {type}
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600">
          <ShieldCheck size={16} /> Verified Employer
        </div>
        <a 
          href={`https://wa.me/919331488999?text=Apply%20for%20${encodeURIComponent(title)}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
        >
          Apply Now
        </a>
      </div>
    </div>
  )
}
