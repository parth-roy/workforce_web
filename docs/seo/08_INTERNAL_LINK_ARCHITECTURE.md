# 08_INTERNAL_LINK_ARCHITECTURE

**Status:** ACTIVE
**Phase:** F6.4
**Last Updated:** 2026-08-20

## 1. Primary Objective
This document maps the semantic internal linking graph for Metro Mitra. Links are generated contextually to support search intent, bounded to prevent over-linking, and strictly filtered by indexability (`not-yet-eligible` and `noindex` pages are excluded from the public SEO graph).

## 2. Research Blueprint Traceability

### A. Core Site Graph
* **Search Intent**: Brand discovery, primary audience routing.
* **Page Family**: Home, Jobs, Services, Hire Workers, For Contractors, For Companies.
* **Internal Link Relationship**: Universal Header/Footer navigation.
* **Implementation**: Standard global nav components.
* **Validation**: Core hubs must have highest inbound link count.

### B. Worker Link Graph
* **Search Intent**: Discovering job opportunities by role and region.
* **Page Family**: Jobs Hub -> Role -> Location -> Role+Location -> Job.
* **Internal Link Relationship**:
  * Hub links to top eligible Roles & Locations.
  * Role page links to relevant eligible Locations and active Jobs.
  * Location page links to relevant eligible Roles and active Jobs.
  * Role+Location links to Parent Role, Parent Location, and nearby Locations.
  * Job Detail links to Parent Role, Location.
* **Implementation**: `RelatedRoles`, `RelatedLocations`, `RelatedJobs` reusable components.
* **Validation**: Orphan pages = 0 for eligible routes. No links to geo-stubs (not-yet-eligible).

### C. Individual Hirer Graph (B2C)
* **Search Intent**: Hiring a specific local service (e.g., Electrician).
* **Page Family**: Services -> Individual Service -> Service+Location.
* **Internal Link Relationship**:
  * Hub links to eligible B2C Services.
  * Service page links to eligible Locations.
  * Contextual cross-link to Jobs (e.g. "Looking for work?").
* **Implementation**: `RelatedLocations`, `RelatedServices` components.
* **Validation**: Only indexable locations are linked from the service page.

### D. B2B Link Graph
* **Search Intent**: Corporate/Contractor staffing solutions.
* **Page Family**: Hire Workers -> B2B Service -> B2B Service+Location.
* **Internal Link Relationship**:
  * B2B Hub links to B2B Services.
  * Service links to eligible Locations, For Contractors, For Companies.
* **Implementation**: `RelatedB2BServices`, `RelatedLocations`.
* **Validation**: No cross-intent leakage to B2C individual services.

## 3. Link Safety & Constraints
1. **Indexability-Aware**: A link is only emitted if the target page evaluates to `indexable: true`.
2. **Canonical Only**: All internal links use the canonical, relative absolute path (e.g. `/jobs/warehouse-helper`).
3. **No Traps**: No `?q=`, `?filter=` links in the SEO graph.
4. **No Demos**: Demo jobs (`isDemo`) or `noindex` stubs are never linked.
5. **Bounded**: "Top N" relationships (e.g. top 10 locations) to prevent O(N*N) scaling issues when expanding Pan-India.
