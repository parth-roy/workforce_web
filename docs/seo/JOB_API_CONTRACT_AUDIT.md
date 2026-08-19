OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# JOB API CONTRACT AUDIT

Before implementing the final JobDetail page, the actual backend API (Prisma Schema `GigJob`) was audited to ensure no fake or hallucinated JobPosting data is used.

## Backend Schema Analysis (`GigJob`)

| SEO Requirement | Backend Field | Status / Mapping |
|---|---|---|
| **Job ID** | `id` (uuid) / `jobNumber` | **Present.** Map to `jobNumber` for URLs. |
| **Title** | `gigCategory` & `description` | **Present.** Formulated from category. |
| **Employer** | `customer` (User relation) | **Present.** Map to Customer Name/Company. |
| **Location** | `locationLat`, `locationLng`, `locationAddress`, `locationZone` | **Present.** Map to Address schema. |
| **Description** | `description` | **Present.** |
| **Date Posted** | `createdAt` | **Present.** Map to `datePosted`. |
| **Expiration / Deadline** | **NONE** | **MISSING.** The backend does not support an expiration date. `validThrough` MUST be omitted in schema. |
| **Compensation** | `perWorkerRate` | **Present.** Map to `baseSalary`. |
| **Employment Type** | N/A (Implicit gig) | **Present.** Map to `CONTRACTOR` or `PART_TIME`. |
| **Status** | `status` (`GigJobStatus`) | **Present.** Drives indexability (e.g. `PENDING` vs `COMPLETED`). |
| **Filled State** | `assignments` | **Present.** Used to trigger 410 or removal. |
| **Updated Timestamp** | `updatedAt` | **Present.** |

## Conclusion & Blockers
The backend natively supports almost all required fields for a valid `JobPosting` structured data object, **except** `expiration / deadline`.
**Action:** Do NOT invent salary, location, dates, or employer details. The `validThrough` property will be explicitly omitted from all schemas in compliance with Google's guidelines for postings with no known expiration date.
