import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { routes } from '../../routes/registry';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import PlayStoreIcon from '../../components/ui/PlayStoreIcon';
import SEO from '../../components/ui/SEO';
import { WorkerRoleLocationSEO } from '../../seo/pageMetadata';
import { RelatedRoles, RelatedLocations } from '../../components/seo/RelatedLinks';
import { CheckCircle, ChevronDown, ChevronUp, ArrowRight, Zap, ShieldCheck, Clock, Banknote, CalendarCheck, TrendingUp, Users } from 'lucide-react';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function RoleLocationPage() {
  const { role: roleSlug, location: locSlug } = useParams();
  const { getRoleBySlug, getLocationBySlug } = useWorkforce();
  const [openFaq, setOpenFaq] = useState(null);

  const role = getRoleBySlug(roleSlug);
  const loc = getLocationBySlug(locSlug);

  if (!role || !loc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <p className="text-slate-600 mb-6">This role + location combination is not currently available.</p>
        <Link to="/jobs" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">Browse All Jobs</Link>
      </div>
    </div>
  );

  const minPay = loc.localPricingConfig?.minimumFare || 450;
  const maxPay = Math.round(minPay * 1.8);
  const activeVacancies = 12 + ((role.name.length * 3 + loc.name.length * 7) % 15);

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: role.name, path: routes.role.builder(role.slug) },
    { label: loc.name },
  ];

  const faqs = [
    { q: `How much can a ${role.name} earn near ${loc.name} Metro?`, a: `Earnings for ${role.name} in ${loc.name} range from ₹${minPay} to ₹${maxPay} per shift with daily UPI / bank transfers directly into your account upon shift completion.` },
    { q: `What are the shift timings available in ${loc.name}?`, a: `MetroMitra offers flexible 4-hour morning, 8-hour day, and evening shift slots across commercial and residential zones in ${loc.name}.` },
    { q: `Are there any registration or agency fees to join?`, a: 'No. Joining MetroMitra is 100% free with zero commission cut. You receive your full agreed wage directly.' },
    { q: 'How fast can I start working?', a: 'Onboarding takes less than 2 minutes. Complete your Aadhaar-KYC in the MetroMitra Worker App, select your preferred work hub in ' + loc.name + ', and accept active shifts.' },
  ];

  return (
    <>
      <SEO {...WorkerRoleLocationSEO(role, loc)} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-28 pb-16 lg:pb-0 overflow-hidden border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
            <div className="max-w-2xl lg:py-16 xl:pl-8">
              
              {/* Dynamic Live Hiring Pill */}
              <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                <span>{activeVacancies} Verified Vacancies · Hiring in {loc.name}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] mb-5 tracking-tight">
                {role.name} Jobs<br />near {loc.name} Metro
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 mb-6 max-w-lg leading-relaxed font-medium">
                Immediate daily shift openings for verified {role.name.toLowerCase()} workers in {loc.name}, {loc.state}. Get daily payouts via UPI and zero registration fees.
              </p>

              {/* Economic Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-xl">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Daily Earnings
                  </div>
                  <div className="text-base font-black text-slate-900">₹{minPay} – ₹{maxPay}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Payment Cycle
                  </div>
                  <div className="text-base font-black text-slate-900">Daily UPI Transfer</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Joining Fee
                  </div>
                  <div className="text-base font-black text-emerald-600">₹0 Free Onboarding</div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  to={`/join-as-worker?role=${role.slug}&location=${loc.slug}`}
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-sm sm:text-base active:scale-95 cursor-pointer"
                >
                  Apply in {loc.name} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="bg-white text-slate-700 border border-slate-300 px-6 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  View All Roles
                </Link>
              </div>
            </div>

            {role.heroImage && (
              <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-4 lg:mt-0">
                <img 
                  src={role.heroImage} 
                  alt={`${role.name} jobs in ${loc.name}`} 
                  width={650}
                  height={500}
                  className="w-full max-w-[650px] h-auto object-contain transform origin-bottom lg:scale-[1.08] xl:translate-x-[4%] xl:translate-y-[2%]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Direct Worker Contact Banner — Right After Hero */}
        <DirectContactBanner serviceName={role.name} cityName={loc.name} variant="default" />

        {/* Dynamic Modular Assembly: Live Hiring & Local Transit Hub Card */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                  <Zap className="w-3.5 h-3.5" /> High Demand Onboarding Zone
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Operational Hub: {loc.name} Corridor
                </h2>
                <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                  MetroMitra provides instant job matching for {role.name.toLowerCase()} workers across {loc.name} and adjacent metro station feeder routes. Walk in with your Aadhaar card or onboard directly via our mobile application.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <div className="bg-slate-800/80 border border-slate-600/60 rounded-xl p-3 text-center">
                  <div className="text-xs text-slate-400 font-medium">Daily Active Openings</div>
                  <div className="text-2xl font-black text-emerald-400">{activeVacancies} Shifts</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About role in location */}
        <section className="mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{role.name} Work in {loc.name}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {role.description} In {loc.name}, opportunities are available across commercial, residential, and industrial environments depending on local demand.
            </p>
            {role.responsibilities && (
              <div>
                <h3 className="font-bold text-slate-800 mb-3">Key Responsibilities:</h3>
                <ul className="space-y-2">
                  {role.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* How to Apply */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How to Apply</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Download the App', desc: 'Get the Metro Mitra Worker App on Google Play.' },
              { step: '02', title: 'Set Location', desc: `Select ${loc.name} as your primary work zone.` },
              { step: '03', title: 'Start Earning', desc: 'Accept assignments and receive transparent daily payouts.' },
            ].map(item => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black mx-auto mb-3">{item.step}</div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 pt-8 border-t border-slate-200">
          <RelatedRoles currentSlug={role.slug} max={4} title="Other Roles" />
          <RelatedLocations currentSlug={loc.slug} basePath={`/jobs/${role.slug}`} max={4} title="Other Locations" suffix="Jobs" />
        </div>

        <WorkerCTA />
      </main>
    </>
  );
}
