# ROUTE ARCHITECTURE

## Purpose
This document establishes the permanent, cumulative route tree for the Metro Mitra frontend web platform. These routes reflect the core domain structure and must not be removed or overwritten without explicit architectural approval.

## Final Authoritative Route Tree

### 1. Worker Experience
- `/` - Homepage
- `/jobs/` - Worker Job Hub
- `/jobs/:role/` - Role-specific jobs
- `/jobs/location/:location/` - Location-specific jobs
- `/jobs/:role/:location/` - Intersected role & location jobs
- `/jobs/detail/:jobId/` - Specific job details

### 2. Individual Hirer Experience (Consumer)
- `/services/` - Individual Hirer Service Hub
- `/services/:service/` - Service detail
- `/services/:service/:location/` - Service & location specific request

### 3. B2B Workforce Procurement (Business)
- `/hire-workers/` - B2B Service Hub
- `/hire-workers/:service/` - B2B Service detail
- `/hire-workers/:service/:location/` - B2B Service & location specific request

### 4. Contractor Experience
- `/for-contractors/` - Multi-role, single-location operational requirement builder

### 5. Corporate Experience
- `/for-companies/` - Multi-role, multi-location, enterprise scheduling builder

## Automated Verification
These routes are strictly guarded by `scripts/test-routes.js` and `scripts/test-ssr.js`.
