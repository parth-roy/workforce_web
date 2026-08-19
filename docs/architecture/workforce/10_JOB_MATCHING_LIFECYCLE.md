# Job Matching Lifecycle (Workforce)

## Overview
The GoMyTruck Workforce App operates on an open-market, claim-based assignment model rather than a forced dispatch model. Workers organically discover nearby jobs, accept them on a first-come-first-serve basis, and execute them through a lifecycle gated by OTP verification.

## Data Sources
A workforce job can originate from two sources in the backend:
1. **Integrated Bookings (`Booking` model):** A standard freight booking where `laborRequired` is set to `true`. The required number of workers is defined in `laborersCount`.
2. **Independent Gigs (`GigJob` model):** A standalone workforce request created via the Gig Engine (e.g., packers, helpers, supervisors) without a freight truck.

## Lifecycle States
Worker jobs progress through the `WorkerJobStatus` enum:
- `PENDING_ACCEPTANCE` -> `ACCEPTED` -> `ARRIVED` -> `IN_PROGRESS` -> `COMPLETED`
Worker profiles concurrently track state via the `WorkerStatus` enum:
- `OFFLINE` -> `AVAILABLE` -> `ON_JOB`

## API Routes & Database Mapping

### 1. Discovery
**Route:** `GET /workforce/jobs/available`
- Queries both `Booking` and `GigJob` tables for open slots.
- Performs distance calculation (Haversine formula in-memory/DB) against the worker's current cached GPS location.
- Returns a unified format mapping both sources to a common `Job` entity.

**Route:** `GET /workforce/jobs/nearby-pins`
- Used for the job radar/map view to show clusters of demand.

### 2. Acceptance
**Route:** `POST /workforce/jobs/:id/accept`
- Verifies worker is `AVAILABLE` and document-verified.
- Uses Prisma serializable transactions to prevent double-booking.
- Creates either a `JobAssignment` (for Bookings) or a `GigAssignment` (for Gigs) with `status = ACCEPTED`.
- Transitions the `Worker.status` to `ON_JOB`.
- Emits real-time Socket.IO events (`gig_fully_assigned` or `workers_fully_assigned`) to the customer if all slots are filled.

### 3. Execution
**Routes:** 
- `POST /workforce/jobs/:id/arrive` -> Updates assignment status to `ARRIVED`.
- `POST /workforce/jobs/:id/start` -> Updates assignment status to `IN_PROGRESS`.

### 4. Completion & Payout
**Route:** `POST /workforce/jobs/:id/request-otp`
- Generates a random OTP.
- Stores it in `jobAssignment.completionOtp` or `gigJob.completionOtp`.
- Dispatches FCM notification to the Customer app to securely provide the OTP to the worker.

**Route:** `POST /workforce/jobs/:id/complete`
- Validates the provided OTP against the database.
- Marks assignment as `COMPLETED`.
- Transitions the worker back to `AVAILABLE`.
- Calculates platform commission (default 15%).
- **Financial Write:** Upserts `WorkerWallet`, crediting the net payout, and logs a `WorkerWalletTransaction` with reason `JOB_EARNING`.
- Checks if all assigned workers are completed; if so, emits `all_workers_completed` via Socket.IO.

## Real-Time Components
- **Redis:** Worker locations are cached in Redis (`worker:location:{id}`) to optimize distance calculations during job discovery.
- **Socket.IO (`/workforce`, `/booking` namespaces):** Pushes new jobs (`new_gig_job`) to available workers and updates customers (`worker_completed`).
