import React from 'react'
import { CheckCircle2, Shield, Zap } from 'lucide-react'

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-100 text-brand-600 rounded-xl"><Shield size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">100% Verified Jobs</h4>
              <p className="text-sm text-slate-500">Every employer is KYC verified.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Zap size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">Instant Onboarding</h4>
              <p className="text-sm text-slate-500">Apply via WhatsApp in 10 seconds.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><CheckCircle2 size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">e-Shram Compliant</h4>
              <p className="text-sm text-slate-500">Get ₹2 Lakh insurance instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
