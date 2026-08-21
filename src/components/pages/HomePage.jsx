import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Briefcase, User, Building2, HardHat,
  CheckCircle, Clock, Shield, Zap, ChevronDown, ChevronUp,
  MapPin, Wrench, Package, Sparkles, Truck, Users, Smartphone
} from 'lucide-react';
import SEO from '../ui/SEO';
import { HomePageSEO } from '../../seo/pageMetadata';
import { mockServices } from '../../data/mock/services';
import { mockLocations } from '../../data/mock/locations';

const ICON_MAP = { Zap, Wrench, Package, Sparkles, Truck, Users };

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const individualServices = mockServices.filter(s => s.audiences.includes('individual')).slice(0, 6);

  const faqs = [
    {
      question: 'How do I hire a worker through Metro Mitra?',
      answer: 'Browse the service catalog, select the type of task you need help with, and fill in the booking form. Workers are assigned based on availability in your area.',
    },
    {
      question: 'Are workers verified?',
      answer: 'Workers on Metro Mitra complete a profile and identity verification process through the app before being eligible for placements. Specific roles may require additional certification (e.g., ITI for electricians).',
    },
    {
      question: 'What areas does Metro Mitra serve?',
      answer: 'Metro Mitra is currently building its network in Barrackpore, Dankuni, Kolkata, and surrounding areas of West Bengal. We are expanding to more locations as our worker network grows.',
    },
    {
      question: 'Is Metro Mitra available for businesses?',
      answer: 'Yes. We support individual hirers, manpower contractors, and corporate clients. B2B workforce solutions (multi-worker teams, shift-based deployment) are available via our Contractor and Corporate pathways.',
    },
    {
      question: 'How is task completion verified?',
      answer: 'Task completion is confirmed by the hirer via OTP. Workers cannot mark a job complete without the hirer\'s confirmation code.',
    },
  ];

  const journeys = [
    {
      icon: User, title: 'Individual Hirer', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100',
      desc: 'Book a cleaner, electrician, plumber, or helper for your home or office.',
      cta: 'Browse Services', href: '/services?category=Home+Services',
    },
    {
      icon: Briefcase, title: 'Find Work', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200',
      desc: 'Discover gig opportunities as a warehouse helper, electrician, cleaner, and more.',
      cta: 'Browse Jobs', href: '/jobs',
    },
    {
      icon: HardHat, title: 'Contractor', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
      desc: 'Hire multi-worker teams for construction sites, warehouses, or project work.',
      cta: 'For Contractors', href: '/for-contractors',
    },
    {
      icon: Building2, title: 'Corporate', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
      desc: 'Enterprise workforce solutions for multiple locations, roles, and shifts.',
      cta: 'For Companies', href: '/for-companies',
    },
  ];

  return (
    <>
      <SEO {...HomePageSEO()} />
      <div className="w-full min-h-screen bg-white font-sans">

        {/* 1. HERO */}
        <section className="relative bg-slate-900 pt-28 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 z-0" />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-500/20 text-emerald-300 text-sm font-semibold tracking-wide mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Gig Workforce Platform — West Bengal
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">Full-Stack Gig <br /><span className="text-emerald-400">Economy Platform</span></h1>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl">
                Metro Mitra is a technology-driven, full-stack gig economy platform matching households and businesses with trained gig workers across West Bengal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services?category=Home+Services" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-colors flex items-center gap-2">
                  Hire Services <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/jobs" className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors">
                  Find Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CHOOSE YOUR JOURNEY */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">What brings you here?</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Metro Mitra serves multiple stakeholders. Choose the experience that fits your need.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {journeys.map(({ icon: Icon, title, color, bg, border, desc, cta, href }) => (
                <Link key={title} to={href} className={`group rounded-2xl border-2 ${border} ${bg} p-7 hover:shadow-lg transition-all`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white shadow-sm`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{desc}</p>
                  <span className={`text-sm font-bold ${color} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    {cta} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. INDIVIDUAL SERVICES */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Popular Home & Local Services</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Book skilled workers for tasks around your home or office.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {individualServices.map(svc => {
                const Icon = ICON_MAP[svc.icon] || Users;
                return (
                  <Link key={svc.slug} to={`/services/${svc.slug}`} className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm leading-snug">{svc.shortName || svc.name}</p>
                  </Link>
                );
              })}
            </div>
            <div className="text-center">
              <Link to="/services" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How Metro Mitra Works</h2>
            <p className="text-slate-400 text-center mb-14 max-w-xl mx-auto">From request to task completion — a simple, transparent process.</p>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { step: '01', title: 'Post Your Requirement', desc: 'Describe what you need — service type, location, duration, and timing.' },
                { step: '02', title: 'Worker Assigned', desc: 'A qualified worker from your area is matched and confirmed for the job.' },
                { step: '03', title: 'Task Completed & Verified', desc: 'The worker completes the task. You confirm completion via OTP before payment is released.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white font-black text-xl">{step}</div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FIND WORK CTA */}
        <section className="py-20 bg-emerald-600 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Are you a skilled worker looking for jobs?</h2>
                <p className="text-emerald-100 mb-8 text-lg">
                  Join the Metro Mitra worker network. Find warehouse, logistics, electrical, cleaning, and other gig opportunities near you.
                </p>
                <ul className="space-y-3 mb-8">
                  {['Work near your home', 'Transparent payouts', 'Flexible shift timings', 'OTP-confirmed completion'].map(b => (
                    <li key={b} className="flex items-center gap-3 text-emerald-100">
                      <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Link to="/jobs" className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
                    <Smartphone className="w-5 h-5" /> Browse Jobs
                  </Link>
                  <Link to="/jobs" className="bg-emerald-700 text-white border border-emerald-500 px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors">
                    View Roles
                  </Link>
                </div>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-4">
                {[
                  { label: 'Warehouse Helper', cat: 'Logistics' },
                  { label: 'Electrician', cat: 'Home Services' },
                  { label: 'Cleaner', cat: 'Home Services' },
                  { label: 'Moving Helper', cat: 'Relocation' },
                ].map(r => (
                  <div key={r.label} className="bg-emerald-700/50 border border-emerald-500/50 rounded-xl p-4">
                    <p className="text-xs text-emerald-300 font-semibold mb-1">{r.cat}</p>
                    <p className="font-bold text-white">{r.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. ENTERPRISE WORKFORCE */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 block">For Businesses</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Scalable Workforce Solutions</h2>
                <p className="text-slate-600 mb-8 text-lg">
                  Whether you're a contractor hiring a 5-person team or a company deploying workers across multiple locations, Metro Mitra offers structured workforce management.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Users, title: 'Multi-Role Teams', desc: 'Hire multiple roles for a single worksite or project.' },
                    { icon: Shield, title: 'Structured Compliance', desc: 'Profile-verified workers with documented assignments.' },
                    { icon: Clock, title: 'Shift-Based Planning', desc: 'Day, night, and rotating shift options.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{title}</h3>
                        <p className="text-slate-600 text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/for-contractors" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">For Contractors</Link>
                  <Link to="/for-companies" className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">For Companies</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { cat: 'Logistics', roles: 'Loaders, Helpers, Packers' },
                  { cat: 'Home Services', roles: 'Electricians, Plumbers, Cleaners' },
                  { cat: 'Manufacturing', roles: 'Riggers, Helpers, Quality Checkers' },
                  { cat: 'Hospitality', roles: 'Cleaners, Setup Staff, Servers' },
                ].map(c => (
                  <div key={c.cat} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{c.cat}</p>
                    <p className="text-sm font-semibold text-slate-700">{c.roles}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. LOCATION DISCOVERY */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Where We Operate</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
              Metro Mitra is building its worker network across West Bengal. More locations coming as the network grows.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {mockLocations.map(loc => (
                <Link key={loc.slug} to={`/jobs/location/${loc.slug}`} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-400">{loc.state}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{loc.name}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2">{loc.description}</p>
                  <div className="mt-3 text-emerald-600 text-sm font-semibold group-hover:underline">View jobs →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 8. WHY METRO MITRA */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">Why Metro Mitra? <span className="block text-xl text-emerald-600 mt-2">A Technology-Driven, Full-Stack Gig Economy Platform</span></h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">A platform built around transparency and reliability.</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: 'OTP-Verified Completion', desc: 'No payment is released until you confirm task completion with your OTP. Your control, your confirmation.' },
                { icon: Clock, title: 'Flexible Scheduling', desc: 'Book for immediate tasks or schedule ahead. Day, evening, and shift-based options available.' },
                { icon: MapPin, title: 'Local Workers', desc: 'Workers are matched based on proximity to your location, reducing travel time and improving reliability.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/10 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-white">{faq.question}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="py-20 bg-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-4">Get started with Metro Mitra</h2>
            <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">
              Whether you need to hire for your home or find work near you — Metro Mitra connects you to the right person.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/services" className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center gap-2">
                Hire Services <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/jobs" className="bg-emerald-700 text-white border border-emerald-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 transition-colors">
                Find Work
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}




