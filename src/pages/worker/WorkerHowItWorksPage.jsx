import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { WorkerHowItWorksSEO } from '../../seo/pageMetadata';
import { Smartphone, Search, Briefcase, CheckCircle, Clock } from 'lucide-react';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function WorkerHowItWorksPage() {
  const steps = [
    { icon: Search, title: 'Join as Employee', desc: 'Browse available shifts and tasks matching your chosen roles and locations. Filter by duration, urgency, and category.' },
    { icon: Briefcase, title: 'Review Opportunity', desc: 'Check the job details, including location, requirements, duration, and what the work involves before accepting.' },
    { icon: CheckCircle, title: 'Accept Assignment', desc: 'Confirm your availability and accept the job directly in the app. The hirer will be notified.' },
    { icon: ({ className }) => <img src="/google-maps-icon.webp" alt="Location" width={24} height={24} className={className || "w-6 h-6 object-contain"} />, title: 'Arrive on Site', desc: 'Navigate to the worksite using the app and check in when you arrive.' },
    { icon: Clock, title: 'Complete Work', desc: 'Finish the agreed-upon tasks. For shift work, complete your hours. Mark the task as done in the app.' },
    { icon: Smartphone, title: 'Track Activity', desc: 'View your completed jobs, track your history, and manage your upcoming schedule in your worker dashboard.' }
  ];

  return (
    <>
      <SEO {...WorkerHowItWorksSEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-black mb-4">How Metro Mitra Works for You</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            A step-by-step guide to finding, accepting, and completing gig work using the Metro Mitra Workforce App.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-7xl px-4 py-16">
        {/* Direct Worker Contact Banner — Right After Hero */}
        <DirectContactBanner variant="default" />
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Worker Lifecycle</h2>
            <p className="text-slate-600 mb-6 text-lg max-w-2xl">
              Once you have completed your profile and passed verification, the Workforce App becomes your gateway to local opportunities.
            </p>
            <div className="space-y-8 pr-4">
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
          
          <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 lg:sticky lg:top-24">
            <div className="aspect-[9/16] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden relative max-w-[320px] mx-auto border-8 border-slate-900 flex flex-col relative">
              {/* Fake Phone UI */}
              <div className="h-6 w-full bg-slate-900 flex items-center justify-between px-4">
                <div className="text-[10px] text-white font-medium">9:41</div>
                <div className="flex gap-1">
                  <div className="w-3 h-2 bg-white rounded-sm"></div>
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="flex-1 bg-slate-50 flex flex-col p-4 relative">
                <div className="flex items-center justify-between mb-6 mt-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div>
                      <div className="h-2 w-16 bg-slate-300 rounded mb-1"></div>
                      <div className="h-2 w-12 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-100"></div>
                </div>
                
                <div className="h-24 w-full bg-emerald-600 rounded-xl mb-6 p-4">
                  <div className="h-3 w-24 bg-white/30 rounded mb-2"></div>
                  <div className="h-6 w-32 bg-white rounded"></div>
                </div>
                
                <div className="font-bold text-slate-800 mb-3 text-sm">Available Shifts</div>
                
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                        <div className="h-3 w-12 bg-emerald-500 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded mb-1"></div>
                      <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full"></div>
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
