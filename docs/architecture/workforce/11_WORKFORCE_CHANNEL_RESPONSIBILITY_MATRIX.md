# 11: Workforce Channel Responsibility Matrix

This document outlines the allocation of responsibilities and capabilities across the various client applications and the backend infrastructure within the Parther Logistics Platform, specifically focusing on the Workforce domain.

## Channels

1. **Workforce App (Flutter)**: Mobile application used by drivers, helpers, and laborers on the field.
2. **Workforce Web (React/Vite)**: Desktop/mobile browser interface for workforce users (e.g., fleet owners managing their workforce, or laborers accessing via shared devices).
3. **Admin Web (TanStack Start)**: Internal back-office panel used by operations to manage users, approvals, and system parameters.
4. **GoMyTruck Backend (Node.js)**: The core centralized backend service that enforces business rules and state transitions.

## Responsibility Matrix

| Capability / Feature Area | Workforce App (Flutter) | Workforce Web (React) | Admin Web (Internal) | Backend Server |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication & AuthZ** | UI for OTP, token storage | UI for OTP, token storage | Admin SSO / Credentials | Generate OTP (MSG91), Validate, Issue JWTs |
| **Profile & Onboarding** | Capture KYC docs, camera | Upload KYC docs | Verify, Reject, Approve KYC | Store data securely (S3), State management |
| **Job Discovery & Matching** | Map-based live view | List/Grid view, Search | Assign jobs manually | Geospatial queries, Dispatch engine, Rules |
| **Job Bidding & Acceptance** | Submit bids, Accept terms | Submit bids, Accept terms | Monitor bidding process | Concurrency control, Bid evaluation, Awards |
| **Live Tracking & State** | Background GPS tracking | Manual status updates | Real-time map oversight | Socket.IO tracking, Status state machine |
| **Task Execution / POD** | Camera (POD), E-signature | Upload POD images | Review PODs/Invoices | Validate inputs, trigger next booking state |
| **Earnings & Wallet** | View ledger, Request withdrawal | View ledger, Request withdrawal | Approve/Retry payouts | Ledger logic, RazorpayX API, Balance checks |
| **Push Notifications** | Receive FCM push | Receive Web Push | Trigger manual alerts | Eventbus listeners, Firebase Admin logic |
| **Offline Capabilities** | Local SQLite caching, Sync | Basic caching (Service Worker) | N/A | Conflict resolution, Sync endpoints |
| **Performance Analytics** | View individual stats | View historical metrics | Aggregate reports | Data aggregation, Read-replica queries |

## Key Design Principles

1. **Thin Clients, Thick Backend**: Business rules (e.g., `booking.transition.ts`) are strictly enforced on the backend. Clients only render state and submit intents.
2. **Channel-Specific UX**: The mobile app focuses on real-time, GPS-heavy, on-the-go actions. The web portal focuses on broader management, detailed history, and accessibility.
3. **Unified API Surface**: Both Workforce App and Workforce Web consume the same backend API contracts where possible to reduce maintenance.
