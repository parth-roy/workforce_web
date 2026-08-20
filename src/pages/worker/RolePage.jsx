import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import WorkerCTA from '../../components/worker/WorkerCTA';
import SEO from '../../components/ui/SEO';
import { WorkerRoleSEO } from '../../seo/pageMetadata';
import { RelatedRoles, RelatedLocations } from '../../components/seo/RelatedLinks';
import { CheckCircle, MapPin, Briefcase, Users, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function RolePage() {
  const { role: roleSlug } = useParams();
  const { getRoleBySlug, locations } = useWorkforce();
  const [openFaq, setOpenFaq] = useState(null);

  const role = getRoleBySlug(roleSlug);
  if (!role) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Role Not Found</h1>
        <p className="text-slate-600 mb-6">The role you're looking for doesn't exist or may have been updated.</p>
        <Link to="/jobs" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">Browse All Roles</Link>
      </div>
    </div>
  );

  const breadcrumbs = [
    { label: 'Jobs', path: '/jobs' },
    { label: role.name },
  ];

  const mockFaqs = role.faqs || [
    { q: `What experience do I need to work as a ${role.name}?`, a: role.requirements ? role.requirements[0] : 'Basic relevant experience is expected. Specific requirements are listed in the job posting.' },
    { q: 'How do I apply?', a: 'Download the Metro Mitra Worker App, complete your profile, and apply for available openings in your location.' },
    { q: 'Are there shift options?', a: 'Yes. Day, afternoon, and night shifts are available depending on the employer\'s requirement.' },
  ];

  return (
    <>
      <SEO {...WorkerRoleSEO(role)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">{role.category || 'Gig Work'}</span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{role.name}</h1>
              <p className="text-lg text-slate-300 max-w-2xl">{role.tagline || role.description}</p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Find Openings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Role Definition */}
        <section className="mb-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What is a {role.name}?</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{role.longDescription || role.description}</p>
          </div>
        </section>

        {/* Responsibilities + Requirements */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          {role.responsibilities && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" /> Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {role.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {role.requirements && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-600" /> Typical Requirements
              </h2>
              <ul className="space-y-3">
                {role.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Work Environment */}
        {role.workEnvironment && (
          <section className="mb-16">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-500" /> Work Environment
              </h2>
              <p className="text-slate-600 leading-relaxed">{role.workEnvironment}</p>
            </div>
          </section>
        )}

        {/* Opportunity Section */}
        <section className="mb-16 bg-slate-900 text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4">Find {role.name} Opportunities</h2>
          <p className="text-slate-300 mb-6">
            Metro Mitra is actively building its worker network across West Bengal. Register through the Worker App to receive notifications about new {role.name.toLowerCase()} openings in your area.
          </p>
          <div className="flex flex-wrap gap-3">
            {locations.map(loc => (
              <Link
                key={loc.slug}
                to={`/jobs/${role.slug}/${loc.slug}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <MapPin className="w-4 h-4" /> {role.name} in {loc.name}
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to Start Working</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Download the App', desc: 'Install Metro Mitra Worker App and create your profile with basic details.' },
              { step: '02', title: 'Complete Verification', desc: 'Complete the worker profile verification steps within the app.' },
              { step: '03', title: 'Apply for Jobs', desc: 'Browse available opportunities and apply for roles matching your skills.' },
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
            {mockFaqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
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
        <section className="mb-12 pt-8 border-t border-slate-200">
          <RelatedRoles currentSlug={role.slug} max={4} title="Related Roles" />
        </section>

        <WorkerCTA />
      </main>
    </>
  );
}
