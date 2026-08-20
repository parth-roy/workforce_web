# RESEARCH BLUEPRINT REQUIREMENT TRACEABILITY

| Research Requirement | Implemented Frontend Mechanism | Current Status | Validation | Backend Dependency | Remaining Work |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clean Canonical URLs** | `canonicalUrl` explicitly mapped via `pageMetadata.js` factory pattern. | Complete | `test-ssr.js` & Matrix | None | N/A |
| **No Indexing of Search/Filters** | Blocked via `robots.txt` patterns (Crawl control). Search parameters do not affect canonicals (Indexability). | Complete | `robots.txt` / Sitemap generator | None | N/A |
| **Semantic Entity Definition** | `<EntityDefinition>` component strictly asserts identity without negative branding. | Complete | `test-geo-content.js` | None | N/A |
| **H1 Heading Hierarchy** | Every public route enforces exactly one primary `H1` matching user intent. | Complete | `test-geo-content.js` | None | N/A |
| **Structured Data** | `react-helmet-async` injects dynamic JSON-LD via `schema-helpers.js`. | Complete | `test-ssr.js` | None | N/A |
| **Dynamic Sitemap** | Current sitemap generator is driven by mock/domain repository data. | Frontend Complete / Backend Pending | `test-sitemap.js` | Requires live backend evidence-driven generator | Build live sitemap API |
| **Internal Linking Architecture** | Custom `<RelatedLinks>` components map strict parent-child relationships avoiding dead ends. | Complete | `test-internal-links.js` | None | N/A |
| **Evidence-Gated Indexability** | Three-state model (`eligible`, `not-yet-eligible`, `noindex`) suppresses empty geo pages. | Frontend Complete / Backend Pending | `test-internal-links.js` | Requires live Jobs API for evidence | Connect to Prisma counts |
| **Evidence-Gated Earnings** | Earnings blocks are hidden if `publicAllowed` is false or `amount` is null. | Frontend Complete / Backend Pending | `test-geo-content.js` | Requires live Jobs API earnings | Connect to Jobs DB |
| **AI Crawler Transparency** | `llms.txt` deployed as supplementary reference; `robots.txt` allows `OAI-SearchBot`. | Complete | `robots.txt` / File check | None | N/A |
| **Core Web Vitals Readiness** | JS payload is lean; LCP images were optimized to WebP. | Partially Complete | Static Analysis | Real-world device measurement | Field testing on Vercel/Cloudflare |
| **True HTTP Status Codes (404/410)** | React Router handles 404 visually, but the network layer still serves a CDN 200 fallback. | Backend Pending | Manual Review | Requires Node/Express SSR proxy | Build SSR proxy layer |
