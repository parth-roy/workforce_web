# GoMyTruck Workforce Dependency Map
**Status:** READ-ONLY Forensic Audit
**Date:** 2026-08-19

## Overview
This document outlines the dependencies and integrations between the Workforce module and the broader GoMyTruck Logistics backend (`server/`). 

## 1. Authentication & Identity
- **Model:** Modifies the global `User` model, adding a specific `UserRole.WORKER`.
- **Worker Record:** A dedicated `Worker` model is mapped 1:1 to the `User` model (`userId`), holding worker-specific fields (status, rating, verification, bank details, currentLat/Lng).
- **OTP System:** 
  - Dual-writes OTP to Redis (`workforce:otp:{phone}`) and an in-memory Map. 
  - Uses FCM data messages to deliver OTPs in production (via `@modules/notifications/notification.service`). 
  - Has a hardcoded demo account override (`9999999999`).
- **Token Generation:** Reuses the common `jsonwebtoken` utility for JWT Access/Refresh tokens and stores refresh tokens in the central `RefreshToken` table.

## 2. Jobs & Bookings
Workforce ties into two separate paradigms:
- **Standard Bookings:** Ties into the core `Booking` model where `laborRequired: true`. Uses `JobAssignment` to map workers to standard bookings. Payouts are calculated dynamically by splitting `laborCharge` across the number of `laborersCount`.
- **Gig Jobs:** A dedicated `GigJob` model for pure manpower/workforce tasks without a traditional transport load. Uses `GigAssignment` to map workers.
- **Assignment Logic:** 
  - Both `JobAssignment` and `GigAssignment` statuses use the Prisma enum `WorkerJobStatus`.
  - Transactional locking is used extensively in `workforce.service.ts` to prevent over-subscription to a single job/booking.

## 3. Real-Time & Location Tracking
- **Redis Caching:** Worker locations are cached in Redis under `worker:location:{workerId}` with a 60-second TTL.
- **Database Snapshot:** Snapshots location to `Worker.currentLat/Lng` in the database every 30 seconds using a Redis NX lock.
- **Socket.IO Integration:** Heavy usage of `@shared/socket/socket.instance` helper methods:
  - `emitToWorkerRoom('admin', ...)` for SOS alerts.
  - `emitToBookingRoom({bookingId}, ...)` for dispatch signals (`worker_arrived`, `worker_started`, `worker_completed`, `workers_fully_assigned`).

## 4. Wallet & Payments (RazorpayX)
- **Worker Wallets:** Dedicated `WorkerWallet` and `WorkerWalletTransaction` tables for internal ledger management.
- **Commissions:** Computes a `WORKFORCE_COMMISSION_RATE` (default 15%) locally before crediting the worker. 
- **Outbound Payouts:** 
  - Withdrawals enforce the `@shared/payments/outbound-payment.policy` (`assertRazorpayXPayoutsEnabled()`). 
  - Creates a `WithdrawalRequest` which acts as the source of truth for transferring funds to worker bank accounts. 
  - Initiates the RazorpayX auto-payout via `@modules/driver-wallet/driver-wallet.service` (`processWithdrawalViaRazorpayX`).

## 5. Gamification & Notifications
- **Badges/Gamification:** Delegates to `@modules/gamification/gamification.service` (`getBadgesForWorker`).
- **FCM Push Notifications:** Interacts with `@modules/notifications/notification.service` for sending OTPs, Job Confirmations, Completion OTPs, and Payment confirmations directly to device tokens.
- **In-App Notifications:** Uses `@modules/notifications/inapp.notification.service` (`createNotification`) to emit notifications to customers when a worker completes a job or requests a completion OTP.

## 6. Safety & SOS
- **Tickets:** Triggering an SOS creates a standard `SupportTicket` assigned to the admin.
- **Admin Alerts:** Broadcasts `sos_alert` via real-time sockets to the `admin` room so fleet managers/admins receive the alert immediately.

## 7. Data Models (Prisma)
Key Prisma models actively queried or mutated by the Workforce module:
- `User`
- `Worker`
- `WorkerDocument`
- `JobAssignment`
- `GigJob`
- `GigAssignment`
- `Booking`
- `WorkerWallet`
- `WorkerWalletTransaction`
- `WithdrawalRequest`
- `SupportTicket`
- `Announcement` (Filtered by `target: 'WORKFORCE'`)
