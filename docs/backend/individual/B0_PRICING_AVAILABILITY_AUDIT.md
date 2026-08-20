# Pricing & Availability Forensic Audit

## 1. Pricing Engine
**Path:** `server/src/modules/pricing/`

### Inputs -> Calculation -> Outputs
- **Inputs:** `pickupLat`, `pickupLng`, `dropLat`, `dropLng`, `vehicleType`, `hasLoadingService`, `helperCount`, `insuranceOpted`, `stops`.
- **Calculation Flow:**
  1. Mapbox distance/duration retrieval.
  2. `baseFare` + (`distanceKm` × `pricePerKm`) + `timeFare` (capped at 2× distance) = Core.
  3. Fuel surcharge added (if active & diesel price above threshold).
  4. Surge multiplier applied (currently defaults to 1.0 in Stage 1).
  5. Add-ons: loading charge (`helperCount` × rate), insurance.
  6. Subtotal checked against `minFare`.
  7. GST calculated separately (5% for freight, 18% for services).
  8. **Driver Payout:** Calculates `commissionAmount` (on subtotal excluding loading). Runs **MPP Enforcement (Minimum Platform Payout)**: driver payout must be >= (`distanceKm` × `tcoPerKm`). If below, it compresses platform commission to 0%, and adds a platform subsidy if still needed (logs `DriverPayoutSubsidy`).
- **Outputs:** Customer `grandTotal`, `totalFare`, `driverPayout`, `platformRevenue`, detailed fare breakdown, GST breakdown, waiting/toll info.

### Internal vs. Public SEO Pricing Exposure
- **Internal / Booking Estimates:** `POST /api/v1/pricing/estimate` calculates full unit economics and writes to `PricingAuditLog`. It returns highly sensitive platform margins, driver payouts, and effective commission.
- **Public / Bulk Estimates:** `POST /api/v1/pricing/estimate-all` calculates customer totals for all active vehicles in memory (no DB audit logs). It safely omits driver payouts and platform revenue entirely.

### Exposure Risk Assessment
- **CRITICAL RISK:** `POST /api/v1/pricing/estimate` is currently mounted on the public router (`pricing.router.ts`) **without authentication middleware**. Any anonymous user or scraper can query it to map out exact driver payouts, commission boundaries, and platform subsidy burn rates.
- The `estimate-all` endpoint is safe for public SEO/catalog exposure as it does not leak unit economics.

---

## 2. Availability & Location Engine
**Path:** `server/src/modules/maps/serviceability.service.ts`

### Service + Location Handling
- **Mechanism:** Dynamically validates serviceability via coordinate resolution (lat/lng) instead of referencing a static predefined list of zones.
- **Resolution Flow:**
  1. **Cache (Fast path):** Redis TTL 24h lookup keyed by 3-decimal lat/lng (approx 110m grid).
  2. **Mapbox (Primary):** Reverse geocodes coordinates to extract `countryCode`, `stateCode`, `city`, `pincode`.
  3. **Bounding Box (Fallback):** In-memory lat/lng boundaries for Mainland India & Andaman Islands if Mapbox goes down (fails open).
- **Service Zones:** Validates geographic parameters against the `ServiceabilityConfig` DB table. Currently configured to operate at the `COUNTRY` level (`in` = India). It is designed to scale dynamically to `STATE`, `CITY`, and `PINCODE` level restrictions dynamically without requiring codebase changes.

### Frontend Mapping (`GET /locations?service=:slug`, `GET /availability`)
- **Gap Identified:** The backend **does not implement** static `GET /locations` or `GET /availability` endpoints. 
- **Actual Implementation:** The system relies on real-time Places Autocomplete (`/api/v1/maps/autocomplete`). Serviceability is evaluated purely by passing coordinates to the pricing/booking endpoints, which internally invoke `checkServiceability(lat, lng)`. There is no endpoint that serves an array of active locations or zones to the frontend.
