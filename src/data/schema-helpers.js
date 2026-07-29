const BASE_URL = 'https://workforce.gomytruck.com'

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GoMyTruck Workforce',
    legalName: 'Parther Technologies Pvt. Ltd.',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    foundingDate: '2022',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Barrackpore',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700120',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9331488999',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'bn', 'hi'],
    },
    sameAs: [
      'https://linkedin.com/company/gomytruck',
      'https://twitter.com/gomytruck',
    ],
  }
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GoMyTruck Workforce',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function createFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

export function createBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: `${BASE_URL}${b.href}`,
    })),
  }
}

export function createLocalBusinessSchema({ name, city, latitude, longitude, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name || 'GoMyTruck Workforce',
    image: `${BASE_URL}/og-default.jpg`,
    url: `${BASE_URL}${path}`,
    telephone: '+91-9331488999',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || 'Kolkata',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
    geo: latitude ? {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    } : undefined,
    priceRange: 'Free',
    servesCuisine: undefined,
    areaServed: city || 'Kolkata',
  }
}

export function createJobPostingSchema({ title, description, baseSalary, city = 'Kolkata', path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'GoMyTruck Workforce',
      sameAs: BASE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: 'West Bengal',
        addressCountry: 'IN',
      },
    },
    baseSalary: baseSalary ? {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: baseSalary,
        unitText: 'DAY',
      },
    } : undefined,
    url: `${BASE_URL}${path}`,
  }
}

export function createHowToSchema({ name, description, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  }
}

export function createCollectionPageSchema({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${BASE_URL}${path}`,
    publisher: {
      '@type': 'Organization',
      name: 'GoMyTruck Workforce',
      url: BASE_URL,
    },
  }
}
