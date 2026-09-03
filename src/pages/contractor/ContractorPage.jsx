import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ContractorSEO } from '../../seo/pageMetadata';
import ContractorHero from '../../components/contractor/ContractorHero';
import ContractorRequirementBuilder from '../../components/contractor/ContractorRequirementBuilder';
import { CheckCircle, ChevronDown, ChevronUp, Users, Clock, MapPin, Package, Zap, Wrench, Sparkles, Phone } from "lucide-react";
import DirectContactBanner from '../../components/common/DirectContactBanner';

const WORKFORCE_TYPES = [
  { icon: Package, name: 'Loader / Helper', desc: 'General labour for loading, unloading, and manual handling.' },
  { icon: Zap, name: 'Electrician', desc: 'Certified electrical work for commercial and industrial settings.' },
  { icon: Wrench, name: 'Plumber', desc: 'Plumbing for worksite infrastructure and maintenance.' },
  { icon: Sparkles, name: 'Cleaner', desc: 'Worksite and facility cleaning on scheduled or one-off basis.' },
  { icon: Users, name: 'Packer', desc: 'Packaging, wrapping, and labelling for logistics operations.' },
  { icon: Package, name: 'Rigger', desc: 'Rigging and heavy equipment handling for industrial sites.' },
];

export default function ContractorPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'What is the minimum team size I can request?', a: 'No minimum team size is required. You can request from a single worker up to larger teams depending on availability in your area.' },
    { q: 'Can I hire multiple roles for a single worksite?', a: 'Yes. The Requirement Builder allows you to specify multiple roles and quantities for a single location.' },
    { q: 'What shift types are supported?', a: 'Day, afternoon, and night shifts are available. You can specify preferred shift timing in the requirement form.' },
    { q: 'How do I specify a long-term requirement?', a: 'Choose Project-Based or Monthly duration in the Requirement Builder. Our team will review and confirm worker availability for extended engagements.' },
    { q: 'Are workers covered by any formal agreements?', a: 'Worker engagements are governed by platform terms. For specific compliance documentation requirements, contact us via the form.' },
  ];

  return (
    <>
      <SEO {...ContractorSEO()} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">For Contractors</span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Scalable Workforce<br />
              <span className="text-amber-400">for Site Operators</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Metro Mitra helps site managers, factory owners, and project coordinators hire multi-role worker teams for their operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#builder" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400 transition-colors">
                Build Requirement
              </a>
              <a href="#how-it-works" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-12">

        {/* Direct Worker Contact Banner — Right After Hero */}
        <DirectContactBanner variant="default" />

        {/* Who This Is For */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Who This Is For</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">Metro Mitra's contractor pathway is designed for operators who need teams, not individuals.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Site Manager', desc: 'Hire loaders, helpers, and riggers for construction and logistics sites with flexible shift options.' },
              { title: 'Factory Owner', desc: 'Deploy production and maintenance staff on day, night, or rotating shifts for ongoing operations.' },
              { title: 'Project Coordinator', desc: 'Staff up for project-specific work (e.g., relocation, warehouse setup) with defined end dates.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workforce Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Workforce Types</h2>
          <p className="text-slate-500 text-center mb-10">Available roles for contractor workforce deployments.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {WORKFORCE_TYPES.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{name}</h3>
                <p className="text-slate-600 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">How It Works</h2>
          <p className="text-slate-500 text-center mb-10">Four simple steps from requirement to deployed team.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Define Roles', desc: 'Select the trades and headcount you need using the builder below.' },
              { step: '02', title: 'Set Schedule', desc: 'Choose shift timings, duration, and worksite location.' },
              { step: '03', title: 'Get Confirmed', desc: 'Metro Mitra reviews worker availability in your area and confirms.' },
              { step: '04', title: 'Workers Arrive', desc: 'Workers report to your site as scheduled, coordinated via platform.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-black mx-auto mb-3">{step}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-slate-600 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirement Builder */}
        <section id="builder" className="mb-16 scroll-mt-24">
          <div className="bg-white border-2 border-amber-200 rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-amber-50 border-b border-amber-200 px-8 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Workforce Requirement Builder</h2>
                <p className="text-slate-500 text-sm">Configure your worksite team requirement</p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">Active Form</span>
            </div>
            <div className="p-6">
              <ContractorRequirementBuilder />
            </div>
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

        {/* CTA */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a custom requirement?</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">If your requirement involves specialised trades or non-standard shift schedules, talk directly to our operations team.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#builder" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors">
              Use Builder
            </a>
            <Link to="/contact" className="bg-amber-600 text-white border border-amber-400 px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"><Phone size={18} /> Contact Us</Link>
          </div>
        </section>

      </main>
    </>
  );
}
