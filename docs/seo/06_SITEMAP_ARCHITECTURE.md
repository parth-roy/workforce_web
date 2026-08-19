# 06_SITEMAP_ARCHITECTURE

**Status:** ACTIVE
**Phase:** F6.3
**Last Updated:** 2026-08-19

## 1. Primary Objective
This document outlines the centralized, evidence-aware sitemap architecture for Metro Mitra. It ensures that only validated, indexable, and canonical public URLs are exposed to crawlers. The system explicitly decouples the existence of a frontend route from its eligibility for indexation.

## 2. The Centralized `isSitemapEligible` Rule
The sitemap generator (`scripts/generate-sitemap.js`) does NOT maintain its own SEO rules. It imports the canonical SEO metadata factories (`src/seo/pageMetadata.js`) and tests every possible route against a strict eligibility gate:

```javascript
function isSitemapEligible(seoMetadata) {
  if (!seoMetadata.indexable) return false;
  if (!seoMetadata.canonicalPath) return false;
  // Further guards against demo status or redirects exist in the factory definitions
  return true;
}
```

## 3. Scale and Segmentation Strategy
Currently, the system generates a single `sitemap.xml` file.
As Metro Mitra scales Pan-India, loading the entire job/location universe into a single flat XML file will become inefficient and violate the 50,000 URL / 50MB limits of standard sitemap protocols.

**Future Architecture Trigger:**
> 10,000 indexable URLs is an internal Metro Mitra engineering threshold for introducing segmented/sitemap-index output. It is not a search-engine protocol limit.\n\nOnce the active URL count exceeds 10,000 indexable nodes, the generation script must be migrated to a Sitemap Index structure:
```text
sitemap-index.xml
├── sitemap-core.xml
├── sitemap-jobs.xml
├── sitemap-locations.xml
└── sitemap-services.xml
```
*Action:* This migration requires modifying `generate-sitemap.js` to batch URLs and write multiple `.xml` files mapped under a central `<sitemapindex>`.

## 4. URL Universe & Normalization Rules
Every URL injected into the sitemap must adhere to:
- **Absolute HTTPS:** e.g., `https://metromitra.com/`
- **Canonical Trailing Slash Policy:** The root is `https://metromitra.com`, and all subsequent paths omit the trailing slash (e.g., `.../jobs`).
- **No Query Strings:** URLs containing `?q=`, `?filter=`, etc. are stripped/ignored.
- **No Fragments:** `#hash` targets are excluded.

## 5. Geo-Stub and Demo Constraints
- **Geo-stubs (`not-yet-eligible`):** `/jobs/:role/:location` and `/services/:service/:location` intentionally evaluate to `indexable = false` if evidence is lacking. They are programmatically suppressed from `sitemap.xml`.
- **Demo Content (`noindex`):** Demo jobs (`isDemo = true`) enforce `indexable = false` and are explicitly excluded from the sitemap.

## 6. Job Lifecycle Handling
Jobs use an internal lifecycle (e.g. `DRAFT`, `ACTIVE`, `CLOSED`). The sitemap generator filters the job repository, emitting URLs exclusively for jobs where `status === 'active'`. Dead, closed, or expired jobs are pruned immediately upon regeneration, protecting crawl budget.

## 7. Change Frequency and Lastmod
- **`changefreq` / `priority`**: Removed completely. Modern Google algorithms ignore these hints.
- **`lastmod`**: Removed completely unless a genuine, verifiable `updatedAt` database timestamp is supplied. Arbitrarily stamping every URL with the build-time date is considered artificial freshness fabrication and is strictly forbidden.
