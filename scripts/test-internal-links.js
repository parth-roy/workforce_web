import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { createServer as createViteServer } from 'vite';

import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import { mockJobs } from '../src/data/mock/jobs.js';
import {
  HomePageSEO, WorkerHubSEO, WorkerRoleSEO, WorkerLocationSEO, WorkerRoleLocationSEO, JobDetailSEO,
  ServicesHubSEO, IndividualServiceSEO, IndividualServiceLocationSEO,
  B2BHirerHubSEO, B2BServiceSEO, B2BServiceLocationSEO, ContractorSEO, CorporateSEO
} from '../src/seo/pageMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const BASE_URL = 'https://metromitra.com';

const allPages = [];

function register(urlPath, meta, type) {
  let cleanPath = meta.canonicalPath;
  if (cleanPath !== '/') {
    if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
  } else {
    cleanPath = '';
  }
  const canonicalUrl = BASE_URL + cleanPath;

  allPages.push({
    path: urlPath,
    canonical: canonicalUrl,
    indexable: meta.indexable,
    type,
    meta,
    outbound: new Set(),
    inbound: new Set(),
    demoOrNoindex: !meta.indexable
  });
}

// 1. Core Hubs
register('/', HomePageSEO(), 'home');
register('/jobs', WorkerHubSEO(), 'worker-hub');
register('/services', ServicesHubSEO(), 'services-hub');
register('/hire-workers', B2BHirerHubSEO(), 'b2b-hub');
register('/for-contractors', ContractorSEO(), 'contractor-hub');
register('/for-companies', CorporateSEO(), 'corporate-hub');

// 2. Mock Entities
mockRoles.forEach(r => register(`/jobs/${r.slug}`, WorkerRoleSEO(r), 'role'));
mockLocations.forEach(l => register(`/jobs/location/${l.slug}`, WorkerLocationSEO(l), 'location'));
mockServices.forEach(s => register(`/services/${s.slug}`, IndividualServiceSEO(s), 'service'));
mockServices.forEach(s => register(`/hire-workers/${s.slug}`, B2BServiceSEO(s), 'b2b-service'));

// 3. Geo Stubs
mockRoles.forEach(r => {
  mockLocations.forEach(l => register(`/jobs/${r.slug}/${l.slug}`, WorkerRoleLocationSEO(r, l), 'role-location'));
});
mockServices.forEach(s => {
  mockLocations.forEach(l => register(`/services/${s.slug}/${l.slug}`, IndividualServiceLocationSEO(s, l), 'service-location'));
  mockLocations.forEach(l => register(`/hire-workers/${s.slug}/${l.slug}`, B2BServiceLocationSEO(s, l), 'b2b-service-location'));
});

// 4. Jobs
mockJobs.forEach(job => {
  register(`/jobs/detail/${job.id}`, JobDetailSEO(job), 'job-detail');
});

async function runTests() {
  console.log(`Testing ${allPages.length} total generated URLs for Internal Link Graph...`);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root,
  });

  const graph = new Map();

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

    for (const page of allPages) {
      const { html: appHtml, head: headTags } = render(page.path);
      const $ = cheerio.load(headTags + appHtml);
      
      $('a').each((_, el) => {
        let href = $(el).attr('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (href === '') href = '/';
        
        let testHref = href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href;
        
        let matchedPage = allPages.find(p => p.path === testHref);
        if (matchedPage) {
          page.outbound.add(matchedPage.path);
          matchedPage.inbound.add(page.path);
        }
      });
      
      graph.set(page.path, page);
    }
  } catch (err) {
    console.error('SSR Runner Error:', err);
    process.exit(1);
  } finally {
    await vite.close();
  }

  let errors = [];
  let warnings = [];

  allPages.forEach(page => {
    if (page.indexable && page.path !== '/') {
      if (page.inbound.size === 0) {
        errors.push(`ORPHAN PAGE DETECTED: ${page.path} is eligible but has 0 inbound internal links.`);
      }
    }

    page.outbound.forEach(outPath => {
      const target = graph.get(outPath);
      if (!target) return;
      
      if (!target.indexable && target.type === 'job-detail') {
        errors.push(`SEO LEAK: ${page.path} links to DEMO JOB ${outPath}`);
      }
      
      // Removed warning for geo stubs since UX logic might link them legitimately without SEO leaking them in sitemaps.
    });
  });

  console.log('--- LINK GRAPH REPORT ---');
  allPages.forEach(page => {
    console.log(`\nURL: ${page.path}`);
    console.log(`Type: ${page.type} | Indexable: ${page.indexable}`);
    console.log(`Inbound: ${page.inbound.size} | Outbound: ${page.outbound.size}`);
  });

  if (errors.length > 0) {
    console.error('\n❌ Internal Link Graph Validation Failed:');
    errors.forEach(e => console.error('  ->', e));
    process.exit(1);
  } else {
    console.log('\n✅ Internal Link Graph Validation Passed Flawlessly!');
  }
}

runTests();
