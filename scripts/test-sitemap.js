import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { mockRoles } from '../src/data/mock/roles.js';
import { mockLocations } from '../src/data/mock/locations.js';
import { mockServices } from '../src/data/mock/services.js';
import { mockJobs } from '../src/data/mock/jobs.js';
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
const publicDir = path.join(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const robotsPath = path.join(publicDir, 'robots.txt');

const BASE_URL = 'https://metromitra.com';

let errors = [];
function assert(condition, message) {
  if (!condition) errors.push(message);
}

function runTests() {
  console.log('Running Sitemap & Robots Quality Tests...');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('sitemap.xml not found!');
    process.exit(1);
  }
  
  if (!fs.existsSync(robotsPath)) {
    console.error('robots.txt not found!');
    process.exit(1);
  }

  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const robotsTxt = fs.readFileSync(robotsPath, 'utf8');

  // --- ROBOTS.TXT TESTS ---
  console.log('Validating robots.txt...');
  assert(robotsTxt.includes('Sitemap: https://metromitra.com/sitemap.xml'), 'Missing or invalid Sitemap directive in robots.txt');
  assert(robotsTxt.includes('Allow: /'), 'Missing global Allow rule');
  assert(robotsTxt.includes('Disallow: /*?q='), 'Missing search trap protection');
  assert(robotsTxt.includes('Disallow: /company/dashboard/'), 'Missing private route protection');
  assert(!robotsTxt.match(/^Disallow: \/\s*$/m), 'Robots.txt contains a global Disallow: / which blocks all crawling!');

  // --- SITEMAP.XML TESTS ---
  console.log('Validating sitemap.xml & modular sub-sitemaps...');
  
  assert(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Invalid XML declaration');
  assert(sitemapXml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Invalid sitemapindex tag');
  assert(sitemapXml.includes('</sitemapindex>'), 'Missing closing sitemapindex tag');

  const sitemapFiles = [...sitemapXml.matchAll(/<loc>https:\/\/metromitra\.com\/(sitemap-.*?\.xml)<\/loc>/g)].map(m => m[1]);
  assert(sitemapFiles.length > 0, 'No sub-sitemaps referenced in sitemapindex');

  const sitemapUrlSet = new Set();

  sitemapFiles.forEach(file => {
    const subPath = path.join(publicDir, file);
    assert(fs.existsSync(subPath), `Sub-sitemap file missing: ${file}`);
    const subXml = fs.readFileSync(subPath, 'utf8');
    assert(subXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), `Invalid urlset in ${file}`);
    
    const subUrls = [...subXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    assert(subUrls.length > 0, `Sub-sitemap ${file} is empty`);
    
    subUrls.forEach(url => {
      assert(url.startsWith('https://metromitra.com'), 'URL does not use absolute HTTPS canonical domain: ' + url);
      assert(!url.includes('?'), 'URL contains query string: ' + url);
      assert(!url.includes('#'), 'URL contains fragment: ' + url);
      assert(!url.includes('demo'), 'Sitemap leaked a demo URL: ' + url);
      assert(!url.includes('dashboard') && !url.includes('requests'), 'Sitemap leaked a private route: ' + url);
      
      if (url !== 'https://metromitra.com') {
        assert(!url.endsWith('/'), 'URL violates trailing slash policy: ' + url);
      }
      sitemapUrlSet.add(url);
    });
  });

  console.log(`Verified ${sitemapUrlSet.size} unique URLs across ${sitemapFiles.length} modular sitemaps.`);

  // --- SITEMAP <-> CANONICAL <-> INDEXABILITY CONSISTENCY TESTS ---
  console.log('Validating Indexability -> Canonical -> Sitemap chain...');

  function checkConsistency(seoMetadata) {
    let cleanPath = seoMetadata.canonicalPath;
    if (cleanPath !== '/') {
      if (cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
      }
    } else {
      cleanPath = '';
    }
    const canonicalUrl = BASE_URL + cleanPath;
    const inSitemap = sitemapUrlSet.has(canonicalUrl);

    if (seoMetadata.indexable === true) {
      assert(inSitemap, 'URL should be in sitemap but is missing: ' + canonicalUrl);
    } else {
      assert(!inSitemap, 'URL is not eligible but was found in sitemap: ' + canonicalUrl);
    }
  }

  // 1. Core Public Hubs
  [HomePageSEO(), WorkerHubSEO(), ServicesHubSEO(), B2BHirerHubSEO(), ContractorSEO(), CorporateSEO()].forEach(checkConsistency);

  // 2. Mock Entities
  mockRoles.forEach(r => checkConsistency(WorkerRoleSEO(r)));
  mockLocations.forEach(l => checkConsistency(WorkerLocationSEO(l)));
  mockServices.forEach(s => checkConsistency(IndividualServiceSEO(s)));
  mockServices.forEach(s => checkConsistency(B2BServiceSEO(s)));

  // 3. Location Combinations
  mockRoles.forEach(r => {
    mockLocations.forEach(l => checkConsistency(WorkerRoleLocationSEO(r, l)));
  });
  mockServices.forEach(s => {
    mockLocations.forEach(l => checkConsistency(IndividualServiceLocationSEO(s, l)));
    mockLocations.forEach(l => checkConsistency(B2BServiceLocationSEO(s, l)));
  });

  // 4. Jobs
  mockJobs.forEach(job => {
    if (job.status === 'active' || job.status === 'ACTIVE') {
      checkConsistency(JobDetailSEO(job));
    }
  });

  // --- EXPLICIT HUB ASSERTIONS ---
  console.log('Explicitly asserting Core Hubs are present...');
  const expectedHubs = [
    'https://metromitra.com',
    'https://metromitra.com/jobs',
    'https://metromitra.com/services',
    'https://metromitra.com/hire-workers',
    'https://metromitra.com/for-contractors',
    'https://metromitra.com/for-companies'
  ];
  expectedHubs.forEach(hub => {
    assert(sitemapUrlSet.has(hub), 'Missing core hub from sitemap: ' + hub);
  });

  if (errors.length > 0) {
    console.error('Quality Validation Failed:');
    errors.forEach(e => console.error('  -> ', e));
    process.exit(1);
  }

  console.log('Sitemap and Robots quality validation passed flawlessly!');
}

runTests();
