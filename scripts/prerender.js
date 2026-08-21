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
const sitemapPath = path.resolve(dist, 'sitemap.xml'); // We assume it's moved or generated in dist/public? Wait, generate-sitemap.js writes to 'public'.

// generate-sitemap.js writes to `../public/sitemap.xml`. 
// Vite copies `public/*` to `dist/` during the client build.
// So `dist/sitemap.xml` will exist. Let's read it.
const sitemapDistPath = path.resolve(dist, 'sitemap.xml');
let urls = [];
if (fs.existsSync(sitemapDistPath)) {
  const sitemapXml = fs.readFileSync(sitemapDistPath, 'utf-8');
  // Simple regex to extract <loc> contents
  const matches = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)];
  urls = matches.map(m => {
    // Convert absolute URL to relative path
    const urlStr = m[1];
    try {
      const urlObj = new URL(urlStr);
      return urlObj.pathname; // e.g. '/', '/jobs'
    } catch {
      return urlStr;
    }
  });
} else {
  console.error('❌ dist/sitemap.xml not found. Cannot determine routes to prerender.');
  process.exit(1);
}

// Deduplicate and sanitize
urls = [...new Set(urls)].filter(u => u.startsWith('/'));

// Important: Also add non-indexable routes that we still want to render statically 
// for the user experience, even if they aren't in the sitemap. 
// For now, sitemap URLs are our primary SEO target.
// But we should also make sure 404 or other core pages are rendered if they exist.

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
