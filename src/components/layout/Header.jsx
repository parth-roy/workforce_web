import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, Briefcase, Users, Building2, HardHat, Info, Phone, FileText } from 'lucide-react';

const DESKTOP_NAV = [
  {
    label: 'Find Work',
    href: '/jobs',
    dropdown: [
      { label: 'Roles', href: '/jobs/roles' },
      { label: 'Locations', href: '/jobs' },
      { label: 'How It Works', href: '/workers/how-it-works' },
      { label: 'Join as Worker', href: '/join-as-worker' },
    ]
  },
  {
    label: 'Hire Services',
    href: '/services',
    dropdown: [
      { label: 'All Services', href: '/services/categories' },
      { label: 'Popular Services', href: '/services' },
      { label: 'How Hiring Works', href: '/services/how-it-works' },
    ]
  },
  {
    label: 'Hire Workers',
    href: '/hire-workers',
    dropdown: [
      { label: 'Workforce Services', href: '/hire-workers' },
      { label: 'Contractor', href: '/for-contractors' },
      { label: 'Company', href: '/for-companies' },
    ]
  },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/guides' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Mobile accordion state
  const [mobileAcc, setMobileAcc] = useState({});
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.body.style.overflow = mobileOpen ? 'hidden' : 'unset';
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const toggleMobileAcc = (label) => {
    setMobileAcc(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4 border-b border-slate-100'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group z-50 shrink-0">
          <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {DESKTOP_NAV.map((item, idx) => (
            <div key={idx} className={item.dropdown ? "relative group" : ""}
                 onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                 onMouseLeave={() => item.dropdown && setActiveDropdown(null)}>
              
              <Link 
                to={item.href} 
                className={`flex items-center gap-1 font-semibold transition-colors ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600 group-hover:text-emerald-600'}`}
              >
                {item.label}
                {item.dropdown && <ChevronDown className="w-4 h-4" />}
              </Link>
              
              {item.dropdown && (
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top-left ${activeDropdown === item.label ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                  <div className="py-2">
                    {item.dropdown.map((sub, sIdx) => (
                      <Link 
                        key={sIdx} 
                        to={sub.href}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/join-as-worker" className="text-slate-600 font-semibold hover:text-emerald-600 transition-colors">
            Log In
          </Link>
          <Link to="/services" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 z-50 relative"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileOpen(false)} />
      
      <div className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-40 lg:hidden shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-20 border-b border-slate-100 flex items-center px-6"><img src="/logo.png" alt="Metro Mitra Logo" className="h-8 w-auto object-contain" /></div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <nav>
            {DESKTOP_NAV.map((item, idx) => (
              <div key={idx} className="border-b border-slate-100">
                {!item.dropdown ? (
                  <Link 
                    to={item.href} 
                    className={`block py-4 text-lg font-bold ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-800'}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => toggleMobileAcc(item.label)}
                      className={`w-full flex items-center justify-between py-4 text-lg font-bold ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-800'}`}
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform ${mobileAcc[item.label] ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileAcc[item.label] && (
                      <div className="pl-4 pb-4 space-y-3 border-l-2 border-slate-100 ml-2">
                        <Link 
                          to={item.href} 
                          className="block text-slate-700 font-medium hover:text-emerald-600"
                        >
                          Overview
                        </Link>
                        {item.dropdown.map((sub, sIdx) => (
                          <Link 
                            key={sIdx} 
                            to={sub.href}
                            className="block text-slate-700 font-medium hover:text-emerald-600"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-6 pb-28 border-t border-slate-100 bg-slate-50 space-y-3">
          <Link to="/join-as-worker" className="block w-full py-3 text-center text-slate-700 font-bold bg-white border border-slate-200 rounded-xl">
            Log In
          </Link>
          <Link to="/services" className="block w-full py-3 text-center text-white font-bold bg-emerald-600 rounded-xl shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

