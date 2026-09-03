/**
 * scripts/generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Modular Sitemap & Robots Generator
 * Complete Multi-Category Sitemap Index Architecture (Aligned with Vahan)
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
  WorkerRolesDirectorySEO,
  WorkerOnboardingSEO,
  WorkerHowItWorksSEO,
  WorkerFAQSEO,
  ServiceCategoryDirectorySEO,
  ServiceHowItWorksSEO,
  ServiceFAQSEO,
  ServiceHiringFlowSEO,
  DirectContactSEO,
} from '../src/seo/pageMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://metromitra.com';

function cleanCanonical(pathOrObj) {
  if (typeof pathOrObj === 'object' && pathOrObj !== null) {
    if (pathOrObj.indexable === false) return null;
    const p = pathOrObj.canonicalPath || '';
    if (!p || p.includes('demo')) return null;
    const cleanPath = p === '/' ? '' : p.replace(/\/$/, '');
    return `${BASE_URL}${cleanPath}`;
  }
  const p = typeof pathOrObj === 'string' ? pathOrObj : '';
  if (!p || p.includes('demo')) return null;
  const cleanPath = p === '/' ? '' : p.replace(/\/$/, '');
  return `${BASE_URL}${cleanPath}`;
}

function generateSitemaps() {
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const categories = {
    core: [],
    jobs: [],
    services: [],
    b2b: [],
    locations: [],
    'role-locations': [],
    'service-locations': [],
  };

  // 1. Core Evergreen Pages
  const coreMetas = [
    HomePageSEO(),
    WorkerHubSEO(),
    ServicesHubSEO(),
    B2BHirerHubSEO(),
    ContractorSEO(),
    CorporateSEO(),
    WorkerRolesDirectorySEO(),
    WorkerOnboardingSEO(),
    WorkerHowItWorksSEO(),
    WorkerFAQSEO(),
    ServiceCategoryDirectorySEO(),
    ServiceHowItWorksSEO(),
    ServiceFAQSEO(),
    DirectContactSEO(),
    { canonicalPath: '/about' },
    { canonicalPath: '/contact' },
    { canonicalPath: '/faq' },
    { canonicalPath: '/guides' },
  ];
  coreMetas.forEach(meta => {
    const url = cleanCanonical(meta);
    if (url) categories.core.push(url);
  });

  // 2. Worker Roles & Jobs
  mockRoles.forEach(r => {
    const url = cleanCanonical(WorkerRoleSEO(r));
    if (url) categories.jobs.push(url);
  });
  mockJobs.forEach(job => {
    if (job.status === 'active' || job.status === 'ACTIVE') {
      const url = cleanCanonical(JobDetailSEO(job));
      if (url) categories.jobs.push(url);
    }
  });

  // 3. Individual Services (B2C)
  mockServices.forEach(s => {
    const sUrl = cleanCanonical(IndividualServiceSEO(s));
    if (sUrl) categories.services.push(sUrl);
    const flowUrl = cleanCanonical(ServiceHiringFlowSEO(s));
    if (flowUrl) categories.services.push(flowUrl);
  });

  // 4. B2B Services
  mockServices.forEach(s => {
    const b2bUrl = cleanCanonical(B2BServiceSEO(s));
    if (b2bUrl) categories.b2b.push(b2bUrl);
  });

  // 5. Locations Hubs
  mockLocations.forEach(l => {
    const locUrl = cleanCanonical(WorkerLocationSEO(l));
    if (locUrl) categories.locations.push(locUrl);
  });

  // 6. Worker Role + Location Combinations
  mockRoles.forEach(r => {
    mockLocations.forEach(l => {
      const rlUrl = cleanCanonical(WorkerRoleLocationSEO(r, l));
      if (rlUrl) categories['role-locations'].push(rlUrl);
    });
  });

  // 7. Service + Location Combinations (B2C & B2B)
  mockServices.forEach(s => {
    mockLocations.forEach(l => {
      const slUrl = cleanCanonical(IndividualServiceLocationSEO(s, l));
      if (slUrl) categories['service-locations'].push(slUrl);
      const b2blUrl = cleanCanonical(B2BServiceLocationSEO(s, l));
      if (b2blUrl) categories['service-locations'].push(b2blUrl);
    });
  });

  const sitemapFiles = [];
  let totalUrls = 0;

  // Build each category sitemap
  for (const [category, urls] of Object.entries(categories)) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length === 0) continue;

    const filename = `sitemap-${category}.xml`;
    const sitemapPath = path.join(publicDir, filename);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    uniqueUrls.forEach(url => {
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync(sitemapPath, xml);
    console.log(`✅ ${filename} generated with ${uniqueUrls.length} URLs`);
    sitemapFiles.push(filename);
    totalUrls += uniqueUrls.length;
  }

  // Generate canonical sitemap.xml index
  const indexPath = path.join(publicDir, 'sitemap.xml');
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  sitemapFiles.forEach(file => {
    indexXml += `  <sitemap>\n`;
    indexXml += `    <loc>${BASE_URL}/${file}</loc>\n`;
    indexXml += `  </sitemap>\n`;
  });

  indexXml += `</sitemapindex>`;

  fs.writeFileSync(indexPath, indexXml);
  console.log(`✅ sitemap.xml (index) successfully generated referencing ${sitemapFiles.length} sitemaps and ${totalUrls} total URLs.`);

  // Generate robots.txt
  const robotsTxt = `# METRO MITRA — Crawler Policy
# Complete AEO & Search Engine Indexing Policy

User-agent: *
Allow: /
Disallow: /*?q=
Disallow: /*?filter=
Disallow: /*?sort=
Disallow: /company/dashboard/
Disallow: /company/requests/
Disallow: /contractor/dashboard/
Disallow: /user/orders
Disallow: /checkout

# AI Search & Answer Engines (Explicitly Allowed for Geo/AI Discovery)
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Applebot
Allow: /
User-agent: Google-Extended
Allow: /

# Canonical Sitemap Index
Sitemap: ${BASE_URL}/sitemap.xml
`;

  const robotsPath = path.join(publicDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`✅ robots.txt generated with AI answer engine policies and sitemap index.`);
}

generateSitemaps();

