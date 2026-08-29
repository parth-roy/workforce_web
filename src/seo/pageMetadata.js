/**
 * src/seo/pageMetadata.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Centralised Page-Type SEO Metadata Factory
 * Phase F6.1 — Metadata Foundation
 *
 * PURPOSE
 * Each export function is the authoritative title/description/canonical/robots
 * rule for a single page type. Pages MUST NOT construct SEO strings inline in
 * JSX. Import and call the appropriate factory from this file.
 *
 * RESEARCH TRACEABILITY
 * Every rule is derived from:
 *   Metro Mitra SEO Architecture Blueprint (docs/seo/KEYWORD_INTENT_ARCHITECTURE.md)
 *     → Approved Page Intent
 *     → Metadata Rule
 *     → Implementation
 *     → Validation (scripts/test-ssr.js)
 *
 * INDEXABILITY STATE MODEL
 * The `indexabilityStatus` field on mock data objects drives the `indexable`
 * prop sent to the <SEO> component. Three legal values:
 *
 *   "eligible"         — Page has passed the evidence model; may be indexed.
 *   "not-yet-eligible" — Architecturally valid, but lacks verified evidence for
 *                        indexation (e.g., geo-stub, thin content). Resolves to
 *                        noindex UNTIL evidence is sufficient. NOT a permanent
 *                        prohibition — will be upgraded during geo-expansion.
 *   "noindex"          — Explicitly excluded (demo, test, admin, prototype).
 *
 * DO NOT ADD SCHEMAS HERE. Schema / JSON-LD is Phase F6.2.
 * DO NOT ADD SITEMAP LOGIC HERE. Sitemap is Phase F6.3.
 */

import {
  createOrganizationSchema,
  createWebSiteSchema,
  createWebPageSchema,
  createCollectionPageSchema,
  createBreadcrumbSchema,
  createServiceSchema,
  createJobPostingSchema,
  createLocalBusinessSchema,
  createFAQSchema,
} from '../data/schema-helpers.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve indexabilityStatus → boolean for <SEO indexable={} />
 * @param {"eligible"|"not-yet-eligible"|"noindex"|undefined} status
 * @param {boolean} [forceNoindex=false] - additional runtime guard (e.g. isDemo)
 * @returns {boolean}
 */
export function resolveIndexable(status, forceNoindex = false) {
  if (forceNoindex) return false;
  if (status === 'noindex') return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Evergreen Hub Pages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * / (Homepage)
 *
 * Blueprint intent: Brand (Disambiguated) — brand authority, dual-funnel entry.
 * Audience: General (workers + employers + press + partners).
 * Keywords: metro mitra, metro mitra workforce, metro mitra parther technologies.
 */
export function HomePageSEO() {
  const path = '/';
  const title = 'Metro Mitra - Best Job Portal & Full-Stack Gig Economy Platform';
  const description = 'Metro Mitra is the best online job site and gig economy platform connecting job seekers with daily shift work and businesses with on-demand staffing across India.';
  const keywords = 'gig economy platforms, best job portals, employment portals, online job portal website, best online job sites, portal career, all job portal, gig economy, the gig economy, gig economy platforms, online job portal, job portal website';
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: true,
    audience: 'General',
    searchIntent: 'Brand Discovery',
    schemas: [
      createOrganizationSchema(),
      createWebSiteSchema(),
      createWebPageSchema({ title, description, path }),
    ],
  };
}

/**
 * /jobs (Worker Hub)
 *
 * Blueprint intent: Worker (B2C Discovery) — high-volume queries: "jobs near me",
 * "daily wage jobs", "gig work", "part time jobs". Scope is deliberately broad
 * to support future Pan-India positioning. Do NOT geo-lock to West Bengal.
 */
export function WorkerHubSEO() {
  const path = '/jobs';
  const title = 'Gig Economy Jobs & Shift Work | Best Job Search Sites | Metro Mitra';
  const description = 'Find gig work, shift gigs, and daily gig economy jobs. Metro Mitra is the best job portal for gig workers looking for flexible hours and daily payouts.';
  const keywords = 'gig workers, gig work, gig economy jobs, gig jobs, gig apps, find gig workers, gig app jobs, gig sites, get employees, shift gig, find workers app, it gig work, gig work sites, gig platform, gig workers jobs, app for gig workers, gig jobs from home, gig economy jobs from home, gig economy workers, work from home gig, it gig jobs, gig worker, best job search sites, best job posting sites, popular job search sites, job search portals, job posting portals, job vacancy portal';
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: true,
    audience: 'Worker',
    searchIntent: 'Job Discovery',
    schemas: [
      createCollectionPageSchema({ title, description, path }),
      createBreadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Jobs', href: path }], path),
    ],
  };
}

/**
 * /services (Individual Hirer Hub)
 *
 * Blueprint intent: B2C individual hirer looking for task-based local services.
 */
export function ServicesHubSEO() {
  const path = '/services';
  const title = 'Hire a Worker | Find Gig Workers App | Metro Mitra';
  const description = 'Book skilled workforce for local services including plumbing, electrical work, loading, and maintenance. The best gig worker platform to find gig workers.';
  const keywords = 'hire a worker, finding an employee, where to find workers, how to find workers, how to find employee, gig worker platform';
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: true,
    audience: 'Individual',
    searchIntent: 'Local Services Discovery',
    schemas: [
      createCollectionPageSchema({ title, description, path }),
      createBreadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Services', href: path }], path),
    ],
  };
}

/**
 * /hire-workers (B2B Hirer Hub)
 *
 * Blueprint intent: Employer (B2B Commercial) — operations managers, HR directors,
 * 3PL executives. Queries: "hire temporary workers", "warehouse staffing solutions".
 */
export function B2BHirerHubSEO() {
  const path = '/hire-workers';
  const title = 'Hire Gig Workers & Workforce Solutions | Metro Mitra B2B';
  const description = 'The best place to hire construction workers and logistics staff. Our online recruitment portal connects you with verified workforce solutions for businesses.';
  const keywords = 'hire gig workers, work force, best place to hire construction workers, need workers, work solutions, need construction workers, hiring gig workers, best job recruitment sites, job portals for recruiters, best job hiring sites, online recruitment portal, hiring portals, job hiring portal, get employees';
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: true,
    audience: 'Business',
    searchIntent: 'Workforce Procurement',
    schemas: [
      createCollectionPageSchema({ title, description, path }),
      createBreadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'B2B', href: path }], path),
    ],
  };
}

/**
 * /for-contractors (Contractor Hub)
 *
 * Blueprint intent: Contractors and proprietors needing fast multi-role operational
 * requests. Separate from corporate structured planning.
 */
export function ContractorSEO() {
  const path = '/for-contractors';
  const title = 'Contractor Workforce Builder | Metro Mitra';
  const description = 'Operational workforce request builder for contractors. Specify roles, quantities, and shifts for a single worksite quickly.';
  return {
    title,
    description,
    canonicalPath: path,
    indexable: true,
    audience: 'Contractor',
    searchIntent: 'Contractor Workforce',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'For Contractors', href: path }], path),
    ],
  };
}

/**
 * /for-companies (Corporate Hub)
 *
 * Blueprint intent: Enterprise clients needing structured multi-location,
 * multi-shift workforce planning.
 */
export function CorporateSEO() {
  const path = '/for-companies';
  const title = 'Enterprise Workforce Planning | Metro Mitra';
  const description = 'Centralized workforce request management for corporate logistics hubs and enterprise operations.';
  return {
    title,
    description,
    canonicalPath: path,
    indexable: true,
    audience: 'Corporate',
    searchIntent: 'Enterprise Workforce',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'For Companies', href: path }], path),
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Programmatic Worker Pages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * /jobs/:role (Worker Role Hub)
 *
 * Blueprint intent: Role-Specific — "warehouse helper jobs", "delivery executive
 * vacancy", "forklift operator jobs".
 *
 * Indexability: driven by role.indexabilityStatus. Only roles with confirmed
 * operational presence should be eligible.
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string }} role
 */
export function WorkerRoleSEO(role) {
  const path = `/jobs/${role.slug}`;
  const title = `${role.name} Jobs | Direct Hiring | Metro Mitra`;
  const description = `Find open ${role.name} jobs and shifts. Apply today for flexible gig work, safe environment, and daily payouts. Download the Metro Mitra app.`;
  return {
    title,
    description,
    canonicalPath: path,
    indexable: resolveIndexable(role.indexabilityStatus),
    audience: 'Worker',
    searchIntent: 'Role Discovery',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: `${role.name} Jobs`, href: path }
      ], path),
    ],
  };
}

/**
 * /jobs/location/:location (Worker Location Hub)
 *
 * Blueprint intent: Geographic — "jobs in barrackpore", "daily wage work dum dum".
 * Phased rollout: Tier-1 core base first, then industrial logistics zones.
 *
 * Indexability: driven by location.indexabilityStatus.
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string, state?: string }} location
 */
export function WorkerLocationSEO(location) {
  const path = `/jobs/location/${location.slug}`;
  const title = `Jobs in ${location.name} | Daily Wage & Shifts | Metro Mitra`;
  const description = `Browse all daily gig jobs, shift work, and open roles available in ${location.name}, ${location.state}. Get hired directly with daily payouts.`;
  const keywords = `jobs in ${location.name}, daily wage jobs ${location.name}, gig work ${location.name}, part time jobs in ${location.name}, hiring workers in ${location.name}, shift jobs ${location.state}`;
  
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' }
  ];
  if (location.state) {
    crumbs.push({ label: location.state, href: `/jobs` });
  }
  crumbs.push({ label: location.name, href: path });

  const faqs = [
    { question: `Are there daily payment jobs available in ${location.name}?`, answer: `Yes. Metro Mitra connects workers with daily shift work and instant UPI payouts across ${location.name} and surrounding industrial zones.` },
    { question: `What types of roles are hiring in ${location.name}?`, answer: `Common roles in ${location.name} include warehouse helpers, loading labor, delivery associates, electricians, and cleaning staff.` },
    { question: `How do I start working in ${location.name}?`, answer: `Download the Metro Mitra app, complete Aadhaar-based KYC verification, and accept shifts nearby.` }
  ];
  
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: resolveIndexable(location.indexabilityStatus),
    audience: 'Worker',
    searchIntent: 'Location Discovery',
    schemas: [
      createCollectionPageSchema({ title, description, path }),
      createBreadcrumbSchema(crumbs, path),
      createLocalBusinessSchema({
        name: `Metro Mitra Workforce ${location.name}`,
        city: location.name,
        state: location.state,
        postalCode: location.schemaData?.postalCode,
        geo: location.schemaData?.geo,
        path
      }),
      createFAQSchema(faqs),
    ],
  };
}

/**
 * /jobs/:role/:location (Worker Role + Location — Hyper-Local)
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string, id?: string }} role
 * @param {{ name: string, slug: string, indexabilityStatus?: string, id?: string, state?: string, localPricingConfig?: object, schemaData?: object }} location
 */
export function WorkerRoleLocationSEO(role, location) {
  const path = `/jobs/${role.slug}/${location.slug}`;
  const title = `${role.name} Jobs in ${location.name} | Direct Hiring | Metro Mitra`;
  const baseRate = location.localPricingConfig?.minimumFare ? ` Earn from ₹${location.localPricingConfig.minimumFare} per shift.` : '';
  const description = `Find verified ${role.name} jobs and shifts in ${location.name}, ${location.state}.${baseRate} Apply today for flexible work, safe environment and daily payouts.`;
  const keywords = `${role.name} jobs in ${location.name}, hire ${role.name.toLowerCase()} in ${location.name}, ${role.slug} vacancy ${location.name}, shift work ${location.name}`;
  
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: `${role.name} Jobs`, href: `/jobs/${role.slug}` }
  ];
  if (location.state) {
    crumbs.push({ label: location.state, href: `/jobs` });
  }
  crumbs.push({ label: location.name, href: path });

  const faqs = [
    { question: `How much can a ${role.name} earn in ${location.name}?`, answer: `Earnings for ${role.name} in ${location.name} start at ₹${location.localPricingConfig?.minimumFare || 250} per shift with instant digital wallet transfers.` },
    { question: `Do I need prior experience for ${role.name} work in ${location.name}?`, answer: `Requirements vary by employer. General guidelines and tool requirements are listed in the app.` }
  ];

  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: resolveIndexable(role.indexabilityStatus) && resolveIndexable(location.indexabilityStatus),
    audience: 'Worker',
    searchIntent: 'Local Job Transaction',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema(crumbs, path),
      createServiceSchema({ name: `${role.name} Work in ${location.name}`, description, path, areaServed: location.name }),
      createFAQSchema(faqs),
    ],
  };
}

/**
 * /jobs/detail/:jobId (Individual Job Detail)
 *
 * @param {{ title: string, id: string, isDemo?: boolean, indexabilityStatus?: string }} job
 */
export function JobDetailSEO(job) {
  const path = `/jobs/detail/${job.id}`;
  const title = `${job.title} | Metro Mitra`;
  const description = job.description || `Apply for ${job.title} in ${job.location?.city || 'India'}. Flexible gig work with Metro Mitra.`;
  return {
    title,
    description,
    canonicalPath: path,
    indexable: resolveIndexable(job.indexabilityStatus, job.isDemo),
    audience: 'Worker',
    searchIntent: 'Job Application',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: job.title, href: path }
      ], path),
      createJobPostingSchema({ job, path }),
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Programmatic Individual Hirer Pages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * /services/:service (Individual Service Page)
 *
 * @param {{ name: string, slug: string, description?: string, indexabilityStatus?: string }} service
 */
export function IndividualServiceSEO(service) {
  const path = `/services/${service.slug}`;
  const title = `${service.name} Services | Book Online | Metro Mitra`;
  const description = service.description || `Book reliable ${service.name} services. Experienced local workforce available on demand with verified ratings.`;
  const keywords = `${service.name.toLowerCase()} services, book ${service.name.toLowerCase()} online, hire ${service.name.toLowerCase()}, ${service.slug} near me`;
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: resolveIndexable(service.indexabilityStatus),
    audience: 'Individual',
    searchIntent: 'Service Booking',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: service.name, href: path }
      ], path),
      createServiceSchema({ name: service.name, description, path }),
    ],
  };
}

/**
 * /services/:service/:location (Individual Service + Location)
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string, description?: string }} service
 * @param {{ name: string, slug: string, indexabilityStatus?: string, state?: string, schemaData?: object }} location
 */
export function IndividualServiceLocationSEO(service, location) {
  const path = `/services/${service.slug}/${location.slug}`;
  const title = `${service.name} Services in ${location.name} | Book Online | Metro Mitra`;
  const description = `Book verified ${service.name.toLowerCase()} services in ${location.name}, ${location.state}. Transparent pricing, background-checked professionals, fast doorstep arrival.`;
  const keywords = `${service.name.toLowerCase()} in ${location.name}, best ${service.name.toLowerCase()} services in ${location.name}, hire ${service.name.toLowerCase()} ${location.name}, ${service.slug} near me ${location.name}`;
  
  const faqs = [
    { question: `How fast can a ${service.name} arrive in ${location.name}?`, answer: `Doorstep arrival is typically within 30-60 minutes depending on your area in ${location.name}.` },
    { question: `Are ${service.name} professionals verified?`, answer: `Yes. All service professionals on Metro Mitra are Aadhaar-verified with background checks.` }
  ];

  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus),
    audience: 'Individual',
    searchIntent: 'Local Service Booking',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: service.name, href: `/services/${service.slug}` },
        { label: location.name, href: path }
      ], path),
      createServiceSchema({ name: `${service.name} in ${location.name}`, description, path, areaServed: location.name }),
      createLocalBusinessSchema({
        name: `Metro Mitra ${service.name} - ${location.name}`,
        city: location.name,
        state: location.state,
        postalCode: location.schemaData?.postalCode,
        geo: location.schemaData?.geo,
        path
      }),
      createFAQSchema(faqs),
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Programmatic B2B Pages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * /hire-workers/:service (B2B Service Page)
 *
 * @param {{ name: string, slug: string, description?: string, indexabilityStatus?: string }} service
 */
export function B2BServiceSEO(service) {
  const path = `/hire-workers/${service.slug}`;
  const cleanName = service.name.endsWith('Staffing') ? service.name : `${service.name} Staffing`;
  const title = `${cleanName} Services | ESIC Compliant | Metro Mitra`;
  const description = service.description || `Request verified ${service.name} workforce for your business operations. Flexible staffing across shifts, 100% compliant with PF/ESIC regulations.`;
  return {
    title,
    description,
    canonicalPath: path,
    indexable: resolveIndexable(service.indexabilityStatus),
    audience: 'Business',
    searchIntent: 'Staffing Service',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'B2B', href: '/hire-workers' },
        { label: cleanName, href: path }
      ], path),
      createServiceSchema({ name: cleanName, description, path }),
    ],
  };
}

/**
 * /hire-workers/:service/:location (B2B Service + Location)
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string }} service
 * @param {{ name: string, slug: string, indexabilityStatus?: string, state?: string, localPricingConfig?: object, schemaData?: object }} location
 */
export function B2BServiceLocationSEO(service, location) {
  const path = `/hire-workers/${service.slug}/${location.slug}`;
  const cleanName = service.name.endsWith('Staffing') ? service.name : `${service.name} Staffing`;
  const title = `${cleanName} in ${location.name} | Verified Supply | Metro Mitra`;
  const baseRate = location.localPricingConfig?.minimumFare ? ` starting at ₹${location.localPricingConfig.minimumFare}/shift` : '';
  const description = `Hire verified, background-checked ${service.name} workforce in ${location.name}, ${location.state}${baseRate}. Deployment within 24-48 hours. Fully CLRA, PF and ESIC compliant workforce. Contact Metro Mitra.`;
  const keywords = `hire ${service.name.toLowerCase()} in ${location.name}, ${service.name.toLowerCase()} staffing agency ${location.name}, temporary workers ${location.name}, b2b workforce ${location.name}`;
  
  return {
    title,
    description,
    keywords,
    canonicalPath: path,
    indexable: resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus),
    audience: 'Business',
    searchIntent: 'Local Staffing Service',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'B2B', href: '/hire-workers' },
        { label: cleanName, href: `/hire-workers/${service.slug}` },
        { label: location.name, href: path }
      ], path),
      createServiceSchema({ name: `${service.name} Staffing in ${location.name}`, description, path, areaServed: location.name }),
      createLocalBusinessSchema({
        name: `Metro Mitra B2B Staffing - ${location.name}`,
        city: location.name,
        state: location.state,
        postalCode: location.schemaData?.postalCode,
        geo: location.schemaData?.geo,
        path
      }),
    ],
  };
}

// --- DOMAIN A EXTREME EXPANSION ---

export function WorkerRolesDirectorySEO() {
  return {
    title: 'Work Opportunities & Roles | Metro Mitra',
    description: 'Explore the different types of work and roles available on Metro Mitra. Find warehouse helper, delivery, packing, cleaning, and technical opportunities.',
    canonicalPath: '/jobs/roles',
    indexable: true
  };
}

export function WorkerOnboardingSEO() {
  return {
    title: 'Join as a Worker | Metro Mitra Onboarding',
    description: 'Learn how to join Metro Mitra as a worker. Discover what you need to sign up, how verification works, and how to find your first job.',
    canonicalPath: '/join-as-worker',
    indexable: true
  };
}

export function WorkerHowItWorksSEO() {
  return {
    title: 'How It Works for Workers | Metro Mitra',
    description: 'Understand the complete worker journey on Metro Mitra. From registration and profile completion to finding jobs, accepting work, and tracking activity.',
    canonicalPath: '/workers/how-it-works',
    indexable: true
  };
}

export function WorkerFAQSEO() {
  return {
    title: 'Worker FAQ & Help | Metro Mitra',
    description: 'Frequently asked questions for Metro Mitra workers. Get help with registration, job discovery, role selection, locations, and more.',
    canonicalPath: '/workers/faq',
    indexable: true
  };
}

// --- DOMAIN B EXTREME EXPANSION ---

export function ServiceCategoryDirectorySEO() {
  return {
    title: 'Service Categories | Metro Mitra',
    description: 'Explore our complete range of service categories, from logistics and technical support to cleaning and delivery personnel.',
    canonicalPath: '/services/categories',
    indexable: true
  };
}

export function ServiceHowItWorksSEO() {
  return {
    title: 'How Hiring Works | Metro Mitra',
    description: 'Learn how to hire a service or worker on Metro Mitra. Select your service, specify your needs, add a location, set timing, and review your request.',
    canonicalPath: '/services/how-it-works',
    indexable: true
  };
}

export function ServiceFAQSEO() {
  return {
    title: 'Hiring FAQ & Help | Metro Mitra',
    description: 'Frequently asked questions about hiring services or workers on Metro Mitra. Learn about worker selection, locations, scheduling, and request fulfillment.',
    canonicalPath: '/services/faq',
    indexable: true
  };
}

export function ServiceHiringFlowSEO(service) {
if (!service) return { title: 'Hire Service | Metro Mitra', canonicalPath: '/services/hire', indexable: false };
return {
title: `Hire ${service.name} | Request Form | Metro Mitra`,
description: `Request ${service.name} services on Metro Mitra. Fill out the request form to specify workers needed, location, and timing.`,
canonicalPath: `/services/${service.slug}/hire`,
indexable: resolveIndexable(service.indexabilityStatus),
schemas: [createWebPageSchema({ title: `Hire ${service.name}`, description: `Request ${service.name} services.`, path: `/services/${service.slug}/hire` })]
};
}
