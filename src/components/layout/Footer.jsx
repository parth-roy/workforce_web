import React from 'react';
import { Link } from 'react-router-dom';
import { APP_DOWNLOAD_URL } from '../../config/constants.js';
import PlayStoreIcon from '../ui/PlayStoreIcon.jsx';
import { mockLocations } from '../../data/mock/locations.js';

const Facebook = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const Twitter = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4.01c-1 .49-1.98.68-3 .99-1.12-1.27-2.74-2.06-4.5-2-3.26.11-5.83 2.72-5.96 5.96-.06.25-.09.52-.09.78C5.07 9.4 2.65 7.18 1 5c-.77 1.33-.29 3.09 1 4.01-1.07-.05-1.92-.37-2.5-.78v.1c0 2.21 1.5 4.14 3.75 4.64-.67.22-1.35.25-2.05.08.6 1.83 2.45 3.07 4.5 3.12-2.14 1.74-4.8 2.5-7.5 2.12 2.28 1.48 4.88 2.22 7.5 2.22 8.76 0 13.91-7.23 13.91-13.91 0-.25-.01-.49-.03-.73 1.05-.75 1.94-1.63 2.63-2.67z"></path></svg>;
const Instagram = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const Linkedin = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const Youtube = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;

const FOOTER_COLUMNS = [
  {
    title: 'Metro Mitra',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Resources & Guides', href: '/guides' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'General FAQ', href: '/faq' },
    ],
  },
  {
    title: 'For Workers',
    links: [
      { label: 'Browse Jobs & Roles', href: '/jobs' },
      { label: 'Join as a Worker', href: '/join-as-worker' },
      { label: 'How It Works (Workers)', href: '/workers/how-it-works' },
      { label: 'Worker FAQ', href: '/workers/faq' },
    ],
  },
  {
    title: 'For Hirers & Business',
    links: [
      { label: 'Book Home Services', href: '/services' },
      { label: 'Service Categories', href: '/services/categories' },
      { label: 'How Hiring Works', href: '/services/how-it-works' },
      { label: 'Hirer FAQ', href: '/services/faq' },
      { label: 'Direct Worker Numbers · ₹49', href: '/direct-contact' },
      { label: 'Hire Bulk Workforce (B2B)', href: '/hire-workers' },
      { label: 'For Contractors', href: '/for-contractors' },
      { label: 'For Companies', href: '/for-companies' },
    ],
  }
];

const POPULAR_SEARCHES = [
  { label: 'Electrician in Kolkata', to: '/services/electrician/kolkata' },
  { label: 'Plumber in Delhi NCR', to: '/services/plumber/new-delhi' },
  { label: 'Loading Labor in Mumbai', to: '/services/loading-unloading/mumbai' },
  { label: 'Packers & Movers in Bengaluru', to: '/services/furniture-moving/bengaluru' },
  { label: 'AC Repair in Hyderabad', to: '/services/ac-repair/hyderabad' },
  { label: 'Deep Cleaning in Pune', to: '/services/cleaning/pune' },
  { label: 'Warehouse Helpers in Ahmedabad', to: '/services/general-helper/ahmedabad' },
  { label: 'Carpenters in Chennai', to: '/services/carpenter/chennai' },
  { label: 'Painters in Jaipur', to: '/services/painter/jaipur' },
  { label: 'Appliance Repair in Lucknow', to: '/services/appliance-repair/lucknow' },
  { label: 'Security Staff in Indore', to: '/services/security/indore' },
  { label: 'Delivery Associates in Kochi', to: '/services/last-mile-delivery/kochi' },
  { label: 'Loading Labor in Dankuni', to: '/services/loading-unloading/dankuni' },
  { label: 'Electrician in Barrackpore', to: '/services/electrician/barrackpore' },
  { label: 'Daily Wage Jobs Near Me', to: '/jobs' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800/80 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and QR Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 object-contain" />
              <span className="font-black text-2xl tracking-tight leading-none text-white">
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              India's transparent on-demand gig workforce & local home services platform. Headquartered in <strong className="text-slate-300">Barrackpore, West Bengal</strong>. Connecting skilled professionals with residential, commercial, and industrial operations nationwide.
            </p>

            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 inline-block mb-6 shadow-sm">
              <p className="text-xs font-bold text-slate-300 mb-2 text-center uppercase tracking-wider">Download Mobile App</p>
              <img src="/workforce-app.webp" alt="Download Metro Mitra App" className="w-44 h-44 sm:w-48 sm:h-48 object-cover rounded-xl bg-white p-2 mx-auto" />
              <a href={APP_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 mt-3 text-emerald-400 hover:text-emerald-300 text-xs font-bold">
                <PlayStoreIcon size={15} /> Download App on Play Store
              </a>
            </div>

            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61593733915083" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="YouTube"><Youtube size={16} /></a>
            </div>
          </div>

          {/* Links Columns */}
          {FOOTER_COLUMNS.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.href} className="text-xs sm:text-sm text-slate-400 hover:text-emerald-400 transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Searches Section */}
        <div className="pt-8 pb-6 border-t border-slate-800/80">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Popular Workforce Searches</h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium rounded-full transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Service Locations & Operational Hubs Grid */}
        <div className="pt-6 pb-8 border-t border-slate-800/80">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Service Locations &amp; Operational Hubs</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-4">
            {mockLocations.map((loc) => (
              <Link
                key={loc.slug}
                to={`/jobs/location/${loc.slug}`}
                title={`Workforce & Home Services in ${loc.name}, ${loc.state}`}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors truncate font-medium"
              >
                {loc.name}, {loc.state}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal and Office Section */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-3">
          <div>
            <h4 className="text-slate-300 font-bold text-xs mb-1">Registered Office:</h4>
            <p>&copy; 2026 Parther Technologies Private Limited (Metro Mitra)</p>
            <p>1/2, Bhattacharjee Para, Barrackpore, North 24 Parganas, West Bengal 700120, India</p>
          </div>
          
          <div className="pt-2 border-t border-slate-800/50">
            <p className="mb-1 text-slate-400">Parther Technologies Private Limited (Metro Mitra) | CIN: U62099WR2026PTC293183 | GSTIN: 19AAQCP8945A1ZY</p>
            <p className="mb-1">Email: <a href="mailto:admin@metromitra.com" className="hover:text-emerald-400 transition-colors">admin@metromitra.com</a> | Phone: <a href="tel:+919331488999" className="hover:text-emerald-400 transition-colors">+91 9331488999</a></p>
            <p className="text-slate-500 mt-2">Metro Mitra connects customers with verified workforce and local service professionals. Coverage, assignment, pricing, and service scope are confirmed for each booking.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
