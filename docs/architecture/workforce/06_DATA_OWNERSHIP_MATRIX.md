# Data Ownership Matrix

This document outlines the data ownership boundaries between the core GoMyTruck logistics platform and the Workforce module, based on the `server/prisma/schema.prisma` audit.

## Shared Core (Identity & Foundation)
These models are agnostic to the domain and serve as the foundational identity and utility layer.
- `User` (Root identity for Customer, Driver, FleetOwner, and Worker)
- `RefreshToken`
- `SavedAddress`
- `GstDetail`
- `WithdrawalRequest` (Used by Driver, Fleet, and Worker)
- `ProcessedWebhook`
- `CashCollectionRecord`

## GoMyTruck Domain (Logistics & Fleet)
Owned by the logistics and freight marketplace bounded context.
- **Driver & Vehicle**: `Driver`, `Vehicle`, `DriverDocument`, `DriverEarning`, `DriverWallet`, `DriverWalletTransaction`, `DriverSubscription`, `VerificationLog`
- **Fleet Management**: `FleetOwner`, `FleetTruck`, `FleetDriver`, `TruckAssignment`, `FleetTruckUsage`, `FleetWallet`, `FleetWalletTransaction`, `FleetEarning`, `FleetMaintenance`, `FleetFuelLog`, `FleetTruckDocument`
- **Bookings**: `Booking`, `BookingStop`, `BookingLocationHistory`
- **Private Marketplace**: `BidWindow`, `MarketplaceBid`, `BidRevision`, `BidMessage`, `BidAward`, `Bid` (Legacy)
- **Customer Finance & Rewards**: `Wallet`, `WalletTransaction`, `CoinBalance`, `CoinTransaction`, `ScratchCard`
- **Pricing Engine**: `VehicleTypePricing`, `PricingConfig`, `PricingAuditLog`, `DriverPayoutSubsidy`
- **Support & Config**: `SupportTicket`, `SupportMessage`, `WebContactMessage`, `ServiceabilityConfig`, `Announcement`, `UserNotification`, `RecentSearch`, `TeamMember`

## Workforce Domain (Labor & Enterprise HR)
Owned by the workforce, gig management, and enterprise B2B bounded context.
- **Worker Identity**: `Worker`, `WorkerDocument`, `WorkerWallet`, `WorkerWalletTransaction`
- **Engagement & Training**: `Badge`, `WorkerBadge`, `TrainingCourse`, `WorkerTrainingProgress`
- **Gig Marketplace**: `GigJob`, `GigAssignment`, `GigPricingConfig`, `Lead`
- **Enterprise / Organization Structure**: 
  - `Organization`, `OrganizationMembership`, `OrganizationMembershipInvitation`
  - `OrganizationBranch`, `OrganizationDepartment`, `OrganizationTeam`
  - `OrganizationDesignation`, `OrganizationEmploymentType`, `OrganizationEmploymentAssignment`
- **Workforce Scheduling**: 
  - `WorkScheduleTemplate`, `WorkScheduleTemplateVersion`, `ScheduleAssignment`
  - `ShiftGenerationJob`, `ShiftInstance`, `ShiftOverride`, `ShiftTimelineEvent`
- **Compliance (Event-Sourced)**: 
  - `WorkerCompliance`, `WorkerComplianceDashboard`, `WorkerCredential`
  - `ComplianceExemption`, `VerificationAudit`, `ComplianceEvent`
- **Performance (Event-Sourced)**: 
  - `WorkerPerformanceCycle`, `WorkerObjective`, `KeyResult`, `ManagerEvaluation`
  - `WorkerPerformanceDashboard`, `PerformanceScoringPolicy`, `WorkerAdherenceReadModel`, `PerformanceEvent`
- **Time Tracking & Presence (Event-Sourced / CQRS)**: 
  - `TimeTrackingOutbox`, `CommandInbox`, `WorkerAttendanceEvent`
  - `WorkerPresence`, `ProjectionCheckpoint`

## Cross-Domain Integrations
Where the domains overlap and reference each other.
- **`JobAssignment`**: Links `Booking` (GoMyTruck) to `Worker` (Workforce). Used when a logistics booking requires manual loading/unloading labor.
- **`User` relations**: While `User` is shared, the extensions (`Driver`, `FleetOwner`, `Worker`) belong strictly to their respective domains.
- **`GigJob`**: Links an underlying customer `User` to `GigAssignment`s fulfilled by `Worker`s, circumventing the standard logistics `Booking`.
