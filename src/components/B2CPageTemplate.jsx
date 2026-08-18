import React from 'react'
import SEO from './SEO'
import DualHero from './DualHero'
import JobCard from './JobCard'
import TrustBadges from './TrustBadges'

export default function B2CPageTemplate({ 
  titleTag, 
  metaDescription, 
  h1, 
  subtitle, 
  schema, 
  jobs = [] 
}) {
  return (
    <div>
      <SEO title={titleTag} description={metaDescription} schema={schema} />
      
      <DualHero title={h1} subtitle={subtitle} />
      
      <TrustBadges />
      
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900">Latest Opportunities</h2>
            <p className="mt-4 text-slate-600 text-lg">Apply directly via WhatsApp. No middlemen. 0 - 5% lowest commission.</p>
          </div>
          
          {jobs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, idx) => (
                <JobCard key={idx} {...job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">New shifts are added daily. Tap 'I Want to Work' above to register your profile.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
