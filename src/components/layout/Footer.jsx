import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Guides', href: '/guides' },
    ],
  },
  {
    title: 'For Workers',
    links: [
      { label: 'Browse All Jobs', href: '/jobs' },
      { label: 'Warehouse Helper Jobs', href: '/jobs/warehouse-helper' },
      { label: 'Electrician Jobs', href: '/jobs/electrician' },
      { label: 'Jobs in Barrackpore', href: '/jobs/location/barrackpore' },
      { label: 'Jobs in Dankuni', href: '/jobs/location/dankuni' },
    ],
  },
  {
    title: 'For Hirers & Business',
    links: [
      { label: 'Book a Service', href: '/services' },
      { label: 'Hire Workers (B2B)', href: '/hire-workers' },
      { label: 'For Contractors', href: '/for-contractors' },
      { label: 'For Companies', href: '/for-companies' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'WhatsApp (placeholder)', href: '#', external: true },
      { label: 'Phone (placeholder)', href: '#', external: true },
      { label: 'Email (placeholder)', href: '#', external: true },
      { label: 'Contact Form', href: '/contact' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Brand + Description */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="font-black text-white text-lg">Metro Mitra</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Gig workforce platform connecting skilled workers with individuals and businesses across West Bengal.
            </p>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FOOTER_COLUMNS.map(col => (
              <div key={col.title}>
                <h3 className="text-white font-bold text-sm mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map(({ label, href, external }) => (
                    <li key={label}>
                      {external ? (
                        <span className="text-sm text-slate-500 cursor-not-allowed">{label}</span>
                      ) : (
                        <Link to={href} className="text-sm hover:text-emerald-400 transition-colors">
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">© {currentYear} Metro Mitra. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-emerald-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
