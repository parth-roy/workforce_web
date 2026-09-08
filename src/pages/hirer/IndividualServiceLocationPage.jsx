import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { IndividualServiceLocationSEO } from '../../seo/pageMetadata';
import { mockServices } from '../../data/mock/services';
import { mockLocations } from '../../data/mock/locations';
import { useCity } from '../../context/CityContext';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import ServiceBookingWizard from '../../components/hirer/ServiceBookingWizard';
import { RelatedServices } from '../../components/seo/RelatedLinks';
import { ArrowRight, X } from 'lucide-react';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function IndividualServiceLocationPage() {
  const navigate = useNavigate();
  const { service: serviceSlug, location: locSlug } = useParams();
  const { currentCity, setCity } = useCity();
  const [openFaq, setOpenFaq] = useState(null);

  const svc = mockServices.find(s => s.slug === serviceSlug);
  const loc = mockLocations.find(l => l.slug === locSlug) || (locSlug ? {
    id: `loc-${locSlug}`,
    slug: locSlug,
    name: locSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    state: 'India',
    localPricingConfig: { minimumFare: 299 },
    description: `Verified doorstep ${svc?.name || 'home'} services available across ${locSlug.replace(/-/g, ' ')}.`,
    context: `${locSlug.replace(/-/g, ' ')} has active daily demand for verified home service professionals, fast repairs, and experienced technicians.`,
    industries: ['Home Services', 'Retail', 'Trade Services', 'Logistics']
  } : null);

  // Synchronize global CityContext with viewed location
  useEffect(() => {
    if (loc && currentCity?.slug !== loc.slug) {
      setCity({
        name: loc.name,
        slug: loc.slug,
        state: loc.state || 'India',
        region: loc.state || 'India',
      }, true);
    }
  }, [loc, currentCity?.slug, setCity]);

  if (!svc || !loc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <Link to="/services" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
          Browse Services
        </Link>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: svc.name, path: `/services/${svc.slug}` },
    { label: loc.name },
  ];

  const minFare = loc.localPricingConfig?.minimumFare || 299;

  const faqs = [
    {
      q: `How much does a ${svc.name} service cost in ${loc.name}?`,
      a: `In ${loc.name}, verified ${svc.name.toLowerCase()} doorstep inspection starts from ₹${minFare}. Upfront itemized pricing is confirmed before any work begins with zero hidden broker markups.`
    },
    {
      q: `How quickly can a ${svc.name} arrive at my home in ${loc.name}?`,
      a: `MetroMitra dispatches the nearest verified ${svc.name.toLowerCase()} in ${loc.name}, typically reaching your doorstep within 45 to 60 minutes of booking confirmation.`
    },
    {
      q: `Can I get direct phone numbers of ${svc.name} workers in ${loc.name} without paying commission?`,
      a: `Yes! MetroMitra offers a ₹49 Direct Worker Contact Pass. You can instantly unlock 10 verified ${svc.name.toLowerCase()} phone numbers in ${loc.name} to talk, negotiate rates, and hire directly.`
    },
    {
      q: `Are ${svc.name} professionals in ${loc.name} background verified?`,
      a: `Every technician on MetroMitra undergoes strict government ID (Aadhaar) KYC verification and past work history checks prior to being dispatched in ${loc.name}.`
    },
    {
      q: `What if I am a ${svc.name} looking for jobs in ${loc.name}?`,
      a: `Skilled ${svc.name.toLowerCase()} technicians in ${loc.name} can download the MetroMitra Worker App or join online for ₹49 to receive daily customer bookings with 0% platform commission deductions.`
    }
  ];

  return (
    <>
      <SEO {...IndividualServiceLocationSEO(svc, loc)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6 flex items-center gap-2 text-emerald-400 mb-3">
            <img src="/google-maps-icon.webp" alt="Location" width={20} height={20} className="w-5 h-5 object-contain" />
            <span className="font-semibold">{loc.name}, {loc.state}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {svc.name} in {loc.name}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            {svc.description} Available across all residential and commercial localities in {loc.name}, {loc.state}.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(`/services/${svc.slug}/hire`)}
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Book in {loc.name} <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to={`/jobs/${svc.slug}/${loc.slug}`}
              className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 px-6 py-4 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
            >
              Worker Jobs in {loc.name} →
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* AI DIRECT ANSWER FACT BOX (GEO / AEO Engine) */}
        <section className="mb-10 bg-gradient-to-br from-emerald-50 via-white to-blue-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Overview & Local Service Fact Sheet — {loc.name}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Standard Rate</span>
              <span className="text-lg font-black text-slate-900">From ₹{minFare}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Doorstep Inspection</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Arrival SLA</span>
              <span className="text-lg font-black text-emerald-700">45-60 Mins</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Across {loc.name}</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Direct Unlock</span>
              <span className="text-lg font-black text-blue-700">₹49 Only</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">10 Verified Phones</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Commission</span>
              <span className="text-lg font-black text-purple-700">0% Cut</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Worker Keeps 100%</span>
            </div>
          </div>
        </section>

        {/* ₹49 Direct Contact Banner — Zero Broker / Hire Direct */}
        <div className="mb-10">
          <DirectContactBanner
            serviceName={svc.name}
            cityName={loc.name}
            serviceSlug={svc.slug}
            citySlug={loc.slug}
            variant="default"
          />
        </div>

        {/* Local Context */}
        {loc.context && (
          <section className="mb-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {svc.name} in {loc.name}</h2>
              <p className="text-slate-600 leading-relaxed">{loc.context}</p>
            </div>
          </section>
        )}

        {/* Service in this location */}
        <section className="mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{svc.name} Service Details in {loc.name}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{svc.longDescription || svc.description}</p>
            {svc.whatThisCovers && (
              <ul className="space-y-2">
                {svc.whatThisCovers.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="text-emerald-500 mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* HYPER-LOCAL FAQ ACCORDION (AEO Structured Answer Engine) */}
        <section className="mb-10 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions in {loc.name}</h2>
          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between font-semibold text-slate-900 text-base"
                  >
                    <span>{f.q}</span>
                    <span className="text-emerald-600 font-bold ml-4">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-200">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10 bg-emerald-600 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Book {svc.name} in {loc.name}</h2>
            <p className="text-emerald-100 text-sm">Instant doorstep technician dispatch with guaranteed pricing.</p>
          </div>
          <button
            onClick={() => navigate(`/services/${svc.slug}/hire`)}
            className="shrink-0 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow"
          >
            Book Now
          </button>
        </section>

        {/* Related & Internal Siloing */}
        <section className="pt-8 border-t border-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <Link to={`/services/${svc.slug}`} className="text-emerald-600 hover:underline font-semibold text-sm">
              ← All {svc.name} Hubs
            </Link>
            <Link to={`/jobs/${svc.slug}/${loc.slug}`} className="text-blue-600 hover:underline font-semibold text-sm">
              Daily {svc.name} Jobs in {loc.name} →
            </Link>
          </div>
          <RelatedServices audience="individual" basePath="/services" currentSlug={svc.slug} max={4} title={`Other Home Services in ${loc.name}`} />
        </section>
      </main>
    </>
  );
}





