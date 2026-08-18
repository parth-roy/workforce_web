import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, ArrowRight, CheckCircle2, Star, Shield, MapPin, Package, PackageOpen, Sparkles, Handshake, X } from 'lucide-react'
import BookingFormModal from '../modals/BookingFormModal'

import { roles as WORKER_ROLES } from '../../data/roles';

/**
 * HeroSection — three variants:
 *  - 'worker'   : Full dark-blue hero, app download CTA, QR code right side
 *  - 'employer' : Dark hero with dashboard mockup right side
 *  - 'dual'     : Split two-column (worker left, employer right)
 */
export default function HeroSection({
  variant = 'worker',
  h1,
  subtitle,
  badge,
  cta,
  workerCta,
  employerCta,
  stats = [],
  heroImage,
}) {
  if (variant === 'dual') return <DualHero h1={h1} subtitle={subtitle} workerCta={workerCta} employerCta={employerCta} stats={stats} heroImage={heroImage} />
  if (variant === 'employer') return <EmployerHero h1={h1} subtitle={subtitle} badge={badge} cta={cta} stats={stats} heroImage={heroImage} />
  return <WorkerHero h1={h1} subtitle={subtitle} badge={badge} cta={cta} stats={stats} heroImage={heroImage} />
}

/* ── Worker Hero ── */
function WorkerHero({ h1, subtitle, badge, cta, stats, heroImage }) {
  return (
    <section 
      className={`relative overflow-hidden ${heroImage ? 'bg-slate-950 bg-cover bg-center lg:bg-[position:right_35%] pt-32 md:pt-40 pb-24 md:pb-48 min-h-screen flex flex-col justify-center' : 'bg-trust-blue-900 bg-gradient-to-br from-trust-blue-900 via-trust-blue-700 to-trust-blue-900 pt-24'}`}
      style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
    >
      {!heroImage && <div className="absolute inset-0 grid-pattern opacity-50"></div>}
      {/* Left-side readability gradient when a bg image is set */}
      {heroImage && <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"></div>}
      <div className={`${heroImage ? 'w-full max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16' : 'container-xl py-16 md:py-24'} relative z-10`}>
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left — compact upper-left column */}
          <div className={heroImage ? 'lg:col-span-5' : 'lg:col-span-6'}>
            {badge && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-5">
                <span className="pulse-dot" />
                <span className="text-sm font-semibold text-white">{badge}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5 whitespace-pre-line">
              {h1}
            </h1>
            {subtitle && (
              <p className="text-base text-blue-100 leading-relaxed mb-7 max-w-md">{subtitle}</p>
            )}

            {/* Inline trust stats — only shown when there is no background image */}
            {!heroImage && stats.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA — only shown when there is no background image */}
            {!heroImage && (
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  to={cta?.href || '/gig-jobs-kolkata'}
                  className="btn-primary-green text-base px-7 py-4"
                >
                  <Download size={18} />
                  {cta?.label || 'Download App – Free'}
                </Link>
              </div>
            )}

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['e-Shram Registered', 'Daily UPI Payouts', '0 - 5% Lowest Commission'].map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs text-blue-200 bg-white/10 rounded-full px-3 py-1">
                  <CheckCircle2 size={11} className="text-action-green-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — App Mockup only when no custom background image is present */}
          {!heroImage && (
            <div className="hidden lg:flex lg:col-span-6 justify-center">
              <AppMockup />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Employer Hero ── */
function EmployerHero({ h1, subtitle, badge, cta, stats, heroImage }) {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeBookingWorkers, setActiveBookingWorkers] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: '',
    companyName: '',
    phone: '',
    city: ''
  });
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const workerId = searchParams.get('worker');
    if (workerId) {
      setActiveBookingWorkers([workerId]);
      // Remove query param without refreshing the page
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('https://api.gomytruck.com/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          companyName: formData.companyName,
          phone: formData.phone,
          city: formData.city,
          role: 'EMPLOYER'
        })
      });
      if (!response.ok) throw new Error('Failed to submit');
      setStatus('success');
      setFormData({ name: '', companyName: '', phone: '', city: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section 
      className={`relative overflow-hidden pt-24 ${heroImage ? 'bg-[#0f172a] bg-cover bg-center lg:aspect-[1693/929] flex flex-col justify-center' : 'bg-slate-900 bg-gradient-to-br from-slate-900 to-trust-blue-900 min-h-[90vh]'}`}
      style={heroImage ? { backgroundImage: `url('${heroImage}')` } : {}}
    >
      {!heroImage && <div className="absolute inset-0 grid-pattern opacity-50"></div>}
      {heroImage && <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30 pointer-events-none"></div>}
      <div className="container-xl relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start lg:pt-0">
          {/* Left */}
          <div className="lg:-mt-24 lg:-ml-12 relative z-20">
            {badge && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <CheckCircle2 size={14} className="text-action-green-400" />
                <span className="text-sm font-semibold text-white">{badge}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              {h1}
            </h1>
            
            {subtitle && (
              <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-lg">{subtitle}</p>
            )}

            {false && stats.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-8">
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary-blue text-base px-7 py-4"
            >
              Hire Now
              <ArrowRight size={18} />
            </button>

            <div className="flex flex-wrap gap-2 mt-6">
              {['Code on SS 2020 Compliant', '98.7% Verification Rate', 'SLA Guaranteed'].map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs text-blue-200 bg-white/10 rounded-full px-3 py-1">
                  <Shield size={11} className="text-action-green-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Lead form */}
          {false && (
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Get a Free Demo</h3>
              <p className="text-sm text-slate-500 mb-6">Deploy verified workers within 2.4 hours</p>
              
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Request Received!</h4>
                  <p className="text-sm text-slate-500">We will contact you shortly.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-trust-blue-600 font-bold hover:underline">Submit another</button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    required type="text" placeholder="Your Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors"
                  />
                  <input
                    type="text" placeholder="Company Name" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors"
                  />
                  <input
                    required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" placeholder="Phone Number *" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors"
                  />
                  <input
                    required type="text" placeholder="City / Location *" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors"
                  />
                  {status === 'error' && (
                    <div className="text-red-500 text-xs">Failed to submit. Please try again.</div>
                  )}
                  <button type="submit" disabled={status === 'loading'} className="btn-primary-blue w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                    {status === 'loading' ? 'Submitting...' : 'Get a Callback Today'}
                  </button>
                </form>
              )}
              
              <p className="text-xs text-slate-400 text-center mt-4">
                🔒 Your data is 100% secure. No spam.
              </p>
            </div>
          </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">Hire Verified Workers</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                {WORKER_ROLES.map(role => (
                  <div 
                    key={role.id} 
                    onClick={() => {
                      if (!activeBookingWorkers.includes(role.id)) {
                        setActiveBookingWorkers(prev => [...prev, role.id]);
                      }
                      setIsModalOpen(false);
                    }}
                    className="group relative flex flex-col items-center justify-center p-4 md:p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-trust-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
                  >
                    <img src={role.icon} alt={role.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] object-cover shadow-sm border border-slate-100 mb-3 animate-float group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold text-slate-700 text-sm md:text-base group-hover:text-trust-blue-600 transition-colors">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BookingFormModal 
        isOpen={activeBookingWorkers.length > 0} 
        onClose={() => setActiveBookingWorkers([])} 
        activeWorkers={activeBookingWorkers}
        onAddAnotherWorker={() => setIsModalOpen(true)}
      />
    </section>
  )
}

/* ── Dual Hero ── */
function DualHero({ h1, subtitle, workerCta, employerCta, stats, heroImage }) {
  const location = useLocation();
  const isHome = location.pathname === '/' || !!heroImage;
  const bgImg = heroImage || '/home-hero.webp';

  return (
    <section 
      className={`relative flex flex-col justify-center ${location.pathname === '/' ? 'min-h-[85vh] mb-32 overflow-visible bg-slate-950' : (isHome ? 'bg-slate-950 bg-cover bg-center lg:bg-[position:right_35%] min-h-screen pb-24 md:pb-48' : 'bg-slate-900 bg-gradient-to-br from-slate-900 to-trust-blue-900 overflow-hidden pt-24')}`}
      style={isHome && location.pathname !== '/' ? { backgroundImage: `url('${bgImg}')` } : {}}
    >
      {location.pathname === '/' && (
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            poster={bgImg}
            className="h-full w-full object-cover object-top"
          >
            <source src="/workforce-hero.webm" type="video/webm" />
            <source src="/workforce-hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>
        </div>
      )}
      {!isHome && <div className="absolute inset-0 grid-pattern opacity-50"></div>}
      {location.pathname === '/' ? (
        <>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full px-4 z-20 flex justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 sm:px-12 flex flex-col gap-6 border border-slate-100 w-full sm:w-fit">
            
            {/* Top City Selector */}
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm px-2 w-fit">
              <MapPin size={20} className="text-slate-800" />
              <span>City: Kolkata</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-10 lg:gap-16 w-full">
              {/* Roles Tabs */}
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-4 w-full min-w-0 sm:max-w-md lg:max-w-3xl justify-start snap-x scroll-smooth custom-scrollbar">
                {WORKER_ROLES.map((role, index) => {
                  return (
                    <Link
                      to={`/employer-hiring?worker=${role.id}`}
                      key={role.id}
                      className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 transition-all duration-500 flex-shrink-0 group snap-center animate-float cursor-pointer outline-none"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <img 
                        src={role.icon} 
                        alt={role.name} 
                        className="w-full h-full object-cover rounded-[1.5rem] shadow-sm border border-slate-200 transition-all duration-500 group-hover:shadow-lg group-hover:border-trust-blue-300"
                      />
                      <span className="absolute bottom-2 font-bold text-[11px] sm:text-xs text-center transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:-translate-y-2 text-trust-blue-800 bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-sm">
                        {role.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Action Button */}
              <Link
                to="/employer-hiring"
                className="group flex flex-col items-center justify-center gap-4 shrink-0 sm:pr-4 cursor-pointer outline-none"
              >
                <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-trust-blue-600 text-white shadow-xl shadow-trust-blue-600/30 transition-transform duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-full border-2 border-trust-blue-600 opacity-0 group-hover:animate-ping transition-opacity duration-300"></div>
                  <ArrowRight size={40} className="transition-transform duration-500 group-hover:translate-x-2 relative z-10" />
                </div>
                <span className="font-display font-extrabold text-base sm:text-lg text-slate-800 group-hover:text-trust-blue-600 transition-colors tracking-tight">
                  Hire Now
                </span>
              </Link>
            </div>
          </div>
        </div>
        </>
      ) : (
        <div className={`${isHome ? 'w-full max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-16 pt-32 md:pt-40 pb-24 md:pb-48' : 'container-xl py-16 md:py-24'} relative z-10`}>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className={`lg:col-span-7 xl:col-span-6 relative ${isHome ? 'lg:-left-16 xl:-left-24' : ''}`}>
              {/* Headline & Subtitle */}
              <div className="mb-10 text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 whitespace-pre-line">{h1}</h1>
                {subtitle && <p className="text-lg text-slate-200 max-w-xl whitespace-pre-line">{subtitle}</p>}
              </div>

              {/* Interactive Circular CTA Buttons */}
              <div className="flex flex-col gap-4 items-start">
                {/* Worker Button */}
                <Link 
                  to={workerCta?.href || '/gig-jobs-kolkata'} 
                  className="group flex items-center bg-action-green-600 hover:bg-action-green-500 rounded-full h-14 max-w-[56px] hover:max-w-[280px] transition-all duration-300 ease-in-out overflow-hidden shadow-2xl border border-action-green-400/30"
                >
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Download size={22} className="text-white" />
                  </div>
                  <span className="text-white font-bold whitespace-nowrap pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {workerCta?.label || 'For Workers - Download App'}
                  </span>
                </Link>

                {/* Employer Button */}
                <Link 
                  to={employerCta?.href || '/employer-hiring'} 
                  className="group flex items-center bg-trust-blue-700 hover:bg-trust-blue-600 rounded-full h-14 max-w-[56px] hover:max-w-[280px] transition-all duration-300 ease-in-out overflow-hidden shadow-2xl border border-trust-blue-500/30"
                >
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <ArrowRight size={22} className="text-white" />
                  </div>
                  <span className="text-white font-bold whitespace-nowrap pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {employerCta?.label || 'For Employers - Hire Now'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ── App Mockup ── */
function AppMockup() {
  return (
    <div className="relative w-64 h-96">
      {/* Phone frame */}
      <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] border-4 border-slate-700 shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="bg-slate-800 h-8 flex items-center justify-between px-5">
          <span className="text-white text-xs font-bold">9:41</span>
          <span className="text-white text-xs">●●●</span>
        </div>
        {/* App content mockup */}
        <div className="bg-white flex-1 p-4">
          <div className="bg-action-green-600 rounded-xl p-3 mb-3">
            <p className="text-white text-xs font-bold">✅ Rs.450 credited!</p>
            <p className="text-green-100 text-xs">Loading Job – Dankuni Hub</p>
          </div>
          {[1,2,3].map(i => (
            <div key={i} className="border border-slate-100 rounded-xl p-3 mb-2">
              <div className="flex justify-between items-start mb-1">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
              <div className="skeleton h-2 w-32 rounded mt-1" />
            </div>
          ))}
          <div className="mt-3 bg-trust-blue-600 rounded-xl p-3 text-center">
            <p className="text-white text-xs font-bold">28,000+ Jobs Available</p>
          </div>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -inset-4 bg-action-green-500/20 rounded-full blur-2xl -z-10" />
    </div>
  )
}
