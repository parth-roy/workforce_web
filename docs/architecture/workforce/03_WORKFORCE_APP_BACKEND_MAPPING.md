# Workforce App to Backend API Mapping

This document maps the primary features of the Workforce App to the corresponding backend modules, API routes, and Prisma database models.

## 1. Authentication & Onboarding
**Backend Module:** `server/src/modules/workforce`

| Action | API Route | Controller / Service Method | Prisma Models |
| :--- | :--- | :--- | :--- |
| **Send OTP** | `POST /workforce/auth/send-otp` | `sendOtp` | (In-memory / Redis cache) |
| **Verify OTP** | `POST /workforce/auth/verify-otp` | `verifyOtp` | `User` (Role `WORKER`), `Worker`, `RefreshToken` |
| **Upload Docs** | `POST /workforce/profile/documents` | `uploadDocuments` | `WorkerDocument` |

## 2. Worker Profile & State Management
**Backend Module:** `server/src/modules/workforce`

| Action | API Route | Controller / Service Method | Prisma Models |
| :--- | :--- | :--- | :--- |
| **Get Profile** | `GET /workforce/profile/me` | `getMe` | `Worker`, `User`, `WorkerDocument` |
| **Update Duty Status** | `PATCH /workforce/profile/status` | `updateStatus` | `Worker` (Updates `status`) |
| **Sync Live GPS** | `PATCH /workforce/profile/location` | `updateLocation` | Redis `worker:location:*`, `Worker` (every 30s) |
| **Update Bank Info** | `PATCH /workforce/profile/bank-details` | `updateBankDetails` | `Worker` |

## 3. Job Matching & Discovery
**Backend Module:** `server/src/modules/workforce` & `server/src/modules/gig`

| Action | API Route | Controller / Service Method | Prisma Models |
| :--- | :--- | :--- | :--- |
| **Find Open Jobs** | `GET /workforce/jobs/available` | `getAvailableJobs` | `Booking` (with `laborRequired`), `GigJob` |
| **Radar/Heatmap** | `GET /workforce/jobs/nearby-pins` | `getNearbyPins` | `Booking`, `GigJob` |
| **Get Active Job** | `GET /workforce/jobs/active` | `getActiveJob` | `JobAssignment`, `GigAssignment` |
| **Get History** | `GET /workforce/jobs/history` | `getJobHistory` | `JobAssignment`, `GigAssignment` |

## 4. Job Execution Lifecycle
**Backend Module:** `server/src/modules/workforce`

| Action | API Route | Controller / Service Method | Prisma Models |
| :--- | :--- | :--- | :--- |
| **Accept Job** | `POST /workforce/jobs/:id/accept` | `acceptJob` | `JobAssignment`, `GigAssignment`, `Worker` |
| **Arrive at Site** | `POST /workforce/jobs/:id/arrive` | `markArrived` | `JobAssignment`, `GigAssignment` |
| **Start Working** | `POST /workforce/jobs/:id/start` | `startJob` | `JobAssignment`, `GigAssignment` |
| **Request OTP** | `POST /workforce/jobs/:id/request-otp` | `requestCompletionOtp` | `JobAssignment`, `GigJob` |
| **Complete Job** | `POST /workforce/jobs/:id/complete` | `completeJob` | `JobAssignment`, `GigAssignment`, `WorkerWallet`, `WorkerWalletTransaction` |

## 5. Earnings & Wallet
**Backend Module:** `server/src/modules/workforce`

| Action | API Route | Controller / Service Method | Prisma Models |
| :--- | :--- | :--- | :--- |
| **Get Balance** | `GET /workforce/wallet/balance` | `getWalletBalance` | `WorkerWallet`, `JobAssignment` (pending calc) |
| **Ledger History** | `GET /workforce/wallet/transactions` | `getWalletTransactions` | `WorkerWalletTransaction` |
| **Withdraw** | `POST /workforce/wallet/withdraw` | `withdrawWallet` | `WorkerWalletTransaction`, `WithdrawalRequest` |
| **Earnings Chart** | `GET /workforce/wallet/earnings-chart`| `getEarningsChart` | `WorkerWalletTransaction` |

## 6. Real-time Interactions
**Backend Namespace:** Socket.IO (`/workforce` and `/booking`)
- **Incoming to Worker App:**
  - `new_gig_job`: Emitted when a new GigJob is created.
  - `job_cancelled`: Emitted if customer cancels.
- **Outgoing to Customer App:**
  - `workers_fully_assigned` / `gig_fully_assigned`: Emitted when all required workers have accepted.
  - `worker_completed`: Emitted when an individual worker finishes.
  - `all_workers_completed`: Emitted when all workers finish their tasks.
