import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, PhoneCall, LogIn } from 'lucide-react';

const DESKTOP_NAV = [
  {
    label: 'Find Work',
    href: '/jobs',
    dropdown: [
      { label: 'All Jobs', href: '/jobs' },
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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileAcc, setMobileAcc] = useState({});
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const toggleMobileAcc = (label) => {
    setMobileAcc(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md py-1 border-b border-slate-200/50" 
        : "bg-white py-2 border-b border-slate-100"
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center py-1">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-[101]" onClick={() => setIsOpen(false)}>
            <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <span className="font-black text-[20px] sm:text-[24px] tracking-tight leading-none mt-1 text-slate-900">
              Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mitra</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {DESKTOP_NAV.map((item, idx) => (
              <div key={idx} className={item.dropdown ? "relative group" : ""}
                   onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                   onMouseLeave={() => item.dropdown && setActiveDropdown(null)}>
                
                <Link 
                  to={item.href} 
                  className={`flex items-center gap-1 font-bold text-sm transition-colors py-2 ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-700 hover:text-emerald-600'}`}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />}
                </Link>
                
                {item.dropdown && (
                  <div className={`absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden transition-all duration-200 origin-top-left ${activeDropdown === item.label ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                    <div className="py-2">
                      {item.dropdown.map((sub, sIdx) => (
                        <Link 
                          key={sIdx} 
                          to={sub.href}
                          className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/join-as-worker" className="flex items-center gap-1.5 font-bold text-sm text-slate-600 hover:text-emerald-600 transition-colors px-2">
              <LogIn size={16} />
              Login
            </Link>
            <Link to="/services" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2 rounded-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile menu buttons */}
          <div className="lg:hidden flex items-center gap-2 z-[101]">
            <a href="tel:+919331488999" className="p-2 rounded-lg text-slate-700 hover:bg-slate-100" title="Call Support">
              <PhoneCall size={20} className="text-emerald-600" />
            </a>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg transition-colors text-slate-800 hover:bg-slate-100" 
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Accordion (Vahan Style) */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[85vh] overflow-y-auto border-t border-slate-200 bg-white shadow-2xl" : "max-h-0 pointer-events-none"}`}>
        <div className="px-4 pt-2 pb-24 space-y-1">
          {DESKTOP_NAV.map((item, idx) => (
            <div key={idx} className="border-b border-slate-100 last:border-0">
              {!item.dropdown ? (
                <Link 
                  to={item.href} 
                  onClick={() => setIsOpen(false)}
                  className={`block py-3.5 px-2 text-sm font-bold ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-800 hover:bg-slate-50'}`}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => toggleMobileAcc(item.label)}
                    className={`w-full flex items-center justify-between py-3.5 px-2 text-sm font-bold ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-800 hover:bg-slate-50'}`}
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform ${mobileAcc[item.label] ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${mobileAcc[item.label] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 pb-3 space-y-1 bg-slate-50 rounded-lg mx-2 mb-2 p-2">
                      <Link 
                        to={item.href} 
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 rounded-md"
                      >
                        Overview
                      </Link>
                      {item.dropdown.map((sub, sIdx) => (
                        <Link 
                          key={sIdx} 
                          to={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 rounded-md"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="h-px bg-slate-200 my-4 mx-2" />
          
          <div className="grid grid-cols-2 gap-3 px-2">
            <Link 
              to="/join-as-worker" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-800 font-bold py-3 rounded-lg text-sm hover:bg-slate-50 active:scale-98 transition-all"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link 
              to="/services" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-lg shadow-md shadow-emerald-500/20 active:scale-98 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
