import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import { routes } from '../../routes/registry';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import SEO from '../../components/ui/SEO';
import { WorkerRoleLocationSEO } from '../../seo/pageMetadata';
import { RelatedRoles, RelatedLocations } from '../../components/seo/RelatedLinks';
import { MapPin, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';

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

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: role.name, path: routes.role.builder(role.slug) },
    { label: loc.name },
  ];

  const faqs = [
    { q: `Are there ${role.name} jobs in ${loc.name}?`, a: `Metro Mitra is building its worker network in ${loc.name}. Register to be notified when ${role.name.toLowerCase()} openings become available in this area.` },
    { q: `What qualifications are needed for a ${role.name}?`, a: role.requirements ? role.requirements.join('. ') : 'Requirements vary by employer. General requirements for this role are listed above.' },
    { q: 'How do I apply?', a: 'Download the Metro Mitra Worker App, create your profile, and apply for openings that match your skills and location.' },
  ];

  return (
    <>
      <SEO {...WorkerRoleLocationSEO(role, loc)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6 flex items-center gap-2 text-emerald-400 mb-3">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">{loc.name}, {loc.state}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {role.name} Jobs<br />in {loc.name}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Metro Mitra is establishing its {role.name.toLowerCase()} workforce network in {loc.name}. Register to be among the first to receive job alerts.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Status Notice */}
        <section className="mb-10">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-1">Building Our Network in {loc.name}</p>
              <p className="text-amber-800 text-sm">Metro Mitra is actively recruiting workers in this area. This page will be updated as verified job data becomes available. Register now to be notified first.</p>
            </div>
          </div>
        </section>

        {/* Role Definition */}
        <section className="mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About the {role.name} Role</h2>
            <p className="text-slate-600 leading-relaxed">{role.longDescription || role.description}</p>
          </div>
        </section>

        {/* Local Context */}
        {loc.context && (
          <section className="mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {loc.name}</h2>
              <p className="text-slate-600 leading-relaxed">{loc.context}</p>
              {loc.industries && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {loc.industries.map(ind => (
                    <span key={ind} className="bg-white border border-slate-300 text-slate-700 text-sm font-medium px-3 py-1 rounded-full">{ind}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Requirements */}
        {role.requirements && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Requirements for {role.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {role.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{req}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Opportunity Section */}
        <section className="mb-16 bg-emerald-600 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Register for {role.name} Openings in {loc.name}</h2>
          <p className="text-emerald-100 mb-6 max-w-2xl">
            Be the first to know when verified {role.name.toLowerCase()} opportunities open in {loc.name}. Download the Metro Mitra Worker App and set your location preference.
          </p>
          <button className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
            Download Worker App
          </button>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'Download the Metro Mitra Worker App and create your profile.' },
              { step: '02', title: 'Set Preferences', desc: `Add ${loc.name} as your preferred work area and select ${role.name} as your skill category.` },
              { step: '03', title: 'Get Notified', desc: 'Receive job alerts as new openings become available in your area.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{item.step}</div>
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

