/**
 * scripts/generate-sitemap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Segmented Programmatic Sitemap & Robots Generator
 * Scales to 25,000+ URLs with < 5,000 URLs per segment file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Manifest
import { CORE_ROUTES } from '../src/route-manifest.js';
import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import { mockJobs } from '../src/data/mock/jobs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'https://metromitra.com';

function toUrl(path) {
  if (!path) return null;
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${BASE_URL}${cleanPath}`;
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function generateSitemaps() {
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const buckets = {
    core: [],
    locations: [],
    services: [],
    jobs: [],
    b2b: []
  };

  // 1. Core Evergreen
  CORE_ROUTES.forEach(r => buckets.core.push(toUrl(r)));
  mockServices.forEach(s => {
    buckets.services.push(toUrl(`/services/${s.slug}`));
    buckets.services.push(toUrl(`/services/${s.slug}/hire`));
    buckets.b2b.push(toUrl(`/hire-workers/${s.slug}`));
  });
  mockRoles.forEach(r => buckets.jobs.push(toUrl(`/jobs/${r.slug}`)));
  mockJobs.forEach(job => {
    if (job.status === 'active' || job.status === 'ACTIVE' || !job.isDemo) {
      buckets.jobs.push(toUrl(`/jobs/detail/${job.id}`));
    }
  });

  // 2. Locations
  mockLocations.forEach(loc => {
    buckets.locations.push(toUrl(`/jobs/location/${loc.slug}`));
  });

  // 3. Matrix: B2C Services × Locations
  mockServices.forEach(s => {
    mockLocations.forEach(loc => {
      buckets.services.push(toUrl(`/services/${s.slug}/${loc.slug}`));
    });
  });

  // 4. Matrix: Worker Jobs × Locations
  mockRoles.forEach(r => {
    mockLocations.forEach(loc => {
      buckets.jobs.push(toUrl(`/jobs/${r.slug}/${loc.slug}`));
    });
  });

  // 5. Matrix: B2B Manpower × Locations
  mockServices.forEach(s => {
    mockLocations.forEach(loc => {
      buckets.b2b.push(toUrl(`/hire-workers/${s.slug}/${loc.slug}`));
    });
  });

  const CHUNK_SIZE = 5000;
  const sitemapFiles = [];
  let grandTotal = 0;

  for (const [category, rawUrls] of Object.entries(buckets)) {
    const urls = [...new Set(rawUrls.filter(Boolean))];
    if (urls.length === 0) continue;

    const chunks = chunkArray(urls, CHUNK_SIZE);
    chunks.forEach((chunk, index) => {
      const filename = chunks.length > 1
        ? `sitemap-${category}-${index + 1}.xml`
        : `sitemap-${category}.xml`;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      chunk.forEach(u => {
        xml += `  <url>\n    <loc>${u}</loc>\n  </url>\n`;
      });
      xml += `</urlset>`;

      fs.writeFileSync(path.join(publicDir, filename), xml);
      console.log(`✅ ${filename} generated with ${chunk.length} URLs`);
      sitemapFiles.push(filename);
      grandTotal += chunk.length;
    });
  }

  // Master Sitemap Index
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  indexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  sitemapFiles.forEach(file => {
    indexXml += `  <sitemap>\n    <loc>${BASE_URL}/${file}</loc>\n  </sitemap>\n`;
  });
  indexXml += `</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
  console.log(`\n🎉 sitemap.xml generated with ${sitemapFiles.length} segmented sitemaps and ${grandTotal} total URLs!\n`);

  // Robots.txt
  const robotsTxt = `# METRO MITRA — Crawler & Generative Engine Policy
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

# Search Engines
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /

# AI Answer Engines & Generative Search
User-agent: Google-Extended
Allow: /
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Applebot
Allow: /

# Canonical Sitemap Index
Sitemap: ${BASE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log(`✅ robots.txt generated successfully.\n`);
}

generateSitemaps();
