/**
 * scripts/prerender.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Static Site Generator (SSG) Prerender
 * Phase F6.4 — Pre-rendering Engine
 *
 * This script runs after `vite build` and `vite build --ssr`.
 * It reads the generated `public/sitemap.xml` to determine which URLs to 
 * statically generate. It then uses the SSR entry point to render the HTML and 
 * SEO tags, and writes the final static `.html` files into the `dist/` folder.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');
const distSsr = path.resolve(root, 'dist-ssr');

// Ensure dist exists (it should, from Vite client build)
if (!fs.existsSync(dist)) {
  console.error('❌ dist folder not found. Run `vite build` first.');
  process.exit(1);
}

// Ensure dist-ssr exists
if (!fs.existsSync(distSsr)) {
  console.error('❌ dist-ssr folder not found. Run `vite build --ssr src/entry-server.jsx --outDir dist-ssr` first.');
  process.exit(1);
}

const templatePath = path.resolve(dist, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');
// We need to prerender ALL routes, including those excluded from the sitemap (like geo-stubs or demo jobs)
// because users still navigate to them, and they should be fast and have proper <head> tags (e.g. noindex).

import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import { mockJobs } from '../src/data/mock/jobs.js';

let urls = [
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
  '/guides'
];

mockRoles.forEach(r => urls.push(`/jobs/${r.slug}`));
mockLocations.forEach(l => urls.push(`/jobs/location/${l.slug}`));
mockRoles.forEach(r => mockLocations.forEach(l => urls.push(`/jobs/${r.slug}/${l.slug}`)));
mockJobs.forEach(job => urls.push(`/jobs/detail/${job.id}`));
mockServices.forEach(s => {
  urls.push(`/services/${s.slug}`);
  urls.push(`/services/${s.slug}/hire`);
  urls.push(`/hire-workers/${s.slug}`);
  mockLocations.forEach(l => {
    urls.push(`/services/${s.slug}/${l.slug}`);
    urls.push(`/hire-workers/${s.slug}/${l.slug}`);
  });
});

// Deduplicate and sanitize
urls = [...new Set(urls)].filter(u => u.startsWith('/'));

async function prerender() {
  console.log(`Starting SSG Prerender for ${urls.length} routes...`);

  // Load the server entry
  // Vite SSR build outputs to dist-ssr/entry-server.js
  const entryServerPath = path.resolve(distSsr, 'entry-server.js');
  if (!fs.existsSync(entryServerPath)) {
    console.error('❌ entry-server.js not found in dist-ssr.');
    process.exit(1);
  }

  // Import dynamically
  const { render } = await import(new URL('file://' + entryServerPath).href);

  for (const url of urls) {
    try {
      const { html: appHtml, head: headTags } = render(url);

      // Inject tags into head and app HTML into root
      let finalHtml = templateHtml.replace('</head>', `${headTags}</head>`);
      finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      // Determine output file path
      // e.g. '/' -> 'dist/index.html'
      // e.g. '/jobs' -> 'dist/jobs/index.html'
      let filePath;
      if (url === '/') {
        filePath = path.resolve(dist, 'index.html');
      } else {
        const routeDir = path.resolve(dist, url.substring(1));
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        filePath = path.resolve(routeDir, 'index.html');
      }

      fs.writeFileSync(filePath, finalHtml);
      console.log(`✅ Prerendered: ${url}`);
    } catch (err) {
      console.error(`❌ Error prerendering ${url}:`, err.message);
    }
  }

  console.log('✅ SSG Prerender Complete!');
}

prerender();
