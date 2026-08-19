OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# MASTER IMPLEMENTATION PLAN: Metro Mitra SEO & Architecture
**Version:** Phase 0.5 (Final Architecture Reconciliation)
**Canonical Property:** `https://metromitra.com`
**Corporate Identity:** Parther Technologies Pvt. Ltd. (CIN Verification Pending)

## A. Current State
The `workforce_web` app is currently a React 19 CSR SPA using flat URLs that mix B2B and B2C intent. SEO markup incorrectly uses `LocalBusiness` for category pages and `JobPosting` for non-expiring generic roles. Outdated/unverified claims and legacy domain references (`GoMyTruck`) bleed into metadata and content.

## B. Research Findings
- The application delivers empty shells to non-JS bots.
- There is knowledge graph collision with an auto-rickshaw app.
- Static fake scale numbers risk Consumer Protection Act violations.
- Current URLs are flat and unscalable.
- `logistics-jobs` exhibits Worker intent ("Find Logistics Gigs").

## C. PDF Recommendations (Reconciled)
The original blueprint mandated strict B2B/B2C URL silos, static prerendering, entity disambiguation, schema correction, and evidence-based programmatic scaling.

## D. Corrections to the PDF / Initial Plan
- **Canonical Consistency:** All properties MUST use `https://metromitra.com/`. GoMyTruck leakage in SEO must be eradicated unless explicitly verified.
- **CIN Handling:** Do NOT guess the CIN. Keep in pending state. See `CORPORATE_IDENTITY_VERIFICATION.md`.
- **SearchAction:** Deprecated by Google. MUST NOT be included.
- **H1 Tags:** Do NOT force mechanical `Brand + Category + Geography`. Use search intent phrasing.
- **Entity Disambiguation:** Build positive identity instead of spamming negative disclaimers.
- **IndexNow / Indexing API:** Use accurately. IndexNow notifies Bing; Google Indexing API is for valid `JobPosting` schemas.

## E. Current Official Documentation Constraints
- All implementations strictly align with Google Webmaster Guidelines, Structured Data Guidelines (JobPosting lifecycle), ASCI truth-in-advertising, and Companies Act 2013.

## F. Final Architecture
- **Framework:** React 19 + Vite 8
- **URL Taxonomy:** `/jobs/` for B2C, `/hire-workers/` for B2B

## G. URL Migration Plan
*See `docs/seo/URL_MIGRATION_MATRIX.md`.*
- All 20 routes are mapped. `/logistics-jobs` correctly migrated to `/jobs/logistics/` to preserve Worker intent.

## H. Schema Architecture
- **Global:** `Organization`, `WebSite`.
- **Hub Pages:** `CollectionPage` + `ItemList`.
- **B2B Pages:** `WebPage` + `Service`.
- **Generic Role Pages:** `WebPage` + `Occupation`.
- **DO NOT USE:** `LocalBusiness` on categories, `SearchAction`, or `HowTo`.

## I. Rendering Architecture
*See `docs/seo/SEO_RENDERING_ARCHITECTURE.md`.*
- **Evergreen:** Build-time SSG.
- **Programmatic:** SSG generated from verified database records.
- **Live Jobs:** SSR/Request-time rendering for dynamic crawlability.

## J. Data Model & Claim Verification System
- Indexability driven by configurable evidence model reflecting genuine business relevance, not arbitrary numerical thresholds.
- Unverified claims MUST be removed and replaced with truthful qualitative wording until backed by a verifiable claims registry.

## K. Indexability Engine
- Decision matrix dictates if a programmatic page is indexed based on operational availability, worker supply, employer demand, etc.

## L. Job Lifecycle
*See `docs/seo/JOB_POSTING_LIFECYCLE_SPEC.md` and `docs/seo/JOB_API_CONTRACT_AUDIT.md`.*
- `JobPosting` ONLY on genuine `/jobs/detail/[id]` pages.
- Backend does NOT provide `expiration`, so `validThrough` MUST be omitted.
- Expired jobs 404/410, never left live.

## M. Sitemap Architecture
- Only canonical indexable URLs. Truthful `lastmod`.

## N. Robots Architecture
- Separate Search Crawler policy from AI Training Crawler policy.

## O. AI Crawler Strategy
- `llms.txt` is an optional supplementary machine-readable resource for clarity and semantic completeness. It is NOT a ranking signal, an indexing requirement, or a core dependency for Google/Bing visibility.

## P. Entity Strategy
- Positive entity graph declaring Parther Technologies Pvt. Ltd. and Metro Mitra.

## Q. Redirect Infrastructure
*See `docs/seo/REDIRECT_IMPLEMENTATION_SPEC.md`.*
- 301 redirects implemented natively in Nginx (`/etc/nginx/sites-available/`). React Router redirects are insufficient.

## R. Rollback Strategy
*See `docs/seo/PHASE_1_ROLLBACK_RUNBOOK.md`.*
- Full application, infrastructure, routing, and SEO rollback plan.

## S. Testing Strategy (HARD FREEZE ON SCALE)
- **Phase 1 executes ZERO mass location generation.**
- We will build the architecture and create ONE validation set: 1 Worker Role, 1 Worker Location, 1 Role+Location, 1 B2B Service, 1 B2B Service+Location, 1 Individual Job.
- Only after validation passes can programmatic scaling occur.
