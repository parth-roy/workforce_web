OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# URL MIGRATION MATRIX

Before programmatic expansion, all 20 existing flat URLs must be accounted for and migrated.

| Old URL (`workforce_web`) | Current Purpose | Proposed New URL | Indexability | Canonical | Redirect Strategy | Reason |
|---|---|---|---|---|---|---|
| `/` | Brand / Dual Gateway | `/` | 200 Indexable | `/` | None | Stable homepage |
| `/jobs-near-me` | Worker Discovery (B2C) | `/jobs/` | 200 Indexable | `/jobs/` | 301 to `/jobs/` | Consolidate B2C hub |
| `/loading-jobs` | Role Category (B2C) | `/jobs/loading/` | 200 Indexable | `/jobs/loading/` | 301 to new | Nest under B2C hub |
| `/delivery-jobs-kolkata` | Role + Location (B2C) | `/jobs/delivery/kolkata/` | 200 Indexable | `/jobs/delivery/kolkata/` | 301 to new | Semantic location taxonomy |
| `/warehouse-jobs` | Role Category (B2C) | `/jobs/warehouse/` | 200 Indexable | `/jobs/warehouse/` | 301 to new | Nest under B2C hub |
| `/daily-payment-jobs` | Feature/Worker Intent | `/jobs/daily-payment/` | 200 Indexable | `/jobs/daily-payment/` | 301 to new | Nest under B2C hub |
| `/daily-wage-jobs` | Feature/Worker Intent | `/jobs/daily-wage/` | 200 Indexable | `/jobs/daily-wage/` | 301 to new | Nest under B2C hub |
| `/helper-jobs-kolkata` | Role + Location (B2C) | `/jobs/helper/kolkata/` | 200 Indexable | `/jobs/helper/kolkata/` | 301 to new | Semantic location taxonomy |
| `/student-jobs` | Demographic Intent | `/jobs/student/` | 200 Indexable | `/jobs/student/` | 301 to new | Nest under B2C hub |
| `/part-time-jobs` | Shift Intent | `/jobs/part-time/` | 200 Indexable | `/jobs/part-time/` | 301 to new | Nest under B2C hub |
| `/weekend-jobs` | Shift Intent | `/jobs/weekend/` | 200 Indexable | `/jobs/weekend/` | 301 to new | Nest under B2C hub |
| `/logistics-jobs` | Broad Industry Worker Query | `/jobs/logistics/` | 200 Indexable | `/jobs/logistics/` | 301 to new | B2C search intent identified in content ("Find Logistics Gigs", "Warehouse Helper") |
| `/warehouse-helper` | Role Category (B2C) | `/jobs/warehouse-helper/` | 200 Indexable | `/jobs/warehouse-helper/` | 301 to new | Remove fake JobPosting schema |
| `/unloading-jobs` | Role Category (B2C) | `/jobs/unloading/` | 200 Indexable | `/jobs/unloading/` | 301 to new | Nest under B2C hub |
| `/temporary-jobs` | B2B Commercial Staffing | `/hire-workers/temporary-staffing/` | 200 Indexable | `/hire-workers/temporary-staffing/` | 301 to new | Resolve dual-intent conflict |
| `/employer-hiring` | B2B Commercial Pillar | `/hire-workers/` | 200 Indexable | `/hire-workers/` | 301 to new | Consolidate B2B hub |
| `/book-workers` | B2B Instant Service | `/hire-workers/on-demand/` | 200 Indexable | `/hire-workers/on-demand/` | 301 to new | Nest under B2B hub |
| `/workforce-solutions` | B2B Enterprise Solutions | `/hire-workers/enterprise/` | 200 Indexable | `/hire-workers/enterprise/` | 301 to new | Nest under B2B hub |
| `/forklift-operator` | Role Category (B2C) | `/jobs/forklift-operator/` | 200 Indexable | `/jobs/forklift-operator/` | 301 to new | Remove fake JobPosting schema |
| `/truck-helper-jobs` | Role Category (B2C) | `/jobs/truck-helper/` | 200 Indexable | `/jobs/truck-helper/` | 301 to new | Nest under B2C hub |
| `/gig-jobs-kolkata` | Local Job Search (B2C) | `/jobs/kolkata/` | 200 Indexable | `/jobs/kolkata/` | 301 to new | Semantic location taxonomy |
