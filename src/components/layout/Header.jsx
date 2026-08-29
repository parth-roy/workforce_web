import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, PhoneCall, LogIn, ShoppingCart, Package, ArrowRight, Briefcase } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DESKTOP_NAV = [
  {
    label: 'Join as Employee',
    href: '/jobs',
    dropdown: [
      { label: 'All Jobs', href: '/jobs' },
      { label: 'Locations', href: '/jobs#locations' },
      { label: 'How It Works', href: '/workers/how-it-works' },
      { label: 'Join as Worker', href: '/join-as-worker' },
    ]
  },
  {
    label: 'Hire Services',
    href: '/services',
    dropdown: [
      { label: 'All Services', href: '/services' },
      { label: 'Service Categories', href: '/services/categories' },
      { label: 'Hire Workers (B2B)', href: '/hire-workers' },
      { label: 'How Hiring Works', href: '/services/how-it-works' },
    ]
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const { cart, orders, setIsCartOpen, clearAllData } = useUCCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileAcc, setMobileAcc] = useState({});
  const location = useLocation();
  const { user, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const handleLogout = () => {
    if (clearAllData) clearAllData();
    logout();
  };

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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200 shadow-xs transition-shadow duration-200">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-[101]" onClick={() => setIsOpen(false)}>
          <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <span className="font-black text-[20px] sm:text-[24px] tracking-tight leading-none mt-1 text-slate-900">
            Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Mitra</span>
          </span>
        </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6">
            {DESKTOP_NAV.map((item, idx) => (
              <div key={idx} className={item.dropdown ? "relative group" : ""}
                   onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                   onMouseLeave={() => item.dropdown && setActiveDropdown(null)}>
                
                <Link 
                  to={item.href} 
                  className={`flex items-center gap-1 font-bold text-[13px] xl:text-sm transition-colors py-2 ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-700 hover:text-emerald-600'}`}
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
          <div className="hidden lg:flex items-center gap-1 xl:gap-3">
            {user && (
              <Link to="/user/orders" className="relative p-1.5 xl:p-2 text-slate-600 hover:text-emerald-600 transition-colors" title="My Bookings">
                <Package size={22} />
                {orders?.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </Link>
            )}
            <button onClick={handleCheckoutClick} className="relative p-1.5 xl:p-2 text-slate-600 hover:text-emerald-600 transition-colors mr-1 xl:mr-2" title="My Cart">
              <ShoppingCart size={22} />
              {cart?.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative group px-1 xl:px-2">
                <button className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    {user.firstName?.[0] || user.name?.[0] || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/user/profile" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium border-b border-slate-50">My Profile</Link>
                  <Link to="/user/orders" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium border-b border-slate-50">My Bookings</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium rounded-b-xl">Log out</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => openAuthModal('CUSTOMER')} 
                className="flex items-center gap-1 font-bold text-[13px] xl:text-sm text-slate-600 hover:text-emerald-600 transition-colors px-1 xl:px-2"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
            <Link 
              to="/join-as-worker" 
              className="relative group inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[12px] xl:text-[13px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 hover:border-emerald-400 transition-colors shadow-2xs active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>I'm a Job Seeker</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-600 transform group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <Link 
              to="/hire-workers" 
              className="relative group inline-flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-[12px] xl:text-[13px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 hover:border-blue-400 transition-colors shadow-2xs active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>I'm an Employer</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600 transform group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile menu buttons */}
          <div className="lg:hidden flex items-center gap-2 z-[101]">
            {user && (
              <Link to="/user/orders" className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100" title="My Bookings">
                <Package size={20} className="text-slate-700" />
                {orders?.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {orders.length}
                  </span>
                )}
              </Link>
            )}
            <button onClick={handleCheckoutClick} className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100" title="My Cart">
              <ShoppingCart size={20} className="text-slate-700" />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg transition-colors text-slate-800 hover:bg-slate-100 ml-1" 
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

      {/* Mobile Menu Accordion */}
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
          
          <div className="grid grid-cols-2 gap-2.5 px-2 mb-3">
            <Link 
              to="/join-as-worker" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-98 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>I'm a Job Seeker</span>
            </Link>
            <Link 
              to="/hire-workers" 
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 border border-blue-300 text-blue-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-98 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>I'm an Employer</span>
            </Link>
          </div>

          {/* User Auth Section in Mobile Drawer */}
          {user ? (
            <div className="pt-2 px-2 border-t border-slate-100 space-y-1">
              <Link
                to="/user/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs">
                  {user.firstName?.[0] || user.name?.[0] || 'U'}
                </div>
                <span>My Profile ({user.firstName || user.name || 'User'})</span>
              </Link>
              <Link
                to="/user/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <Package size={18} />
                <span>My Bookings {orders?.length > 0 && `(${orders.length})`}</span>
              </Link>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="w-full text-left py-2.5 px-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="pt-2 px-2 border-t border-slate-100">
              <button
                onClick={() => { setIsOpen(false); openAuthModal('CUSTOMER'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                <LogIn size={16} />
                Login / Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


