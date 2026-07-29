import React from 'react'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

const defaultStats = [
  { end: 500000, prefix: '', suffix: '+', label: 'Tasks Completed',     displayRaw: '5,00,000+' },
  { end: 3.2,    prefix: '₹', suffix: 'Cr+', label: 'Payouts Disbursed', displayRaw: '₹3.2Cr+', isGreen: true },
  { end: 28000,  prefix: '', suffix: '+', label: 'Verified Workers',    displayRaw: '28,000+' },
  { end: 120,    prefix: '', suffix: '+', label: 'Active Pincodes',     displayRaw: '120+' },
]

function Stat({ stat }) {
  const { ref, display } = useAnimatedCounter({
    end: stat.end,
    prefix: stat.prefix,
    suffix: stat.suffix,
  })
  return (
    <div ref={ref} className="text-center">
      <div className={`text-2xl md:text-3xl font-black flex items-center justify-center gap-1 ${stat.isGreen ? 'text-action-green-600' : 'text-slate-900'}`}>
        {stat.isGreen && <span className="pulse-dot" />}
        {display}
      </div>
      <div className="text-xs md:text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
    </div>
  )
}

export default function StatsBar({ stats = defaultStats, className = '' }) {
  // Temporarily hidden per user request
  return null;
  /*
  return (
    <section className={`bg-white border-y border-slate-100 ${className}`}>
      <div className="container-xl py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => <Stat key={i} stat={s} />)}
        </div>
      </div>
    </section>
  )
  */
}
