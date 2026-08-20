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
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-black mb-4">How Hiring Works</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A simple, transparent process to request services and hire verified workers on Metro Mitra.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 bg-slate-100 rounded-3xl p-8 border border-slate-200">
            <div className="aspect-square bg-slate-800 rounded-2xl shadow-xl overflow-hidden relative max-w-sm mx-auto flex items-center justify-center p-8 text-center">
              <div>
                <p className="text-slate-300 font-medium mb-4">Request Flow Prototype</p>
                <div className="w-full bg-slate-700 h-2 rounded-full mb-8">
                  <div className="w-2/3 bg-emerald-500 h-full rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-slate-700 rounded w-3/4 mx-auto"></div>
                  <div className="h-8 bg-slate-700 rounded w-full"></div>
                  <div className="h-8 bg-slate-700 rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Hiring Process</h2>
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