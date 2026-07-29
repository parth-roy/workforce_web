import React from 'react'
import { ClipboardList, Cpu, CheckCircle2, ArrowRight } from 'lucide-react'

const defaultSteps = [
  {
    icon: ClipboardList,
    title: 'Post Your Requirement',
    description: 'Specify role, quantity, date, location, and required skills. Done in under 60 seconds.',
    bg: 'bg-trust-blue-50',
    iconColor: 'text-trust-blue-600',
  },
  {
    icon: Cpu,
    title: 'AI Matches Workers',
    description: 'Our algorithm instantly sources KYC-verified, rated workers in your pincode. Average fill time: 2.4 hours.',
    bg: 'bg-action-green-50',
    iconColor: 'text-action-green-600',
  },
  {
    icon: CheckCircle2,
    title: 'Track & Execute',
    description: 'Workers arrive. Track GPS-verified check-ins, monitor progress, and process payouts from your dashboard.',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
]

export default function WizardSteps({ steps = defaultSteps }) {
  return (
    <section className="section-pad bg-white">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="section-label">How Hiring Works</p>
          <h2 className="section-title">Deploy Workers in 3 Steps</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            From requirement to execution — the fastest verified workforce deployment in West Bengal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative max-w-4xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative">
                <div className="card text-center py-10 px-6">
                  <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon size={30} className={step.iconColor} />
                  </div>
                  <div className="text-xs font-black text-slate-300 tracking-widest mb-2">STEP {String(i + 1).padStart(2, '0')}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                    <ArrowRight size={12} className="text-trust-blue-600" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-slate-500">
            🔒 All workers are background-verified · Replacement guaranteed in 2 hours · e-Shram compliant
          </p>
        </div>
      </div>
    </section>
  )
}
