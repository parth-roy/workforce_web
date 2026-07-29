import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function InternalLinkGrid({
  heading = 'Explore More Roles',
  subheading = 'Find the right gig for you — daily pay, flexible hours, no experience needed.',
  pages = [],
}) {
  return (
    <section className="section-pad bg-white">
      <div className="container-xl">
        <div className="text-center mb-10">
          <p className="section-label">More Opportunities</p>
          <h2 className="section-title">{heading}</h2>
          {subheading && <p className="section-subtitle max-w-xl mx-auto">{subheading}</p>}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pages.map((page, i) => (
            <Link
              key={i}
              to={`/${page.path}`}
              className="card card-hover group flex flex-col gap-3 no-underline"
            >
              <div className="flex items-start gap-3">
                {page.icon && (
                  <span className="text-2xl flex-shrink-0">{page.icon}</span>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-trust-blue-600 transition-colors text-sm">
                    {page.heroH1 || page.titleTag?.split(' | ')[0] || page.path}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {page.metaDescription?.slice(0, 100)}…
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-trust-blue-600 mt-auto">
                View Roles <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
