import React from 'react'
import SEO from '../ui/SEO'
import Breadcrumb from '../ui/Breadcrumb'
import HeroSection from '../sections/HeroSection'
import WizardSteps from '../sections/WizardSteps'
import EmployerDashboardPreview from '../sections/EmployerDashboardPreview'
import CaseStudyBlock from '../sections/CaseStudyBlock'
import GovtAlignment from '../sections/GovtAlignment'
import TrustSignals from '../sections/TrustSignals'
import FAQSection from '../sections/FAQSection'
import InternalLinkGrid from '../sections/InternalLinkGrid'
import { pageMap } from '../../data/pages'
import { createFAQSchema } from '../../data/schema-helpers'

// Employer lead form (full version for template footer)
function EmployerLeadForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    companyName: '',
    phone: '',
    city: '',
    rolesNeeded: ''
  });
  const [status, setStatus] = React.useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('https://api.gomytruck.com/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          companyName: formData.companyName,
          phone: formData.phone,
          city: formData.city,
          role: 'EMPLOYER',
          notes: formData.rolesNeeded
        })
      });

      if (!response.ok) throw new Error('Failed to submit');
      
      setStatus('success');
      setFormData({ name: '', companyName: '', phone: '', city: '', rolesNeeded: '' });
    } catch (err) {
      console.error('Lead submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-xl">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="section-label">Get Started</p>
            <h2 className="section-title">Talk to Our Team Today</h2>
            <p className="section-subtitle">Get a free demo and custom quote within 24 hours.</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500">Thank you. Our team will contact you within 4 business hours to discuss your workforce needs.</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-trust-blue-600 font-bold hover:underline">Submit another request</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emp-name" className="text-xs font-bold text-slate-600 mb-1 block">Your Name *</label>
                    <input id="emp-name" required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Priya Agarwal" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="emp-company" className="text-xs font-bold text-slate-600 mb-1 block">Company Name</label>
                    <input id="emp-company" type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Dankuni Logistics" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="emp-phone" className="text-xs font-bold text-slate-600 mb-1 block">Phone Number *</label>
                    <input id="emp-phone" required type="tel" pattern="[0-9]{10}" title="10 digit mobile number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9331488999" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="emp-city" className="text-xs font-bold text-slate-600 mb-1 block">City *</label>
                    <input id="emp-city" required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Kolkata" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label htmlFor="emp-role" className="text-xs font-bold text-slate-600 mb-1 block">Roles Needed</label>
                  <input id="emp-role" type="text" value={formData.rolesNeeded} onChange={e => setFormData({...formData, rolesNeeded: e.target.value})} placeholder="e.g. 10 loading workers + 5 warehouse helpers" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-trust-blue-500 outline-none transition-colors" />
                </div>
                {status === 'error' && (
                  <div className="text-red-500 text-sm">Failed to submit. Please check your network and try again.</div>
                )}
                <button type="submit" disabled={status === 'loading'} className="btn-primary-blue w-full justify-center text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed">
                  {status === 'loading' ? 'Submitting...' : 'Get a Free Demo & Quote'}
                </button>
              </form>
            )}
            <p className="text-xs text-slate-400 text-center mt-4">
              🔒 Your data is secure. No spam. Our team will contact you within 4 business hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function EmployerPageTemplate({ page }) {
  if (!page) return null

  const relatedPageConfigs = (page.relatedPages || []).map(p => pageMap[p]).filter(Boolean)
  const schemas = [page.schema].filter(Boolean)
  if (page.faqs?.length) schemas.push(createFAQSchema(page.faqs))

  return (
    <>
      <SEO
        title={page.titleTag}
        description={page.metaDescription}
        schemas={schemas}
        canonical={page.canonicalUrl}
        breadcrumbs={page.breadcrumbs}
      />

      <HeroSection
        variant="employer"
        h1={page.heroH1}
        subtitle={page.heroSubtitle}
        badge={page.heroBadge}
        cta={page.heroCta}
        stats={page.heroStats || []}
        heroImage={page.heroImage}
      />

      {page.breadcrumbs?.length > 1 && (
        <div className="container-xl py-4">
          <Breadcrumb items={page.breadcrumbs} />
        </div>
      )}

      {(page.sections || []).map(section => {
        switch (section) {
          case 'wizardSteps':       return <WizardSteps key={section} />
          case 'employerDashboardPreview': return <EmployerDashboardPreview key={section} />
          case 'caseStudyBlock':    return <CaseStudyBlock key={section} />
          case 'govtAlignment':     return <GovtAlignment key={section} />
          case 'trustSignals':      return <TrustSignals key={section} />
          case 'faqSection':        return page.faqs?.length ? <FAQSection key={section} faqs={page.faqs} /> : null
          case 'internalLinkGrid':  return relatedPageConfigs.length ? <InternalLinkGrid key={section} pages={relatedPageConfigs} /> : null
          default: return null
        }
      })}

      {page.features?.showEmployerForm && <EmployerLeadForm />}
    </>
  )
}
