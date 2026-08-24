import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ServiceHowItWorksSEO } from '../../seo/pageMetadata';
import { Search, MapPin, Calendar, FileText, CheckCircle, Truck } from 'lucide-react';

export default function ServiceHowItWorksPage() {
  const steps = [
    { icon: Search, title: 'Choose Service', desc: 'Select the exact service or worker type you need from our directory.' },
    { icon: FileText, title: 'Tell Us What You Need', desc: 'Specify how many workers you need and briefly describe the task.' },
    { icon: MapPin, title: 'Add Location', desc: 'Provide the worksite location so we can match you with nearby professionals.' },
    { icon: Calendar, title: 'Select Timing', desc: 'Choose the duration and schedule for when the work should happen.' },
    { icon: CheckCircle, title: 'Review & Request', desc: 'Review your total estimate (when available) and submit your request.' },
    { icon: Truck, title: 'Worker Fulfillment', desc: 'Verified workers accept your request and arrive at your location to complete the job.' }
  ];

  return (
    <>
      <SEO {...ServiceHowItWorksSEO()} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-32 pb-16 lg:pt-32 lg:pb-0 overflow-x-clip border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
            <div className="max-w-2xl lg:pt-16 lg:pb-64 xl:pl-12 flex flex-col justify-start">
              <div>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  How It Works
                </span>
                
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                  How Hiring Works
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                  A simple, transparent process to request services and hire verified workers on Metro Mitra.
                </p>
              </div>
            </div>

            <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
              <img 
                src="/service-how-it-works-hero.webp" 
                alt="How Hiring Works on Metro Mitra" 
                className="w-full max-w-[900px] h-auto object-contain transform origin-bottom lg:scale-[1.1] xl:scale-[1.2] 2xl:scale-[1.25] xl:translate-x-[5%] xl:translate-y-[0%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-center mb-16">
          <div className="order-2 md:order-1 bg-slate-100 rounded-3xl p-8 border border-slate-200 lg:sticky lg:top-24">
            <div className="aspect-[3/4] bg-white rounded-2xl shadow-xl overflow-hidden relative max-w-[320px] mx-auto border-4 border-slate-200 flex flex-col relative">
              <div className="h-12 border-b border-slate-100 flex items-center px-4 justify-between bg-slate-50">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              </div>
              <div className="flex-1 p-5 bg-slate-50">
                <div className="h-4 w-32 bg-slate-800 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="aspect-square bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full"></div>
                    <div className="h-2 w-16 bg-slate-300 rounded"></div>
                  </div>
                  <div className="aspect-square bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                    <div className="h-2 w-16 bg-slate-300 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-40 bg-slate-400 rounded mb-3"></div>
                <div className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm mb-4"></div>
                <div className="h-10 w-full bg-emerald-600 rounded-xl mt-auto"></div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Hiring Process</h2>
            <p className="text-slate-600 mb-6 text-lg max-w-2xl">
              From requesting a service to final payment, our platform ensures a smooth and transparent experience for all hirers.
            </p>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                    <p className="text-slate-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to hire?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">Explore our services and submit a request today. <em>Note: This is currently a mock experience. Live worker matching will be available soon.</em></p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
              Browse Services
            </Link>
            <Link to="/services/faq" className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Read Hiring FAQ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}