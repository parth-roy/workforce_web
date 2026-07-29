import React from 'react'
import { Monitor, MapPin, Users, DollarSign, BarChart2, CheckCircle2 } from 'lucide-react'

const features = [
  { icon: Users,      label: 'Worker List',         desc: '28 verified workers · Active today' },
  { icon: MapPin,     label: 'Live Location',        desc: 'GPS check-in confirmed 08:03 AM' },
  { icon: CheckCircle2,label:'Task Status',          desc: '22 of 28 tasks completed' },
  { icon: DollarSign, label: 'Payout Summary',       desc: '₹8,400 pending · Auto-transfer 6pm' },
  { icon: BarChart2,  label: 'Completion Rate',      desc: '96.4% this month' },
]

export default function EmployerDashboardPreview() {
  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="section-label">Employer Dashboard</p>
            <h2 className="section-title">Manage Your Workforce in Real-Time</h2>
            <p className="section-subtitle">
              A single dashboard to post requirements, track attendance, monitor task progress, and process payouts — all from your browser or mobile.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'GPS-verified worker check-ins',
                'Automated payout processing',
                'e-Shram compliance report downloads',
                'Replacement requests in one click',
                'Attendance and performance history',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-action-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-action-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 mx-2">
                <p className="text-xs text-slate-400">employer.gomytruck.com/dashboard</p>
              </div>
              <Monitor size={14} className="text-slate-400" />
            </div>

            {/* Dashboard header */}
            <div className="bg-trust-blue-700 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200">Good morning, Priya 👋</p>
                <p className="font-bold text-white text-sm">Dankuni Hub · Today's Shift</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">Fill Rate</p>
                <p className="text-2xl font-black text-white">96%</p>
              </div>
            </div>

            {/* Feature list */}
            <div className="p-5 space-y-3">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-trust-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-trust-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700">{f.label}</p>
                      <p className="text-xs text-slate-400 truncate">{f.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
