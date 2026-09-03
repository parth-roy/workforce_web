/**
 * src/data/schema-helpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Structured Data Factory
 * Phase F6.2 — Schema Matrix Implementation
 *
 * Rules:
 * 1. Output is assembled into a single unified `@graph`.
 * 2. All nodes must have a stable `@id` for relationships.
 * 3. Never invent data (no fake validThrough, fake salaries, fake ratings).
 * 4. JobPosting is strictly for real public jobs.
 */

const BASE_URL = 'https://metromitra.com'
const ORG_ID = `${BASE_URL}/#organization`
const PARENT_ORG_ID = `${BASE_URL}/#parentOrganization`
const WEBSITE_ID = `${BASE_URL}/#website`

/**
 * Helper to ensure a path is clean and root is just '/'
 */
function getCanonicalUrl(path = '') {
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '')
  return `${BASE_URL}${cleanPath}`
}

/**
 * 1. Metro Mitra Organization Entity
 */
export function createOrganizationSchema() {
  return [
    {
      '@id': PARENT_ORG_ID,
      '@type': 'Organization',
      name: 'Parther Technologies Pvt. Ltd.',
      url: BASE_URL,
    },
    {
      '@id': ORG_ID,
      '@type': 'Organization',
      name: 'Metro Mitra',
      description: 'Gig Workforce Platform',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      parentOrganization: { '@id': PARENT_ORG_ID },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9331488999',
        contactType: 'customer service',
      },
    }
  ]
}

/**
 * 2. WebSite Entity
 */
export function createWebSiteSchema() {
  return {
    '@id': WEBSITE_ID,
    '@type': 'WebSite',
    name: 'Metro Mitra',
    url: BASE_URL,
    publisher: { '@id': ORG_ID },
  }
}

/**
 * 3. WebPage Entity (Default for most pages)
 */
export function createWebPageSchema({ title, description, path }) {
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#webpage`,
    '@type': 'WebPage',
    url: canonicalUrl,
    name: title,
    description: description,
    isPartOf: { '@id': WEBSITE_ID },
    about: path === '/' ? { '@id': ORG_ID } : undefined,
  }
}

/**
 * 4. CollectionPage Entity (For Hubs, Catalogs)
 */
export function createCollectionPageSchema({ title, description, path }) {
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#webpage`,
    '@type': 'CollectionPage',
    url: canonicalUrl,
    name: title,
    description: description,
    isPartOf: { '@id': WEBSITE_ID },
  }
}

/**
 * 5. BreadcrumbList Entity
 */
export function createBreadcrumbSchema(breadcrumbs, path) {
  if (!breadcrumbs || breadcrumbs.length === 0) return null
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#breadcrumb`,
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: getCanonicalUrl(b.href),
    })),
  }
}

/**
 * 6. Service Entity (Genuine service offerings)
 */
export function createServiceSchema({ name, description, path, areaServed }) {
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#service`,
    '@type': 'Service',
    name: name,
    description: description,
    provider: { '@id': ORG_ID },
    areaServed: areaServed ? { '@type': 'City', name: areaServed } : undefined,
    mainEntityOfPage: { '@id': `${canonicalUrl}/#webpage` },
  }
}

/**
 * 7. JobPosting Entity (For REAL jobs only)
 */
export function createJobPostingSchema({ job, path }) {
  if (job.isDemo) return null
  
  const canonicalUrl = getCanonicalUrl(path)
  
  const schema = {
    '@id': `${canonicalUrl}/#jobposting`,
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    mainEntityOfPage: { '@id': `${canonicalUrl}/#webpage` },
  }
  
  if (job.datePosted) {
    schema.datePosted = job.datePosted
  }
  
  // NEVER invent validThrough. The F6.2 rules are strict on this.
  if (job.validThrough) {
    schema.validThrough = job.validThrough
  }
  
  if (job.employmentType) {
    schema.employmentType = job.employmentType
  }
  
  if (job.hiringOrganization) {
    schema.hiringOrganization = {
      '@type': 'Organization',
      name: job.hiringOrganization.name,
    }
  } else {
    schema.hiringOrganization = { '@id': ORG_ID }
  }
  
  if (job.location) {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.city,
        addressRegion: job.location.state || 'West Bengal',
        addressCountry: 'IN',
      },
    }
  }
  
  if (job.salary) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary.amount,
        unitText: job.salary.unit || 'DAY',
      },
    }
  }
  
  return schema
}

/**
 * 8. FAQPage Entity
 */
export function createFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question || f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer || f.a,
      },
    })),
  };
}

/**
 * 9. HowTo Entity
 */
export function createHowToSchema({ name, description, steps }) {
  if (!steps || steps.length === 0) return null;
  return {
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };
}

/**
 * 10. LocalBusiness / EmploymentAgency Entity
 */
export function createLocalBusinessSchema({ name, city, state, postalCode, geo, path }) {
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#localbusiness`,
    '@type': 'EmploymentAgency',
    name: name || `Metro Mitra ${city || ''}`.trim(),
    description: `On-demand workforce and local home services in ${city || 'India'} provided by Metro Mitra.`,
    url: canonicalUrl,
    image: `${BASE_URL}/logo.png`,
    telephone: '+91-9331488999',
    priceRange: '₹₹',
    parentOrganization: { '@id': ORG_ID },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || 'Kolkata',
      addressRegion: state || 'West Bengal',
      postalCode: postalCode || '700001',
      addressCountry: 'IN',
    },
    geo: geo ? {
      '@type': 'GeoCoordinates',
      latitude: geo.lat || geo.latitude,
      longitude: geo.lng || geo.longitude,
    } : undefined,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '22:00',
    },
  }
}

/**
 * 11. DirectConnect ₹49 Product Offer Schema
 *
 * Used on /direct-contact and injected as a supplementary schema on all
 * service + location pages to make the ₹49 unlock feature crawlable
 * by Google Shopping, AI answer engines, and Perplexity for the query:
 * "how to hire workers without paying broker commission in [City]"
 *
 * @param {string} [city] — location context (e.g. "Kolkata")
 * @param {string} [serviceName] — service context (e.g. "Electrician")
 */
export function createDirectContactOfferSchema(city = 'India', serviceName = 'Workers') {
  return {
    '@type': 'Product',
    name: `Direct ${serviceName} Contact Unlock — Metro Mitra`,
    description: `Pay ₹49 once and instantly receive the direct phone numbers of 10 verified, Aadhaar-KYC\'d ${serviceName} in ${city}. Zero broker fees, zero middleman charges. You deal directly with the professional.`,
    brand: { '@type': 'Brand', name: 'Metro Mitra' },
    offers: {
      '@type': 'Offer',
      price: '49',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://metromitra.com/direct-contact',
      description: `Get 10 verified ${serviceName} phone numbers in ${city} directly. No agency. No broker. No commission.`,
      seller: {
        '@type': 'Organization',
        name: 'Parther Technologies Private Limited',
        url: 'https://metromitra.com',
      }
    }
  };
}

/**
 * 12. Zero-Broker FAQ Schema
 *
 * Appended to all service + location SEO schemas.
 * Specifically targets AI answer-engine (AEO) queries:
 * - "How to avoid broker commission when hiring workers?"
 * - "Can I get electrician number directly without agency?"
 * - "Cheapest way to find verified workers near me"
 *
 * @param {string} [city]
 * @param {string} [serviceName]
 */
export function createZeroBrokerFAQSchema(city = 'your city', serviceName = 'workers') {
  return {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How can I hire ${serviceName} in ${city} without paying a broker or middleman?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Metro Mitra's Direct Connect feature lets you unlock 10 verified ${serviceName} phone numbers in ${city} for a flat ₹49 one-time fee. There are zero broker commissions and zero middleman charges. You contact the ${serviceName} directly and negotiate your own terms.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the cheapest way to find verified ${serviceName} near me in ${city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The cheapest option is Metro Mitra's ₹49 Direct Contact Unlock. For ₹49, you get direct phone numbers of 10 Aadhaar-verified ${serviceName} in ${city}. Traditional agencies charge ₹500–₹2,000 or take 15–30% commission per booking.`
        }
      },
      {
        '@type': 'Question',
        name: `Are the ${serviceName} numbers on Metro Mitra genuine and verified?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Every worker on Metro Mitra completes Aadhaar-based identity verification, skill assessment, and customer OTP job validation. Only verified professionals are available through the Direct Connect pool.`
        }
      }
    ]
  };
}
