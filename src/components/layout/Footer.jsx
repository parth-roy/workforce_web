import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MessageCircle, Globe } from 'lucide-react'

const LinkedinIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const workerLinks = [
  { label: 'Jobs Near Me',       href: '/jobs-near-me' },
  { label: 'Daily Payment Jobs', href: '/daily-payment-jobs' },
  { label: 'Loading Jobs',       href: '/loading-jobs' },
  { label: 'Warehouse Jobs',     href: '/warehouse-jobs' },
  { label: 'Gig Jobs Kolkata',   href: '/gig-jobs-kolkata' },
  { label: 'Helper Jobs',        href: '/helper-jobs-kolkata' },
]

const employerLinks = [
  { label: 'Hire Workers Now',     href: '/employer-hiring' },
  { label: 'Book On-Demand',       href: '/book-workers' },
  { label: 'Enterprise Solutions', href: '/workforce-solutions' },
  { label: 'Temporary Staffing',   href: '/temporary-jobs' },
]

const topCities = [
  { label: 'Gig Jobs in Kolkata', href: '/gig-jobs-kolkata' },
  { label: 'Delivery Jobs Kolkata', href: '/delivery-jobs-kolkata' },
  { label: 'Helper Jobs Kolkata', href: '/helper-jobs-kolkata' },
]

const topRoles = [
  { label: 'Forklift Operator', href: '/forklift-operator' },
  { label: 'Truck Helper',      href: '/truck-helper-jobs' },
  { label: 'Unloading Jobs',    href: '/unloading-jobs' },
  { label: 'Warehouse Helper',  href: '/warehouse-helper' },
  { label: 'Logistics Jobs',    href: '/logistics-jobs' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container-xl py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Col 1: Company */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <img src="/logo.png" alt="Metro Mitra Logo" loading="lazy" className="h-10 w-10 object-contain" />
              <span className="font-black text-2xl text-white leading-none mt-1">
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              West Bengal's most trusted platform for daily gig work and verified gig workforce solutions.
            </p>
            <p className="text-xs leading-relaxed mb-5 text-slate-500">
              Parther Technologies Pvt. Ltd.<br />
              Chiriyamore, Barrackpore, North 24 Parganas, West Bengal, 700120, India<br />
              CIN: U62099WR2026PTC293183
            </p>
            <div className="flex items-center gap-3">
              <a href="tel:9331488999" aria-label="Phone" className="relative group w-8 h-8 rounded-full bg-slate-800 hover:bg-trust-blue-700 flex items-center justify-center transition-colors">
                <Phone size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">Call Us</span>
              </a>
              <a href="mailto:hello@parthertech.com" aria-label="Email" className="relative group w-8 h-8 rounded-full bg-slate-800 hover:bg-trust-blue-700 flex items-center justify-center transition-colors">
                <Mail size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">Email Us</span>
              </a>
              <a href="https://wa.me/919331488999?text=Hello%20Metro Mitra%20Workforce%20Team!%20I%20am%20interested%20in%20joining.%0A%0AName%3A%20-%0APhone%20Number%3A%20-" aria-label="WhatsApp" className="relative group w-8 h-8 rounded-full bg-slate-800 hover:bg-action-green-700 flex items-center justify-center transition-colors">
                <MessageCircle size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">WhatsApp</span>
              </a>
              <a href="https://www.linkedin.com/company/metromitra/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="relative group w-8 h-8 rounded-full bg-slate-800 hover:bg-trust-blue-700 flex items-center justify-center transition-colors">
                <LinkedinIcon size={14} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-700 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Col 2: For Workers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">For Workers</h3>
            <ul className="space-y-3">
              {workerLinks.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <a href="https://play.google.com/store/apps/details?id=com.metromitra.workforce&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/workforce-app.webp" 
                  alt="Scan to Download Metro Mitra App" 
                  className="w-48 h-auto rounded-xl drop-shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">For Employers</h3>
            <ul className="space-y-3 mb-6">
              {employerLinks.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3 mt-5">Top Roles</h3>
            <ul className="space-y-2">
              {topRoles.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Locations & Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-5">Locations</h3>
            <ul className="space-y-3 mb-6">
              {topCities.map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
              <li><span className="text-sm text-slate-500">Howrah · Durgapur · Asansol · Siliguri</span></li>
            </ul>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/grievance" className="text-sm hover:text-white transition-colors">Grievance Officer</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 Parther Technologies Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-xs text-slate-600 text-center">
              🏛️ Platform regulated under{' '}
              <span className="text-slate-400">Code on Social Security 2020</span>
              {' · '}
              <span className="text-slate-400">e-Shram Registered</span>
              {' · '}
              <span className="text-slate-400">West Bengal Gatidhara Partner</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
