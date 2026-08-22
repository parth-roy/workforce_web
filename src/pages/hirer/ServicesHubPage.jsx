import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ServicesHubSEO } from '../../seo/pageMetadata';
import { mockServices } from '../../data/mock/services';
import { Zap, Wrench, Package, Sparkles, Truck, Users, ChevronDown, ChevronUp, ArrowRight, Search , Phone } from 'lucide-react';

const ICON_MAP = { Zap, Wrench, Package, Sparkles, Truck, Users };

const CATEGORIES = ['All', 'Home Services', 'Logistics & Labor'];

export default function ServicesHubPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');
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


  const allServices = mockServices.filter(s => s.audiences.includes('individual'));

  const filtered = allServices.filter(s => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const faqs = [
    { q: 'How do I book a service?', a: 'Select a service, click Book This Service, and follow the step-by-step form to describe your task, location, and timing.' },
    { q: 'Are workers verified?', a: 'Workers on Metro Mitra complete a profile and identity verification process before being eligible for job placements.' },
    { q: 'What if I\'m not satisfied with the service?', a: 'Task completion is confirmed by you via OTP. If you have concerns, you can escalate through the app.' },
    { q: 'Is pricing available online?', a: 'Contact us for current pricing. Charges depend on task complexity, duration, and location.' },
  ];

  return (
    <>
      <SEO {...ServicesHubSEO()} />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">Individual Services</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Book Trusted Local &<br />
            <span className="text-emerald-400">Home Services</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            From electricians and plumbers to cleaning and moving help — Metro Mitra connects you with skilled workers for tasks around your home or office.
          </p>
          
        </div>
      </section>

      <main className="container mx-auto px-4 max-w-5xl py-16">

        {/* Search + Filter */}
        <section id="services" className="mb-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(svc => {
                const Icon = ICON_MAP[svc.icon] || Users;
                return (
                  <Link
                    key={svc.slug}
                    to={`/services/${svc.slug}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
                  >
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{svc.category}</div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">{svc.name}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{svc.description}</p>
                    {svc.useCases && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {svc.useCases.slice(0, 3).map(uc => (
                          <span key={uc} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{uc}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center text-emerald-600 text-sm font-semibold group-hover:gap-2 transition-all">
                      View Service <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <p className="text-slate-500 mb-3">No services match your search.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-emerald-600 font-semibold hover:underline">Clear filters</button>
            </div>
          )}
        </section>

        {/* How It Works */}
        <section className="mb-16 bg-slate-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">How It Works</h2>
          <p className="text-slate-500 text-center mb-10">Booking a service is simple and takes only a few minutes.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Your Service', desc: 'Browse the service catalog and select what you need.' },
              { step: '02', title: 'Describe the Task', desc: 'Tell us your location, number of workers needed, and any special instructions.' },
              { step: '03', title: 'Worker Arrives & Completes', desc: 'A worker is assigned and completes your task. You confirm via OTP.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-4">{step}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
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
        <section className="bg-emerald-600 text-white rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Need something else?</h2>
          <p className="text-emerald-100 mb-6 max-w-lg mx-auto">If you don't see the service you need, contact us and we'll help match you with the right worker.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"><Phone size={18} /> Contact Us</Link>
            <Link to="/hire-workers" className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors border border-emerald-500">
              Hire Multiple Workers
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}



