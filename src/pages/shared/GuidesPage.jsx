import React from 'react';
import SEO from '../../components/ui/SEO';
import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, Building2, ArrowRight, Clock } from 'lucide-react';

const GUIDE_CATEGORIES = [
  {
    id: 'workers',
    icon: Briefcase,
    title: 'Worker Guides',
    desc: 'For people looking to find gig work and manage their assignments.',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    guides: [
      { title: 'How to Register as a Worker', desc: 'Step-by-step guide to creating your Metro Mitra Worker profile and completing verification.' },
      { title: 'Choosing the Right Role', desc: 'Understanding the difference between warehouse helper, electrician, cleaner and other role categories.' },
      { title: 'Managing Your Schedule', desc: 'How to set availability, accept jobs, and manage shift timings within the app.' },
    ],
  },
  {
    id: 'hirers',
    icon: BookOpen,
    title: 'Hirer Guides',
    desc: 'For individuals booking home and local services.',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    guides: [
      { title: 'Booking Your First Service', desc: 'A walkthrough of the service booking process — from selecting a service to confirming task completion.' },
      { title: 'Understanding OTP Verification', desc: 'What the completion OTP is, why it matters, and when to use it.' },
      { title: 'What to Expect on Service Day', desc: 'How the worker arrival and task flow works in practice.' },
    ],
  },
  {
    id: 'business',
    icon: Building2,
    title: 'Business Guides',
    desc: 'For contractors and companies managing workforce deployments.',
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    guides: [
      { title: 'Setting Up a Workforce Requirement', desc: 'How to use the Requirement Builder to specify roles, quantities, and shift preferences.' },
      { title: 'Managing Multi-Location Teams', desc: 'An overview of the Corporate workspace features and how to organise multi-site deployments.' },
      { title: 'Contractor vs Corporate Pathways', desc: 'Understanding which Metro Mitra pathway fits your business model.' },
    ],
  },
];

export default function GuidesPage() {
  return (
    <>
      <SEO
        title="Guides & How-To Resources — Metro Mitra"
        description="Step-by-step guides for workers, individual hirers, and businesses using the Metro Mitra platform."
        canonical="https://metromitra.in/guides"
        robots="index, follow"
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">Resources</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Guides & How-To Resources</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Step-by-step guides to help you get the most out of Metro Mitra — whether you're a worker, hirer, or business.</p>
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-16">

        {/* Coming Soon Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-12 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 mb-1">Guides Coming Soon</p>
            <p className="text-amber-800 text-sm">
              Full guide articles are currently being prepared. The categories and topics below represent the planned content. Individual guide pages will be published as content becomes available.
            </p>
          </div>
        </div>

        {/* Guide categories */}
        {GUIDE_CATEGORIES.map(({ id, icon: Icon, title, desc, color, bg, border, guides }) => (
          <section key={id} className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 ${bg} ${border} border rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-500 text-sm">{desc}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <div key={guide.title} className={`${bg} border ${border} rounded-2xl p-6 relative`}>
                  <span className="absolute top-3 right-3 text-xs font-semibold bg-white/70 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">Coming Soon</span>
                  <h3 className="font-bold text-slate-900 mb-2 pr-16">{guide.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{guide.desc}</p>
                  <span className={`text-sm font-semibold ${color} flex items-center gap-1 opacity-50 cursor-not-allowed`}>
                    Read Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="bg-emerald-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Have a question not covered here?</h2>
          <p className="text-emerald-100 mb-6">Reach out to us directly and we'll help you get started.</p>
          <Link to="/contact" className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
            Contact Us
          </Link>
        </section>
      </main>
    </>
  );
}
