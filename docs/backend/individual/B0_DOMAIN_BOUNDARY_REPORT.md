# B0_DOMAIN_BOUNDARY_REPORT

## Domain Isolation Audit

1. **CRITICAL CHECK: Verify Individual Hirer ≠ Company Organization ≠ Manpower Contractor**
   - **Finding:** Cleanly decoupled. Individual hiring is implemented inside the `gig` module and backed by the `GigJob` and `GigAssignment` tables. A `GigJob` connects directly to a `User` (as `customerId`) and assigns a `Worker` (which has a `userId`). 
   - **Result:** There is NO accidental coupling to `Organization`, `OrganizationBranch`, `OrganizationDepartment`, or `OrganizationEmploymentAssignment`. An individual user can hire an individual worker entirely independently of the corporate/B2B manpower structures.

2. **Isolate Domain: Prove that Individual Hiring changes won't break Driver, Booking, Fleet, Bidding, Corporate**
   - **Driver / Booking / Fleet:** Entirely isolated. Truck bookings and their attached labor use the `Booking` and `JobAssignment` models. Individual gig labor uses `GigJob` and `GigAssignment`. They do not intersect.
   - **Bidding:** Private Bidding (`MarketplaceBid`, `BidWindow`) is strictly bound to `bookingId` in the schema and ignores `GigJob`. 
   - **Corporate:** B2B labor uses `Organization` models and `ShiftInstance`. Gig logic is entirely disjoint.
   - **Pricing:** The `gig.pricing.ts` engine is separate from the truck pricing engine and corporate payroll calculation. You can safely change individual gig formulas without breaking anything else.

3. **Check Notification/Payment dependencies (Razorpay, wallet, FCM, sockets, OTP)**
   - **Sockets (Required):** `gig.service.ts` heavily relies on Socket.IO (`/workforce` namespace) to broadcast `new_gig_job` to nearby workers.
   - **Razorpay/Wallet (Existing but decoupled in creation):** The `GigJob` schema tracks `paymentStatus`, `paymentMethod`, and `razorpayOrderId`, but the `gig.service.ts` logic doesn't strictly depend on Razorpay/Wallet APIs during job creation or estimation. These are handled asynchronously or in a separate payment module.
   - **OTP (Existing in schema, not required in creation):** `completionOtp` exists on the `GigJob` model for job completion validation, but the gig module does not currently auto-generate it or strictly enforce it during creation/assignment phases.
   - **FCM (Not required directly):** Realtime driver/worker discovery favors the Socket.IO namespace over Firebase push notifications for immediate dispatch.
