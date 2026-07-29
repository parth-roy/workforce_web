import React, { useState } from 'react'

const roles = [
  { label: 'Loading Jobs',       shift4: 280, shift6: 380, shiftFull: 480 },
  { label: 'Delivery (2-wheeler)',shift4: 320, shift6: 440, shiftFull: 560 },
  { label: 'Warehouse Helper',   shift4: 240, shift6: 340, shiftFull: 450 },
  { label: 'Unloading',          shift4: 300, shift6: 400, shiftFull: 520 },
  { label: 'Truck Helper',       shift4: 350, shift6: 480, shiftFull: 600 },
  { label: 'Forklift Operator',  shift4: 500, shift6: 700, shiftFull: 900 },
]

const shifts = [
  { key: 'shift4',    label: '4-Hour Shift' },
  { key: 'shift6',    label: '6-Hour Shift' },
  { key: 'shiftFull', label: 'Full Day (8hr)' },
]

export default function EarningsCalculator() {
  const [selectedShift, setSelectedShift] = useState('shiftFull')
  const [selectedRole, setSelectedRole] = useState(0)

  const daily = roles[selectedRole][selectedShift]
  const monthly22 = daily * 22
  const monthly26 = daily * 26

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="section-label">Earnings Calculator</p>
            <h2 className="section-title">How Much Can You Earn?</h2>
            <p className="section-subtitle">Adjust shift and role to see estimated payouts.</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8">
            {/* Shift toggle */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Shift Length</p>
              <div className="flex gap-2 flex-wrap">
                {shifts.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSelectedShift(s.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      selectedShift === s.key
                        ? 'bg-trust-blue-600 border-trust-blue-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-trust-blue-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Role selector */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Job Role</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {roles.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedRole(i)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 text-left ${
                      selectedRole === i
                        ? 'bg-action-green-50 border-action-green-500 text-action-green-800'
                        : 'border-slate-200 text-slate-600 hover:border-action-green-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Per Shift</p>
                  <p className="text-2xl font-black text-slate-900">₹{daily}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Monthly (22 days)</p>
                  <p className="text-2xl font-black text-action-green-600">
                    ₹{monthly22.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Monthly (26 days)</p>
                  <p className="text-2xl font-black text-trust-blue-600">
                    ₹{monthly26.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 justify-center">
                <span className="pulse-dot" />
                <span className="text-xs text-slate-500">Paid via UPI within 1 hour of shift completion. Zero deductions.</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center mt-4">
              *Estimates based on platform average rates. Actual earnings may vary by location and demand.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
