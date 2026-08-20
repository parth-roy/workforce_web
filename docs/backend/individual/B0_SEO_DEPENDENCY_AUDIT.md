# B0 SEO DEPENDENCY AUDIT

## 1. Public SEO Data Requirements
To satisfy the frozen frontend architecture (which strictly avoids unsupported claims), the backend must supply verified evidence for location hubs and service pages.

### Operational Data vs. SEO-Safe Data

| Data Type | Classification | Exposure Decision |
| :--- | :--- | :--- |
| Worker exact coordinates | Operational / PII | **NEVER expose** |
| Worker personal identity | Operational / PII | **NEVER expose** |
| Live real-time individual transactions | Operational | **NEVER expose** |
| Service taxonomy (role slug, display name, category) | SEO-Safe | **Expose on catalog endpoint** |
| Serviceability per zone (active/planned/unsupported) | SEO-Safe | **Expose on serviceability endpoint** |
| Aggregated job completions per location/role | SEO-Safe (aggregated) | **Expose as SEO evidence** |
| Average historical payouts per role | SEO-Safe (aggregated, evidence-gated) | **Expose only when verified data exists** |

---

## 2. Evidence/Indexability Contract

The frontend employs a strict three-state indexability model:
```
not-yet-eligible  →  eligible  →  noindex (on withdrawal)
```

This transition is driven **exclusively** by backend data evidence.

### Contract: "Not-Yet-Eligible" → "Eligible"
To flip a location or service page to `eligible` (making it indexable by search engines), the backend MUST provide evidence meeting ALL of the following:

1. **Supply Minimum:** `worker_count >= [configurable threshold]` for the specific `role` AND `location`.
2. **Activity Minimum:** `completed_jobs_last_30_days >= [configurable threshold]` in that location.
3. **Valid Pricing:** The Pricing API must return valid, non-fallback rates for the zone.

### Current State
- `GET /api/v1/seo/hub/:slug` returns **static mock data** from `seo.data.ts`.
- This must be rebuilt to dynamically query the database and return an `indexable: true/false` flag based on actual thresholds.

### Required API Implementation (Future — B1+)
```
GET /api/v1/seo/evidence/jobs?location=:slug&role=:slug
→ { completedJobs30Days: number, totalJobs: number, isEligible: boolean }

GET /api/v1/seo/evidence/supply?location=:slug&role=:slug
→ { workerCount: number, isActive: boolean }

GET /api/v1/seo/hub/:slug (Rebuild)
→ { indexable: boolean, evidence: { jobs, supply }, taxonomy: { ... } }
```

---

## 3. Service Page SEO Requirements

| Required Field | Backend Source | Status |
| :--- | :--- | :--- |
| Service identity / slug | `GigSkill` enum | EXISTS (needs slug mapping) |
| Service description | Hardcoded in catalog | EXISTS (not DB-driven) |
| Target audience | None | MISSING |
| Eligible locations | `ServiceabilityConfig` + worker supply | PARTIAL (no public endpoint) |
| Evidence (job counts) | `GigJob` completions aggregate | MISSING (no public endpoint) |

---

## 4. Location Page SEO Requirements

| Required Field | Backend Source | Status |
| :--- | :--- | :--- |
| Actual serviceability | `serviceability.service.ts` | EXISTS (coordinate-based, no list) |
| Active worker supply | Worker locations | EXISTS (internal only) |
| Completed job count | `GigJob` completions | EXISTS (internal only) |
| Meaningful local content | N/A | MISSING |
