# B0 Individual Hiring Forensic Audit Report

**Date:** 2026-08-20
**Phase:** B0 — Read-Only Forensic Audit
**Scope:** Individual Hirer / Individual Hiring Only
**Code Modified:** ZERO

---

## 1. Flutter Screen Map

The Individual Hirer experience exists in both the **Customer app** and the **Workforce (Hirer mode) app**. Key findings:

- **Entry:** Customer app → `Main Layout` → `/gig-workforce` (Hire Workforce). Workforce app → Contractor/Hirer mode → `/hirer/gig-post`.
- **Service Selection:** Fully **hardcoded** in both apps. Maps to `GigSkill` enum: `LOADER`, `ELECTRICIAN`, `HELPER`, `CLEANER`, `FURNITURE_MOVER`, `HEAVY_LOADER`, `PACKER`, `RIGGER`. Not API-driven.
- **Worker Quantity:** Users select 1–10 workers. No sub-variants of services.
- **Location:** Customer app uses a Map Picker (lat/lng + address). Workforce app auto-fetches GPS and allows text override.
- **Scheduling:** Duration (1/2/4/8/12 hrs) + Urgency (`IMMEDIATE`, `WITHIN_HOUR`, `SCHEDULED`). **No calendar date picker. `scheduledStartTime` field is missing from the DB schema.**
- **Pricing:**
  - Customer app: Backend-calculated (calls `POST /estimate/gig`). ✅
  - Workforce Hirer app: **Fully mocked static calculation (₹150/hr base)**. ❌
- **Submission:** Customer app submits to `POST /gig/create` successfully. On success it **pops to home screen — no tracking screen is wired**.
- **Status Tracking:** No active status tracking screen exists in either app post-submission.

---

## 2. Existing Backend Capabilities

The `GigJob` domain is **well-structured and largely complete** for Individual Hiring:

| Capability | Status |
| :--- | :--- |
| GigJob creation (`POST /gig/customer`) | ✅ Exists |
| Fare estimate (`POST /gig/estimate`) | ✅ Exists |
| Customer gig list (`GET /gig/customer`) | ✅ Exists |
| Worker assignment (Socket.IO broadcast) | ✅ Exists |
| Job lifecycle (accept/arrive/start/complete) | ✅ Exists |
| OTP completion verification | ✅ Exists |
| Worker payout on completion | ✅ Exists |
| FCM push notifications | ✅ Exists |

---

## 3. Existing API Inventory (Relevant to Individual Hiring)

| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/gig/estimate` | ❌ None | Fare estimate (⚠️ leaks internal margins) |
| `POST` | `/api/v1/gig/customer` | ✅ CUSTOMER JWT | Create a GigJob |
| `GET` | `/api/v1/gig/customer` | ✅ CUSTOMER JWT | List customer's gigs |
| `POST` | `/api/v1/leads` | ❌ None | Unauthenticated lead capture |
| `GET` | `/api/v1/maps/autocomplete` | ✅ | Location autocomplete |

**Missing APIs:**
- `GET /api/v1/gig/catalog` (public service catalog)
- `GET /api/v1/gig/customer/:id` (single gig detail / tracking)
- `GET /api/v1/gig/serviceability` (location-based availability check for web)
- `GET /api/v1/seo/evidence` (aggregated data for SEO indexability contract)

---

## 4. Existing Database Entities

`GigJob` is the core Individual Hiring entity. It is **largely complete**, with one critical missing field:

| Field | Status |
| :--- | :--- |
| `customerId` (Individual Hirer) | ✅ Existing |
| `gigCategory` (GigSkill enum) | ✅ Existing |
| `workersNeeded` | ✅ Existing |
| `locationLat`, `locationLng`, `locationAddress`, `locationZone` | ✅ Existing |
| `durationHours` | ✅ Existing |
| `urgency` (IMMEDIATE/WITHIN_HOUR/SCHEDULED) | ✅ Existing |
| `totalFare`, `perWorkerRate`, `fareBreakdown` | ✅ Existing |
| `platformFee` | ✅ Existing (must remain internal) |
| `paymentStatus`, `paymentMethod`, `razorpayOrderId` | ✅ Existing |
| `status` (PENDING/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED) | ✅ Existing |
| `completionOtp` | ✅ Existing |
| **`scheduledStartTime`** | ❌ **MISSING — Critical Gap** |

---

## 5. Authentication Model

The contextual JWT model **natively supports Individual Hirer** without organization creation.

- A phone number can hold both `CUSTOMER` and `WORKER` roles simultaneously.
- Role is injected into JWT at login time based on `role` parameter from the client.
- Individual Hirers operate in `PERSONAL` workspace (no `x-organization-id` header required).
- **Individual Hirer ≠ Organization Member.** These are fully separate paths in the auth/workspace resolver.

---

## 6. Service Catalog Model

| | Current State | Required State |
| :--- | :--- | :--- |
| Storage | Hardcoded TypeScript constant (`getGigCatalog()` in `gig.pricing.ts`) | PARTIAL — adequate for v1 with a read-only wrapper |
| Structure | Flat `GigSkill` union (8 skills) | Frozen web model expects Category → Section → Item → Role → Requirement hierarchy |
| Audience filtering | None | Needed (`individual` vs `b2b`) |
| DB-driven | No | Not required for v1; required for v2 |
| Public endpoint | None | `GET /api/v1/gig/catalog?audience=individual` needed |

---

## 7. Pricing Model

- **Gig pricing** is handled by `GigPricingEngine` in `gig.pricing.ts`, separate from truck/logistics pricing.
- **Inputs:** `gigCategory`, `locationZone`, `durationHours`, `workersNeeded`, `urgency`.
- **Outputs:** `totalFare`, `perWorkerRate`, `platformFee`, `workerEarnings`, `fareBreakdown`.
- **⚠️ Critical Risk:** `POST /gig/estimate` is unauthenticated and exposes `platformFee` and internal commission data to any caller. Must be sanitised before web exposure.
- Safe public exposure: only `totalFare` and `fareBreakdown` (without margin/payout fields).

---

## 8. Location / Availability Model

- Serviceability is **coordinate-based** (lat/lng) — validated via Mapbox reverse-geocode + `ServiceabilityConfig` DB table.
- Currently operates at **COUNTRY level** (all of India is in-scope).
- There is **no list endpoint** for available locations per service — frontend cannot query "which cities serve Electricians?".
- Availability is derived in real-time per-coordinate; no aggregate supply count is exposed.
- Gap: Web frontend needs `GET /gig/serviceability?lat=X&lng=Y` and eventually an evidence aggregate for the indexability contract.

---

## 9. Individual-vs-Organization Boundary

✅ **Clean separation confirmed.**

- `GigJob` is linked directly to a `User` (`customerId`) — no `Organization` reference.
- Individual Hiring never touches `OrganizationBranch`, `OrganizationDepartment`, `ShiftInstance`, or `OrganizationEmploymentAssignment`.
- Changes to the gig domain are safe from corporate/contractor module contamination.

---

## 10. Frontend Dependency Mapping

| Frontend Requirement | Gap Classification |
| :--- | :--- |
| Service Catalog | PARTIAL (exists, needs public wrapper) |
| Pricing Estimate | EXISTS (needs sanitisation) |
| Lead Form | EXISTS |
| Authenticated Booking | EXISTS |
| Single Gig Detail / Tracking | MISSING |
| Scheduled Start Time | MISSING (DB field) |
| Location Availability List | MISSING |
| SEO Evidence Aggregates | MISSING |

---

## 11. Missing Capabilities Summary

1. **`scheduledStartTime`** field on `GigJob` — single additive migration.
2. **Public service catalog endpoint** — thin read-only wrapper over existing `getGigCatalog()`.
3. **Single gig detail endpoint** (`GET /gig/customer/:id`) — customer ownership-checked.
4. **Gig estimate sanitisation** — strip internal margin/payout before public response.
5. **Location serviceability public adapter** — thin wrapper over existing serviceability engine.
6. **SEO evidence aggregate endpoint** — new read-only DB aggregate query.
7. **Post-submission tracking screen** in both Flutter apps.

---

## 12. Minimal Implementation Plan

See [`B0_BACKEND_IMPLEMENTATION_PLAN.md`](./B0_BACKEND_IMPLEMENTATION_PLAN.md) for the full 8-phase plan. Summary:

| Phase | Scope | Risk |
| :--- | :--- | :--- |
| 1 | Add `scheduledStartTime` to `GigJob` (additive migration) | Low |
| 2 | Catalog, detail, serviceability endpoints (read-only wrappers) | Low |
| 3 | Accept `scheduledStartTime` in gig creation | Low |
| 4 | Sanitise estimate endpoint security risk | Medium |
| 5 | Web frontend API integration | Low |
| 6 | Flutter app API integration | Medium |
| 7 | Test environment deployment | Low |
| 8 | Regression testing | Low |

---

## 13. Test Deployment Plan

```
API:    https://api-test.gomytruck.com
DB:     logistic_test
Branch: test
```

Steps: migrate test DB → seed test users → deploy PM2 → run smoke tests.

---

## 14. Risk Analysis

| Risk | Severity | Mitigation |
| :--- | :--- | :--- |
| `POST /gig/estimate` exposes internal margins | **HIGH** | Sanitise or add auth guard in Phase 4 before any web connection |
| `scheduledStartTime` NULL for existing rows | Low | Additive column, no backfill needed |
| Service catalog `priceMultiplier` leakage | Medium | Strip field in public catalog response |
| Workforce app still mocking pricing | Medium | Wire to real API in Phase 6 |
| No post-submission tracking screen | Medium | Add in Phase 6 Flutter work |
| SEO evidence endpoints don't exist | Medium | Required for indexability transition — Phase 5 |

---

## 15. Files / Modules Affected in Next Phase (B1)

| File | Change Type |
| :--- | :--- |
| `server/prisma/schema.prisma` | Add `scheduledStartTime DateTime?` to `GigJob` |
| `server/prisma/migrations/` | New additive migration file |
| `server/src/modules/gig/gig.schema.ts` | Add optional `scheduledStartTime` to Zod schema |
| `server/src/modules/gig/gig.service.ts` | Accept `scheduledStartTime` in create; add `getPublicEstimate()` sanitiser; add `getCustomerGigById()` |
| `server/src/modules/gig/gig.controller.ts` | Add `GET /customer/:id` handler; add `GET /catalog` handler; add `GET /serviceability` handler |
| `server/src/modules/gig/gig.router.ts` | Register new routes |
| `server/src/modules/seo/seo.service.ts` | Add evidence aggregate query |
| `server/src/modules/seo/seo.router.ts` | Register `GET /evidence` route |

**No Driver, Booking, Fleet, Organization, Bidding, or pricing engine modules are touched.**

---

## 16. Explicit Code Modification Confirmation

```
Backend source modifications:   0
Prisma schema modifications:    0
Database migrations created:    0
Flutter app modifications:      0
Frontend (web) modifications:   0
```

**ZERO code was modified during B0. This is a forensic read-only audit.**

---

## STOP

B0 Individual Hiring Forensic Audit is complete.

**Awaiting explicit approval to begin B1 implementation.**
