# FRONTEND BACKEND DEPENDENCY REGISTRY

This registry defines the exact backend API capabilities required to connect the frozen frontend architecture to the live backend.

## P0: Required to Connect the Frontend
These are the foundational APIs required to make the core product paths functional.

| Frontend Need | Required Backend Capability | Domain |
| :--- | :--- | :--- |
| **B2B / B2C Lead Form** | Lead ingestion API (`POST /api/v1/leads`). | CRM / Marketing |
| **Worker Catalog** | Public read API for Role Definitions and Location Hubs. | Workforce |
| **Job Details** | Public read API for specific Job attributes (status, requirements, pay). | Workforce |
| **Server-Side Rendering (SSR)** | Express.js middleware capable of wrapping `entry-server.jsx` to return raw HTML and real 404/410 HTTP status codes to Googlebot. | Infrastructure |

## P1: Required for Evidence-Driven SEO Expansion
These APIs power the dynamic three-state indexability model (Eligible, Not-Yet-Eligible, Noindex) and the Earnings Evidence Gate.

| Frontend Need | Required Backend Capability | Domain |
| :--- | :--- | :--- |
| **GEO Expansion Evidence** | Database `count()` of active jobs per Role + Location to flip "not-yet-eligible" stubs into "eligible" indexable pages. | Workforce / Jobs |
| **Earnings Evidence Gate** | Live aggregation of verified earnings/payouts per Role to flip `publicAllowed: true` and populate the Earnings blocks securely. | Jobs / Ledger |
| **Dynamic Sitemap Engine** | Backend chron job or dynamic endpoint to generate `sitemap.xml` based on live indexability evidence instead of mock data. | Infrastructure / SEO |
| **Service Availability** | Real-time supply verification (workers online in a zone) to dictate B2C Service local eligibility. | Dispatch |

## P2: Required for Scale / Advanced Functionality
These APIs power complex multi-stage booking and corporate scale.

| Frontend Need | Required Backend Capability | Domain |
| :--- | :--- | :--- |
| **Contractor Booking** | Multi-role, multi-shift workforce request creation (`POST /api/work-requests`). | Booking / Workforce |
| **Corporate Locations** | Organization entity modeling to manage saved deployment locations. | Identity / Workforce |
| **Corporate Dashboard** | Workforce analytics read model (fill rates, SLAs, e-Shram compliance metrics). | Analytics |
| **Live Pricing** | Dynamic pricing algorithm responding to requested roles, duration, and geo-zone. | Pricing Engine |
| **Worker Matching** | Dispatch engine assigning incoming individual requests to active gig workers. | Dispatch / Socket.io |
