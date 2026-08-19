/**
 * scripts/generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Sitemap & Robots Generator
 * Phase F6.3 — Sitemap, Robots & Indexability Infrastructure
 *
 * Rules:
 * 1. ONLY include URLs where `indexable` evaluates to true via pageMetadata.
 * 2. Exclude geo stubs (not-yet-eligible) and demo jobs (noindex).
 * 3. NO fake lastmod, priority, or changefreq.
 * 4. URLs must be absolute, canonical, HTTPS, trailing-slash consistent.
 * 5. Job lifecycle enforcement (ACTIVE + ELIGIBLE).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock Data
import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import { mockJobs } from '../src/data/mock/jobs.js';

// SEO Factories
import {
  HomePageSEO,
  WorkerHubSEO,
  WorkerRoleSEO,
  WorkerLocationSEO,
  WorkerRoleLocationSEO,
  JobDetailSEO,
  ServicesHubSEO,
  IndividualServiceSEO,
  IndividualServiceLocationSEO,
  B2BHirerHubSEO,
  B2BServiceSEO,
  B2BServiceLocationSEO,
  ContractorSEO,
  CorporateSEO,
} from '../src/seo/pageMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://metromitra.com';

function isSitemapEligible(seoMetadata) {
  // 1. Must be indexable via the centralized three-state model
  if (!seoMetadata.indexable) return false;
  // 2. Must have a canonical path
  if (!seoMetadata.canonicalPath) return false;
  // (In a real system, we'd also check isPublic, isNotRedirect, etc.)
  return true;
}

function generateSitemap() {
  const urls = [];

  const addUrl = (seoMetadata) => {
    if (isSitemapEligible(seoMetadata)) {
      // Normalize canonical: Use BASE_URL + path
      let cleanPath = seoMetadata.canonicalPath === '/' ? '' : seoMetadata.canonicalPath.replace(/\/$/, '');
      urls.push(`${BASE_URL}${cleanPath}`);
    }
  };

  // 1. Core Evergreen Pages
  addUrl(HomePageSEO());
  addUrl(WorkerHubSEO());
  addUrl(ServicesHubSEO());
  addUrl(B2BHirerHubSEO());
  addUrl(ContractorSEO());
  addUrl(CorporateSEO());

  // 2. Worker Role Hubs
  mockRoles.forEach(r => addUrl(WorkerRoleSEO(r)));

  // 3. Worker Location Hubs
  mockLocations.forEach(l => addUrl(WorkerLocationSEO(l)));

  // 4. Worker Role + Location (Geo Stubs)
  mockRoles.forEach(r => {
    mockLocations.forEach(l => {
      addUrl(WorkerRoleLocationSEO(r, l));
    });
  });

  // 5. Job Details (Lifecycle enforced in JobDetailSEO and data status)
  mockJobs.forEach(job => {
    // Only ACTIVE jobs are allowed
    if (job.status === 'active' || job.status === 'ACTIVE') {
      addUrl(JobDetailSEO(job));
    }
  });

  // 6. Individual Services (B2C)
  mockServices.forEach(s => addUrl(IndividualServiceSEO(s)));

  // 7. Individual Service + Location (Geo Stubs B2C)
  mockServices.forEach(s => {
    mockLocations.forEach(l => addUrl(IndividualServiceLocationSEO(s, l)));
  });

  // 8. B2B Services
  mockServices.forEach(s => addUrl(B2BServiceSEO(s)));

  // 9. B2B Service + Location (Geo Stubs B2B)
  mockServices.forEach(s => {
    mockLocations.forEach(l => addUrl(B2BServiceLocationSEO(s, l)));
  });

  // Deduplicate just in case
  const uniqueUrls = [...new Set(urls)];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  uniqueUrls.forEach(url => {
    xml += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
  });

  xml += `</urlset>`;

  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  console.log(`✅ Generated sitemap.xml with ${uniqueUrls.length} eligible URLs.`);

  // Generate robots.txt
  const robotsTxt = `# METRO MITRA — Crawler Policy
# Phase F6.3 Architecture

User-agent: *
# Allow public crawling
Allow: /

# Prevent uncontrolled crawl/indexation of internal search/filter traps
Disallow: /*?q=
Disallow: /*?filter=
Disallow: /*?sort=

# Protect private/authenticated areas (Future Scale)
Disallow: /company/dashboard/
Disallow: /company/requests/
Disallow: /company/locations/
Disallow: /contractor/dashboard/
Disallow: /contractor/requests/

# Expose Canonical Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`;
  
  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`✅ Generated robots.txt`);
}

generateSitemap();
