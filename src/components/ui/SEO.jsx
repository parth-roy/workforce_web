/**
 * src/components/ui/SEO.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Centralised Head Metadata Component
 * Phase F6.1 — Metadata Foundation
 *
 * SCOPE (F6.1 only)
 * This component handles: title, meta description, canonical, robots,
 * Open Graph, Twitter/X, and application-defined metadata.
 *
 * OUT OF SCOPE FOR THIS COMPONENT (handled in later F6 phases):
 * - JSON-LD / structured data   → F6.2
 * - robots.txt policy           → F6.3
 * - sitemap                     → F6.3
 * - internal linking            → F6.4
 *
 * USAGE
 * Pages must NOT construct SEO strings inline. Import from src/seo/pageMetadata.js
 * and spread the result into this component:
 *
 *   import { WorkerHubSEO } from '../../seo/pageMetadata'
 *   <SEO {...WorkerHubSEO()} />
 *
 * SSR
 * The HelmetProvider in entry-server.jsx captures the rendered context.
 * StaticRouter (from react-router-dom v7) is used server-side.
 * useLocation() is provided by the StaticRouter context during SSR.
 *
 * CUSTOM METADATA NOTE
 * The `audience` and `search-intent` meta tags below are application-defined
 * fields for internal content classification and tooling. They are NOT
 * Google/Bing/OpenAI ranking signals, indexing signals, or GEO signals.
 * The actual SEO architecture is based on semantic HTML, factual content,
 * entity clarity, structured data (F6.2), crawlability, and internal linking.
 */

import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://metromitra.com'

/**
 * Safe default title — brand identity only, no performance claims.
 */
const DEFAULT_TITLE = 'Metro Mitra — Gig Work & On-Demand Workforce Platform'

/**
 * Safe default description — factual product description only.
 * Must not contain: verified, trusted, guaranteed, instant, SLA,
 * worker counts, employer counts, payout guarantees, or deployment claims.
 */
const DEFAULT_DESC =
  'Metro Mitra connects job seekers with daily shift work and businesses with on-demand staffing across logistics, warehousing, and operations.'

export default function SEO({
  title,
  description,
  keywords = 'full-stack gig economy platform, Metro Mitra, workforce',
  schemas = [],
  canonicalPath,
  ogImage = '/og-default.jpg',
  indexable = false,
  type = 'website',
  audience,
  searchIntent,
  lastModified,
}) {
  const location = useLocation()

  // ── Canonical URL ──────────────────────────────────────────────────────────
  const currentPath = canonicalPath !== undefined ? canonicalPath : location.pathname
  const cleanPath = currentPath === '/' ? '' : currentPath.replace(/\/$/, '')
  const canonicalUrl = `${SITE_URL}${cleanPath}`

  // ── Title ──────────────────────────────────────────────────────────────────
  // Append " | Metro Mitra" only when the brand name is not already present.
  const finalTitle = title
    ? title.includes('Metro Mitra')
      ? title
      : `${title} | Metro Mitra`
    : DEFAULT_TITLE

  // ── Description ────────────────────────────────────────────────────────────
  const finalDesc = description || DEFAULT_DESC

  // ── OG Image ───────────────────────────────────────────────────────────────
  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage}`

  // ── Robots ─────────────────────────────────────────────────────────────────
  // indexable=false covers both "not-yet-eligible" and "noindex" states.
  // The distinction between those two states is held in the data layer
  // (indexabilityStatus) and in pageMetadata.js, not here.
  const robotsContent = indexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow'

  return (
    <Helmet>
      {/* ── Primary Meta ── */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />

      {/* ── Canonical ── */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Robots ── */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={indexable ? 'index, follow' : 'noindex, nofollow'} />

      {/* ── Application-defined metadata ─────────────────────────────────────
          These are internal content classification fields. They are NOT
          Google/Bing/OpenAI ranking signals. See component docstring above.
      ─────────────────────────────────────────────────────────────────────── */}
      {audience && <meta name="audience" content={audience} />}
      {searchIntent && <meta name="search-intent" content={searchIntent} />}

      {/* ── Page lifecycle (optional) ── */}
      {lastModified && <meta property="article:modified_time" content={lastModified} />}

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:site_name" content="Metro Mitra" />
      <meta property="og:image" content={absoluteOgImage} />

      {/* ── Twitter / X ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={absoluteOgImage} />

      {/* ── JSON-LD Structured Data (@graph) ──────────────────────────────────
          Phase F6.2: Single Unified Graph Architecture.
          All schema nodes provided by the page factory are assembled into a
          coherent @graph with relational @id links.
      ─────────────────────────────────────────────────────────────────────── */}
      {schemas && schemas.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': schemas.flat().filter(Boolean),
          })}
        </script>
      )}
    </Helmet>
  )
}
