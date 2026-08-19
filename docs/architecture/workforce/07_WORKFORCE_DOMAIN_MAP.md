# Workforce Domain Map

Based on the Prisma schema, the Workforce domain is composed of several distinct but interconnected subdomains.

## 1. Core Worker Identity & Lifecycle
Manages the individual worker's profile, verification, wallet, and gamification.
- **Entities**: `Worker`, `WorkerDocument`, `WorkerWallet`, `WorkerWalletTransaction`
- **Gamification & Engagement**: `Badge`, `WorkerBadge`, `TrainingCourse`, `WorkerTrainingProgress`
- **Responsibilities**: KYC (Digilocker Aadhaar/PAN integration), onboarding, skill/capacity declarations, and basic payout information.

## 2. Gig & Job Execution
Manages the routing and completion of actual work items. Split into two main flows:
- **Logistics Loading/Unloading**: `JobAssignment` (connects a GoMyTruck `Booking` to a `Worker`).
- **Standalone Gig Jobs**: `GigJob`, `GigAssignment`, `GigPricingConfig`. These are standalone jobs requested directly by a customer (e.g., helpers, furniture movers).
- **Leads**: `Lead` (for onboarding new workers/businesses).

## 3. Organization & Structure (Enterprise/B2B)
Manages the structure for enterprise clients, agencies, and vendors that supply or manage workforce personnel.
- **Hierarchy Models**: `Organization`, `OrganizationBranch`, `OrganizationDepartment`, `OrganizationTeam`
- **Role Management**: `OrganizationDesignation`, `OrganizationEmploymentType`
- **Memberships**: `OrganizationMembership`, `OrganizationMembershipInvitation`, `OrganizationEmploymentAssignment`
- **Responsibilities**: Role-based access, structural hierarchy for scheduling, and tracking employment types (Gig, Contractor, Full-Time).

## 4. Scheduling & Shifts
Manages workforce planning, shift generation, and execution.
- **Templates**: `WorkScheduleTemplate`, `WorkScheduleTemplateVersion`, `ScheduleAssignment`
- **Instances & Lifecycle**: `ShiftGenerationJob`, `ShiftInstance`, `ShiftOverride`, `ShiftTimelineEvent`
- **Responsibilities**: Generating shifts based on templates, handling overrides (sick leave, shift changes), and tracking the timeline of a shift lifecycle.

## 5. Compliance & Credentials (Event-Sourced)
Tracks regulatory compliance, medical clearances, and background checks.
- **Aggregates**: `WorkerCompliance`, `WorkerCredential`, `ComplianceExemption`
- **Auditing & Events**: `VerificationAudit`, `ComplianceEvent`
- **Projections**: `WorkerComplianceDashboard`
- **Responsibilities**: Expiry tracking, automated/manual verification of credentials, and policy-based compliance snapshots.

## 6. Performance Management (Event-Sourced)
Evaluates worker performance across operational cycles.
- **Cycles & Goals**: `WorkerPerformanceCycle`, `WorkerObjective`, `KeyResult`
- **Evaluation & Adherence**: `ManagerEvaluation`, `WorkerAdherenceReadModel`, `PerformanceScoringPolicy`
- **Events & Dashboards**: `PerformanceEvent`, `WorkerPerformanceDashboard`
- **Responsibilities**: Tracking adherence metrics (on-time, attendance), OKRs, and manager feedback (encrypted).

## 7. Attendance & Presence (Event-Sourced / CQRS)
Real-time tracking of worker location and clock-in/out state.
- **Events & Outbox**: `WorkerAttendanceEvent`, `TimeTrackingOutbox`, `CommandInbox`
- **Projections**: `WorkerPresence`, `ProjectionCheckpoint`
- **Responsibilities**: Scalable ingestion of device time/location, deriving current presence status, and tracking work context (e.g., which branch/site).

## Architectural Patterns Observed
1. **Event Sourcing**: Heavily used in Compliance, Performance, and Attendance subdomains (using `eventId`, `aggregateId`, `eventType`, `payload` JSON).
2. **CQRS / Projections**: Usage of read models like `WorkerPresence`, `WorkerComplianceDashboard`, and `ProjectionCheckpoint`.
3. **Immutable Snapshots**: JSON snapshots taken at generation time (e.g., `scheduleSnapshot`, `assignmentSnapshot` in `ShiftInstance`) to decouple historical data from current template changes.
4. **Crypto-Shredding Prepared**: Events store payloads in JSON which implies encryption for PII/feedback (noted in schema comments).
