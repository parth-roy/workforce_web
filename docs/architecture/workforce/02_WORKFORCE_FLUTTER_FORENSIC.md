# Workforce Flutter App Forensic Audit

## Overview
A read-only forensic audit of the `workforce` Flutter app directory (`d:/Projects/Parther_Technologies/logistic/workforce/lib`) was conducted. The application is a multi-persona Flutter application handling several different user types within a single codebase.

## 1. App Personas & Routing
The app relies on `go_router` and local storage (`SecureStorage`) to route users to different experiences based on their `hirerType`.
- **Individual Hirer**: Navigated to `/individual-hirer-home` (`HirerMainLayout`).
- **Employee/Worker**: Navigated to `/home` (`MainLayout`).
- **Corporate**: Navigated to `/corporate/home` (`CorporateMainLayout`).
- **Contractor / Manpower Supplier**: Navigated to `/contractor/home` (`ContractorMainLayout`).

## 2. UI and State Management
- **State Management**: The app uses Riverpod for state management.
- **Mock Data**: Most of the service booking workflow (especially for the Individual Hirer) is entirely UI-driven with hardcoded mock data.
  - Images use `https://picsum.photos` placeholders.
  - Ratings, reviews, and prices are static strings hardcoded into the widget trees.
- **Form Actions**: 
  - Posting a gig (`hirer_gig_post_screen.dart`) creates a dummy gig payload and inserts it directly into Riverpod state (`hirerGigsProvider.notifier.addDummyGig`) rather than making a network request via `ApiClient`.
  - Simulates network delays using `Future.delayed`.

## 3. Navigation Workflows
Navigation between categories is hardcoded via string matching rather than dynamic ID-based routing. For example, in `IndividualHirerHomeScreen`:
```dart
if (service['title'] == 'Electrician') {
  Navigator.push(context, MaterialPageRoute(builder: (context) => const ElectricianCategoryScreen()));
} else if (service['title'] == 'Plumber') {
  Navigator.push(context, MaterialPageRoute(builder: (context) => const PlumberCategoryScreen()));
}
```
If a category doesn't have a dedicated screen, it uses a BottomSheet (e.g., `PainterSelectionBottomSheet`).

## 4. Conclusion
The current state of the workforce Flutter app's hiring modules is primarily a static prototype or mockup. It does not integrate with the backend API for fetching service catalogs, dynamic pricing, or submitting job requests (for the gig posting feature).
