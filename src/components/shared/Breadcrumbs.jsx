import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex text-sm text-slate-500 mb-6 whitespace-nowrap overflow-x-auto py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-blue-600">Home</Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span className="text-slate-400">/</span>
            {item.path ? (
              <Link to={item.path} className="hover:text-blue-600">{item.label}</Link>
            ) : (
              <span className="text-slate-900 font-medium" aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
