import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500 flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={i}>
            {isLast ? (
              <span className="text-slate-700 font-medium" aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-trust-blue-600 transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
