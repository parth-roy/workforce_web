import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items, light = false }) {
  return (
    <nav className={`flex text-sm mb-6 whitespace-nowrap overflow-x-auto py-2 ${light ? 'text-slate-300' : 'text-slate-500'}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className={`transition-colors ${light ? 'hover:text-white' : 'hover:text-emerald-600'}`}>Home</Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span className={`${light ? 'text-slate-500' : 'text-slate-400'}`}>/</span>
            {item.path ? (
              <Link to={item.path} className={`transition-colors ${light ? 'hover:text-white' : 'hover:text-emerald-600'}`}>{item.label}</Link>
            ) : (
              <span className={`font-medium ${light ? 'text-white' : 'text-slate-900'}`} aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
