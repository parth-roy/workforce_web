import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase, Users, Building2, HardHat, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Find Work', href: '/jobs', icon: Briefcase },
  { label: 'Hire Services', href: '/services', icon: Users },
  { label: 'Hire Workers', href: '/hire-workers', icon: Users },
  { label: 'For Contractors', href: '/for-contractors', icon: HardHat },
  { label: 'For Companies', href: '/for-companies', icon: Building2 },
];

const MOBILE_EXTRA_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  // Sticky scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${scrolled ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Metro Mitra home">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className={`font-black text-lg ${scrolled ? 'text-slate-900' : 'text-white'}`}>Metro Mitra</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : scrolled
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/services"
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">M</span>
                </div>
                <span className="font-black text-slate-900">Metro Mitra</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-1">
                {MOBILE_EXTRA_LINKS.map(({ label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-slate-100">
              <Link
                to="/services"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
