# B0 Backend Implementation Plan — Individual Hiring
> **STATUS: PLAN ONLY — AWAITING EXPLICIT APPROVAL BEFORE EXECUTION**

---

## Phase 1 — Database / Domain Changes
**Target Branch:** `test`
**Target DB:** `logistic_test`

### Change 1: Add `scheduledStartTime` to `GigJob`
```prisma
model GigJob {
  // ... existing fields ...
  scheduledStartTime  DateTime?   // NEW — null means immediate/urgency-driven
}
```

**Migration:**
```sql
ALTER TABLE "GigJob" ADD COLUMN "scheduledStartTime" TIMESTAMP(3);
```

**Risk:** Additive-only. Existing rows will have `NULL`. No breaking change.

**Rollback:** `ALTER TABLE "GigJob" DROP COLUMN "scheduledStartTime";`

---

## Phase 2 — Service / API Changes

### 2a. Service Catalog Endpoint (Read-only wrapper)
- **File:** `server/src/modules/gig/gig.router.ts`
- **Action:** Add `GET /gig/catalog` route that calls `getGigCatalog()` from `gig.pricing.ts` and strips internal fields (`priceMultiplier`) before returning.
- **No schema change required.**

### 2b. Single Gig Detail Endpoint
- **File:** `server/src/modules/gig/gig.controller.ts` + `gig.service.ts`
- **Action:** Add `GET /gig/customer/:id` that verifies customer ownership and returns the GigJob with its assignments.
- **No schema change required.**

### 2c. Location Serviceability (Public Adapter)
- **File:** New thin controller in `gig` module or `maps` module.
- **Action:** `GET /gig/serviceability?lat=X&lng=Y` → calls `serviceability.service.ts` → returns `{ serviceable, zoneName, city }`.
- **No schema change required.**

---

## Phase 3 — Individual Hiring Request Creation

### 3a. Update Gig Creation to Accept `scheduledStartTime`
- **File:** `server/src/modules/gig/gig.schema.ts` (Zod validation)
- **Action:** Add optional `scheduledStartTime` field to Zod schema and pass through to `gig.service.ts` create logic.
- **Depends on:** Phase 1 migration.

---

## Phase 4 — Pricing / Availability Integration

### 4a. Sanitise Public Estimate Endpoint
- **File:** `server/src/modules/gig/gig.service.ts`
- **Action:** Create a `getPublicEstimate()` helper that strips `platformFee`, `driverPayout`, `commissionRate` from the response before returning to unauthenticated callers.
- **Security Fix:** Add auth guard or response sanitiser to `POST /gig/estimate`.

---

## Phase 5 — Web API Integration

### 5a. Connect Web Frontend to Catalog
- **File:** `workforce_web/src/data/` — replace mock data with API calls to `GET /api/v1/gig/catalog`.

### 5b. Connect Lead Form
- **File:** `workforce_web/src/` — wire contact/booking forms to `POST /api/v1/leads`.

### 5c. Connect Pricing Widget
- **File:** `workforce_web/src/` — wire pricing estimate to sanitised `POST /api/v1/gig/estimate`.

---

## Phase 6 — Flutter API Integration

### 6a. Update Customer App
- Map `GigWorkforcePostScreen` to include `scheduledStartTime` in the submission payload.
- Add post-submit tracking screen navigating to `GET /gig/customer/:id`.

### 6b. Update Workforce App `HirerGigPostScreen`
- Replace mocked static pricing with real call to `POST /api/v1/gig/estimate`.
- Replace mocked submission with real `POST /api/v1/gig/customer`.

---

## Phase 7 — Test Deployment

### Environment
```
API:  https://api-test.gomytruck.com
DB:   logistic_test
Branch: test
```

### Deployment Steps
1. Run migration on `logistic_test`: `npx prisma migrate deploy` (test env only).
2. Seed test data: a test customer user, test worker user, test gig entries.
3. Deploy backend to `api-test.gomytruck.com` via PM2 restart.
4. Run smoke tests (curl scripts for all new endpoints).

### Rollback
- Revert the `scheduledStartTime` migration SQL.
- Rollback PM2 to prior release.

---

## Phase 8 — Regression

### Backend Regression Suite
```bash
npm run test                     # Existing Jest test suite
node scripts/smoke-test-gig.js   # New — to be created in B1
```

### Frontend Regression Suite
```bash
npm run build
node scripts/test-routes.js
node scripts/test-ssr.js
node scripts/test-sitemap.js
node scripts/test-internal-links.js
node scripts/test-geo-content.js
```

### Zero-Degradation Contract
- No existing `Booking`, `Driver`, `Fleet`, `Organization` tests may fail.
- All new gig endpoints must have ≥1 smoke test each.
