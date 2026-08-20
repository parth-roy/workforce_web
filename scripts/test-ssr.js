/**
 * scripts/test-ssr.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Server-Side Rendering Validation Suite
 * Phase F6.1 — Final Head-Assembly Validation Gate
 *
 * PURPOSE
 * Authoritative proof that SEO head tags are correctly generated and assembled
 * into the final document <head> during server-side rendering.
 *
 * VALIDATION PATH
 *   Route
 *    ↓
 *   AppRouter
 *    ↓
 *   StaticRouter
 *    ↓
 *   Page
 *    ↓
 *   SEO
 *    ↓
 *   SSR/prerender
 *    ↓
 *   Final HTML document (assembled from index.html + helmet tags + app html)
 *    ↓
 *   <head> validation via cheerio
 *
 * EXIT CODES
 *   0 — all assertions passed
 *   1 — one or more assertions failed
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer as createViteServer } from 'vite'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Read the base template to simulate final assembly
const templatePath = path.resolve(root, 'index.html')
const templateHtml = fs.readFileSync(templatePath, 'utf8')

// ─────────────────────────────────────────────────────────────────────────────
// Test definitions
// ─────────────────────────────────────────────────────────────────────────────

const TESTS = [
  // ── Homepage ──────────────────────────────────────────────────────────────
  {
    route: '/',
    label: 'Homepage',
    assert: {
      title: 'Metro Mitra — Gig Work & On-Demand Workforce Platform',
      descContains: 'gig workforce platform',
      canonical: 'https://metromitra.com',
      robots: 'index, follow',
      ogTitle: 'Metro Mitra — Gig Work & On-Demand Workforce Platform',
      audience: 'General',
          schemaNodes: ["Organization","WebSite","WebPage"],
      forbiddenSchema: ["JobPosting","Service"],
    },
  },

  // ── Worker Hub ────────────────────────────────────────────────────────────
  {
    route: '/jobs',
    label: 'Worker Hub',
    assert: {
      title: 'Daily Gig Jobs & Shift Work | Metro Mitra',
      canonical: 'https://metromitra.com/jobs',
      robots: 'index, follow',
      audience: 'Worker',
          schemaNodes: ["CollectionPage","BreadcrumbList"],
    },
  },

  // ── Worker Role Hub ───────────────────────────────────────────────────────
  {
    route: '/jobs/warehouse-helper',
    label: 'Worker Role Hub (warehouse-helper)',
    assert: {
      title: 'Warehouse Helper Jobs | Metro Mitra',
      canonical: 'https://metromitra.com/jobs/warehouse-helper',
      robots: 'noindex, nofollow',   // not-yet-eligible
      audience: 'Worker',
          schemaNodes: ["WebPage","BreadcrumbList"],
    },
  },

  // ── Worker Location Hub ───────────────────────────────────────────────────
  {
    route: '/jobs/location/barrackpore',
    label: 'Worker Location Hub (barrackpore)',
    assert: {
      title: 'Jobs in Barrackpore | Metro Mitra',
      canonical: 'https://metromitra.com/jobs/location/barrackpore',
      robots: 'noindex, nofollow',   // not-yet-eligible
      audience: 'Worker',
          schemaNodes: ["CollectionPage","BreadcrumbList"],
    },
  },

  // ── Worker Role + Location ────────────────────────────────────────────────
  {
    route: '/jobs/warehouse-helper/dankuni',
    label: 'Worker Role+Location (warehouse-helper/dankuni)',
    assert: {
      title: 'Warehouse Helper Jobs in Dankuni | Metro Mitra',
      canonical: 'https://metromitra.com/jobs/warehouse-helper/dankuni',
      robots: 'noindex, nofollow',   // not-yet-eligible
          schemaNodes: ["WebPage","BreadcrumbList"],
    },
  },

  // ── Job Detail — DEMO (must NEVER be indexable) ───────────────────────────
  {
    route: '/jobs/detail/demo-job',
    label: 'Job Detail — DEMO (must be noindex)',
    assert: {
      robots: 'noindex, nofollow',
      notIndexable: true,            // explicit guard
          schemaNodes: [],
      forbiddenSchema: ["JobPosting"],
    },
  },

  // ── Services Hub ──────────────────────────────────────────────────────────
  {
    route: '/services',
    label: 'Services Hub',
    assert: {
      title: 'Local Workforce Services | Metro Mitra',
      canonical: 'https://metromitra.com/services',
      robots: 'index, follow',
      audience: 'Individual',
          schemaNodes: ["CollectionPage","BreadcrumbList"],
    },
  },

  // ── Individual Service Page ───────────────────────────────────────────────
  {
    route: '/services/electrical-services',
    label: 'Individual Service (electrician)',
    assert: {
      title: 'Electrical Services Services | Metro Mitra',
      canonical: 'https://metromitra.com/services/electrical-services',
      robots: 'noindex, nofollow',   // not-yet-eligible
      audience: 'Individual',
          schemaNodes: ["WebPage","BreadcrumbList","Service"],
    },
  },

  // ── Individual Service + Location ─────────────────────────────────────────
  {
    route: '/services/electrical-services/barrackpore',
    label: 'Individual Service+Location (geo stub)',
    assert: {
      robots: 'noindex, nofollow',
      notIndexable: true,
      schemaNodes: ["WebPage","BreadcrumbList"],
      forbiddenSchema: ["Service"]
    },
  },

  // ── B2B Hirer Hub ─────────────────────────────────────────────────────────
  {
    route: '/hire-workers',
    label: 'B2B Hirer Hub',
    assert: {
      title: 'Workforce Procurement for Businesses | Metro Mitra',
      canonical: 'https://metromitra.com/hire-workers',
      robots: 'index, follow',
      audience: 'Business',
          schemaNodes: ["CollectionPage","BreadcrumbList"],
    },
  },

  // ── B2B Service Page ──────────────────────────────────────────────────────
  {
    route: '/hire-workers/warehouse-staffing',
    label: 'B2B Service — must not duplicate "Staffing"',
    assert: {
      titleContains: 'Warehouse Staffing Services | Metro Mitra',
      titleNotContains: 'Warehouse Staffing Staffing',
      canonical: 'https://metromitra.com/hire-workers/warehouse-staffing',
      robots: 'noindex, nofollow',   // not-yet-eligible
      audience: 'Business',
          schemaNodes: ["WebPage","BreadcrumbList","Service"],
    },
  },

  // ── B2B Service + Location ────────────────────────────────────────────────
  {
    route: '/hire-workers/warehouse-staffing/dankuni',
    label: 'B2B Service+Location (geo stub)',
    assert: {
      robots: 'noindex, nofollow',
      notIndexable: true,
      schemaNodes: ["WebPage","BreadcrumbList"],
      forbiddenSchema: ["Service"]
    },
  },

  // ── Contractor ────────────────────────────────────────────────────────────
  {
    route: '/for-contractors',
    label: 'Contractor Hub',
    assert: {
      title: 'Contractor Workforce Builder | Metro Mitra',
      canonical: 'https://metromitra.com/for-contractors',
      robots: 'index, follow',
      audience: 'Contractor',
          schemaNodes: ["WebPage","BreadcrumbList"],
    },
  },

  // ── Corporate ─────────────────────────────────────────────────────────────
  {
    route: '/for-companies',
    label: 'Corporate Hub',
    assert: {
      title: 'Enterprise Workforce Planning | Metro Mitra',
      canonical: 'https://metromitra.com/for-companies',
      robots: 'index, follow',
      audience: 'Corporate',
          schemaNodes: ["WebPage","BreadcrumbList"],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Runner
// ─────────────────────────────────────────────────────────────────────────────

async function runTests() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root,
  })

  let passed = 0
  let failed = 0

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')

    // Transform template using Vite to resolve assets
    const processedTemplate = await vite.transformIndexHtml('/', templateHtml)

    for (const test of TESTS) {
      // 1. Render app and extract React 19 hoisted head tags
      const { html: appHtml, head: headTags } = render(test.route)

      if (headTags === undefined) {
        console.error(`❌  [${test.label}] render() returned undefined head tags`)
        failed++
        continue
      }
      
      // 2. Assemble final HTML document exactly as production prerender does
      // Inject tags into head and app HTML into root
      let finalHtml = processedTemplate.replace('</head>', `${headTags}</head>`)
      finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

      // 3. Load final document into Cheerio to strictly validate <head> contents
      const $ = cheerio.load(finalHtml)
      const head = $('head')

      if (!head.length) {
        console.error(`❌  [${test.label}] Could not find <head> element in assembled document`)
        failed++
        continue
      }

      const a = test.assert
      let routePassed = true
      const errors = []

      // Cheerio extractors explicitly scoped to <head>
      const actualTitle = $('head > title').last().text()
      const actualDesc = $('head > meta[name="description"]').attr('content')
      const actualCanonical = $('head > link[rel="canonical"]').attr('href')
      const actualRobots = $('head > meta[name="robots"]').attr('content')
      const actualOgTitle = $('head > meta[property="og:title"]').attr('content')
      const actualAudience = $('head > meta[name="audience"]').attr('content')

      // ── Title exact match ──────────────────────────────────────────────────
      if (a.title) {
        if (actualTitle !== a.title) {
          errors.push(`title: expected "${a.title}", got "${actualTitle}"`)
          routePassed = false
        }
      }

      // ── Title contains ─────────────────────────────────────────────────────
      if (a.titleContains) {
        if (!(actualTitle || '').includes(a.titleContains)) {
          errors.push(`title should contain "${a.titleContains}", got "${actualTitle}"`)
          routePassed = false
        }
      }

      // ── Title must NOT contain ─────────────────────────────────────────────
      if (a.titleNotContains) {
        if ((actualTitle || '').includes(a.titleNotContains)) {
          errors.push(`title must NOT contain "${a.titleNotContains}", but got "${actualTitle}"`)
          routePassed = false
        }
      }

      // ── Description ───────────────────────────────────────────────────────
      if (a.descContains) {
        if (!(actualDesc || '').includes(a.descContains)) {
          errors.push(`description should contain "${a.descContains}", got "${actualDesc}"`)
          routePassed = false
        }
      }

      // ── Canonical ─────────────────────────────────────────────────────────
      if (a.canonical) {
        if (actualCanonical !== a.canonical) {
          errors.push(`canonical: expected "${a.canonical}", got "${actualCanonical}"`)
          routePassed = false
        }
      }

      // ── Robots ────────────────────────────────────────────────────────────
      if (a.robots) {
        const expectedFirst = a.robots.split(',')[0].trim() // 'index' or 'noindex'
        if (!(actualRobots || '').includes(expectedFirst)) {
          errors.push(`robots: expected to contain "${expectedFirst}", got "${actualRobots}"`)
          routePassed = false
        }
      }

      // ── Explicit noindex guard ─────────────────────────────────────────────
      if (a.notIndexable === true) {
        if (!(actualRobots || '').includes('noindex')) {
          errors.push(`page must be noindex, but robots is "${actualRobots}"`)
          routePassed = false
        }
      }

      // ── OG Title ──────────────────────────────────────────────────────────
      if (a.ogTitle) {
        if (actualOgTitle !== a.ogTitle) {
          errors.push(`og:title: expected "${a.ogTitle}", got "${actualOgTitle}"`)
          routePassed = false
        }
      }

      // ── Audience application metadata ─────────────────────────────────────
      if (a.audience) {
        if (actualAudience !== a.audience) {
          errors.push(`audience: expected "${a.audience}", got "${actualAudience}"`)
          routePassed = false
        }
      }

      
      // ── JSON-LD Structured Data (@graph) ──────────────────────────────────
      const ldJsonStr = $('head > script[type="application/ld+json"]').html()
      if (a.schemaNodes || a.forbiddenSchema) {
        if (!ldJsonStr) {
          errors.push('JSON-LD script tag missing in <head>')
          routePassed = false
        } else {
          try {
            const parsedLd = JSON.parse(ldJsonStr)
            if (parsedLd['@context'] !== 'https://schema.org') {
              errors.push('Missing or invalid @context in JSON-LD')
              routePassed = false
            }
            if (!Array.isArray(parsedLd['@graph'])) {
              errors.push('Missing @graph array in JSON-LD')
              routePassed = false
            } else {
              const types = parsedLd['@graph'].map(node => node['@type']).flat();
              
              if (a.schemaNodes) {
                for (const expectedType of a.schemaNodes) {
                  if (!types.includes(expectedType)) {
                    errors.push(`Missing expected schema node: ${expectedType}`)
                    routePassed = false
                  }
                }
              }

              if (a.forbiddenSchema) {
                for (const forbidden of a.forbiddenSchema) {
                  if (types.includes(forbidden)) {
                    errors.push(`Found forbidden schema node: ${forbidden}`)
                    routePassed = false
                  }
                }
              }
              
              // Verify IDs are unique
              const ids = parsedLd['@graph'].map(node => node['@id']).filter(Boolean)
              const uniqueIds = new Set(ids)
              if (ids.length !== uniqueIds.size) {
                errors.push(`Duplicate @id found in JSON-LD graph: ${ids}`)
                routePassed = false
              }
            }
          } catch (err) {
            errors.push('Invalid JSON in LD-JSON script: ' + err.message)
            routePassed = false
          }
        }
      }

      if (routePassed) {
        console.log(`✅  ${test.label}`)
        passed++
      } else {
        console.error(`❌  ${test.label}`)
        for (const e of errors) {
          console.error(`      → ${e}`)
        }
        failed++
      }
    }
  } catch (err) {
    console.error('SSR Test Runner Error:', err)
    failed++
  } finally {
    await vite.close()
  }

  console.log(`\n─────────────────────────────────────────────`)
  console.log(`Results: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
