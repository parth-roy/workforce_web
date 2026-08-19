# FRONTEND BACKEND DEPENDENCY REGISTRY

This document logs all theoretical frontend-to-backend API dependencies discovered during the UI development phases. It does not mean these APIs are implemented.

## F3 Dependencies: Individual Hirer

| Feature              | Required Backend Data/Capability  | Future API          | Status |
| -------------------- | --------------------------------- | ------------------- | ------ |
| Service Catalog      | Service + audience + role mapping | GET services        | Future |
| Service availability | Location supply                   | GET availability    | Future |
| Request creation     | Work Request                      | POST work-requests  | Future |
| Pricing              | Pricing response                  | Future pricing API  | Future |
| Matching             | Workforce matching                | Future matching API | Future |

## F4 Dependencies: Contractor Experience (Refined in F4.2)

| Frontend Concept   | Required Backend Capability     | Future Domain      |
| ------------------ | ------------------------------- | ------------------ |
| Requirement Type   | Workforce requirement taxonomy  | Workforce          |
| Service Category   | Service catalog                 | Workforce          |
| Multiple Roles     | Role requirements               | Workforce          |
| Per-role shifts    | Role-specific scheduling        | Workforce          |
| Global shift       | Request-level scheduling        | Workforce          |
| Role quantity      | Quantity per role               | Workforce          |
| Worksite           | Deployment location             | Workforce          |
| Duration           | Work duration/recurrence        | Workforce          |
| Requirements       | Job requirements                | Workforce          |
| Contractor Profile | Contractor organization/profile | Identity/Workforce |
| Saved Worksites    | Contractor locations            | Workforce          |
| Request History    | WorkRequest history             | Workforce          |

## F5 Corporate Dependencies

| Frontend Concept        | Backend Capability     | Future Domain      |
| ----------------------- | ---------------------- | ------------------ |
| Organization            | Organization entity    | Identity/Workforce |
| Membership              | User-role relationship | Identity           |
| Corporate locations     | Organization locations | Workforce          |
| Multi-location request  | WorkRequest            | Workforce          |
| Multi-role requirements | Role requirements      | Workforce          |
| Shift strategy          | Scheduling             | Workforce          |
| Recurrence              | Scheduling             | Workforce          |
| Request history         | WorkRequest history    | Workforce          |
| Dashboard data          | Workforce read model   | Workforce          |
| Reports                 | Workforce analytics    | Workforce          |
