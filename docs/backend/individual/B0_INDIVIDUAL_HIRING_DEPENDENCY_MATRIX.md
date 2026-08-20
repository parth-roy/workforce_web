# B0 INDIVIDUAL HIRING DEPENDENCY MATRIX

Mapping of frontend requirements for the Individual Hiring flow to the existing backend capabilities.

| Frontend Requirement | Data Needed | Existing Backend Capability | Existing API | Gap | Proposed API | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Worker Catalog / Services** | Roles, descriptions, audiences, categories | Exists in Gig module (`getGigCatalog`) but focused on skills/rates | `GET /api/v1/gig/catalog` | PARTIAL (Needs role UI mappings, audience filtering) | `GET /api/v1/gig/catalog` (Extend with audience/UI metadata) | P0 |
| **B2C/B2B Lead Form** | Ingest unauthenticated work requests (name, phone, role) | Leads module handles unauth submissions | `POST /api/v1/leads` | EXISTS | Connect directly to `POST /api/v1/leads` | P0 |
| **Pricing Estimate (Web)** | Fare estimate based on role, location, urgency | Gig module calculates estimates | `POST /api/v1/gig/estimate` | EXISTS | Connect directly to `POST /api/v1/gig/estimate` | P1 |
| **Location Availability (Supply)** | Count of active workers in zone per role | Worker locations tracked, but no public supply aggregate | None | MISSING | `GET /api/v1/workforce/supply?location=X&role=Y` | P1 |
| **Dynamic SEO Evidence (Jobs)** | Historical/active job counts per role+location | DB has Gig jobs, but no SEO aggregate endpoint | None (Only static mock SEO data) | MISSING | `GET /api/v1/seo/evidence/jobs?location=X&role=Y` | P1 |
| **Earnings Evidence (SEO)** | Verified payouts per role | Wallet tracks earnings, no public SEO endpoint | None | MISSING | `GET /api/v1/seo/evidence/earnings?role=Y` | P2 |
| **Authenticated Booking** | Create confirmed gig jobs | Gig module customer endpoint | `POST /api/v1/gig/customer` | EXISTS | Connect to `POST /api/v1/gig/customer` | P2 |
| **Booking Status Tracking** | Real-time status of a submitted gig | Socket.IO events exist, no polling endpoint | `GET /api/v1/gig/customer` (list only) | PARTIAL (No single-gig detail endpoint) | `GET /api/v1/gig/customer/:id` | P2 |
| **Service + Location pages** | Backend-derived availability for `not-yet-eligible` -> `eligible` | Serviceability engine exists per-coordinate | None (static mock) | MISSING | `GET /api/v1/gig/serviceability?slug=X` | P2 |
| **Schedule Date/Time** | `scheduledStartTime` field on GigJob | Field does not exist on `GigJob` | N/A | MISSING (DB schema gap) | Add `scheduledStartTime DateTime?` to `GigJob` | P1 |
