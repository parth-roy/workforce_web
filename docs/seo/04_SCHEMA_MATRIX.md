# 04_SCHEMA_MATRIX

**Status:** ACTIVE
**Phase:** F6.2
**Last Updated:** 2026-08-19

## Traceability Chain
`Metro Mitra SEO Research Blueprint` → `Approved Frontend Page-Type Matrix` → `Actual Domain Data` → `Schema.org` → `Implementation` → `Validation`

## Authoritative Schema Matrix

| Page Type | Schema Nodes | Required? | Data Source | Eligibility | Notes |
| --------- | ------------ | --------- | ----------- | ----------- | ----- |
| **Home** (`/`) | `Organization`, `WebSite`, `WebPage` | Yes | Verified entity data | `eligible` | Base graph. `Organization` describes Metro Mitra as a Gig Workforce Platform, operated by Parther Technologies Pvt. Ltd. |
| **Worker Hub** (`/jobs`) | `CollectionPage`, `BreadcrumbList` | As appropriate | Role/Job catalog | `eligible` | Represents a collection of gig roles. Breadcrumbs: Home → Jobs. |
| **Role Page** (`/jobs/:role`) | `WebPage`, `BreadcrumbList` | As appropriate | `Role` entity | `role.indexabilityStatus` | Specific role information. Breadcrumbs: Home → Jobs → Role. |
| **Location Page** (`/jobs/location/:location`) | `CollectionPage`, `BreadcrumbList` | As appropriate | `Location` entity | `location.indexabilityStatus` | Aggregation by geography. Breadcrumbs: Home → Jobs → Location. |
| **Role + Location** (`/jobs/:role/:location`) | `WebPage`, `BreadcrumbList` | Conditional | Verified role/loc data | evidence-gated | Breadcrumbs: Home → Jobs → Role → Location. |
| **Job Detail** (`/jobs/detail/:jobId`) | `JobPosting`, `BreadcrumbList`, `WebPage` | Yes (for real jobs) | Real job data | conditional (Demo = `noindex`) | MUST NOT emit JobPosting for Demo jobs. No fake `validThrough`. Follows job lifecycle. |
| **Services Hub** (`/services`) | `CollectionPage`, `BreadcrumbList` | As appropriate | B2C service catalog | `eligible` | Consumer services collection. Breadcrumbs: Home → Services. |
| **Individual Service** (`/services/:service`) | `Service`, `WebPage`, `BreadcrumbList` | As appropriate | `ServiceCatalog` | `service.indexabilityStatus` | Emits `Service` node. No invented price/ratings. |
| **Service + Location** (`/services/:service/:location`) | `Service`, `WebPage`, `BreadcrumbList` | Conditional | Real local evidence | evidence-gated (current: `not-yet-eligible`) | Locational service context. |
| **B2B Hub** (`/hire-workers`) | `CollectionPage`, `BreadcrumbList` | As appropriate | B2B service catalog | `eligible` | Commercial procurement collection. Breadcrumbs: Home → B2B. |
| **B2B Service** (`/hire-workers/:service`) | `Service`, `WebPage`, `BreadcrumbList` | As appropriate | `ServiceCatalog` | `service.indexabilityStatus` | B2B `Service` node. |
| **B2B Service + Location** (`/hire-workers/:service/:location`) | `Service`, `WebPage`, `BreadcrumbList` | Conditional | Verified supply | evidence-gated (current: `not-yet-eligible`) | Locational B2B service context. |
| **Contractor** (`/for-contractors`) | `WebPage`, `BreadcrumbList` | As appropriate | Product data | `eligible` | Breadcrumbs: Home → For Contractors. |
| **Corporate** (`/for-companies`) | `WebPage`, `BreadcrumbList` | As appropriate | Product data | `eligible` | Breadcrumbs: Home → For Companies. |

## Graph `@id` Strategy
- **Organization (Metro Mitra):** `https://metromitra.com/#organization`
- **Organization (Parent):** `https://metromitra.com/#parentOrganization`
- **WebSite:** `https://metromitra.com/#website`
- **WebPage / CollectionPage:** `https://metromitra.com{canonicalPath}#webpage`
- **BreadcrumbList:** `https://metromitra.com{canonicalPath}#breadcrumb`
- **Service:** `https://metromitra.com{canonicalPath}#service`
- **JobPosting:** `https://metromitra.com/jobs/detail/{id}#jobposting`

## Graph Relationships
- `WebSite` → `publisher` → `Organization`
- `WebPage` → `isPartOf` → `WebSite`
- `WebPage` → `about` → `Organization` (on Homepage)
- `WebPage` → `breadcrumb` → `BreadcrumbList`
- `JobPosting` → `mainEntityOfPage` → `WebPage`
- `Service` → `mainEntityOfPage` → `WebPage`
- `Service` → `provider` → `Organization`
