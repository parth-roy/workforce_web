# 03_METADATA_ARCHITECTURE

**Status:** ACTIVE
**Phase:** F6.1
**Last Updated:** 2026-08-19

## Core Principles

The metadata implementation in `src/seo/pageMetadata.js` is **NOT** an independent SEO strategy. It is the direct codification of the `KEYWORD_INTENT_ARCHITECTURE.md` blueprint. 

Every metadata rule is derived from this traceability chain:
`Metro Mitra SEO Research Blueprint` → `Approved Page Intent` → `Metadata Rule` → `Implementation` → `Validation`.

### Safe Default Policy
The `SEO.jsx` component enforces a safe default policy:
- `indexable` defaults to `false`.
- Claims like "verified", "trusted", or "guaranteed" are strictly prohibited in fallback metadata.
- No dynamic schema is appended by default.

### Application-Defined Metadata
The `<meta name="audience">` and `<meta name="search-intent">` tags are application-defined attributes for internal tracing and monitoring. They are NOT ranked or indexed by Google, Bing, or OpenAI. They exist to enforce alignment between the page's output and its research blueprint.

---

## Authoritative Page-Type Metadata Matrix

| Page Type | Research Intent | Title Rule | Description Rule | Indexability Rule | Canonical Rule | Validation |
| --------- | --------------- | ---------- | ---------------- | ----------------- | -------------- | ---------- |
| `/jobs` (Worker Hub) | Job Discovery (Intent #2) | Broad, national intent ("Daily Gig Jobs & Shift Work") | Value proposition (daily pay, shifts) | `eligible` | Exact `/jobs` path | SSR `<head>` parser |
| `/hire-workers` (B2B Hub) | Workforce Procurement (Intent #3) | Commercial terminology | Enterprise/contractor structured supply | `eligible` | Exact `/hire-workers` path | SSR `<head>` parser |
| `/services` (B2C Hub) | Local Services (Intent #6) | B2C terminology ("Local Workforce Services") | B2C service descriptions | `eligible` | Exact `/services` path | SSR `<head>` parser |
| `/jobs/:role` | Specific Role Discovery (Intent #4) | `{Role Name} Jobs` | Role-specific value prop | `role.indexabilityStatus` | Exact path | SSR `<head>` parser |
| `/jobs/location/:location` | Geo-Targeted Discovery (Intent #5) | `Jobs in {Location Name}` | Location-specific gig context | `loc.indexabilityStatus` | Exact path | SSR `<head>` parser |
| `/jobs/:role/:location` | Hyper-Local Transactional (Intent #7) | `{Role Name} Jobs in {Location Name}` | Highly specific intent targeting | Must be `eligible` in both Role & Loc | Exact path | SSR `<head>` parser |
| `/jobs/detail/:jobId` | Specific Job Listing | `{Job Title}` | Extract from job requirements | `job.indexabilityStatus` (Demo = `noindex`) | Exact path | SSR `<head>` parser |
| `/hire-workers/:service` | B2B Category Discovery | `{Service Name} Services` (De-dupe Staffing) | Category procurement details | `service.indexabilityStatus` | Exact path | SSR `<head>` parser |
| `/hire-workers/:service/:location`| Geo B2B Procurement | `{Service Name} Workforce in {Loc}` | Geo-targeted operational supply | Current: `not-yet-eligible` | Exact path | SSR `<head>` parser |
| `/services/:service` | B2C Service Discovery | `{Service Name} Services` | Consumer service details | `service.indexabilityStatus` | Exact path | SSR `<head>` parser |
| `/services/:service/:location` | Geo B2C Service | `{Service Name} in {Location}` | Local consumer availability | Current: `not-yet-eligible` | Exact path | SSR `<head>` parser |
| `/for-contractors` | Contractor Operations | `Contractor Workforce Builder` | Operational request flow | `eligible` | Exact path | SSR `<head>` parser |
| `/for-companies` | Corporate Planning | `Enterprise Workforce Planning` | Structural HR/Logistics pipeline | `eligible` | Exact path | SSR `<head>` parser |


---

## The Three-State Indexability Model

The application uses a strict three-state model for programmatic SEO, implemented via `resolveIndexable()`:

1. **`eligible`**
   - **Meaning:** The page has passed the evidence/indexability model and has sufficient supply/content.
   - **Result:** `index, follow`

2. **`not-yet-eligible`**
   - **Meaning:** The page exists and is architecturally valid, but genuine evidence is not yet sufficient for indexation (e.g., empty geo-stubs). This protects the crawl budget.
   - **Result:** `noindex, nofollow`

3. **`noindex`**
   - **Meaning:** The page is explicitly excluded for a substantive reason (e.g., demo data, mock endpoints).
   - **Result:** `noindex, nofollow`

## Validation

Validation is strictly enforced by the server-side rendering test suite (`scripts/test-ssr.js`). This test does not rely on component props or application state; it evaluates the actual HTML string produced by `entry-server.jsx` using `react-helmet-async` v3 `HelmetData`.

If the HTML output does not match the rules defined above, the build fails.
