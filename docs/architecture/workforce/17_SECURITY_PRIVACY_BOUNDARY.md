# 17. Security & Privacy Boundary

This document outlines the security, privacy, and role separation boundaries for the Parther Logistics Workforce Ecosystem. Given the sensitivity of workforce data (PII, KYC, geolocation, and financial records), strict boundary controls are enforced.

## 1. PII and Sensitive Data Classification

Workforce data is classified into three tiers to dictate storage, access, and transmission policies:

| Data Type | Classification | Examples | Storage & Encryption | Access Rules |
| :--- | :--- | :--- | :--- | :--- |
| **High Sensitivity (PII/KYC)** | Restricted | Aadhar, PAN, Face Scans, Bank Accounts, Exact Home Address. | Encrypted at rest (AES-256). Masked in logs. | Only Auth Service & Payout Service. Zero UI exposure unless strictly needed. |
| **Medium Sensitivity** | Private | Live Location, Phone Number, Shift Schedules, Earnings, Chat History. | Standard DB encryption. Soft-deleted. | Accessible to assigned Booking participants & Support via RBAC. |
| **Low Sensitivity** | Internal | Aggregate ratings, Vehicle type, Job preferences, Availability status. | Standard storage. | Visible to marketplace matching engines and Dispatch. |

## 2. Privacy Boundaries & PII Masking

- **Customer to Workforce Privacy:** Customers cannot see a worker's exact phone number or true identity details beyond first name and vehicle/role unless an active booking exists. Number masking (via MSG91/similar call relay) is used during active trips.
- **Worker to Worker Privacy:** In multi-worker jobs, workers see only the necessary details of co-workers (e.g., first name, role) to coordinate. Earnings and personal profiles are strictly isolated.
- **Location Privacy:** Live tracking is only available to the customer and admin *during* an active job. Off-duty locations are never broadcasted to the customer app and are aggregated for fleet-level heatmaps without individual identifiers.

## 3. Role Separation (RBAC)

The workforce ecosystem relies on strict Role-Based Access Control (RBAC):

1. **Independent Driver:** Can view and bid on loads matching their vehicle. Manages own profile and earnings.
2. **Fleet Manager / Owner:** Can view all vehicles and drivers under their fleet. Can assign jobs to drivers and view aggregated fleet earnings. Cannot act as a driver unless explicitly wearing the dual-role hat.
3. **General Labour / Helper:** Restricted to viewing job details (pickup/drop, weight, goods type) and their specific payout slice. Cannot see the total booking revenue or the driver's payout unless bundled in a transparent contract.
4. **Admin / Support Agent:** Has scoped access to view active trips, intervene in disputes, and verify KYC. Cannot view plain-text bank details or raw biometric data.

## 4. Authentication & Authorization Boundaries

- **Authentication:** All workforce apps use single-use refresh tokens and short-lived JWTs. Device binding (FCM tokens + device ID) prevents session hijacking.
- **API Gateways:** The `/workforce` namespace is logically separated from `/customer` and `/fleet`. A worker JWT cannot be used to invoke customer APIs.
- **IDOR Prevention:** All endpoints affecting resource mutation (e.g., updating a bid, accepting a job) enforce strict checks ensuring `workerId` in the JWT matches the `workerId` of the resource owner.

## 5. Auditing and Compliance

- **Audit Trails:** All state transitions (e.g., booking status, payout status, bid submission) are logged in the `PricingAuditLog` or a dedicated `SecurityAuditLog`.
- **Data Deletion:** The system supports a "Right to be Forgotten" soft-deletion protocol. Workers can request account deletion, triggering a 30-day retention period for dispute resolution, followed by PII obfuscation (retaining only anonymous ledger records for financial compliance).
