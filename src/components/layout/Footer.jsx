import React from 'react';
import { Link } from 'react-router-dom';



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
      { label: 'Contact Support', href: '/contact' },
      { label: 'General FAQ', href: '/faq' },
    ],
  },
  {
    title: 'For Workers',
    links: [
      { label: 'Browse Jobs & Roles', href: '/jobs' },
      { label: 'Join as a Worker', href: '/join-as-worker' },
      { label: 'Worker Guidelines', href: '/guides' },
    ],
  },
  {
    title: 'For Hirers & Business',
    links: [
      { label: 'Book a Home Service', href: '/services' },
      { label: 'Hire Bulk Workforce (B2B)', href: '/hire-workers' },
    ],
  }
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and QR Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 object-contain" />
              <span className="font-black text-2xl tracking-tight leading-none text-white">
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
              </span>
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 inline-block mb-6">
              <p className="text-sm font-bold text-white mb-2 text-center">Download Worker App</p>
              <img src="/workforce-app.webp" alt="Download Metro Mitra App" className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-xl bg-white p-2 mx-auto" />
              <a href="https://play.google.com/store/apps/details?id=com.gomytruck.workforce" target="_blank" rel="noopener noreferrer" className="block text-center mt-3 text-emerald-400 hover:text-emerald-300 text-sm font-bold underline">
                Get it on Google Play
              </a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_COLUMNS.map((col, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold mb-6">{col.title}</h3>
              <ul className="space-y-4">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal and Office Section */}
        <div className="pt-8 border-t border-slate-800 text-sm text-slate-400 space-y-4">
          <div>
            <h4 className="text-white font-bold mb-2">Registered Office:</h4>
            <p>© 2026 Parther Technologies Private Limited (GoMyTruck)</p>
            <p>Chiriyamore, Barrackpore, North 24 Parganas, West Bengal, 700120, India</p>
          </div>
          
          <div className="pt-4 border-t border-slate-800/50">
            <p className="mb-2">Parther Technologies Private Limited (GoMyTruck) | CIN: U62099WR2026PTC293183 | GSTIN: 19AAQCP8945A1ZY</p>
            <p>Email: hello@parthertech.com</p>
            <p className="mb-4">Phone: +91 9331488999</p>
            <p className="text-slate-500">GoMyTruck connects customers with independent logistics partners. Coverage, assignment, price and service scope are confirmed for each booking.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}



