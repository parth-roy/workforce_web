import React from 'react'
import SEO from '../ui/SEO'
import Breadcrumb from '../ui/Breadcrumb'
import HeroSection from '../sections/HeroSection'
import StatsBar from '../sections/StatsBar'
import HowItWorks from '../sections/HowItWorks'
import TrustSignals from '../sections/TrustSignals'
import GovtAlignment from '../sections/GovtAlignment'
import AppDownloadCTA from '../sections/AppDownloadCTA'
import FAQSection from '../sections/FAQSection'
import InternalLinkGrid from '../sections/InternalLinkGrid'
import CaseStudyBlock from '../sections/CaseStudyBlock'
import WizardSteps from '../sections/WizardSteps'
import { pageMap } from '../../data/pages'
import { createFAQSchema } from '../../data/schema-helpers'

export default function DualPageTemplate({ page }) {
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
        variant="dual"
        h1={page.heroH1}
        subtitle={page.heroSubtitle}
        workerCta={page.workerCta}
        employerCta={page.employerCta}
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
          case 'statsBar':          return <StatsBar key={section} />
          case 'howItWorks':        return <HowItWorks key={section} showTabs />
          case 'caseStudyBlock':    return <CaseStudyBlock key={section} />
          case 'wizardSteps':       return <WizardSteps key={section} />
          case 'govtAlignment':     return <GovtAlignment key={section} />
          case 'trustSignals':      return <TrustSignals key={section} />
          case 'faqSection':        return page.faqs?.length ? <FAQSection key={section} faqs={page.faqs} /> : null
          case 'appDownloadCTA':    return <AppDownloadCTA key={section} />
          case 'internalLinkGrid':  return relatedPageConfigs.length ? <InternalLinkGrid key={section} pages={relatedPageConfigs} /> : null
          default: return null
        }
      })}
    </>
  )
}
