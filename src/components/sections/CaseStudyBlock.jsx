import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CaseStudyBlock({
  client = 'Dankuni Logistics Pvt. Ltd.',
  result = 'Reduced workforce fulfillment time by 67% during peak season',
  metrics = [
    { value: '50', label: 'Workers Deployed' },
    { value: '48 hrs', label: 'Time to Scale' },
    { value: '₹0', label: 'Compliance Penalty' },
  ],
  ctaHref = '/workforce-solutions',
}) {
  return (
    <section className="section-pad-sm">
      <div className="container-xl">
        <div className="bg-slate-900 rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left — text */}
            <div className="p-10 md:p-14">
              <div className="inline-flex items-center gap-2 bg-action-green-500/20 rounded-full px-3 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-action-green-400" />
                <span className="text-xs font-bold text-action-green-400">Client Case Study</span>
              </div>
              <p className="text-slate-400 text-sm font-semibold mb-2">{client}</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-8 leading-tight">
                "{result}"
              </h3>
              <Link
                to={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold text-action-green-400 hover:text-action-green-300 transition-colors"
              >
                View Enterprise Solutions <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right — metrics */}
            <div className="bg-slate-800 p-10 md:p-14 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Impact Metrics</p>
              <div className="space-y-6">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-baseline gap-4 border-b border-slate-700 pb-6 last:border-0 last:pb-0">
                    <span className="text-3xl font-black text-white">{m.value}</span>
                    <span className="text-sm text-slate-400">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
