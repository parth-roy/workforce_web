import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import WorkerHero from '../../components/worker/WorkerHero';
import RoleCard from '../../components/worker/RoleCard';
import LocationCard from '../../components/worker/LocationCard';
import WorkerCTA from '../../components/worker/WorkerCTA';
import { WorkerHubSEO } from '../../seo/pageMetadata';
import {
  Briefcase, MapPin, CheckCircle, ChevronDown, ChevronUp,
  Clock, Shield, Smartphone, ArrowRight
} from 'lucide-react';

const CATEGORIES = ['All', 'Home Services', 'Logistics & Labor'];

export default function WorkerHubPage() {
  const { roles, locations } = useWorkforce();
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
    } else if (!cat) {
      setActiveCategory('All');
    }
  }, [location.search]);


  const filteredRoles = activeCategory === 'All'
    ? roles
    : roles.filter(r => r.category === activeCategory);

  const faqs = [
    { q: 'How do I apply for a job on Metro Mitra?', a: 'Download the Metro Mitra Worker App, create your profile, and browse available job openings in your preferred location and role category.' },
    { q: 'When do I get paid?', a: 'Payment timing depends on the specific job terms. Each listing includes payment information. Review before accepting a job.' },
    { q: 'What verification is required?', a: 'You will need to complete a basic profile and identity verification within the app. Specific skill certifications may be required for certain roles (e.g., ITI for electricians).' },
    { q: 'Can I choose my own work schedule?', a: 'Many gig opportunities offer flexible scheduling. Availability and shift types vary by job posting.' },
  ];

  return (
    <>
      <SEO {...WorkerHubSEO()} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">Find Work</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Find Flexible Gig Work<br />
              <span className="text-emerald-400">Near You</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl">
              Metro Mitra connects workers with warehouse, logistics, and home service jobs across West Bengal. Browse roles, set your location preference, and get started.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://play.google.com/store/apps/details?id=com.gomytruck.workforce" target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"><Smartphone className="w-5 h-5" /> Download Worker App</a>
              
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-emerald-600 text-white py-4 px-4">
        <div className="container mx-auto max-w-5xl flex flex-wrap justify-center gap-6 text-sm font-semibold">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Transparent Payouts</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Flexible Scheduling</span>
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Work Near Home</span>
          <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Verified Employers</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 max-w-5xl">

        {/* Role Category Filter */}
        <section id="roles" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Browse Available Roles</h2>
          <p className="text-slate-500 text-center mb-8">Find work that matches your skills and experience.</p>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredRoles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map(role => (
                <RoleCard key={role.slug} role={role} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <p className="text-slate-500">No roles found in this category. Try a different filter.</p>
            </div>
          )}
        </section>

        {/* Locations */}
        <section className="mb-16 bg-slate-50 rounded-3xl p-8 md:p-12 -mx-4 md:mx-0">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Explore Locations</h2>
          <p className="text-slate-500 text-center mb-8">Metro Mitra is active and growing across West Bengal.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map(loc => (
              <LocationCard key={loc.slug} location={loc} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">How Workers Join</h2>
          <p className="text-slate-500 text-center mb-10">Getting started is simple.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Smartphone, title: 'Download the App', desc: 'Install Metro Mitra Worker App on Android. Available on Google Play.' },
              { step: '02', icon: Shield, title: 'Complete Your Profile', desc: 'Add your skills, preferred location, and complete the basic verification steps.' },
              { step: '03', icon: Briefcase, title: 'Apply & Work', desc: 'Browse open jobs, apply with a tap, and manage your assignments within the app.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white rounded-full text-xs font-black flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Work with Metro Mitra</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: 'Transparent Payouts', desc: 'Know exactly what you earn before accepting a job. No hidden deductions.' },
                { title: 'Work Near Home', desc: 'Filter jobs by your preferred location — no long commutes.' },
                { title: 'Flexible Scheduling', desc: 'Day, evening, and night shift options across different job types.' },
                { title: 'Reliable Employers', desc: 'Jobs are posted by verified businesses. Your completed work is confirmed via OTP.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-5 border border-emerald-100">
                  <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                    <p className="text-slate-600 text-sm">{desc}</p>
                  </div>
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

        {/* Internal links */}
        <div className="border-t border-slate-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/services" className="group flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            <div>
              <p className="text-slate-500 text-sm mb-1">Need to hire?</p>
              <p className="font-bold text-slate-900">Book a Home Service →</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </Link>
          <Link to="/for-contractors" className="group flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
            <div>
              <p className="text-slate-500 text-sm mb-1">Have a worksite?</p>
              <p className="font-bold text-slate-900">Hire Multiple Workers →</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </Link>
        </div>

        <WorkerCTA />
      </main>
    </>
  );
}



