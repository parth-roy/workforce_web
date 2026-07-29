import React from 'react'

const zones = [
  { name: 'Salt Lake / Sector V',   cx: 68, cy: 38, demand: 'Very High', color: '#16A34A' },
  { name: 'New Town / Rajarhat',    cx: 78, cy: 30, demand: 'Very High', color: '#16A34A' },
  { name: 'Howrah Industrial',      cx: 32, cy: 52, demand: 'Very High', color: '#16A34A' },
  { name: 'Taratala / Joka',        cx: 42, cy: 72, demand: 'High',      color: '#1D4ED8' },
  { name: 'Dankuni Hub',            cx: 18, cy: 36, demand: 'High',      color: '#1D4ED8' },
  { name: 'Barrackpore Corridor',   cx: 58, cy: 18, demand: 'High',      color: '#1D4ED8' },
  { name: 'Kasba / Garia',          cx: 60, cy: 65, demand: 'Medium',    color: '#F59E0B' },
  { name: 'Haldia Port',            cx: 88, cy: 85, demand: 'High',      color: '#1D4ED8' },
]

export default function LocalZoneMap({ heading = 'Kolkata Demand Zone Map' }) {
  return (
    <section className="section-pad bg-white">
      <div className="container-xl">
        <div className="text-center mb-8">
          <p className="section-label">Coverage Map</p>
          <h2 className="section-title">{heading}</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Active gig opportunities across 80+ Kolkata pincodes. High-demand zones update daily based on employer bookings.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* SVG Map */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-4 aspect-[4/3] relative overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                aria-label="Kolkata gig demand zone map"
                role="img"
              >
                {/* Background river-like shape (Hooghly suggestion) */}
                <path
                  d="M 45 5 Q 46 20 44 35 Q 43 50 45 65 Q 46 80 44 95"
                  stroke="#BFDBFE"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* City boundary rough polygon */}
                <polygon
                  points="20,10 75,8 88,25 90,55 82,80 65,92 40,90 18,75 10,50 15,25"
                  fill="#F8FAFC"
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />

                {/* Zone dots */}
                {zones.map((z, i) => (
                  <g key={i}>
                    {/* Pulse ring */}
                    <circle cx={z.cx} cy={z.cy} r="5" fill={z.color} opacity="0.15" />
                    {/* Dot */}
                    <circle cx={z.cx} cy={z.cy} r="2.5" fill={z.color} />
                    {/* Label */}
                    <text
                      x={z.cx}
                      y={z.cy - 4}
                      textAnchor="middle"
                      fontSize="2.8"
                      fill="#374151"
                      fontWeight="600"
                    >
                      {z.name.split(' / ')[0]}
                    </text>
                  </g>
                ))}

                {/* Legend */}
                <rect x="2" y="82" width="35" height="16" rx="2" fill="white" opacity="0.9" />
                <circle cx="6" cy="87" r="2" fill="#16A34A" />
                <text x="10" y="89" fontSize="2.5" fill="#374151">Very High Demand</text>
                <circle cx="6" cy="93" r="2" fill="#1D4ED8" />
                <text x="10" y="95" fontSize="2.5" fill="#374151">High Demand</text>
              </svg>

              {/* River label */}
              <div className="absolute top-1/2 left-[44%] -translate-y-1/2 -translate-x-1/2">
                <span className="text-xs text-blue-300 font-semibold rotate-90 block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  Hooghly
                </span>
              </div>
            </div>
          </div>

          {/* Zone list */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Active Zones</h3>
            <div className="space-y-3">
              {zones.map((z, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: z.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{z.name}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      color: z.color,
                      backgroundColor: z.color + '20',
                    }}
                  >
                    {z.demand}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Demand levels updated every 4 hours based on active employer bookings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
