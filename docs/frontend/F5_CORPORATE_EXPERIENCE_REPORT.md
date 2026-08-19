# F5 CORPORATE EXPERIENCE REPORT

## 1. Corporate Landing Page
Implemented `/for-companies/` as a dedicated B2B enterprise landing page. It is structured to communicate Metro Mitra's capability to handle multi-location, multi-role workforce procurement at an organizational level. Unverified SLA or volume claims were strictly avoided.

## 2. Organization Model
The frontend prototype introduces a conceptual `CorporateWorkspace` tied to an `Organization` (e.g. "Acme Logistics Corp (Demo)"). This context wraps the builder, communicating that requirements belong to an entity rather than an individual.

## 3. Membership Model
The UI acknowledges the difference between organizations and members (roles like Admin, Hiring Manager) conceptually through the future dashboard preview, establishing the groundwork for future RBAC/Identity features.

## 4. Multi-Location Model
The `CorporateWorkforceRequirementBuilder` supports dynamically adding multiple operational locations to a single requirement context. The UX clearly separates "Location A" from "Location B", allowing users to plan distributed workforce demand in one flow.

## 5. Multi-Role Model
Roles are nested *within* locations (`locations[].roles[]`). A user can select "Warehouse Helper x 10" for Location A, and "Loader x 5" for Location B. The UI utilizes accessible increment/decrement patterns.

## 6. Shift Strategy
The shift model is bound per-role per-location (`locations[].roles[].shift`), providing the granularity needed for complex enterprise scheduling. The UI allows users to easily map standard presets (Day, Night, Morning, Evening, Custom/Rotating) directly to specific role cohorts.

## 7. Duration / Recurrence
Duration is currently modeled at the request level with conceptual options like "Temporary", "Recurring", and "Ongoing" to support the reality of structural enterprise staffing over transactional gig work.

## 8. Corporate Request Builder
The 7-step builder provides a focused, step-by-step wizard:
1. Organization Context
2. Workforce Solution
3. Multi-Location Planning
4. Roles & Quantities per Location
5. Shift Strategy
6. Duration & Recurrence
7. Additional Requirements
8. Review & Submit

## 9. Corporate Workspace Preview
Created a structural, non-interactive shell (`CorporateWorkspacePreview.jsx`) that previews how active requests, locations, and reporting will look in the authenticated dashboard. It utilizes placeholders instead of fake metrics.

## 10. Components
Created reusable components in `src/components/corporate`:
- `CorporateHero`
- `CorporateUseCases`
- `CorporateProcess`
- `CorporateWorkforceRequirementBuilder`
- `CorporateWorkspacePreview`

## 11. Responsive QA
The layout flexes gracefully from 360px up to 1440+ px. The builder adopts a vertical stack on mobile while expanding into comfortable rows for multi-location editing on desktop.

## 12. Accessibility
Applied `aria-live`, `role="radio"`, `role="progressbar"`, explicit `<label>` bindings, and clear focus rings across the builder to ensure keyboard and screen-reader usability.

## 13. SSR/Static-Render Test
Added `/for-companies` to `scripts/test-ssr.js`. It renders perfectly through `StaticRouter` without hydration errors or browser-only dependencies crashing the Node environment.

## 14. Build / Static Analysis
- `npx oxlint .` passed (some unused imports in other files remain, but no errors).
- `npm run build` executed successfully.

## 15. Backend Dependencies
Logged 10 enterprise domain concepts (Organization, Membership, Multi-location request, Dashboard data, etc.) into `docs/frontend/11_FRONTEND_BACKEND_DEPENDENCY_REGISTRY.md`.

## 16. Remaining Work for F6
Phase F6 (SEO / GEO / Final Verification) will involve establishing the HTML document head, structured data (JobPosting schemas), meta tags, canonical URLs, and ensuring the architectural separation of public landing pages vs authenticated routes is crawler-optimized.

## F5.1 Route Integrity
The `AppRouter.jsx` was restored to include the complete approved route tree, ensuring that earlier route families (Worker, Hirer, B2B) are not accidentally overwritten by later phases.

## Final Route Tree
Created `docs/frontend/02_ROUTE_ARCHITECTURE.md` to permanently document the cumulative, authoritative route tree.

## Route Contract Test
Created `scripts/test-routes.js` to parse `AppRouter.jsx` and enforce that all foundational `<Route path="...">` declarations remain present.

## Demo Data Safety
Ensured that the demo context ("Acme Logistics Corp (Demo)") is explicitly marked as "(Demo)" and is clearly scoped to avoid leaking into SEO output or schema context.

## Workspace Preview Correction
Removed realistic-looking operational data from `CorporateWorkspacePreview.jsx`. Replaced active deployments and pending states with neutral empty states stating "No live requests connected yet" and "Workspace location management will appear after backend integration". "Future" and "Planned" terminology was normalized.

## SSR Test Clarification
Corrected earlier statements: StaticRouter SSR render passed successfully. Browser hydration remains part of final browser QA.

## Build/Static Analysis
- `node scripts/test-routes.js` passed.
- `node scripts/test-ssr.js` passed against a full 14-route matrix.
- `npx oxlint .` completed without errors.
- `npm run build` executed successfully.

## Remaining Limitations
The corporate frontend relies completely on a prototype store. Backend logic for enterprise RBAC, multi-location deployment, multi-shift fulfillment, and dynamic dashboard analytics will be required in future non-frontend phases. SEO integration for public B2B landing pages remains outstanding for Phase F6.
