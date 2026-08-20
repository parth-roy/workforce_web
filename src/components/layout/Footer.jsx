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
      { label: 'Worker Hub', href: '/jobs' },
      { label: 'Worker Roles', href: '/jobs/roles' },
      { label: 'Join as Worker', href: '/join-as-worker' },
      { label: 'How It Works', href: '/workers/how-it-works' },
      { label: 'Worker FAQ', href: '/workers/faq' },
    ],
  },
  {
    title: 'For Hirers & Business',
    links: [
      { label: 'Services Hub', href: '/services' },
      { label: 'Service Categories', href: '/services/categories' },
      { label: 'How Hiring Works', href: '/services/how-it-works' },
      { label: 'Hiring FAQ', href: '/services/faq' },
      { label: 'For Contractors', href: '/for-contractors' },
      { label: 'For Companies', href: '/for-companies' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/faq' },
      { label: 'Phone: +91 (XXX) XXXXXXX', href: '#' },
      { label: 'Email: support@metromitra.com', href: '#' },
    ],
  }
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {FOOTER_COLUMNS.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold mb-4">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.href === '#' ? (
                      <span className="text-sm hover:text-white transition-colors">{link.label}</span>
                    ) : (
                      <Link to={link.href} className="text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-800 text-center md:text-left md:flex justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-white font-black text-xl mr-4">Metro Mitra</span>
            <span className="text-sm">© {new Date().getFullYear()} Parther Technologies. All rights reserved.</span>
          </div>
          <div className="text-xs text-slate-500">
            * This is a prototype frontend. Terms and policies are pending.
          </div>
        </div>
      </div>
    </footer>
  );
}
