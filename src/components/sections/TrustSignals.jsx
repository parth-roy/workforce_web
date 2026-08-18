import React from 'react'
import { ShieldCheck, Lock, FileText, Heart, Handshake, BadgeCheck } from 'lucide-react'

const badges = [
  { icon: FileText,  label: 'e-Shram Portal Registered',         color: 'text-trust-blue-600',   bg: 'bg-trust-blue-50'  },
  { icon: Lock,      label: 'Bank-Grade Data Encryption',         color: 'text-slate-700',         bg: 'bg-slate-100'      },
  { icon: ShieldCheck,label:'Code on Social Security 2020',       color: 'text-trust-blue-600',   bg: 'bg-trust-blue-50'  },
  { icon: Heart,     label: 'Accident Insurance Covered',         color: 'text-red-500',           bg: 'bg-red-50'         },
  { icon: Handshake, label: 'WB Gatidhara Scheme Partner',        color: 'text-amber-600',         bg: 'bg-amber-50'       },
  { icon: BadgeCheck,label: '0 - 5% Lowest Commission',         color: 'text-action-green-600', bg: 'bg-action-green-50'},
]

export default function TrustSignals({ extraBadges = [], className = '' }) {
  const all = [...badges, ...extraBadges]
  return (
    <section className={`section-pad-sm bg-white ${className}`}>
      <div className="container-xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          Trusted by 28,000+ workers and 1,200+ employers across West Bengal
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {all.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-slate-100 hover:shadow-card transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${b.bg} flex items-center justify-center`}>
                  <Icon size={20} className={b.color} />
                </div>
                <span className="text-xs font-semibold text-slate-700 leading-tight">{b.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
