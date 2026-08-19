import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';

export default function LocationCard({ location }) {
  return (
    <Link 
      to={routes.location.builder(location.slug)} 
      className="flex items-center justify-between p-4 bg-slate-50 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
    >
      <div>
        <h3 className="font-bold text-slate-900">{location.name}</h3>
        <span className="text-xs text-slate-500">{location.state}</span>
      </div>
      <span className="text-blue-600">&rarr;</span>
    </Link>
  );
}
