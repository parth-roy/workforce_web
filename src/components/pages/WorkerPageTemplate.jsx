import React from 'react'
import SEO from '../ui/SEO'
import Breadcrumb from '../ui/Breadcrumb'
import HeroSection from '../sections/HeroSection'
import StatsBar from '../sections/StatsBar'
import ProblemSolution from '../sections/ProblemSolution'
import HowItWorks from '../sections/HowItWorks'
import TrustSignals from '../sections/TrustSignals'
import GovtAlignment from '../sections/GovtAlignment'
import AppDownloadCTA from '../sections/AppDownloadCTA'
import FAQSection from '../sections/FAQSection'
import InternalLinkGrid from '../sections/InternalLinkGrid'
import EarningsCalculator from '../sections/EarningsCalculator'
import LocalZoneMap from '../sections/LocalZoneMap'
import TestimonialsSection from '../sections/TestimonialsSection'
import { pageMap } from '../../data/pages'
import { createFAQSchema } from '../../data/schema-helpers'

export default function WorkerPageTemplate({ page }) {
  if (!page) return null

  const relatedPageConfigs = (page.relatedPages || [])
    .map(path => pageMap[path])
    .filter(Boolean)

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
        variant="worker"
        h1={page.heroH1}
        subtitle={page.heroSubtitle}
        badge={page.heroBadge}
        cta={page.heroCta}
        stats={page.heroStats || []}
        heroImage={page.heroImage}
      />

      {/* Breadcrumb below hero */}
      {page.breadcrumbs?.length > 1 && (
        <div className="container-xl py-4">
          <Breadcrumb items={page.breadcrumbs} />
        </div>
      )}

      {/* Conditional local zone map */}
      {page.features?.showLocalMap && <LocalZoneMap />}

      {/* Sections driven by page.sections array */}
      {(page.sections || []).map(section => {
        switch (section) {
          case 'statsBar':
            return <StatsBar key={section} />
          case 'problemSolution':
            return <ProblemSolution key={section} />
          case 'earningsCalculator':
            return <EarningsCalculator key={section} />
          case 'howItWorks':
            return <HowItWorks key={section} variant="worker" />
          case 'trustSignals':
            return <TrustSignals key={section} />
          case 'govtAlignment':
            return <GovtAlignment key={section} />
          case 'testimonialsSection':
            return <TestimonialsSection key={section} />
          case 'faqSection':
            return page.faqs?.length
              ? <FAQSection key={section} faqs={page.faqs} />
              : null
          case 'appDownloadCTA':
            return <AppDownloadCTA key={section} />
          case 'internalLinkGrid':
            return relatedPageConfigs.length
              ? <InternalLinkGrid key={section} pages={relatedPageConfigs} />
              : null
          default:
            return null
        }
      })}
    </>
  )
}
