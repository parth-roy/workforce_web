# Workforce SEO API Contract Proposal

## 1. Overview

This document outlines the proposed read-only, public API contract to serve `workforce_web`. These endpoints are designed to safely expose aggregated and individual data from the `GigJob` and `Worker` tables to power the SEO landing pages and the Edge Prerendering Middleware.

All endpoints will be hosted under the unauthenticated `/api/v1/seo/workforce/` namespace on the main backend.

### 1.1 Guiding Principles
- **Read-Only & Public**: No PII (Customer Name, Worker exact locations) is ever exposed.
- **Cache-First**: All responses are served from Upstash Redis. The backend updates Redis asynchronously via EventBus listeners on `GigJob` mutations.
- **Evidence-Based Indexation**: Empty states return HTTP 404/410 to prune dead SEO branches programmatically.

---

## 2. Global Platform Metrics
Provides high-level platform stats for the Homepage and global header/footers.

**Endpoint:** `GET /api/v1/seo/workforce/metrics`  
**Cache TTL:** 1 hour

### Response Payload
```json
{
  "success": true,
  "data": {
    "activeJobsCount": 432,
    "totalPayoutsDisbursed": 32500000,
    "activePincodes": 124,
    "verifiedWorkers": 28450
  }
}
```

---

## 3. Taxonomy & Availability Matrix
Powers the dynamic sitemap generation and internal linking grids. Returns arrays of active categories and locations that currently have live jobs.

**Endpoint:** `GET /api/v1/seo/workforce/taxonomy`  
**Cache TTL:** 15 minutes

### Response Payload
```json
{
  "success": true,
  "data": {
    "activeRoles": [
      {
        "slug": "loading",
        "name": "Loading Jobs",
        "liveCount": 145,
        "avgDailyWage": 650
      },
      {
        "slug": "warehouse",
        "name": "Warehouse Jobs",
        "liveCount": 89,
        "avgDailyWage": 550
      }
    ],
    "activeLocations": [
      {
        "slug": "kolkata",
        "name": "Kolkata",
        "liveCount": 312,
        "zones": ["Salt Lake", "Taratala"]
      },
      {
        "slug": "dankuni",
        "name": "Dankuni",
        "liveCount": 120,
        "zones": ["Industrial Hub"]
      }
    ]
  }
}
```

---

## 4. Location & Role Hub Feed
Populates the list of jobs for categorical pages (e.g., `/jobs/[role]/[location]`). 

**Endpoint:** `GET /api/v1/seo/workforce/jobs`  
**Query Parameters:**
- `role` (Optional): e.g., `loading`, `helper`
- `location` (Optional): e.g., `kolkata`
- `limit` (Default: 20, Max: 50)
- `offset` (Default: 0)

**Cache TTL:** 5 minutes

### Behavior
- If the combination of `role` and `location` yields 0 active `PENDING` jobs, the API **MUST** return `statusCode: 404`.

### Response Payload
```json
{
  "success": true,
  "data": {
    "hubMetadata": {
      "title": "Loading Jobs in Kolkata",
      "liveCount": 42,
      "avgDailyWage": 650
    },
    "jobs": [
      {
        "jobNumber": "GIG-10024",
        "title": "Loading Helper",
        "category": "LOADER",
        "locationZone": "METRO",
        "locality": "Taratala",
        "durationHours": 8,
        "perWorkerRate": 600,
        "postedAt": "2026-08-19T08:00:00Z"
      }
    ]
  }
}
```

---

## 5. Job Detail (Schema Payload)
Provides exact details for a specific job. Used to populate the `/jobs/detail/[jobNumber]` page and its `JobPosting` JSON-LD schema.

**Endpoint:** `GET /api/v1/seo/workforce/jobs/:jobNumber`  
**Cache TTL:** 1 minute (or purged immediately via EventBus on status change)

### Behavior
- Only jobs with `status = PENDING` return `200 OK`.
- If a job is `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, or `CANCELLED`, the API **MUST** return `statusCode: 410` (Gone).
- If the job never existed, return `statusCode: 404`.

### Response Payload
```json
{
  "success": true,
  "data": {
    "jobNumber": "GIG-10024",
    "title": "Warehouse Loading Assistant",
    "description": "Assist with unloading incoming freight and stacking in warehouse racks.",
    "category": "LOADER",
    "employerContext": {
      "name": "Verified Employer",
      "type": "Logistics Company"
    },
    "location": {
      "lat": 22.5023,
      "lng": 88.3045,
      "locality": "Taratala",
      "city": "Kolkata",
      "zone": "METRO"
    },
    "durationHours": 8,
    "perWorkerRate": 600,
    "workersNeeded": 2,
    "postedAt": "2026-08-19T08:00:00Z",
    "schemaData": {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": "Warehouse Loading Assistant",
      "description": "Assist with unloading incoming freight...",
      "datePosted": "2026-08-19T08:00:00Z",
      "employmentType": "CONTRACTOR",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Verified Employer"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Taratala",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": 600,
          "unitText": "DAY"
        }
      }
      // Note: validThrough is INTENTIONALLY OMITTED based on backend constraints
    }
  }
}
```

---

## 6. Implementation Notes & Risks
1. **Paging Limit**: Ensure `limit` cannot exceed 50 to prevent scraping abuse.
2. **Rate Limiting**: Apply strict IP-based rate limiting (e.g., 60 req/min) on the API Gateway for all `/seo/` routes to prevent competitor scraping.
3. **Data Masking**: `employerContext.name` should be generically masked (e.g., "Verified Logistics Partner") unless the employer has explicitly opted into public branding.
4. **Geolocation Masking**: `lat`/`lng` should be fuzzed (rounded to 2 decimal places) for worker safety, ensuring the exact address is only available post-booking acceptance in the app.
