import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { CorporateSEO } from '../../seo/pageMetadata';
import CorporateWorkforceRequirementBuilder from '../../components/corporate/CorporateWorkforceRequirementBuilder';
import { CheckCircle, ChevronDown, ChevronUp, Building2, Package, Users, Clock, MapPin, AlertTriangle } from 'lucide-react';

const INDUSTRIES = [
  { icon: Package, title: 'Logistics & Warehousing', desc: 'Helpers, loaders, and packers for fulfillment centers and distribution hubs.' },
  { icon: Building2, title: 'Manufacturing & Production', desc: 'Line workers, riggers, and quality checkers for factory operations.' },
  { icon: Users, title: 'Retail & Hospitality', desc: 'Setup staff, cleaners, and support workers for commercial premises.' },
];

export default function CorporatePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'What types of companies use Metro Mitra for staffing?', a: 'Logistics companies, e-commerce fulfillment centers, manufacturing units, retail chains, and hospitality establishments.' },
    { q: 'Can I request workers for multiple locations?', a: 'Yes. The Corporate Requirement Builder supports multi-location workforce planning. You can specify different roles and quantities per location.' },
    { q: 'Is there a minimum engagement duration?', a: 'No fixed minimum. We support daily, weekly, monthly, and project-based engagements depending on worker availability in your area.' },
    { q: 'How do I track worker attendance?', a: 'Dashboard and attendance tracking features are part of the corporate backend integration currently in progress. Task completion is currently OTP-verified per assignment.' },
    { q: 'How do I start the onboarding process?', a: 'Contact us via the form at /contact with your organization name, workforce requirement, and location. Our team will reach out to discuss.' },
  ];

  return (
    <>
      <SEO {...CorporateSEO()} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">For Companies</span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Enterprise Workforce<br />
              <span className="text-blue-400">Solutions for Scaling Businesses</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Metro Mitra enables enterprise clients to plan, deploy, and manage workforce across multiple locations, roles, and shifts from a single platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#builder" className="bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-400 transition-colors">
                Explore Solutions
              </a>
              <Link to="/contact" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-16">

        {/* Executive Summary */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Multi-Location Workforce', desc: 'Deploy teams across multiple locations from a unified requirement submission.' },
              { icon: CheckCircle, title: 'Structured Worker Profiles', desc: 'Workers complete profile verification before placement. Skill-matched assignments.' },
              { icon: Clock, title: 'Flexible Shift Planning', desc: 'Day, night, and rotating shifts. Daily to project-based duration options.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Who This Is For</h2>
          <p className="text-slate-500 text-center mb-10">Industries that benefit from Metro Mitra's corporate workforce model.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {INDUSTRIES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workforce Solutions */}
        <section className="mb-16 bg-slate-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Workforce Solutions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Multiple Roles', desc: 'Specify Loaders, Helpers, Packers, Electricians, and Cleaners in a single requirement.' },
              { title: 'Multiple Locations', desc: 'Add distinct worksites within a single deployment request. Each location can have different role mixes.' },
              { title: 'Shift-Based Scheduling', desc: 'Day (6am–2pm), Afternoon (2pm–10pm), Night (10pm–6am), and Rotating shifts.' },
              { title: 'Workforce Documentation', desc: 'Worker profiles include identity verification. Additional compliance documentation is part of the roadmap.' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-600 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">How It Works</h2>
          <p className="text-slate-500 text-center mb-10">A structured onboarding and deployment process.</p>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Submit Structure', desc: 'Use the Workforce Builder to specify your roles, locations, and shift requirements.' },
              { step: '02', title: 'Metro Mitra Reviews', desc: 'We review your requirement and confirm worker availability in each location.' },
              { step: '03', title: 'Teams Deployed', desc: 'Workers are confirmed and deployed to your worksites on the agreed schedule.' },
              { step: '04', title: 'Ongoing Management', desc: 'Dashboard reporting and attendance features are part of the backend integration roadmap.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black mx-auto mb-3">{step}</div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">{title}</h3>
                <p className="text-slate-600 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirement Builder */}
        <section id="builder" className="mb-16 scroll-mt-24">
          <div className="bg-white border-2 border-blue-200 rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-blue-50 border-b border-blue-200 px-8 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Corporate Workforce Planner</h2>
                <p className="text-slate-500 text-sm">Prototype — plan your multi-location workforce requirement.</p>
              </div>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-300">Prototype</span>
            </div>
            <div className="p-6">
              <CorporateWorkforceRequirementBuilder />
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="mb-16">
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-300">Prototype Dashboard</p>
                <p className="text-slate-400 text-sm">Live dashboard — workforce tracking, attendance, and reporting — will be available after onboarding. The corporate portal is currently in backend development.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {['Total Workers Deployed', 'Active Locations', 'Shifts This Week'].map(metric => (
                <div key={metric} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <div className="h-8 bg-white/10 rounded mb-2 animate-pulse" />
                  <p className="text-slate-500 text-xs">{metric}</p>
                </div>
              ))}
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
        <section className="bg-blue-600 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to plan your enterprise workforce?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">Contact our team to discuss your requirements or use the Workforce Planner above to draft your initial requirement.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Contact Us
            </Link>
            <a href="#builder" className="bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
              Open Planner
            </a>
          </div>
        </section>

      </main>
    </>
  );
}
