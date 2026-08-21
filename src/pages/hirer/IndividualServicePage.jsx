import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { IndividualServiceSEO } from '../../seo/pageMetadata';
import { mockServices } from '../../data/mock/services';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import ServiceBookingWizard from '../../components/hirer/ServiceBookingWizard';
import { RelatedServices } from '../../components/seo/RelatedLinks';
import {
  Zap, Wrench, Package, Sparkles, Truck, Users, CheckCircle,
  ChevronDown, ChevronUp, X, ArrowRight
} from 'lucide-react';

const ICON_MAP = { Zap, Wrench, Package, Sparkles, Truck, Users };

export default function IndividualServicePage() {
  const navigate = useNavigate();
  const { service: serviceSlug } = useParams();
  const [openFaq, setOpenFaq] = useState(null);

  const svc = mockServices.find(s => s.slug === serviceSlug);

  if (!svc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h1>
        <p className="text-slate-600 mb-6">The service you're looking for doesn't exist or may have been updated.</p>
        <Link to="/services" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors">
          Browse All Services
        </Link>
      </div>
    </div>
  );

  const Icon = ICON_MAP[svc.icon] || Users;
  const breadcrumbs = [
    { label: 'Services', path: '/services' },
    { label: svc.name },
  ];

  const serviceOptions = [
    { name: 'Basic', desc: svc.useCases?.[0] || 'Standard task completion', note: 'Contact for pricing' },
    { name: 'Standard', desc: svc.useCases?.[1] || 'Comprehensive service package', note: 'Contact for pricing' },
    { name: 'Extended', desc: svc.useCases?.[2] || 'Full-day or specialised engagement', note: 'Contact for pricing' },
  ];

  return (
    <>
      <SEO {...IndividualServiceSEO(svc)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-emerald-400" />
              </div>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">{svc.category}</span>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{svc.name}</h1>
              <p className="text-lg text-slate-300 max-w-2xl">{svc.tagline || svc.description}</p>
            </div>
            <button
              onClick={() => navigate(`/services/${svc.slug}/hire`)}
              className="shrink-0 bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              Book This Service <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Overview */}
        <section className="mb-12">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Service Overview</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{svc.longDescription || svc.description}</p>
          </div>
        </section>

        {/* Who It's For + What This Covers */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          {svc.whoIsItFor && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Who Is It For?</h2>
              <ul className="space-y-3">
                {svc.whoIsItFor.map((who, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                    {who}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {svc.whatThisCovers && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-5">What This Covers</h2>
              <ul className="space-y-3">
                {svc.whatThisCovers.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Service Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {serviceOptions.map(opt => (
              <div key={opt.name} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{opt.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{opt.desc}</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pricing</p>
                  <p className="text-slate-700 font-semibold">{opt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">Pricing depends on task complexity, duration, and location. Contact us for a specific quote.</p>
        </section>

        {/* Requirements */}
        {svc.requirements && (
          <section className="mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Typical Requirements</h2>
              <p className="text-slate-600 mb-4 text-sm">Please have the following ready before booking:</p>
              <ul className="space-y-2">
                {svc.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* How It Works */}
        {svc.howItWorks && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {svc.howItWorks.map(({ step, title, desc }) => (
                <div key={step} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-4">{`0${step}`}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Book CTA */}
        <section className="mb-12 bg-emerald-600 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to book {svc.name}?</h2>
            <p className="text-emerald-100">Complete the form in minutes. No account required for the prototype.</p>
          </div>
          <button
            onClick={() => navigate(`/services/${svc.slug}/hire`)}
            className="shrink-0 bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center gap-2"
          >
            Book Now <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        {/* FAQ */}
        {svc.faqs && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {svc.faqs.map((faq, i) => (
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
        )}

        {/* Related */}
        <section className="pt-8 border-t border-slate-200">
          <RelatedServices audience="individual" basePath="/services" currentSlug={svc.slug} max={4} title="Related Services" />
        </section>
      </main>
    </>
  );
}




