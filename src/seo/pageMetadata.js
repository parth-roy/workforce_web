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
  if (status === 'eligible') return true;
  // "not-yet-eligible" and "noindex" both render noindex for now.
  // "not-yet-eligible" will become indexable once evidence thresholds are met.
  return false;
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
  const title = 'Metro Mitra - Technology-Driven, Full-Stack Gig Economy Platform';
  const description = 'Metro Mitra is a technology-driven, full-stack gig economy platform connecting job seekers with daily shift work and businesses with on-demand staffing across India.';
  const keywords = 'full-stack gig economy platform, technology-driven gig platform, Metro Mitra, on-demand workforce';
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
  const title = 'Daily Gig Jobs & Shift Work | Metro Mitra';
  const description = 'Find daily gig jobs, shift work, and part-time opportunities across roles including warehouse, loading, delivery, and more. Daily payouts, flexible hours.';
  return {
    title,
    description,
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
  const title = 'Local Workforce Services | Metro Mitra';
  const description = 'Book skilled workforce for local services including plumbing, electrical work, loading, and maintenance.';
  return {
    title,
    description,
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
  const title = 'Workforce Procurement for Businesses | Metro Mitra';
  const description = 'Structured workforce procurement for contractors and enterprises. Request staffing across logistics, warehousing, construction, and operations roles.';
  return {
    title,
    description,
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
  const description = `Browse all daily gig jobs, shift work, and open roles available in ${location.name}. Get hired directly with daily payouts.`;
  
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' }
  ];
  if (location.state) {
    crumbs.push({ label: location.state, href: `/jobs/location` }); // Or appropriate hub, just text representation for now
  }
  crumbs.push({ label: location.name, href: path });
  
  return {
    title,
    description,
    canonicalPath: path,
    indexable: resolveIndexable(location.indexabilityStatus),
    audience: 'Worker',
    searchIntent: 'Location Discovery',
    schemas: [
      createCollectionPageSchema({ title, description, path }),
      createBreadcrumbSchema(crumbs, path),
    ],
  };
}

/**
 * /jobs/:role/:location (Worker Role + Location — Hyper-Local)
 *
 * Blueprint intent: Transactional — "warehouse jobs in dankuni",
 * "loader jobs near me barasat". Highest commercial value pages.
 *
 * Indexability: "not-yet-eligible" by default in this frontend phase.
 * Will become "eligible" once the evidence model supplies: active job count,
 * verified worker presence, local wage data. NOT a permanent prohibition.
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string, id?: string }} role
 * @param {{ name: string, slug: string, indexabilityStatus?: string, id?: string, state?: string, localPricingConfig?: object }} location
 */
export function WorkerRoleLocationSEO(role, location) {
  const path = `/jobs/${role.slug}/${location.slug}`;
  const title = `${role.name} Jobs in ${location.name} | Direct Hiring | Metro Mitra`;
  const baseRate = location.localPricingConfig?.minimumFare ? ` Earn up to ₹${location.localPricingConfig.minimumFare} per shift.` : '';
  const description = `Find verified ${role.name} jobs and shifts in ${location.name}.${baseRate} Apply today for flexible work, safe environment and daily payouts.`;
  
  // PHASE 8: GEO-STUB PROTECTION. 
  // Do not mass-index combinations without verified active supply/demand evidence.
  // We explicitly force noindex for combinations until evidence is loaded.
  const hasGenuineEvidence = false; // Mock: require actual supply data to flip this true
  const indexable = resolveIndexable(role.indexabilityStatus) && resolveIndexable(location.indexabilityStatus) && hasGenuineEvidence;
  
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: `${role.name} Jobs`, href: `/jobs/${role.slug}` }
  ];
  if (location.state) {
    crumbs.push({ label: location.state, href: `/jobs/location` });
  }
  crumbs.push({ label: location.name, href: path });

  return {
    title,
    description,
    canonicalPath: path,
    indexable,
    audience: 'Worker',
    searchIntent: 'Local Job Transaction',
    schemas: [
      createWebPageSchema({ title, description, path }),
      createBreadcrumbSchema(crumbs, path),
    ],
  };
}

/**
 * /jobs/detail/:jobId (Individual Job Detail)
 *
 * Blueprint rule: JobPosting schema ONLY applied here (F6.2).
 * Indexability: never index demo jobs. Real jobs: eligible if active and not expired.
 *
 * @param {{ title: string, id: string, isDemo?: boolean, indexabilityStatus?: string }} job
 */
export function JobDetailSEO(job) {
  const path = `/jobs/detail/${job.id}`;
  const title = `${job.title} | Metro Mitra`;
  const description = job.description || `Apply for ${job.title} in ${job.location?.city || 'West Bengal'}. Flexible gig work with Metro Mitra.`;
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
 * Indexability: driven by service.indexabilityStatus.
 *
 * @param {{ name: string, slug: string, description?: string, indexabilityStatus?: string }} service
 */
export function IndividualServiceSEO(service) {
  const path = `/services/${service.slug}`;
  const title = `${service.name} Services | Metro Mitra`;
  const description = service.description || `Book reliable ${service.name} services. Experienced local workforce available on demand.`;
  return {
    title,
    description,
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
 * Indexability: "not-yet-eligible" — geo stubs without live supply data.
 * Will upgrade as local supply evidence becomes available.
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string }} service
 * @param {{ name: string, slug: string, indexabilityStatus?: string }} location
 */
export function IndividualServiceLocationSEO(service, location) {
  const path = `/services/${service.slug}/${location.slug}`;
  const title = `${service.name} in ${location.name} | Metro Mitra`;
  const description = `Book ${service.name} in ${location.name}. Reliable local workforce available on demand.`;
  
  // PHASE 8: GEO-STUB PROTECTION.
  const hasGenuineEvidence = false;
  const indexable = resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus) && hasGenuineEvidence;
  
  return {
    title,
    description,
    canonicalPath: path,
    indexable,
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
      indexable ? createServiceSchema({ name: `${service.name} in ${location.name}`, description, path }) : null,
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Programmatic B2B Pages
// ─────────────────────────────────────────────────────────────────────────────

/**
 * /hire-workers/:service (B2B Service Page)
 *
 * Blueprint intent: Service-Specific B2B — "logistics staffing agency kolkata",
 * "on-demand warehouse loading service". Avoids duplicating the service name word.
 *
 * Title rule: "[Service Name] Staffing Services | Metro Mitra"
 * NOT "[Service Name] Staffing & Workforce" (was causing "Warehouse Staffing Staffing & Workforce").
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
 * Indexability: "not-yet-eligible" — geo stubs without confirmed industrial supply.
 *
 * @param {{ name: string, slug: string, indexabilityStatus?: string }} service
 * @param {{ name: string, slug: string, indexabilityStatus?: string, localPricingConfig?: object }} location
 */
export function B2BServiceLocationSEO(service, location) {
  const path = `/hire-workers/${service.slug}/${location.slug}`;
  const cleanName = service.name.endsWith('Staffing') ? service.name : `${service.name} Staffing`;
  const title = `${cleanName} in ${location.name} | Verified Supply | Metro Mitra`;
  const baseRate = location.localPricingConfig?.minimumFare ? ` starting at ₹${location.localPricingConfig.minimumFare}/shift` : '';
  const description = `Hire verified, background-checked ${service.name} workforce in ${location.name}${baseRate}. Deployment within 48 hours. Fully CLRA and PF compliant workforce. Contact Metro Mitra.`;
  
  // PHASE 8: GEO-STUB PROTECTION.
  const hasGenuineEvidence = false;
  const indexable = resolveIndexable(service.indexabilityStatus) && resolveIndexable(location.indexabilityStatus) && hasGenuineEvidence;
  
  return {
    title,
    description,
    canonicalPath: path,
    indexable,
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
      indexable ? createServiceSchema({ name: `${service.name} in ${location.name}`, description, path }) : null,
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
