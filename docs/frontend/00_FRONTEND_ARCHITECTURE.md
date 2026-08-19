OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# Frontend Architecture

## 1. Overview
The `workforce_web` frontend is built with a strong emphasis on SEO, performance, and maintainability. It leverages a data-driven architecture to rapidly generate targeted landing pages for both B2C (workers) and B2B (employers) audiences.

## 2. Tech Stack
- **Framework:** React 19 (via Vite)
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v3
- **Icons:** Lucide React
- **SEO Management:** React Helmet Async
- **Build Tool:** Vite with custom sitemap generation

## 3. Core Principles
- **Data-Driven Routing & Rendering:** Pages are configured in `src/data/pages.js` rather than hardcoded. The `App.jsx` router dynamically maps configurations to specific templates (`WorkerPageTemplate`, `EmployerPageTemplate`, `DualPageTemplate`).
- **Component Reusability:** The UI is constructed from reusable "sections" (e.g., `HeroSection`, `HowItWorks`) that are agnostic to the page data, enabling rapid assembly of new landing pages.
- **SEO-First Design:** Every page injects custom metadata, canonical URLs, and structured data (JSON-LD Schema) through a dedicated `<SEO />` component.
- **Responsive & Accessible App Shell:** A unified `Layout` component provides the persistent navigation (Header, Footer, WhatsApp widget) across all views.

## 4. State Management
Given the static and read-heavy nature of the landing pages, complex state management (e.g., Redux, Zustand) is omitted. 
- Global UI states (like mobile menu toggles) are managed via local React state (`useState`) within the `Header` component.
- Page-level data is statically passed down via props from the router's configuration map.

## 5. Performance Strategy
- **Asset Optimization:** Minimal reliance on heavy third-party libraries. Images should be served in modern formats (WebP).
- **Tailwind JIT:** Utility classes ensure minimal CSS bundle size.
- **Route Definitions:** Kept lightweight. Future considerations include implementing React Lazy/Suspense for route-level code splitting if the bundle grows.
