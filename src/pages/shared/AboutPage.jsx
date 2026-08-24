import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { CheckCircle, Users, Home, Building2, Shield, Eye, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Metro Mitra — Gig Workforce Platform"
        description="Learn about Metro Mitra, our mission to connect skilled workers with employers across West Bengal, and how our platform works."
        canonical="https://metromitra.in/about"
        robots="index, follow"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-32 pb-16 lg:pt-32 lg:pb-0 overflow-x-clip border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
            <div className="max-w-2xl lg:pt-16 lg:pb-56 xl:pl-12 flex flex-col justify-start">
              <div>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  About Us
                </span>
                
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                  About Metro Mitra
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                  A gig workforce platform connecting skilled workers with individuals and businesses across West Bengal.
                </p>
              </div>
            </div>

            <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
              <img 
                src="/about-hero.webp" 
                alt="About Metro Mitra" 
                className="w-full max-w-[900px] h-auto object-contain transform origin-bottom lg:scale-[1.1] xl:scale-[1.2] 2xl:scale-[1.25] xl:translate-x-[5%] xl:translate-y-[0%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-4xl py-16">

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connecting skilled workers with employers who need them — transparently, efficiently, and fairly.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What Metro Mitra Does</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Home, title: 'Individual Hiring', desc: 'Households and small offices can book electricians, plumbers, cleaners, movers, and general helpers for one-time tasks.' },
              { icon: Users, title: 'Team Staffing', desc: 'Contractors and businesses can hire multi-worker teams for warehouse, manufacturing, construction, and logistics work.' },
              { icon: Building2, title: 'Worker Empowerment', desc: 'Workers can discover gig opportunities near their location, apply via mobile app, and manage their assignments transparently.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Approach */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Platform Approach</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <ul className="space-y-4">
              {[
                'Workers register through the Metro Mitra app and complete a profile verification process before becoming eligible for placements.',
                'Hirers describe their task, location, and timing. Workers are matched based on availability and skill match.',
                'Task completion is OTP-verified — the hirer confirms before any payment or closure is processed.',
                'Pricing is transparent for the task at hand. No hidden platform fees charged to workers without disclosure.',
                'We focus on local employment — matching workers to opportunities near their home areas.',
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Trust & Safety</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Profile Verification', desc: 'Workers complete identity and profile verification before being shown to hirers. Additional certifications may be required for skilled roles.' },
              { icon: Eye, title: 'OTP-Confirmed Completion', desc: 'No work is marked complete without a confirmation code from the hirer. This protects both parties.' },
              { icon: CheckCircle, title: 'Transparent Earnings', desc: 'Workers see job terms before accepting. Hirers see task scope before confirming. No surprise changes mid-assignment.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTAs */}
        <section className="grid md:grid-cols-2 gap-6">
          <Link to="/services" className="group bg-emerald-600 text-white rounded-2xl p-8 hover:bg-emerald-700 transition-colors">
            <h3 className="text-xl font-bold mb-2">Hire a Service</h3>
            <p className="text-emerald-100 text-sm mb-4">Book skilled workers for your home or office tasks.</p>
            <span className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all">Browse Services <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/jobs" className="group bg-slate-900 text-white rounded-2xl p-8 hover:bg-slate-800 transition-colors">
            <h3 className="text-xl font-bold mb-2">Join as Employee</h3>
            <p className="text-slate-300 text-sm mb-4">Discover gig opportunities near you across West Bengal.</p>
            <span className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all">Browse Jobs <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </section>
      </main>
    </>
  );
}

