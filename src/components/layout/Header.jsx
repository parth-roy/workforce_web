import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu, X, ChevronDown, Phone, Download, Users,
  MapPin, Briefcase, Wallet, Building2, Zap, Globe
} from 'lucide-react'
import { pageMap } from '../../data/pages'

const workerLinks = [
  { label: 'Jobs Near Me',       href: '/jobs-near-me',        icon: MapPin },
  { label: 'Daily Payment Jobs', href: '/daily-payment-jobs',  icon: Wallet },
  { label: 'Gig Jobs Kolkata',   href: '/gig-jobs-kolkata',    icon: Globe  },
  { label: 'Loading Jobs',       href: '/loading-jobs',        icon: Zap    },
  { label: 'Warehouse Jobs',     href: '/warehouse-jobs',      icon: Briefcase },
  { label: 'All Worker Roles',   href: '/logistics-jobs',      icon: Users  },
]

const employerLinks = [
  { label: 'Hire Workers Now',      href: '/employer-hiring',      icon: Users    },
  { label: 'Book On-Demand',        href: '/book-workers',         icon: Zap      },
  { label: 'Enterprise Solutions',  href: '/workforce-solutions',  icon: Building2},
  { label: 'Temporary Staffing',    href: '/temporary-jobs',       icon: Briefcase},
]

function DropdownMenu({ links, onClose }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-trust-blue-600 transition-colors group"
        >
          <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-trust-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
            <Icon size={15} className="text-slate-500 group-hover:text-trust-blue-600" />
          </span>
          {label}
        </Link>
      ))}
    </div>
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workerOpen, setWorkerOpen] = useState(false)
  const [employerOpen, setEmployerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
    setWorkerOpen(false)
    setEmployerOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown]')) {
        setWorkerOpen(false)
        setEmployerOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const currentSlug = location.pathname.replace(/^\//, '');
  const hasHeroBg = location.pathname === '/' || !!(pageMap[currentSlug]?.heroImage);
  const isTransparent = hasHeroBg && !scrolled;

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent text-white' : 'bg-white shadow-md text-slate-900 border-b border-slate-200'}`}>
        <div className="container-xl">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group flex items-center gap-2">
              <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 object-contain" />
              <span className={`font-black text-2xl tracking-tight leading-none mt-1 ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
                Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Workers */}
              <div className="relative" data-dropdown>
                <button
                  onClick={() => { setWorkerOpen(v => !v); setEmployerOpen(false) }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isTransparent ? 'text-white hover:text-white/80 hover:bg-white/10' : 'text-slate-700 hover:text-trust-blue-600 hover:bg-slate-50'}`}
                >
                  Workers <ChevronDown size={14} className={`transition-transform duration-200 ${workerOpen ? 'rotate-180' : ''}`} />
                </button>
                {workerOpen && <DropdownMenu links={workerLinks} onClose={() => setWorkerOpen(false)} />}
              </div>

              {/* Employers */}
              <div className="relative" data-dropdown>
                <button
                  onClick={() => { setEmployerOpen(v => !v); setWorkerOpen(false) }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isTransparent ? 'text-white hover:text-white/80 hover:bg-white/10' : 'text-slate-700 hover:text-trust-blue-600 hover:bg-slate-50'}`}
                >
                  Employers <ChevronDown size={14} className={`transition-transform duration-200 ${employerOpen ? 'rotate-180' : ''}`} />
                </button>
                {employerOpen && <DropdownMenu links={employerLinks} onClose={() => setEmployerOpen(false)} />}
              </div>

              <Link to="/logistics-jobs" className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isTransparent ? 'text-white hover:text-white/80 hover:bg-white/10' : 'text-slate-700 hover:text-trust-blue-600 hover:bg-slate-50'}`}>
                Govt & Welfare
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:9331488999" className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${isTransparent ? 'text-white hover:text-white/80' : 'text-slate-600 hover:text-trust-blue-600'}`}>
                <Phone size={14} />
                <span>9331488999</span>
              </a>
              <Link to="/employer-hiring" className="btn-primary-blue text-sm px-4 py-2 rounded-lg shadow-none">
                Hire Workers
              </Link>
              <a href="https://play.google.com/store/apps/details?id=com.metromitra.workforce&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="btn-primary-green text-sm px-4 py-2 rounded-lg shadow-none">
                <Download size={14} />
                Download App
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-up">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Metro Mitra Logo" className="h-8 w-8 object-contain" />
                <span className="font-black text-xl text-slate-900 mt-1">
                  Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4">
              {/* Workers section */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">For Workers</p>
              {workerLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-trust-blue-600 transition-colors"
                >
                  <Icon size={16} className="text-slate-400" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-slate-100 my-4" />

              {/* Employers section */}
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">For Employers</p>
              {employerLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-trust-blue-600 transition-colors"
                >
                  <Icon size={16} className="text-slate-400" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Drawer footer CTAs */}
            <div className="px-4 pb-6 space-y-3 border-t border-slate-100 pt-4">
              <a href="tel:9331488999" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                <Phone size={16} />
                Call 9331488999
              </a>
              <Link to="/employer-hiring" onClick={() => setMobileOpen(false)} className="btn-primary-blue w-full justify-center">
                Hire Workers
              </Link>
              <a href="https://play.google.com/store/apps/details?id=com.metromitra.workforce&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="btn-primary-green w-full justify-center">
                <Download size={16} />
                Download Worker App
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
