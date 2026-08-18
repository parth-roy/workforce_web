import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, Warehouse, Building2, ShoppingBag, Factory, Truck } from 'lucide-react'

const industries = [
  {
    icon: Truck,
    name: 'Logistics & Transport',
    desc: 'Loading helpers, truck assistants, route riders',
    roles: ['Truck Helper', 'Loading Worker', 'Route Rider'],
    href: '/logistics-jobs',
    color: 'text-trust-blue-600',
    bg: 'bg-trust-blue-50',
  },
  {
    icon: Warehouse,
    name: 'Warehousing',
    desc: 'Pickers, packers, dispatchers, sorters',
    roles: ['Picker', 'Packer', 'Forklift Operator'],
    href: '/warehouse-jobs',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Building2,
    name: 'Construction Support',
    desc: 'Material handling, site helpers, clean-up',
    roles: ['Site Helper', 'Material Handler', 'Labour'],
    href: '/loading-jobs',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    icon: ShoppingBag,
    name: 'Retail & FMCG',
    desc: 'In-store helpers, stock management, delivery',
    roles: ['Shop Helper', 'Stock Boy', 'Delivery'],
    href: '/delivery-jobs-kolkata',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Factory,
    name: 'Manufacturing',
    desc: 'Assembly line helpers, quality checkers',
    roles: ['Line Helper', 'QC Assistant', 'Loader'],
    href: '/loading-jobs',
    color: 'text-action-green-600',
    bg: 'bg-action-green-50',
  },
  {
    icon: Package,
    name: 'E-commerce Fulfilment',
    desc: 'Last-mile delivery, returns processing',
    roles: ['Delivery Exec', 'Returns Handler', 'Packer'],
    href: '/daily-payment-jobs',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
]

export default function IndustriesGrid() {
  return (
    <section className="section-pad bg-white">
      <div className="container-xl">
        <div className="text-center mb-10">
          <p className="section-label">Industries We Serve</p>
          <h2 className="section-title">Workforce Solutions Across Every Sector</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From FMCG to e-commerce, Metro Mitra powers verified gig workforce across West Bengal's fastest-growing industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {industries.map((ind, i) => {
            const Icon = ind.icon
            return (
              <Link key={i} to={ind.href} className="card card-hover group p-6 block no-underline">
                <div className={`w-12 h-12 ${ind.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} className={ind.color} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-trust-blue-600 transition-colors">{ind.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{ind.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ind.roles.map(r => (
                    <span key={r} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{r}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-trust-blue-600">
                  View Jobs <ArrowRight size={12} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
