/**
 * scripts/prerender.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Concurrent High-Speed Static Site Generator (SSG)
 * Scales to 22,000+ routes with BATCH_SIZE concurrency and async fs operations
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRERENDER_ROUTES } from '../src/route-manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');
const distSsr = path.resolve(root, 'dist-ssr');

if (!fsSync.existsSync(dist)) {
  console.error('❌ dist folder not found. Run `vite build` first.');
  process.exit(1);
}

const entryServerPath = path.resolve(distSsr, 'entry-server.js');
if (!fsSync.existsSync(entryServerPath)) {
  console.error('❌ entry-server.js not found in dist-ssr.');
  process.exit(1);
}

const templatePath = path.resolve(dist, 'index.html');
if (!fsSync.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found.');
  process.exit(1);
}

const templateHtml = await fs.readFile(templatePath, 'utf-8');

// Load SSR render function
const { render } = await import(new URL('file://' + entryServerPath).href);

const createdDirs = new Set([dist]);

async function ensureDir(dir) {
  if (createdDirs.has(dir)) return;
  await fs.mkdir(dir, { recursive: true });
  createdDirs.add(dir);
}

async function writeRoute(url) {
  try {
    const { html: appHtml, head: headTags } = render(url);
    const finalHtml = templateHtml
      .replace('</head>', `${headTags}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    let filePath;
    if (url === '/') {
      filePath = path.resolve(dist, 'index.html');
    } else {
      const routeDir = path.resolve(dist, url.substring(1));
      await ensureDir(routeDir);
      filePath = path.resolve(routeDir, 'index.html');
    }

    await fs.writeFile(filePath, finalHtml, 'utf-8');
  } catch (err) {
    console.error(`❌ Error prerendering ${url}:`, err.message);
  }
}

async function runPrerender() {
  const total = PRERENDER_ROUTES.length;
  console.log(`🚀 Starting concurrent SSG Prerender for ${total} routes...`);

  const BATCH_SIZE = 64;
  let completed = 0;
  let lastLogged = 0;
  const startTime = Date.now();

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const chunk = PRERENDER_ROUTES.slice(i, i + BATCH_SIZE);
    await Promise.all(chunk.map(writeRoute));
    completed += chunk.length;

    if (completed - lastLogged >= 1000 || completed === total) {
      lastLogged = completed;
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (completed / (Date.now() - startTime) * 1000).toFixed(0);
      console.log(`⏳ Prerendered ${completed} / ${total} routes (${rate} pages/sec, ${elapsedSec}s elapsed)...`);
    }
  }

  // Generate real 404.html
  try {
    const { html: appHtml, head: headTags } = render('/404-not-found');
    const final404 = templateHtml
      .replace('</head>', `${headTags}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    await fs.writeFile(path.resolve(dist, '404.html'), final404, 'utf-8');
    console.log('✅ Generated standalone dist/404.html');
  } catch (err) {
    console.error('❌ Error generating 404.html:', err.message);
  }

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 SSG Prerender Complete: ${total} pages + 404.html generated in ${totalTimeSec}s!\n`);
}

await runPrerender();
