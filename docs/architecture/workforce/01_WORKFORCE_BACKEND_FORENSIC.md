# Workforce Backend Forensic Audit
**Date:** 2026-08-19

This document outlines how the existing Node.js backend (`server/`) supports the Workforce ecosystem. It serves as a read-only forensic analysis to guide the development of the standalone `workforce_web` app.

---

## 1. Overview
The backend currently treats a **Worker** (Role: `WORKER`) as a distinct entity from a Driver or a Fleet Owner. Workers can participate in two completely different job streams:
1. **Integrated Logistics Labor (`Booking` / `JobAssignment`)**: Labor attached to a standard truck booking (e.g., Loader required for a Tata Ace).
2. **Standalone Gigs (`GigJob` / `GigAssignment`)**: Independent, service-only tasks (e.g., General Helper, Electrician, Heavy Loader) completely decoupled from any truck or goods transport.

---

## 2. Core Data Models
Found in `server/prisma/schema.prisma`.

### 2.1 User & Profile
- **`User` (Role: `WORKER`)**: Core authentication record.
- **`Worker`**: Extended profile linked 1:1 with `User`. Contains status (`OFFLINE`, `AVAILABLE`, `ON_JOB`), Digilocker KYC (Aadhaar, PAN), Bank details, preferences (`maxWeightKg`, `preferredTypes`), and gamification metrics (`rating`, `totalJobs`, `acceptanceRate`).
- **`WorkerDocument`**: Stores uploaded compliance files (S3 URLs).

### 2.2 Integrated Labor (`JobAssignment`)
- Links a standard `Booking` to a `Worker`.
- **Fields**: `status` (`WorkerJobStatus`), `payoutAmount`, `completionOtp`, timestamps (`arrivedAt`, `startedAt`, `completedAt`).
- **Economics**: The booking's total `laborCharge` is divided equally among the `laborersCount`.

### 2.3 Standalone Gigs (`GigJob` & `GigAssignment`)
- **`GigJob`**: Represents the job created by a customer. Contains `gigCategory` (e.g., `HELPER`, `ELECTRICIAN`), `durationHours`, `urgency`, location data (with pre-computed `locationZone`), and the total fare/payout breakdown.
- **`GigAssignment`**: Links a `GigJob` to a `Worker`, acting identically to `JobAssignment` in the worker's lifecycle.

### 2.4 Financials & Wallets
- **`WorkerWallet`**: Tracks the worker's balance. Interestingly, `cachedBalance` is strictly positive earnings, while cash commission deductions are tracked in `commissionDue`.
- **`WorkerWalletTransaction`**: Ledger for earnings, withdrawals, and commission payments.
- **`WithdrawalRequest`**: Integration point with RazorpayX to transfer wallet balance to the worker's bank account.

---

## 3. Module Architecture

The code is logically divided into three main modules concerning workforce:

### 3.1 `workforce` Module (`server/src/modules/workforce/`)
The primary unified API for the Worker mobile app.
- **Auth**: OTP-based contextual login (`sendOtp`, `verifyOtp`).
- **Profile**: Status toggles, live location updates (to Redis & DB), preferences.
- **Jobs (`workforce.service.ts`)**:
  - `getAvailableJobs`: Currently queries *only* `GigJob`s that are `PENDING`.
  - `acceptJob`, `markArrived`, `startJob`, `requestCompletionOtp`, `completeJob`: Unified handlers that route to either `JobAssignment` (if standard booking) or `GigAssignment` (if gig job).
- **Wallet**: Check balance, list transactions, request withdrawal via RazorpayX.
- **Safety**: Triggers SOS alerts (`triggerSos`), creating high-priority support tickets and broadcasting to admins via Socket.IO.

### 3.2 `gig` Module (`server/src/modules/gig/`)
The customer and admin API for Standalone Gigs.
- **Gig Pricing Engine v1 (`gig.pricing.ts`)**:
  - **Zone-aware**: Classifies West Bengal coordinates into `METRO`, `TIER2`, or `RURAL` via bounding boxes.
  - **Formula**: `(Base Rate * Skill Multiplier * Hours Multiplier) + Urgency Premium + Demand Surge + Travel Fee`.
  - Calculates worker earnings vs. platform commission (default 12%).
- **Controllers**: Exposes endpoints for customers to estimate and create gigs.

### 3.3 `dispatch` Module (`server/src/modules/dispatch/`)
Handles the routing of jobs to workers.
- **`dispatchWorkers`**: Triggered via EventBus when a standard `Booking` is confirmed and `laborRequired = true`.
- **Logic**: Queries up to 10 nearby verified, available workers (within 30km) matching the required `LaborType`. It creates a `JobAssignment` with `PENDING_ACCEPTANCE` and sends an FCM push + Socket.IO alert.

---

## 4. Lifecycle Differences: Booking Labor vs GigJob

| Feature | Booking Labor (`JobAssignment`) | Standalone Gig (`GigAssignment`) |
| :--- | :--- | :--- |
| **Creation** | Created as part of a transport booking. | Created directly by customer via `/gig/customer`. |
| **Pricing** | Fixed `laborCharge` defined by vehicle pricing. | Dynamic via Gig Pricing Engine v1. |
| **Dispatch** | Push-based. `dispatch.service.ts` actively targets nearest workers and pre-creates `JobAssignment`. | Pull-based. Workers see open gigs in their feed (`getAvailableJobs`) and race to accept. |
| **Acceptance** | Worker accepts the pre-created `JobAssignment`. | Worker accepts, creating a new `GigAssignment` on the fly. |

## 5. Socket.IO & Real-time
- **Namespaces/Rooms**: Workers have dedicated socket rooms (e.g. `worker_<id>`) and booking rooms.
- **Events**: `new_job_alert` (dispatch), `worker_arrived`, `worker_started`, `worker_completed`, `all_workers_completed`.

## 6. Key Takeaways for Web App Development
1. **Two Distinct Job Types**: The new web app must visually and logically handle both `GigJob` and `Booking` labor, as the backend treats them as separate tables but unifies their lifecycle through the `workforce.service.ts`.
2. **Gig Pricing Engine**: Any admin UI to configure gig rates must interface with the existing key-value `GigPricingConfig` database format and respect the hardcoded West Bengal bounding boxes in `gig.pricing.ts`.
3. **Withdrawals**: Withdrawal limits and RazorpayX integration are fully wired in the backend (`withdrawWallet`).
4. **Safety & SOS**: A critical feature is the SOS trigger, which expects the backend to route alerts directly to the admin dashboard.
