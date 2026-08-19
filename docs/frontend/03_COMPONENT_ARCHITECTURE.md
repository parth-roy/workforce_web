OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# Component Architecture (Phase F1 Target)

## 1. Structural Hierarchy
The component architecture follows a strict 4-tier hierarchy to ensure separation of concerns and reusability.

### Tier 1: App Shell (`src/components/layout/`)
The foundational scaffolding of the application.
- **`Layout.jsx`**: The root layout wrapper containing the `<Outlet />` for routes, sticky header, global footer, and floating action widgets (e.g., WhatsApp).
- **`Header.jsx`**: Manages top-level navigation, mobile drawer state, and responsive behavior (transparent vs. solid backgrounds on scroll).
- **`Footer.jsx`**: Contains deep links, corporate information, and secondary CTAs.

### Tier 2: Page Templates (`src/components/pages/`)
Orchestrators that consume data configurations and map them to Section components.
- **`WorkerPageTemplate.jsx`**: Optimized for B2C conversion (job seekers).
- **`EmployerPageTemplate.jsx`**: Optimized for B2B lead generation.
- **`DualPageTemplate.jsx`**: Hybrid layout for the homepage and mixed-intent pages.

### Tier 3: Sections (`src/components/sections/`)
Large, distinct blocks of the UI that stack vertically to form a page.
- *Examples:* `HeroSection.jsx`, `HowItWorks.jsx`, `FAQSection.jsx`, `StatsBar.jsx`.
- **Target Architecture Rules for Sections:**
  - Must accept standardized props (e.g., `title`, `subtitle`, `data[]`).
  - Must be wrapped in semantic HTML (e.g., `<section>`).
  - Must internally manage their own responsive padding/margins (e.g., `py-16 sm:py-24`).
  - Should not perform data fetching; data must be passed down from the Template.

### Tier 4: UI Primitives (`src/components/ui/`)
Small, granular, highly reusable elements.
- *Examples:* `Button.jsx`, `SEO.jsx`, `Breadcrumb.jsx`.
- **Target Architecture Rules for UI Primitives:**
  - Strictly stateless (pure components).
  - Use Tailwind for styling but expose `className` overrides.

## 2. Phase F1 Target Architecture Improvements
Moving into Phase F1 (App shell, layouts, reusable scaffolding), the following architectural standards must be enforced:

1. **Standardized Section Interface:** 
   All sections must export a single default React component. They should map to the string identifiers in `pages.js` configuration arrays seamlessly.

2. **App Shell Resilience:**
   - Implement `ErrorBoundary` at the `<Layout />` or template level to prevent complete white-screens on render failures.
   - Separate the mobile navigation drawer into a discrete component (e.g., `src/components/layout/MobileMenu.jsx`) to reduce the complexity of `Header.jsx`.

3. **Design System Tokens (Tailwind):**
   - Rely strictly on `tailwind.config.js` custom colors (`trust-blue`, `action-green`).
   - Avoid arbitrary values (e.g., `bg-[#123456]`) in favor of predefined tokens to maintain brand consistency.

4. **Component Scaffolding Methodology:**
   - New components must be placed in their respective tier directories.
   - Inline styles are prohibited; utilize Tailwind classes exclusively.
