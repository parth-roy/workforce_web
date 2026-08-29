import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';
import { Zap, Wrench, Package, Sparkles, Truck, Users, Shield, Briefcase, ArrowRight } from 'lucide-react';

const ICON_MAP = { Zap, Wrench, Package, Sparkles, Truck, Users, Shield, Briefcase };

export default function RoleCard({ role }) {
  const Icon = ICON_MAP[role.icon] || Briefcase;

  return (
    <Link 
      to={routes.role.builder(role.slug)} 
      className="group block p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
    >
      {role.customIcon ? (
        <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl">
          <img 
            src={role.customIcon} 
            alt={role.name} 
            className={`w-full h-full object-contain ${(role.slug === 'loader-unloader' || role.slug === 'delivery-associate') ? 'scale-[2.4] origin-left' : ''}`} 
          />
        </div>
      ) : (
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{role.category}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{role.name}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{role.description}</p>
      <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
        View Jobs <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}
