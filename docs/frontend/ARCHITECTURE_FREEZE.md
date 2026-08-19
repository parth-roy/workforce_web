# ARCHITECTURE FREEZE (F6.0)

## Overview
This document represents the final, authoritative frontend architecture freeze before SEO integration begins. It reconciles historical documentation with the actual React component tree and domain model implemented through Phases F1 to F5.2.

## Final Route Tree
- **Worker Experience:** `/jobs/`, `/jobs/:role/`, `/jobs/location/:location/`, `/jobs/:role/:location/`, `/jobs/detail/:jobId/`
- **Individual Hirer (Consumer):** `/services/`, `/services/:service/`, `/services/:service/:location/`
- **B2B Procurement:** `/hire-workers/`, `/hire-workers/:service/`, `/hire-workers/:service/:location/`
- **Contractor Operations:** `/for-contractors/`
- **Corporate Enterprise:** `/for-companies/`

## Final Page-Type Tree & SEO Matrix

| Route Family                        | Page Type                     | Audience   | Search Intent         | Data Source      | Indexability |
| ----------------------------------- | ----------------------------- | ---------- | --------------------- | ---------------- | ------------ |
| `/jobs/`                            | WorkerHubPage                 | Worker     | Job discovery         | Workforce        | Public       |
| `/jobs/:role/`                      | RolePage                      | Worker     | Role search           | Workforce        | Conditional  |
| `/jobs/location/:location/`         | LocationPage                  | Worker     | Local job discovery   | Workforce        | Conditional  |
| `/jobs/:role/:location/`            | RoleLocationPage              | Worker     | Role + local          | Workforce        | Conditional  |
| `/jobs/detail/:jobId/`              | JobDetailPage                 | Worker     | Individual job        | Workforce        | Conditional  |
| `/services/`                        | ServicesHubPage               | Individual | Service discovery     | Service Catalog  | Public       |
| `/services/:service/`               | IndividualServicePage         | Individual | Service hiring        | Service Catalog  | Conditional  |
| `/services/:service/:location/`     | IndividualServiceLocationPage | Individual | Local service         | Service + supply | Conditional  |
| `/hire-workers/`                    | B2BHirerHubPage               | Business   | Workforce procurement | Service Catalog  | Public       |
| `/hire-workers/:service/`           | B2BServicePage                | Business   | Staffing service      | Service Catalog  | Conditional  |
| `/hire-workers/:service/:location/` | B2BServiceLocationPage        | Business   | Local staffing        | Service + supply | Conditional  |
| `/for-contractors/`                 | ContractorPage                | Contractor | Workforce procurement | Workforce        | Public       |
| `/for-companies/`                   | CorporatePage                 | Corporate  | Enterprise workforce  | Workforce        | Public       |

## Current Domain Model
The underlying domain separates Services, Roles, and Jobs into distinct entities:
- **Service Catalog:** High-level categories (e.g., `Electrical Work`, `Warehouse Staffing`). Defines audiences (`individual`, `contractor`, `corporate`).
- **Roles:** Specific worker profiles (e.g., `Electrician`, `Warehouse Helper`). A single service maps to one or more roles.
- **Jobs:** Actual open workforce opportunities (distinct from roles).
- **Locations:** Specific geographic areas where roles or services are offered.

## Current Component Architecture
- **Worker Hub:** Assembled from `WorkerHero`, `RoleCard`, `LocationCard`.
- **Individual Hub:** Consumer-focused pages using `ServiceHero` and `ServiceCard`.
- **B2B Hub:** Enterprise pages providing structural workforce context and directing users to specific builders.
- **Request Builders:** 
  - `ContractorWorkforceRequirementBuilder`: Single location, multiple roles.
  - `CorporateWorkforceRequirementBuilder`: Multi-location, multiple roles per location.

## Known Legacy Architecture
The initial pre-F1 architecture relied on dynamic rendering mapping arrays to `WorkerPageTemplate`, `EmployerPageTemplate`, and `DualPageTemplate`. This flat mapping ignored the deep B2B vs. Consumer structural differences and flattened roles into services. The current tree replaced this with targeted page components matching the real platform model.

## Obsolete Documents
The following documents contain outdated references to flat routing, generic SEO templates, old GoMyTruck URLs, and dynamic template mapping. They have been marked with `OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE`:
- `docs/frontend/00_FRONTEND_ARCHITECTURE.md`
- `docs/frontend/01_PAGE_INVENTORY.md`
- `docs/frontend/03_COMPONENT_ARCHITECTURE.md`
- `docs/frontend/04_WORKFORCE_SERVICE_CATALOG.md`
- `docs/frontend/10_MOCK_API_CONTRACTS.md`
- `docs/seo/*` (Pre-F6 SEO planning docs)
