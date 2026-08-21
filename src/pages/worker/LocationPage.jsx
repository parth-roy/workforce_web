import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import RoleCard from '../../components/worker/RoleCard';
import SEO from '../../components/ui/SEO';
import { WorkerLocationSEO } from '../../seo/pageMetadata';
import { RelatedLocations } from '../../components/seo/RelatedLinks';
import { MapPin, Building2, Briefcase, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function LocationPage() {
  const { location: locSlug } = useParams();
  const { getLocationBySlug, roles } = useWorkforce();
  const [openFaq, setOpenFaq] = useState(null);

  const loc = getLocationBySlug(locSlug);
  if (!loc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Location Not Found</h1>
        <p className="text-slate-600 mb-6">This location page is not currently available.</p>
        <Link to="/jobs" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">Browse All Locations</Link>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: loc.name },
  ];

  const faqs = [
    { q: `Are there job opportunities in ${loc.name}?`, a: `Metro Mitra is actively building its worker network in ${loc.name}. Register on the app to receive job alerts as new opportunities become available.` },
    { q: 'How do I apply for jobs in this area?', a: 'Download the Metro Mitra Worker App, set your preferred work location during profile setup, and browse available roles.' },
    { q: `What industries are active in ${loc.name}?`, a: loc.industries ? loc.industries.join(', ') + '.' : 'We\'re currently mapping active industries in this location.' },
  ];

  return (
    <>
      <SEO {...WorkerLocationSEO(loc)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{loc.state}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Gig Work Opportunities<br />in {loc.name}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">{loc.description || `Discover flexible gig work and daily job opportunities in ${loc.name}, ${loc.state}.`}</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Local Context */}
        {loc.context && (
          <section className="mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-500" /> About {loc.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">{loc.context}</p>
              {loc.industries && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {loc.industries.map(ind => (
                    <span key={ind} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{ind}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Available Roles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-slate-600" /> Roles Available in {loc.name}
          </h2>
          <p className="text-slate-500 mb-8">Browse roles and explore opportunities specific to {loc.name}.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map(role => (
              <Link
                key={role.slug}
                to={`/jobs/${role.slug}/${loc.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{role.category || 'Gig'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{role.name}</h3>
                <p className="text-slate-600 text-sm line-clamp-2">{role.description}</p>
                <div className="mt-4 text-emerald-600 text-sm font-semibold">
                  View {role.name} in {loc.name} →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Network Building Section */}
        <section className="mb-16 bg-emerald-600 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Worker Network in {loc.name}</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl">
            Metro Mitra is growing its presence in {loc.name}. Register on the Worker App to be among the first to receive job alerts when new opportunities open in your area.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
              Download Worker App
            </button>
            <Link to="/jobs" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors border border-emerald-500">
              Browse Other Locations
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to Find Work in {loc.name}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Download the App', desc: 'Install Metro Mitra Worker App and register with your phone number.' },
              { step: '02', title: 'Set Your Location', desc: `Add ${loc.name} as your preferred work location during profile setup.` },
              { step: '03', title: 'Get Job Alerts', desc: 'Receive notifications when new openings match your profile in this area.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{item.step}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
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

        {/* Related Locations */}
        <section className="mb-12 pt-8 border-t border-slate-200">
          <RelatedLocations currentSlug={loc.slug} basePath="/jobs/location" max={4} title="Other Locations" />
        </section>

        <WorkerCTA />
      </main>
    </>
  );
}

