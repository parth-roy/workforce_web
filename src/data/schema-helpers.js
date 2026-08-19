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
export function createServiceSchema({ name, description, path }) {
  const canonicalUrl = getCanonicalUrl(path)
  return {
    '@id': `${canonicalUrl}/#service`,
    '@type': 'Service',
    name: name,
    description: description,
    provider: { '@id': ORG_ID },
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
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
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
 * 10. LocalBusiness (Legacy/Restricted)
 */
export function createLocalBusinessSchema({ name, city, path }) {
  return null; // Explicitly disabled per F6.2 constraints unless justified
}
