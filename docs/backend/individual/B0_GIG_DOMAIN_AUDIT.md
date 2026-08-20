# B0_GIG_DOMAIN_AUDIT: GigJob and Individual Hiring Architecture

## 1. Core Models and Mapping
- The system supports two distinct workforce models: standard `Booking` (where workers assist a truck booking) and standalone `GigJob` (individual hiring for specific skills like `HELPER`, `PACKER`, `ELECTRICIAN`).
- `GigJob` handles fields like `locationZone`, `gigCategory`, `urgency` (`IMMEDIATE`, `WITHIN_HOUR`, `SCHEDULED`), `workersNeeded`, `durationHours`, `totalFare`, and `perWorkerRate`.
- Workers have a `Worker` record tracking `status`, `isDocVerified`, `preferredTypes`, and wallet details.
- Standard bookings map to `JobAssignment`, while GigJobs map to `GigAssignment`. The workforce gateway APIs seamlessly unify both into a common structure for the Flutter app.

## 2. API Endpoints
### Customer Endpoints (`/gig` Router)
- **POST `/gig/estimate`**: Returns fare estimates without saving to DB. Uses `GigPricingEngine` and calculates distance to nearest worker.
- **POST `/gig/customer`**: Creates a new `GigJob` record with status `PENDING`, determines the geographic `locationZone`, calculates the final fare breakdown, and emits a socket event (`new_gig_job`) to the workforce.
- **GET `/gig/customer`**: Lists all gigs belonging to the authenticated customer.

### Workforce Endpoints (`/workforce` Router)
- **GET `/workforce/jobs/available`**: Retrieves open jobs for available workers. Transparently merges `GigJob` records into a standardized `JobFeedItem` format (with `vehicleType: 'Gig'`, `goodsType: 'Service'`). Excludes jobs the worker has already declined or accepted. Filters out jobs where `workersNeeded` slots are full. Calculates haversine distances to jobs.
- **POST `/workforce/jobs/:id/accept`**: Replaces the basic `gig.service.ts` logic with a robust transaction. Checks if the job is a `GigJob` or standard `Booking`. Creates a `GigAssignment` with status `ACCEPTED` and updates the worker's status to `ON_JOB`. It emits a socket event if all `workersNeeded` slots are successfully filled.
- **POST `/workforce/jobs/:id/decline`**: Creates a `GigAssignment` with status `DECLINED` to prevent the job from showing in the worker's feed again and affects their `acceptanceRate`.
- **POST `/workforce/jobs/:id/arrive`**: Updates `GigAssignment` status to `ARRIVED`.
- **POST `/workforce/jobs/:id/start`**: Updates `GigAssignment` status to `IN_PROGRESS`.
- **POST `/workforce/jobs/:id/request-otp`**: Generates a 4-digit completion OTP, saves it to `GigJob.completionOtp`, and sends a push notification to the customer to verify task completion.
- **POST `/workforce/jobs/:id/complete`**: Verifies the OTP, updates `GigAssignment` to `COMPLETED`, and sets the worker back to `AVAILABLE`. When the last worker completes their assignment, the parent `GigJob` is marked `COMPLETED`.

## 3. Payment & Commission Flow
- Standard platform commission (default 12%) is factored into the gig total fare during creation (`gig.pricing.ts`).
- Upon job completion (in `workforce.service.ts`), a separate workforce commission (default 15% via `WORKFORCE_COMMISSION_RATE` env var) is deducted from the worker's payout amount.
- The net payout (`payoutAmount - commission`) is credited to the `WorkerWallet`, and a `WorkerWalletTransaction` (type: `CREDIT`, reason: `JOB_EARNING`) is created.

## 4. Notifications & Real-Time Tracking
- Handled primarily via Socket.IO rooms (`/workforce` namespace).
- Transitions (`worker_arrived`, `worker_started`, `worker_completed`, `workers_fully_assigned`) emit events to the specific booking's room.
- Push notifications via Firebase Cloud Messaging (FCM) dispatch to both customers (e.g., OTP generation) and workers (e.g., job confirmed, payment credited).
