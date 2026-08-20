# Database Gap Matrix: Individual Hiring (`GigJob`)

## Overview
This document compares the existing `GigJob` schema in `schema.prisma` against Individual Hiring requirements.

## Evaluation

| Requirement / Concept | Current `GigJob` Field(s) | Classification | Notes |
| :--- | :--- | :--- | :--- |
| **Individual Hirer** | `customerId` | Existing | References `User` model. |
| **Service / Role** | `gigType`, `gigCategory`, `description` | Existing | `gigCategory` uses GigSkill codes (e.g. HELPER). |
| **Workers Needed** | `workersNeeded` | Existing | integer default 1 |
| **Location** | `locationLat`, `locationLng`, `locationAddress`, `locationZone` | Existing | Adequate for geolocation and routing. |
| **Schedule (Date/Time)** | None | **Missing** | There is no `scheduledStartTime` or `scheduledDate`. We only have `urgency` (IMMEDIATE, SCHEDULED, etc.) and `createdAt`. |
| **Duration** | `durationHours` | Existing | |
| **Pricing** | `totalFare`, `perWorkerRate`, `fareBreakdown` | Existing | Contains full fare breakdown and payout rates. |
| **Platform Revenue** | `platformFee` | Must remain internal | Should not be exposed directly to workers or customers. |
| **Payment Status/Method**| `paymentStatus`, `paymentMethod`, `razorpayOrderId` | Existing | Follows platform payment standards. |
| **Status** | `status` | Existing | Enums: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED |
| **OTP / Verification** | `completionOtp` | Existing | Used for job completion. |
| **Assignments** | `assignments` | Derived / Relation | Handled via `GigAssignment` for mapping specific workers. |

## Conclusion
The `GigJob` model covers almost all basic requirements for Individual Hiring, with pricing, location, and role definitions well-structured. However, it is **missing a scheduled start time**. While it has an `urgency` field that supports "SCHEDULED", it lacks the actual timestamp for when the scheduled job should begin. This is a critical gap for scheduling.
