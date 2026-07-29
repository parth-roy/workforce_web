import React from 'react'
import { X, CheckCircle2 } from 'lucide-react'

const defaultRows = [
  { before: 'Stand at labour chowk every morning', after: 'Jobs delivered to your phone overnight' },
  { before: 'Wait 30 days for salary',              after: 'Get paid the same day via UPI' },
  { before: 'No proof of work history',             after: 'Verified digital worker profile' },
  { before: 'Opaque middlemen commissions',         after: '100% transparent platform fees' },
  { before: 'Manual KYC paperwork',                 after: 'Instant digital KYC in minutes' },
]

export default function ProblemSolution({ rows = defaultRows }) {
  return (
    <section className="section-pad bg-white">
      <div className="container-xl">
        <div className="text-center mb-12">
          <p className="section-label">Why GoMyTruck</p>
          <h2 className="section-title">A Better Way to Work & Hire</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            The old way was broken. We rebuilt it from the ground up — digital, transparent, and fair for everyone.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 rounded-2xl px-6 py-4 text-center">
              <X size={20} className="text-red-500 mx-auto mb-1" />
              <span className="text-sm font-bold text-red-600">The Old Way</span>
            </div>
            <div className="bg-action-green-50 rounded-2xl px-6 py-4 text-center">
              <CheckCircle2 size={20} className="text-action-green-600 mx-auto mb-1" />
              <span className="text-sm font-bold text-action-green-700">With GoMyTruck</span>
            </div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-red-50/60 border border-red-100 rounded-xl px-4 py-4 flex items-start gap-3">
                <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-700">{row.before}</span>
              </div>
              <div className="bg-action-green-50 border border-action-green-100 rounded-xl px-4 py-4 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-action-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-action-green-800 font-medium">{row.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
