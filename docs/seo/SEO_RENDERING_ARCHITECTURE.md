OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# SEO RENDERING ARCHITECTURE

This document defines the exact rendering model for all current and future page families in the Metro Mitra property.

## 1. Evergreen Pages (e.g., Homepage, Static Hubs)
**Architecture:** Build-time static prerendering (SSG).
**Implementation:** Generated via Vite SSR into pure static HTML files during the CI/CD build process. Served by Nginx.
**Result:** 100% crawler-visible and human-visible HTML. Zero reliance on client-side JavaScript for initial content or SEO metadata.

## 2. Programmatic Role & Location Pages (e.g., `/jobs/[role]/[location]`)
**Architecture:** Build-time static prerendering (SSG) with Data-Driven Regeneration.
**Implementation:** The page factory script will fetch verified structured data from the backend during the build phase. Pages are only generated if they meet the configurable indexability threshold (evidence model). The output is pure static HTML.
**Result:** Safe, scalable, and impossible to drift into cloaking. The factory is NOT dependent on hardcoded `pages.js` arrays; it pulls valid permutations from the database.

## 3. Individual Live Jobs (e.g., `/jobs/detail/[job-id]`)
**Architecture:** Server-Side Rendering (SSR) or Request-Time Prerendering.
**Implementation:** Since active gig jobs are highly dynamic, these will either be handled by an Edge/Lambda function (request-time rendering) or fetched dynamically and rendered using a proper SSR framework on the Node backend if implemented. If deployed as static, a fallback dynamic crawler-proxy (like Rendertron, only if absolutely necessary and strictly without cloaking) or an On-Demand Revalidation mechanism must be used to guarantee Googlebot sees the exact same JobPosting HTML as humans.
**Result:** Guarantees crawlable HTML and correct HTTP status (200, 404, or 410) without fake content.
