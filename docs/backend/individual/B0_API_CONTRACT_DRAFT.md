# B0 API CONTRACT DRAFT (Analysis Only — Do Not Implement)

> **STATUS: DRAFT FOR REVIEW — NOT APPROVED FOR IMPLEMENTATION**
> These are proposed APIs derived from the forensic audit. Final names and shapes must be confirmed before B1 implementation begins.

---

## Existing APIs (Already Available — Connect Web UI)

### 1. Pricing Estimate
```
POST /api/v1/gig/estimate
Auth: None (but contains internal pricing — see Security Risk below)
Body: { gigCategory, locationLat, locationLng, durationHours, workersNeeded, urgency }
Returns: { totalFare, perWorkerRate, zoneName, fareBreakdown }

⚠️ SECURITY RISK: This endpoint leaks platform margins and driver payouts.
   Must be audited and a sanitised public wrapper considered before web exposure.
```

### 2. Gig Creation (Authenticated)
```
POST /api/v1/gig/customer
Auth: Bearer (CUSTOMER role JWT)
Body: { gigCategory, locationLat, locationLng, locationAddress, durationHours, workersNeeded, urgency, notes }
Returns: { gigId, status: 'PENDING', totalFare, fareBreakdown }
```

### 3. Customer Gig List
```
GET /api/v1/gig/customer
Auth: Bearer (CUSTOMER role JWT)
Returns: GigJob[] (all gigs for authenticated customer)

Gap: No single-record detail endpoint (/gig/customer/:id) exists.
```

### 4. Lead Capture (Unauthenticated)
```
POST /api/v1/leads
Auth: None
Body: { name, phone, service, location, message }
Returns: { success: true }
```

---

## Missing APIs (Must Be Created in B1+)

### 5. Service Catalog (Web-Safe)
```
GET /api/v1/gig/catalog?audience=individual
Auth: None
Returns: [{
  slug: string,           // e.g. "electrician"
  displayName: string,    // e.g. "Electrician"
  category: string,       // e.g. "Home Services"
  description: string,
  audience: 'individual' | 'b2b' | 'both'
}]

Note: Currently hardcoded in gig.pricing.ts — needs a thin read-only wrapper.
      Do NOT expose priceMultiplier in public response.
```

### 6. Single Gig Detail
```
GET /api/v1/gig/customer/:id
Auth: Bearer (CUSTOMER role JWT — must own the gig)
Returns: Full GigJob with assignments and status

Note: Minor addition to existing gig router. Not a new module.
```

### 7. Scheduled Start Time
```
Requires DB schema change: scheduledStartTime DateTime? on GigJob
Then exposed via POST /api/v1/gig/customer body field.

Note: B0 FINDING — this field is MISSING. Must be added in Phase 1 migration.
```

### 8. Location Serviceability (Web)
```
GET /api/v1/gig/serviceability?lat=X&lng=Y
Auth: None
Returns: { serviceable: boolean, zoneName: string, city: string }

Note: Wraps existing serviceability.service.ts — thin adapter only.
```

### 9. Supply Evidence (SEO)
```
GET /api/v1/seo/evidence?role=:slug&city=:slug
Auth: None
Returns: {
  workerCount: number,        // aggregated, not individual
  completedJobs30Days: number,
  isEligible: boolean
}

Note: Requires DB aggregate query on GigJob + Worker. New read-only endpoint.
      Must NOT expose individual worker data or PII.
```

---

## Security Actions Required Before Any Web Exposure

| Risk | Action |
| :--- | :--- |
| `POST /gig/estimate` leaks driver payouts | Create a sanitised public wrapper or add auth guard |
| `POST /pricing/estimate` has no auth | Add auth middleware or remove from public router |
| Service catalog exposes `priceMultiplier` | Strip internal fields before responding to public consumers |
