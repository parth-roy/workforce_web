import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../../routes/registry';

export default function RoleCard({ role }) {
  return (
    <Link 
      to={routes.role.builder(role.slug)} 
      className="block p-6 bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2">{role.name}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{role.description}</p>
      <span className="text-blue-600 font-semibold text-sm">View Jobs &rarr;</span>
    </Link>
  );
}
