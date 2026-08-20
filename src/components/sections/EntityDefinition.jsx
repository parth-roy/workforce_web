import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Navigation, ShieldCheck } from 'lucide-react';

export default function EntityDefinition() {
  return (
    <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* H1 / Primary Answer */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">What is Metro Mitra?</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            <strong>Metro Mitra</strong> is a gig workforce platform. We connect verified gig workers with individuals, contractors, and corporate enterprises who need reliable on-demand workforce and services.
          </p>
        </div>

        {/* Supporting Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Who is it for? */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-trust-blue-200 transition-colors">
            <Users className="text-trust-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Who is it for?</h3>
            <p className="text-slate-600 mb-4">
              Designed for daily wage workers seeking transparent shifts, and for individuals and businesses needing immediate manpower.
            </p>
            <ul className="text-sm font-medium text-slate-700 space-y-2">
              <li>&rarr; <Link to="/jobs" className="hover:text-trust-blue-600">Gig Workers</Link></li>
              <li>&rarr; <Link to="/services" className="hover:text-trust-blue-600">Individuals</Link></li>
              <li>&rarr; <Link to="/hire-workers" className="hover:text-trust-blue-600">Businesses & Contractors</Link></li>
            </ul>
          </div>

          {/* What does it provide? */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-action-green-200 transition-colors">
            <Briefcase className="text-action-green-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">What does it provide?</h3>
            <p className="text-slate-600">
              We provide a transparent marketplace for hiring. Workers get direct access to shifts without middlemen, and employers get verified, ready-to-deploy manpower for short-term or long-term operational needs.
            </p>
          </div>

          {/* Supported Roles */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-trust-blue-200 transition-colors">
            <ShieldCheck className="text-trust-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Supported Roles</h3>
            <p className="text-slate-600 mb-4">
              We focus on essential logistics and operational roles across B2B and B2C sectors.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold bg-white px-2 py-1 border rounded text-slate-700">Warehouse Staff</span>
              <span className="text-xs font-bold bg-white px-2 py-1 border rounded text-slate-700">Loaders</span>
              <span className="text-xs font-bold bg-white px-2 py-1 border rounded text-slate-700">Electricians</span>
              <span className="text-xs font-bold bg-white px-2 py-1 border rounded text-slate-700">Plumbers</span>
            </div>
          </div>

          {/* Where does it operate? */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-action-green-200 transition-colors">
            <Navigation className="text-action-green-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-3">Where does it operate?</h3>
            <p className="text-slate-600">
              Currently expanding across key industrial and urban hubs in West Bengal, with primary workforce centers located in Barrackpore, Dankuni, and surrounding regional zones.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
