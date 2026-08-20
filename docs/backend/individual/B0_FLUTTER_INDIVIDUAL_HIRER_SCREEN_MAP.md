# Flutter Individual Hirer Screen Map

This document outlines the frontend screens, inputs, and backend dependencies for the Individual Hirer experience across both the Customer and Workforce applications.

## Key Findings

1. **Entry Point**: 
   - **Customer App**: Main Layout -> `/gig-workforce` (Hire Workforce).
   - **Workforce App**: Accessed via Contractor/Hirer mode -> `/hirer/gig-post`.
2. **Service Selection**: Hardcoded in both apps (e.g., Loading/Unloading, Electrician, Plumber). Maps to internal enums like `LOADER`, `ELECTRICIAN`, `HELPER`. Not API driven.
3. **Worker/Service Selection**: The user selects the category, then on the post screen selects the **quantity of workers** (1–10). There are no sub-variants of services.
4. **Location**: 
   - **Customer App**: Map Picker / Location Search (returns Lat/Lng and Address).
   - **Workforce App**: Auto-fetches current location via `Geolocator`, allows text override. No map picker.
5. **Requirement Details**: Number of Workers, Duration, Urgency, Job Location, and Special Instructions (Notes).
6. **Scheduling**: Only Duration (1, 2, 4, 8, 12 hours) and Urgency (Immediate, Within 1 Hour, Scheduled). There is no calendar date picker; scheduled hour defaults to the current hour.
7. **Pricing**: 
   - **Customer App**: Calculated via backend API (`POST /estimate/gig`), returning zone, total, worker earnings, surge, etc.
   - **Workforce App**: Fully mocked in frontend (Static calculation with base rate ₹150/hr).
8. **Submission & Status Tracking**: 
   - **Customer App**: Submits to `POST /gig/create`. On success, it simply shows a snackbar and pops to the home screen. **No active tracking screen is wired up.**
   - **Workforce App**: Mocks submission by creating a dummy object in local state (`hirerGigsProvider`) and routing to the hirer home.

## Screen Map

| Screen | App | Purpose | Inputs | Backend Dependency | Existing API | Missing API | Notes |
|---|---|---|---|---|---|---|---|
| `GigWorkforceHomeScreen` | Customer | Category selection | Category Tap | None (Hardcoded) | None | `GET /gigs/categories` | Hardcoded: LOADER, ELECTRICIAN, HELPER, CLEANER, etc. |
| `GigWorkforcePostScreen` | Customer | Job requirement & posting | Workers (1–10), Duration, Urgency, Location (Map), Notes | Pricing Engine & Gig Creation | `POST /estimate/gig`, `POST /gig/create` | Status tracking endpoints | Fetches live estimate. Submits successfully but pops to home instead of active tracking screen. |
| `HirerGigCategoryScreen` | Workforce | Category selection (for contractors) | Category Tap | None (Hardcoded) | None | `GET /gigs/categories` | Hardcoded list with 8 options including Furniture Moving, Heavy Loading, Packer. |
| `HirerGigPostScreen` | Workforce | Job requirement & posting | Workers (1–10), Duration, Urgency, Location (GPS/Text), Notes | None (Fully mocked) | None | `POST /estimate/gig`, `POST /gig/create` | Statically calculated pricing. Submission creates a dummy object in Riverpod state. |
