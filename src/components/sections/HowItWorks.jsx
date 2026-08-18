import React, { useState } from 'react'
import { Smartphone, FileCheck, Wallet, ClipboardList, Cpu, BarChart3, ArrowRight } from 'lucide-react'

const workerSteps = [
  {
    number: '01',
    icon: FileCheck,
    title: 'Verify Your KYC',
    description: 'Upload your Aadhaar, selfie, and bank account in under 5 minutes. Your e-Shram profile is created automatically.',
    color: 'text-trust-blue-600',
    bg: 'bg-trust-blue-50',
  },
  {
    number: '02',
    icon: Smartphone,
    title: 'Accept a Task Near You',
    description: 'Browse hundreds of nearby gigs — loading, delivery, warehouse, helper. Filter by shift length and earnings.',
    color: 'text-action-green-600',
    bg: 'bg-action-green-50',
  },
  {
    number: '03',
    icon: Wallet,
    title: 'Get Paid Instantly',
    description: 'Complete your shift. Your earnings are credited to your Metro Mitra wallet within 1 hour. Withdraw to any UPI ID instantly.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

const employerSteps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Post Your Requirement',
    description: 'Specify role, quantity, date, location, and shift. Our smart form takes under 60 seconds.',
    color: 'text-trust-blue-600',
    bg: 'bg-trust-blue-50',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Matches Workers',
    description: 'Our algorithm matches KYC-verified, rated workers within your pincode. Average fill time: 2.4 hours.',
    color: 'text-action-green-600',
    bg: 'bg-action-green-50',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Track & Pay via Dashboard',
    description: 'Monitor attendance, track GPS-verified arrivals, and process payouts all from your employer dashboard.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export default function HowItWorks({ variant = 'worker', showTabs = false }) {
  const [active, setActive] = useState(variant)
  const steps = active === 'worker' ? workerSteps : employerSteps

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="text-center mb-10">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">
            {showTabs
              ? 'Simple for Everyone'
              : active === 'worker' ? 'Start Earning in 3 Simple Steps' : 'Hire Verified Workers in 3 Steps'}
          </h2>
        </div>

        {/* Tabs */}
        {showTabs && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white border border-slate-200 rounded-2xl p-1 gap-1">
              {[
                { id: 'worker', label: '👷 For Workers' },
                { id: 'employer', label: '🏢 For Employers' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                    active === t.id
                      ? 'bg-trust-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-slate-200 z-0" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative z-10 card card-hover text-center px-6 py-8">
                <div className="flex justify-center mb-5">
                  <div className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center`}>
                    <Icon size={28} className={step.color} />
                  </div>
                </div>
                <div className="text-xs font-black text-slate-300 mb-2 tracking-widest">STEP {step.number}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <ArrowRight size={16} className="hidden md:block absolute -right-3 top-10 text-slate-300 z-20" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
