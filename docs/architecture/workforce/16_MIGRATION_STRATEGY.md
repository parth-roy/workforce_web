# 16. Migration Strategy

This document details the transition plan for migrating the existing driver/fleet and monolithic labour logic to the new unified and specialized Workforce Ecosystem. The migration involves database schema changes, API versioning, and client app rollouts.

## 1. Database Schema Migration

The system is transitioning from rudimentary labour columns attached directly to bookings to a fully normalized workforce and load/goods declaration model.

### Phase 1: Additive Schema Changes
- Introduce new Prisma models: `WorkforceProfile`, `JobAssignment`, `BidWindow`, `MarketplaceBid`, and extended `GoodsDeclaration`.
- Extend Enums: Add necessary `VehicleType` extensions (e.g., `TRUCK_14FT`, etc.) and `WorkerRole` enums.
- *Status:* Implemented via `20260713_load_goods_and_workforce` and `20260713_full_private_bidding` migrations. These are additive and do not break existing queries.

### Phase 2: Data Backfill & Reconciliation
- Execute migration scripts (e.g., `migrate-pricing.ts`, `migrate-workforce.ts`) to backfill historical booking data.
- Convert legacy boolean flags (`requiresLabour`) and count integers into explicit `JobAssignment` demand records so the new engine can match workers correctly.
- Assign a generic `WorkforceProfile` to existing registered drivers to unify the identity model, setting `profileComplete` accordingly.

### Phase 3: Deprecation of Legacy Columns
- Mark legacy columns (e.g., old labour counts on the booking table) as `@deprecated` in Prisma.
- Eventually drop these columns in a future major release once API v1 is fully retired.

## 2. API Migration Strategy

- **Versioning:** New endpoints will be exposed under `/api/v2/workforce/` and `/api/v2/marketplace/`.
- **Parallel Routing:** `/api/v1/driver/` routes will continue to function, pulling from legacy schemas or using translation layers (adapters) to map new database structures to old JSON responses.
- **Sunsetting:** Once 95% of active workers have upgraded to the v2 app, v1 endpoints will return a `426 Upgrade Required` status.

## 3. Client App Rollout

1. **Internal Dogfooding (Week 1):** Deploy the new Workforce App to a test group of internal company drivers and dedicated helpers.
2. **Opt-in Beta (Week 2-3):** Allow high-rating drivers and fleet managers to opt-in to the "New Experience" which unlocks Private Bidding and detailed Goods photos.
3. **Phased Mandatory Update (Week 4):**
   - Enforce an OTA (Over-The-Air) update prompt or Store update requirement.
   - The UI will explicitly highlight the separation of Driver tasks vs. Labour tasks for workers holding dual roles.
4. **Fallback Handling:** If a worker cannot update immediately, they can still receive auto-assigned jobs via SMS or WhatsApp fallback links (lightweight web portal).

## 4. Payment Ledger Migration

- Ensure the Ledger correctly handles split payouts. Existing bookings with monolithic driver payouts will remain untouched.
- New bookings will generate discrete `WalletTransaction` entries for each worker participant.
- RazorpayX execution will remain paused until the reconciliation engine guarantees zero-sum integrity between the customer's total payment and the aggregated worker payouts (including platform commission and GST).
