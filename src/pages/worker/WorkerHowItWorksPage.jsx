import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { WorkerHowItWorksSEO } from '../../seo/pageMetadata';
import { Smartphone, Search, Briefcase, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function WorkerHowItWorksPage() {
  const steps = [
    { icon: Search, title: 'Find Work', desc: 'Browse available shifts and tasks matching your chosen roles and locations. Filter by duration, urgency, and category.' },
    { icon: Briefcase, title: 'Review Opportunity', desc: 'Check the job details, including location, requirements, duration, and what the work involves before accepting.' },
    { icon: CheckCircle, title: 'Accept Assignment', desc: 'Confirm your availability and accept the job directly in the app. The hirer will be notified.' },
    { icon: MapPin, title: 'Arrive on Site', desc: 'Navigate to the worksite using the app and check in when you arrive.' },
    { icon: Clock, title: 'Complete Work', desc: 'Finish the agreed-upon tasks. For shift work, complete your hours. Mark the task as done in the app.' },
    { icon: Smartphone, title: 'Track Activity', desc: 'View your completed jobs, track your history, and manage your upcoming schedule in your worker dashboard.' }
  ];

  return (
    <>
      <SEO {...WorkerHowItWorksSEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-black mb-4">How Metro Mitra Works for You</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A step-by-step guide to finding, accepting, and completing gig work using the Metro Mitra Workforce App.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Worker Lifecycle</h2>
            <p className="text-slate-600 mb-6 text-lg">
              Once you have completed your profile and passed verification, the Workforce App becomes your gateway to local opportunities.
            </p>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
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
          
          <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200">
            <div className="aspect-[9/16] bg-slate-800 rounded-2xl shadow-xl overflow-hidden relative max-w-sm mx-auto flex items-center justify-center">
              <p className="text-slate-400 font-medium">App Interface Prototype</p>
              {/* This represents the app screenshot mockup */}
              <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/workers/faq" className="inline-block bg-slate-100 text-slate-800 border border-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            Read the Worker FAQ
          </Link>
        </div>
      </main>
    </>
  );
}