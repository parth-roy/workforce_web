/**
 * src/route-manifest.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — 22,000+ Programmatic Route Manifest
 * Aligned with 20k PSEO Master Blueprint
 */

import { mockServices } from './data/mock/services.js';
import { mockRoles } from './data/mock/roles.js';
import { mockLocations } from './data/mock/locations.js';
import { mockJobs } from './data/mock/jobs.js';

export const CORE_ROUTES = [
  '/',
  '/jobs',
  '/services',
  '/hire-workers',
  '/for-contractors',
  '/for-companies',
  '/jobs/roles',
  '/join-as-worker',
  '/workers/how-it-works',
  '/workers/faq',
  '/services/categories',
  '/services/how-it-works',
  '/services/faq',
  '/about',
  '/contact',
  '/faq',
  '/guides',
  '/direct-contact',
  '/directory',
  '/locations'
];

const routeSet = new Set(CORE_ROUTES);

function addRoute(r) {
  if (r && typeof r === 'string' && r.startsWith('/')) {
    routeSet.add(r);
  }
}

// 1. Role Hubs & Specific Public Jobs
mockRoles.forEach(r => addRoute(`/jobs/${r.slug}`));
mockJobs.forEach(job => {
  if (job.status === 'active' || job.status === 'ACTIVE' || !job.isDemo) {
    addRoute(`/jobs/detail/${job.id}`);
  }
});

// 2. Service Hubs (B2C & B2B)
mockServices.forEach(s => {
  addRoute(`/services/${s.slug}`);
  addRoute(`/services/${s.slug}/hire`);
  addRoute(`/hire-workers/${s.slug}`);
});

// 3. Location Hubs (556 Cities & Suburbs)
mockLocations.forEach(loc => {
  addRoute(`/jobs/location/${loc.slug}`);
});

// 4. B2C Service × Location Matrix (13 Services × 556 Locations = 7,228 URLs)
mockServices.forEach(s => {
  mockLocations.forEach(loc => {
    addRoute(`/services/${s.slug}/${loc.slug}`);
  });
});

// 5. Worker Supply Role × Location Matrix (13 Roles × 556 Locations = 7,228 URLs)
mockRoles.forEach(r => {
  mockLocations.forEach(loc => {
    addRoute(`/jobs/${r.slug}/${loc.slug}`);
  });
});

// 6. B2B Commercial Manpower × Location Matrix (13 Services × 556 Locations = 7,228 URLs)
mockServices.forEach(s => {
  mockLocations.forEach(loc => {
    addRoute(`/hire-workers/${s.slug}/${loc.slug}`);
  });
});

export const PRERENDER_ROUTES = Array.from(routeSet);
export const INDEXABLE_ROUTES = PRERENDER_ROUTES;

console.log(`[route-manifest] Generated ${PRERENDER_ROUTES.length} programmatic routes for MetroMitra.`);
