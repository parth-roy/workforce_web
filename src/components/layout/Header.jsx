import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, PhoneCall, LogIn, ShoppingCart, Package, ArrowRight, Briefcase, User, Shield, MapPin, LogOut, CheckCircle2 } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import CitySelectorModal from '../common/CitySelectorModal';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { cart, orders, setIsCartOpen, clearAllData } = useUCCart();
  const { currentCity, isCityModalOpen, setIsCityModalOpen } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileAcc, setMobileAcc] = useState({});
  const location = useLocation();
  const { user, openAuthModal, logout, isWorker: authIsWorker, role } = useAuth();
  const navigate = useNavigate();

  const isWorker = authIsWorker || role === 'WORKER' || user?.role === 'WORKER';
  const isWorkerDashboard = location.pathname.startsWith('/worker/dashboard') || isWorker;
  const searchParams = new URLSearchParams(location.search);
  const currentWorkerTab = searchParams.get('tab') || 'jobs';

  const workerNav = useMemo(() => [
    { id: 'jobs', label: 'Jobs', href: '/worker/dashboard?tab=jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', href: '/worker/dashboard?tab=applications', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile', href: '/worker/dashboard?tab=profile', icon: User },
  ], []);

  const desktopNav = useMemo(() => [
    {
      label: 'Find Work',
      href: '/jobs',
      dropdown: [
        { label: 'All Jobs', href: '/jobs' },
        { label: `Jobs in ${currentCity?.name || 'Local Area'}`, href: `/jobs/location/${currentCity?.slug || 'kolkata'}` },
        { label: 'How It Works', href: '/workers/how-it-works' },
        { label: 'Join as Worker', href: '/join-as-worker' },
      ]
    },
    {
      label: 'Services',
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
  ], [currentCity]);

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
        
        {/* Logo & City Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link 
            to={isWorkerDashboard ? "/worker/dashboard" : "/"} 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-[101]" 
            onClick={() => setIsOpen(false)}
          >
            <img src="/logo.png" alt="Metro Mitra Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <span className="font-black text-[20px] sm:text-[24px] tracking-tight leading-none mt-1 text-slate-900">
              Metro<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-emerald-500">Mitra</span>
            </span>
          </Link>

          {/* City Selector Badge Button — Always visible for location switching */}
          <button
            type="button"
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold border border-emerald-200/90 bg-emerald-50/90 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300 transition-all active:scale-95 cursor-pointer shrink-0 shadow-2xs"
            title="Change City"
            aria-label="Change current city"
          >
            <img src="/google-maps-icon.webp" alt="Location" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
            <span className="max-w-[75px] sm:max-w-[120px] truncate">{currentCity?.name || "Kolkata"}</span>
            <ChevronDown size={11} className="text-emerald-700 shrink-0" />
          </button>
        </div>

          {/* Desktop Nav */}
          {isWorkerDashboard ? (
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
              {workerNav.map((item) => {
                const isTabActive = currentWorkerTab === item.id;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      isTabActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isTabActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-4 xl:gap-7">
              {desktopNav.map((item, idx) => (
                <div key={idx} className={item.dropdown ? "relative group" : ""}
                     onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                     onMouseLeave={() => item.dropdown && setActiveDropdown(null)}>
                  
                  <Link 
                    to={item.href} 
                    className={`flex items-center gap-1 font-bold text-[13px] xl:text-sm whitespace-nowrap transition-colors py-2 ${isActive(item.href) ? 'text-emerald-600' : 'text-slate-700 hover:text-emerald-600'}`}
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
                            className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors whitespace-nowrap"
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
          )}

          {/* Desktop CTA / Worker Actions */}
          {isWorkerDashboard ? (
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Worker Profile Button & Dropdown (Protected Route) */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => navigate('/worker/dashboard?tab=profile')}
                  className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs group-hover:bg-emerald-50 group-hover:border-emerald-300"
                  title="My Worker Profile"
                  aria-label="Worker Profile and Navigation"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-2xs group-hover:scale-105 transition-transform">
                    {(user?.name || user?.firstName || 'W')[0].toUpperCase()}
                  </div>
                  <div className="leading-tight text-left">
                    <span className="block text-xs font-black text-slate-900 group-hover:text-emerald-700 truncate max-w-[120px]">
                      {user?.name || user?.firstName || 'Worker Partner'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Worker
                    </span>
                  </div>
                  <ChevronDown size={13} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:rotate-180 ml-0.5" />
                </button>

                {/* Protected Worker Profile Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {user?.name || user?.firstName || 'Worker Partner'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {user?.phone || 'Verified Worker'}
                    </p>
                  </div>

                  <Link
                    to="/worker/dashboard?tab=jobs"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Briefcase size={15} className="text-emerald-600" />
                    <span>Jobs</span>
                  </Link>

                  <Link
                    to="/worker/dashboard?tab=applications"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <CheckCircle2 size={15} className="text-blue-600" />
                    <span>My Applications</span>
                  </Link>

                  <Link
                    to="/worker/dashboard?tab=profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <User size={15} className="text-slate-600" />
                    <span>My Profile</span>
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={15} className="text-red-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>

              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {/* GET A JOB NOW — Clean Solid CTA */}
              <button
                type="button"
                onClick={() => {
                  window.open('/get-a-job', '_blank', 'noopener,noreferrer');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black whitespace-nowrap cursor-pointer active:scale-95 transition-colors"
                aria-label="Get a job now on Metro Mitra"
              >
                Get a Job Now
              </button>

              {/* Glossy "Post a Job" CTA button */}
              <Link
                to="/post-job"
                className="relative hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black overflow-hidden shadow-lg hover:shadow-xl active:scale-95 transition-all whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)' }}
                aria-label="Post a job on MetroMitra"
              >
                {/* Shimmer sweep */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                    animation: 'shimmer-sweep 2.4s ease-in-out infinite',
                  }}
                />
                {/* Pulsing beacon dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-200 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="relative">Post a Job</span>
              </Link>

              {user && (
                <Link to="/user/orders" className="relative p-1.5 text-slate-600 hover:text-emerald-600 transition-colors" title="My Bookings">
                  <Package size={20} />
                  {orders?.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {orders.length}
                    </span>
                  )}
                </Link>
              )}
              
              <button onClick={handleCheckoutClick} className="relative p-1.5 text-slate-600 hover:text-emerald-600 transition-colors" title="My Cart">
                <ShoppingCart size={20} />
                {cart?.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative group px-1">
                  <button className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      {user.firstName?.[0] || user.name?.[0] || 'U'}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/user/profile" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium border-b border-slate-50">My Profile</Link>
                    <Link to="/user/orders" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-medium border-b border-slate-50">My Bookings</Link>
                    <Link to="/user/posted-jobs" className="flex items-center justify-between px-4 py-3 text-sm text-violet-700 hover:bg-violet-50 font-bold border-b border-slate-50">
                      <span>My Posted Jobs</span>
                      <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium rounded-b-xl">Log out</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => openAuthModal('CUSTOMER')} 
                  className="flex items-center gap-1 font-bold text-[13px] text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50 whitespace-nowrap"
                >
                  <LogIn size={15} />
                  Login
                </button>
              )}
            </div>
          )}

          {/* Mobile menu buttons */}
          <div className="lg:hidden flex items-center gap-2 z-[101]">
            {!isWorkerDashboard && (
              <>
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
              </>
            )}
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
        {isWorkerDashboard ? (
          <div className="px-4 pt-3 pb-8 space-y-2">
            {/* Worker Header Card (Protected Profile Link) */}
            <Link
              to="/worker/dashboard?tab=profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl mb-3 transition-colors cursor-pointer group"
              title="My Worker Profile"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base font-black shadow-xs group-hover:scale-105 transition-transform">
                {(user?.name || user?.firstName || 'W')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 group-hover:text-emerald-700 truncate">
                  {user?.name || user?.firstName || 'Worker Partner'}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Worker Portal
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-600" />
            </Link>

            {/* Worker Nav Items */}
            <div className="space-y-1">
              {workerNav.map((item) => {
                const isTabActive = currentWorkerTab === item.id;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      isTabActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isTabActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-slate-200 my-3" />

            {/* Logout button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="px-4 pt-2 pb-24 space-y-1">

            {/* Mobile Drawer City Switcher Bar */}
            <div className="pt-2 pb-2">
              <button
                type="button"
                onClick={() => { setIsOpen(false); setIsCityModalOpen(true); }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 text-slate-800 text-xs font-bold hover:bg-emerald-100 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <img src="/google-maps-icon.webp" alt="City" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
                  <span>Active City: <strong className="text-emerald-700 font-extrabold">{currentCity?.name || "Kolkata"}</strong></span>
                </div>
                <span className="text-emerald-700 underline text-xs font-semibold">Change</span>
              </button>
            </div>

            {desktopNav.map((item, idx) => (
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

            {/* Mobile GET A JOB NOW CTA */}
            <div className="px-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  window.open('/get-a-job', '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3 rounded-xl active:scale-98 transition-colors cursor-pointer"
              >
                Get a Job Now
              </button>
            </div>

            <div className="px-2 mb-3">
              <Link
                to="/post-job"
                onClick={() => setIsOpen(false)}
                className="relative flex items-center justify-center gap-2 w-full text-white font-black text-sm py-3 rounded-xl overflow-hidden shadow-lg active:scale-98 transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)' }}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
                    animation: 'shimmer-sweep 2.4s ease-in-out infinite',
                  }}
                />
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-200 opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="relative">Post a Job — Find Workers Now</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-2 mb-3">
              <Link
                to="/join-as-worker"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-emerald-300 text-emerald-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-98 transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>I'm a Job Seeker</span>
              </Link>
              <Link
                to="/hire-workers"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-blue-300 text-blue-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:scale-98 transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
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
                <Link
                  to="/user/posted-jobs"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 text-sm font-bold text-violet-700 hover:bg-violet-50 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={18} />
                    My Posted Jobs
                  </span>
                  <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
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
        )}
      </div>

      {/* Global City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
      />
    </header>
  );
}


