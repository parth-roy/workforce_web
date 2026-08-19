# SEO Public Data Architecture for Workforce Web

## 1. Executive Summary

This document defines the architectural strategy for integrating live application data from the Parther Logistics backend (`GigJob`, `Worker`, `Vehicle` schemas) into the public-facing `workforce_web` SEO portal. 
To comply with Google's March 2024 Spam Policies regarding Scaled Content Abuse and Doorway Pages, the platform transitions from static vanity metrics to an **"Evidence-First" Data Architecture**.

No SEO landing page, category hub, or location hub will be generated without backing data. The architecture dictates how data is safely aggregated, cached, and exposed to the rendering middleware without compromising the performance or security of the transactional backend.

---

## 2. Evidence-First SEO Paradigm

### 2.1 Principle of Non-Hallucination
The current SPA statically claims "28,000+ Workers" and "120+ Active Pincodes". Under the new architecture:
- If Dankuni has 4 active jobs, the Dankuni Location Hub displays exactly 4 jobs.
- If there are 0 jobs for "Forklift Operator in Salt Lake", that specific long-tail URL MUST return a HTTP `404 Not Found` or `410 Gone`.
- Salary averages must be mathematically derived from `GigJob.perWorkerRate` over a 30-day trailing window.

### 2.2 Intent Silo Enforcement
Data exposure is strictly separated by intent:
- **Worker (B2C) Hub (`/jobs/*`)**: Exposes raw job opportunities, derived salaries, and active worker counts to signal liquidity to job-seekers.
- **Employer (B2B) Hub (`/hire-workers/*`)**: Exposes aggregated supply-side metrics (verified workers per zone, average time-to-fill) to signal reliability to enterprise clients.

---

## 3. Data Flow & Rendering Architecture

Since `workforce_web` is built on React 19 + Vite (Client-Side Rendering), search engines experience significant crawl latency. We introduce a **Hybrid Prerendering Middleware** architecture.

### 3.1 Caching Layer (Upstash Redis)
Exposing live Postgres database queries to web crawlers introduces severe DDoS vulnerabilities. 
A dedicated `workforce-seo-cache` namespace in Upstash Redis will serve all public SEO endpoints.
- **Job Feed TTL**: 5 minutes (Balances real-time liquidity with database load).
- **Aggregated Stats TTL**: 1 hour (Averages, location rollups, worker counts).

### 3.2 Dynamic Prerendering
We will deploy a prerendering edge function (e.g., Cloudflare Workers + Prerender.io integration or Nitro/Vite SSR transition) that:
1. Intercepts bots (Googlebot, Bingbot, OAI-SearchBot).
2. Calls the public SEO API contracts.
3. Renders the full DOM tree including `JobPosting` and `CollectionPage` JSON-LD schemas.
4. Returns flat HTML.

Human users bypass the prerenderer and hydrate via the standard React SPA flow, hitting the same cached endpoints.

---

## 4. Semantic Schema.org Constraints & Job Lifecycle

Based on the `GigJob` database schema constraints:

### 4.1 Strict JobPosting Compliance
Google explicitly requires that `JobPosting` structured data only be used for individual, verifiable job opportunities, not categorical collections.
- **Permitted**: `/jobs/detail/[jobNumber]`
- **Forbidden**: `/jobs/warehouse-helper` (Must use `CollectionPage` schema instead).

### 4.2 The "validThrough" Expiration Conflict
Google Search Central mandates a `validThrough` date for jobs. However, the `GigJob` model **does not support an expiration date** (jobs remain `PENDING` until filled or explicitly cancelled).
- **Architectural Decision**: In compliance with Google's exceptions for jobs with no known expiration, the `validThrough` property **MUST BE OMITTED** from the JSON-LD payload entirely. 
- Do NOT hallucinate a date (e.g., `Date.now() + 90 days`). This violates Google policies and risks manual action.

### 4.3 Automated Expiration Routing (410 Gone)
When a `GigJob` transitions from `PENDING` to `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, or `CANCELLED`:
1. The backend triggers a webhook to purge the specific job's cache.
2. The `/jobs/detail/[jobNumber]` URL immediately begins returning a **410 Gone** status.
3. This signals search engines to immediately de-index the page, maintaining high index fidelity and preventing worker frustration.

---

## 5. Aggregation & Rollup Strategy

To populate regional hubs (e.g., `/jobs/kolkata/`), the backend must aggregate data.
- **Location Matching**: `GigJob.locationZone` (e.g., "METRO", "TIER2") and `GigJob.locationAddress` will be used to group jobs into canonical SEO city slugs (e.g., `kolkata`, `dankuni`).
- **Category Matching**: `GigJob.gigCategory` (e.g., "HELPER", "LOADER") maps to SEO role slugs (e.g., `helper`, `loading`).

Only intersections with `count > 0` are permitted to exist in the sitemap or respond with HTTP 200.
