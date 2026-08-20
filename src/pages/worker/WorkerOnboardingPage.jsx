import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { WorkerOnboardingSEO } from '../../seo/pageMetadata';
import { CheckCircle2, User, FileText, MapPin, Search, ShieldCheck } from 'lucide-react';

export default function WorkerOnboardingPage() {
  return (
    <>
      <SEO {...WorkerOnboardingSEO()} />
      <div className="bg-emerald-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Join Metro Mitra as a Worker</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Discover flexible work opportunities, complete our verification process, and start accessing jobs near you.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What You Need to Join</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold">Basic Information</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Full name and age (must be 18+)</li>
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Active phone number</li>
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Profile photo</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold">Verification Documents</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Government-issued ID (e.g., Aadhaar/Voter ID)</li>
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Proof of address</li>
                <li className="flex gap-2 text-slate-700"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Bank account details for payouts</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Onboarding Process</h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {[
              { step: 1, title: 'Download the App', desc: 'Get the Workforce App on your smartphone to start.' },
              { step: 2, title: 'Register & Select Roles', desc: 'Create an account and tell us what kind of work you want to do (e.g., Warehouse, Delivery).' },
              { step: 3, title: 'Submit Documents', desc: 'Upload your ID and bank details securely in the app for verification.' },
              { step: 4, title: 'Profile Verification', desc: 'Our team reviews your profile to ensure safety standards. You will be notified once approved.' },
              { step: 5, title: 'Start Finding Work', desc: 'Browse available jobs in your location and start requesting assignments.' }
            ].map((item, index) => (
              <div key={item.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                  {item.step}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="text-slate-500 mb-4 italic">Note: The Workforce App is currently in prototype phase. Live onboarding will be available soon.</p>
          <Link to="/workers/how-it-works" className="inline-block bg-white text-emerald-600 border border-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
            See How the App Works
          </Link>
        </div>
      </main>
    </>
  );
}