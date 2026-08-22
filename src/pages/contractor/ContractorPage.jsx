import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ContractorSEO } from '../../seo/pageMetadata';
import ContractorHero from '../../components/contractor/ContractorHero';
import ContractorRequirementBuilder from '../../components/contractor/ContractorRequirementBuilder';
import {  CheckCircle, ChevronDown, ChevronUp, Users, Clock, MapPin, Package, Zap, Wrench, Sparkles , Phone } from "lucide-react";

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

      <main className="container mx-auto px-4 max-w-5xl py-16">

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
          <p className="text-slate-500 text-center mb-10">Select from a range of skill categories for your worksite.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {WORKFORCE_TYPES.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="bg-white border border-slate-200 rounded-2xl p-5 text-center hover:border-amber-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-Worker Hiring */}
        <section className="mb-16 bg-slate-50 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Hire 1 to 50+ Workers for a Single Worksite</h2>
              <p className="text-slate-600 mb-6">
                Specify multiple roles, quantities, and shift preferences in a single requirement submission. Metro Mitra reviews availability and confirms your team.
              </p>
              <ul className="space-y-3">
                {['Multi-role team specification', 'Shift-based scheduling (day/night/rotating)', 'Temporary, weekly, monthly, or project-based', 'Single location or multi-site requirements'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { shift: 'Day Shift', time: '6am – 2pm' },
                { shift: 'Afternoon', time: '2pm – 10pm' },
                { shift: 'Night Shift', time: '10pm – 6am' },
                { shift: 'Rotating', time: 'As specified' },
              ].map(({ shift, time }) => (
                <div key={shift} className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                  <div className="flex items-center justify-center mb-2 text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{shift}</p>
                  <p className="text-xs text-slate-500">{time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">How It Works</h2>
          <p className="text-slate-500 text-center mb-10">From requirement to deployed team in a structured process.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Post Requirement', desc: 'Use the builder below to specify your roles, quantities, location, and shift preferences.' },
              { step: '02', title: 'Metro Mitra Reviews', desc: 'Our team reviews your requirement and checks worker availability in your area.' },
              { step: '03', title: 'Workers Matched', desc: 'Eligible workers are notified and confirmed for your worksite.' },
              { step: '04', title: 'Team Deployed', desc: 'Workers arrive on the agreed date and shift. Task completion tracked via app.' },
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
                <p className="text-slate-500 text-sm">Beta — frontend prototype. No live submission yet.</p>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-300">Prototype</span>
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

        {/* Final CTA */}
        <section className="bg-amber-500 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your team?</h2>
          <p className="text-amber-100 mb-6 max-w-xl mx-auto">Use the Requirement Builder above to describe your workforce need, or contact us for a discussion.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#builder" className="bg-white text-amber-700 px-6 py-3 rounded-xl font-bold hover:bg-amber-50 transition-colors">
              Open Builder
            </a>
            <Link to="/contact" className="bg-amber-600 text-white border border-amber-400 px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"><Phone size={18} /> Contact Us</Link>
          </div>
        </section>

      </main>
    </>
  );
}
