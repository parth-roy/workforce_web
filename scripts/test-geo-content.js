import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { createServer as createViteServer } from 'vite';

import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import {
  HomePageSEO, WorkerHubSEO, WorkerRoleSEO, WorkerLocationSEO, WorkerRoleLocationSEO, 
  ServicesHubSEO, IndividualServiceSEO, IndividualServiceLocationSEO,
  B2BHirerHubSEO, B2BServiceSEO, B2BServiceLocationSEO, ContractorSEO, CorporateSEO
} from '../src/seo/pageMetadata.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const allPages = [];
const BASE_URL = 'https://metromitra.com';

function register(urlPath, meta, type, entity) {
  let cleanPath = meta.canonicalPath;
  if (cleanPath !== '/') {
    if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
  } else {
    cleanPath = '';
  }
  allPages.push({
    path: urlPath,
    canonical: BASE_URL + cleanPath,
    indexable: meta.indexable,
    type,
    entity
  });
}

// Register core hubs
register('/', HomePageSEO(), 'home');
register('/jobs', WorkerHubSEO(), 'worker-hub');
register('/services', ServicesHubSEO(), 'services-hub');
register('/hire-workers', B2BHirerHubSEO(), 'b2b-hub');
register('/for-contractors', ContractorSEO(), 'contractor-hub');
register('/for-companies', CorporateSEO(), 'corporate-hub');

// Register representative mocks for content validation 
mockRoles.forEach(r => register(`/jobs/${r.slug}`, WorkerRoleSEO(r), 'role', r));
mockLocations.forEach(l => register(`/jobs/location/${l.slug}`, WorkerLocationSEO(l), 'location', l));
mockServices.filter(s => s.audiences.includes('individual')).forEach(s => register(`/services/${s.slug}`, IndividualServiceSEO(s), 'service', s));
mockServices.filter(s => s.audiences.includes('corporate') || s.audiences.includes('contractor')).forEach(s => register(`/hire-workers/${s.slug}`, B2BServiceSEO(s), 'b2b-service', s));

async function runTests() {
  console.log(`Running GEO/AI Search Content Validation...`);

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root,
  });

  let errors = [];

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

    for (const page of allPages) {
      const { html: appHtml } = render(page.path);
      const $ = cheerio.load(appHtml);
      
      const h1Text = $('h1').first().text().trim();
      const allText = $('body').text().toLowerCase();

      // 1. Every page must have exactly one H1 (or at least one prominent one)
      if ($('h1').length === 0) {
        errors.push(`[${page.path}] Missing H1 tag`);
      }

      // 2. No forbidden claims (Pan-India, fake worker counts)
      const forbiddenTerms = [
        'pan-india', 
        'pan india', 
        'millions of workers',
        'thousands of jobs', 
        'not the bengaluru company', // entity negative disambiguation check
        'not the auto-rickshaw app'
      ];

      for (const term of forbiddenTerms) {
        if (allText.includes(term)) {
          errors.push(`[${page.path}] Contains forbidden claim or negative disambiguation: "${term}"`);
        }
      }

      // 3. Entity identity checks on Homepage
      if (page.type === 'home') {
        const homeText = allText;
        if (!homeText.includes('metro mitra')) errors.push(`[${page.path}] Homepage missing "Metro Mitra"`);
        if (!homeText.includes('gig')) errors.push(`[${page.path}] Homepage missing "gig" platform definition`);
        // Temporarily relaxed Parther Technologies check until legal relationship is formally verified for public display.
      }

      // 4. Intent checks for semantic answerability
      if (page.type === 'role') {
        if ($('h2, h3, h4').filter((_, el) => $(el).text().toLowerCase().includes('requirement')).length === 0) {
          errors.push(`[${page.path}] Role page missing semantic heading for "Requirements"`);
        }
      }

      if (page.type === 'service' || page.type === 'b2b-service') {
        if ($('h2, h3, h4').filter((_, el) => $(el).text().toLowerCase().includes('use case') || $(el).text().toLowerCase().includes('who is it for') || $(el).text().toLowerCase().includes('about') || $(el).text().toLowerCase().includes('responsibilities')).length === 0) {
          errors.push(`[${page.path}] Service page missing answer-focused semantic headings (Use cases, who it's for, about)`);
        }
      }

      
      // 6. F6.5.1 Claims Gate: No unsupported earnings/payout claims on not-yet-eligible pages
      if (page.type === 'role' && !page.indexable) {
        if (allText.includes('earn up to') || allText.includes('salary') || allText.includes('wage') || allText.match(/rs\.?\s*\d+/)) {
          errors.push(`[${page.path}] Contains unverified earnings/wage claim on a not-yet-eligible role page.`);
        }
      }
      
      // 7. No hidden AI content blocks
      if ($('.hidden, [style*="display: none"], [style*="display:none"], [aria-hidden="true"]').text().toLowerCase().includes('metro mitra')) {
         // This is a naive check to ensure we aren't stuffing AI keywords in hidden divs
         errors.push(`[${page.path}] Contains hidden text blocks which may be seen as AI keyword stuffing.`);
      }

      // 5. Geo Stubs should NOT have verbose GEO content if they are not-yet-eligible
      if (page.type === 'location' && !page.indexable) {
        if (appHtml.length > 50000) { 
           errors.push(`[${page.path}] not-yet-eligible Location page has bloated content.`);
        }
      }
    }
  } catch (err) {
    console.error('SSR Runner Error:', err);
    process.exit(1);
  } finally {
    await vite.close();
  }

  if (errors.length > 0) {
    console.error('\n❌ GEO Content Validation Failed:');
    errors.forEach(e => console.error('  ->', e));
    process.exit(1);
  } else {
    console.log('\n✅ GEO Content Validation Passed Flawlessly!');
  }
}

runTests();
