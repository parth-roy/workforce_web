import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { IndividualServiceLocationSEO } from '../../seo/pageMetadata';
import { mockServices } from '../../data/mock/services';
import { mockLocations } from '../../data/mock/locations';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import ServiceBookingWizard from '../../components/hirer/ServiceBookingWizard';
import { RelatedServices } from '../../components/seo/RelatedLinks';
import { MapPin, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export default function IndividualServiceLocationPage() {
  const navigate = useNavigate();
  const { service: serviceSlug, location: locSlug } = useParams();

  const svc = mockServices.find(s => s.slug === serviceSlug);
  const loc = mockLocations.find(l => l.slug === locSlug);

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

  return (
    <>
      <SEO {...IndividualServiceLocationSEO(svc, loc)} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbs} light />
          <div className="mt-6 flex items-center gap-2 text-emerald-400 mb-3">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">{loc.name}, {loc.state}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            {svc.name} in {loc.name}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            {svc.description} Available in {loc.name}, {loc.state}.
          </p>
          <button
            onClick={() => navigate(`/services/${svc.slug}/hire`)}
            className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors"
          >
            Book in {loc.name} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Local Context */}
        {loc.context && (
          <section className="mb-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {loc.name}</h2>
              <p className="text-slate-600 leading-relaxed">{loc.context}</p>
            </div>
          </section>
        )}

        {/* Service in this location */}
        <section className="mb-10">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{svc.name} Service Details</h2>
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

        {/* CTA */}
        <section className="mb-10 bg-emerald-600 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Book {svc.name} in {loc.name}</h2>
            <p className="text-emerald-100 text-sm">Complete our simple form to describe your task.</p>
          </div>
          <button
            onClick={() => navigate(`/services/${svc.slug}/hire`)}
            className="shrink-0 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
          >
            Book Now
          </button>
        </section>

        {/* Related */}
        <section className="pt-8 border-t border-slate-200">
          <div className="mb-4">
            <Link to={`/services/${svc.slug}`} className="text-emerald-600 hover:underline font-semibold">
              ← Back to {svc.name}
            </Link>
          </div>
          <RelatedServices audience="individual" basePath="/services" currentSlug={svc.slug} max={4} title="Other Services" />
        </section>
      </main>
    </>
  );
}





