# FINAL WORKFORCE ARCHITECTURE DECISION

## 1. Current State & Dependency Graph
Currently, the system is a modular monolith. 
**Shared Core:** Auth (`User`), Wallets (Unified ledger), Payments (RazorpayX), and Notifications (FCM, Sockets).
**Workforce Domain:** Manages `Worker`, `GigJob`, and `WorkerWallet`.
**Logistics Domain:** Manages `Driver`, `FleetOwner`, `Booking`.
**Flutter App:** Features a multi-persona shell, but job categories (Electricians, Plumbers) are currently hardcoded UI mockups.

## 2. Option Evaluation & Comparative Scoring
- **Option A (GoMyTruck feature):** Rejected. Couples Workforce to logistics assumptions, destroying SEO independence and future Pan-India generic gig scalability.
- **Option B (Separate Backend):** Rejected for Stage 1. Forces massive duplication of Auth, KYC, Wallets, and Payment integrations. Unnecessary DevOps overhead.
- **Option C (Modular Shared Platform): RECOMMENDED.** Preserves shared Identity/Payment infrastructure while enforcing strict domain separation (Worker vs Driver, GigJob vs Booking).

## 3. Core Architectural Answers

**Q1: Can Metro Mitra Workforce become an independently scalable product while GoMyTruck remains a consumer?**
**Yes.** By retaining the shared `User` identity root but exposing Workforce capabilities strictly through internal domain APIs (e.g., `WorkforceService.assignLabor(bookingId)`), GoMyTruck becomes a sibling client. They share the authentication and database infrastructure, but the business logic is totally decoupled.

**Q2: What is the minimum architecture we should build now that prevents painful rewrites later?**
The immediate requirement is to replace the Flutter UI mockups with an API-driven `ServiceCatalog` (DB-persisted categories like Electrician, Plumber) and upgrade `GigJob` to support B2B, B2C, and Individual Hirer contexts seamlessly. The `GigJob` model must decouple from logistics completely, establishing its own pricing and matching engine independent of `Booking`.

**Q3: How should a new Workforce job flow through the system?**
1. **Creation:** Hirer (Individual/B2B) calls `/api/v1/workforce/gigs` (Backend creates `GigJob`).
2. **SEO Sync:** If public, an event triggers the Web SSR generator to create a static `JobPosting` page.
3. **Matching:** Backend Haversine radius filters open workers and emits Socket.IO slots.
4. **Assignment:** Worker accepts via App. `GigAssignment` created via serializable transaction.
5. **Execution & Completion:** Worker taps "Complete". Hirer provides OTP. 
6. **Payment:** OTP triggers automated ledger transfer from Customer `Wallet` to `WorkerWallet`. SEO page updates to 410 Gone.

**Q4: How should GoMyTruck request Workforce services without owning the Workforce database?**
GoMyTruck's `BookingService` will dispatch an internal event (or call `WorkforceService` internally). The Workforce domain creates a `JobAssignment` linking the laborer to the `BookingId`. Workforce handles the matching, status tracking, and wallet payouts. GoMyTruck merely receives state updates (via internal EventBus) to know when labor has arrived.

## 4. Boundaries & Data Ownership
- **Database Boundaries:** Modular schema within the same PostgreSQL instance. `Booking` (Logistics) and `GigJob` (Workforce) are strictly separate.
- **Authentication Boundaries:** Shared `User` table. Role isolation is handled via contextual JWTs (`WORKER` vs `CUSTOMER`), enabling multi-persona accounts securely.
- **Payment Boundaries:** Shared Gateway (Razorpay). Separate Wallets (`WorkerWallet`, `CustomerWallet`). Ledgers remain unified to support easy B2B corporate billing.
- **API Boundaries:** New `/api/v1/seo/workforce/` for public discovery and `/api/v1/workforce/` for authenticated App/Web actions.

## 5. Web / App Responsibility (Channel Matrix)
- **Flutter App:** Authenticated execution (Worker matching, tracking, earning, OTP completion). Individual/B2B job request creation.
- **Metro Mitra Web:** Public SEO discovery, B2B lead generation, dynamic JobPosting SSR generation. Deep-links into the Flutter app for individual hiring, or web-based B2B dashboard for bulk corporate management.

## 6. Migration Plan
1. **Database:** Create the `ServiceCatalog` tables to back the Flutter UI categories.
2. **API:** Implement the `/api/v1/workforce/categories` endpoint.
3. **App:** Remove hardcoded Flutter categories; wire UI to the new API.
4. **Web:** Hook the SEO prerender script to the API to generate `/jobs/plumber/` pages.
5. **Rollout:** Deploy backend, then web, then force-update Flutter app.

## 7. Cost, Complexity & Future Extraction
Using Option C keeps DevOps costs identical to today (1 Droplet, 1 DB). If Metro Mitra hits hyper-scale (Stage 4), the `GigJob` and `Worker` tables can be cleanly sharded or split into a true Microservice via CDC (Change Data Capture), as the domain boundaries are already strictly enforced in code.

## 8. Summary & Next Phase
**RECOMMENDED ARCHITECTURE:** Modular Shared Platform (Option C).
**SHARED COMPONENTS:** Auth, Wallets, Payments, Notifications.
**WORKFORCE-OWNED:** `Worker`, `GigJob`, `WorkerWallet`, Service Categories, SEO.
**GOMYTRUCK-OWNED:** `Booking`, `Driver`, Bidding, Fleet.
**NEXT PHASE:** Awaiting explicit approval to begin Backend Database Migrations and Phase 1 SEO Execution based on this approved modular structure.
