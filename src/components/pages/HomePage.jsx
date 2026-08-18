import React from 'react'
import SEO from '../ui/SEO'
import HeroSection from '../sections/HeroSection'
import StatsBar from '../sections/StatsBar'
import IndustriesGrid from '../sections/IndustriesGrid'
import DualHero from '../sections/HeroSection' // DualHero is exported as part of HeroSection
import ProblemSolution from '../sections/ProblemSolution'
import HowItWorks from '../sections/HowItWorks'
import TrustSignals from '../sections/TrustSignals'
import GovtAlignment from '../sections/GovtAlignment'
import AppDownloadCTA from '../sections/AppDownloadCTA'
import TestimonialsSection from '../sections/TestimonialsSection'
import { createWebSiteSchema } from '../../data/schema-helpers'

export default function HomePage() {
  return (
    <>
      <SEO
        title="Metro Mitra | West Bengal's Most Trusted Gig Platform"
        description="Connect with 28,000+ verified gig workers across West Bengal. Daily pay for workers. Rapid deployment for employers. e-Shram compliant."
        schema={createWebSiteSchema()}
        canonical="https://metromitra.com/"
      />

      {/* Hero section */}
      <HeroSection
        variant="dual"
        h1="West Bengal's Most Trusted Gig Platform"
        subtitle="Connecting verified workers with verified employers across West Bengal. From 4-hour shifts to full enterprise deployment."
        workerCta={{
          h2: 'Find Daily Gigs',
          desc: 'Get paid the same day. No middlemen. Rs.300-600/day.',
          label: 'Download App',
          href: '/gig-jobs-kolkata'
        }}
        employerCta={{
          h2: 'Hire Verified Workers',
          desc: 'KYC-verified, e-Shram compliant workforce in under 2.4 hrs.',
          label: 'Hire Now',
          href: '/employer-hiring'
        }}
        stats={[
          { value: '28,000+', label: 'Active Workers' },
          { value: '1,200+', label: 'Verified Employers' },
          { value: '120+', label: 'Pincodes Covered' },
        ]}
      />

      <StatsBar />
      
      {/* Industries we serve */}
      <IndustriesGrid />

      {/* The old way vs our way */}
      <ProblemSolution />

      {/* Tabs for worker/employer flow */}
      <HowItWorks showTabs />

      {/* Trust & compliance */}
      <GovtAlignment />
      <TestimonialsSection />
      <TrustSignals />

      {/* Bottom CTA */}
      <AppDownloadCTA />
    </>
  )
}
