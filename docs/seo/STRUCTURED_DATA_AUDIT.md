OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# Workforce Web — Structured Data & Schema.org Forensic Audit

**Target Platform:** `workforce_web` (Metro Mitra / GoMyTruck Workforce)  
**Audit Date:** August 19, 2026  
**Auditor:** Automated Technical SEO & Schema Subagent  
**Scope:** `index.html`, `src/components/ui/SEO.jsx`, `src/components/SEO.jsx`, `src/data/schema-helpers.js`, `src/data/pages.js`, `src/data/roles.js`, and all page templates (`HomePage.jsx`, `WorkerPageTemplate.jsx`, `EmployerPageTemplate.jsx`, `DualPageTemplate.jsx`, `B2CPageTemplate.jsx`).

---

## 1. Executive Summary & Audit Scorecard

This audit provides a comprehensive inspection of all structured data (JSON-LD) implementations across the 21 routes of the `workforce_web` application.

### Audit Summary Scorecard

| Metric | Count | Details |
|---|---|---|
| **Total URLs / Routes Audited** | 21 | Homepage (`/`) + 20 SEO Landing Pages + `index.html` template |
| **Compliant Implementations** | 8 | Standard `CollectionPage` implementations with valid breadcrumbs |
| **Critical Policy Violations** | 9 | `LocalBusiness` on job category pages (3), `JobPosting` on generic pages (2), Duplicate `FAQPage` (2), Broken `SearchAction` (1), Static template conflict (1) |
| **High-Risk Schema Misapplications** | 5 | `Organization` on service/hub pages (4), `HowTo` on booking flow (1) |
| **Deprecated Schema Features** | 2 | Google Sitelinks Searchbox (`SearchAction`), Google Desktop `HowTo` Rich Results |
| **Graph Fragmentation Rate** | 100% | 100% of pages emit isolated `<script>` tags without unified `@graph` `@id` references |

---

## 2. Detailed Forensic Analysis by Schema Type

### 2.1 `LocalBusiness` Schema (CRITICAL MISAPPLICATION)

#### Where it occurs:
- `workforce_web/src/data/pages.js` (lines 195, 289, 596):
  - `/delivery-jobs-kolkata` (`name: 'Delivery Jobs Kolkata'`)
  - `/helper-jobs-kolkata` (`name: 'Helper Jobs Kolkata'`)
  - `/gig-jobs-kolkata` (`name: 'Gig Jobs Kolkata'`)
- `workforce_web/src/data/schema-helpers.js` (`createLocalBusinessSchema`, lines 79–102)
- `workforce_web/index.html` (lines 26–41)

#### Code Implementation in `schema-helpers.js`:
```javascript
export function createLocalBusinessSchema({ name, city, latitude, longitude, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name || 'Metro Mitra',
    image: `${BASE_URL}/og-default.jpg`,
    url: `${BASE_URL}${path}`,
    telephone: '+91-9331488999',
    address: {
      '@type': 'PostalAddress',
      addressLocality: city || 'Kolkata',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
    geo: latitude ? {
      '@type': 'GeoCoordinates',
      latitude,
      longitude,
    } : undefined,
    priceRange: 'Free',
    servesCuisine: undefined,
    areaServed: city || 'Kolkata',
  }
}
```

#### Deficiencies & Violations:
1. **Non-Existent Physical Establishment (Spam Signal)**: Google Search Central guidelines explicitly mandate that `LocalBusiness` structured data must only be used for physical business locations with permanent signage, physical premises where customers or clients are received, or verified local service area businesses with a physical headquarters. Declaring that a web page `/delivery-jobs-kolkata` is a `LocalBusiness` named `"Delivery Jobs Kolkata"` is a direct violation of Google's Structured Data General Guidelines and is classified as structured data spam.
2. **Missing Mandatory Attributes**: The generated `LocalBusiness` schema lacks a complete `streetAddress` and `postalCode`, contains no operating hours (`openingHoursSpecification`), has no `geo` coordinates, and provides no physical customer entrance.
3. **Artifact Leftovers**: The object contains `servesCuisine: undefined` (restaurant property) and `priceRange: 'Free'` (inapplicable to an employment aggregation page).
4. **Correct Taxonomy**: These pages are occupational category and job discovery hubs. They must be marked as `CollectionPage` or `ItemPage` with `about` / `mentions` referencing occupational categories.

---

### 2.2 `JobPosting` Schema (CRITICAL POLICY VIOLATION)

#### Where it occurs:
- `workforce_web/src/data/pages.js` (lines 406, 549):
  - `/warehouse-helper` (`title: 'Warehouse Helper'`, `baseSalary: 350`)
  - `/forklift-operator` (`title: 'Certified Forklift Operator'`, `baseSalary: 900`)
- `workforce_web/src/data/schema-helpers.js` (`createJobPostingSchema`, lines 104–138)

#### Code Implementation in `schema-helpers.js`:
```javascript
export function createJobPostingSchema({ title, description, baseSalary, city = 'Kolkata', path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted: new Date().toISOString().split('T')[0],
    validThrough: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Metro Mitra',
      sameAs: BASE_URL,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: 'West Bengal',
        addressCountry: 'IN',
      },
    },
    baseSalary: baseSalary ? {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        value: baseSalary,
        unitText: 'DAY',
      },
    } : undefined,
    url: `${BASE_URL}${path}`,
  }
}
```

#### Deficiencies & Violations:
1. **Generic Category Page vs. Real Hiring Vacancy**: Google's JobPosting guidelines strictly state: *"JobPosting markup must only be used on pages that contain a single, specific job opening. It must not be used on pages that list multiple jobs, or on pages that describe a general job category."* Pages `/warehouse-helper` and `/forklift-operator` are generic informational/marketing landing pages, not individual hiring requisitions.
2. **Rolling `new Date()` Timestamp (Algorithmic Penalty Risk)**: Setting `datePosted: new Date().toISOString().split('T')[0]` causes Googlebot to see a newly posted job every single day it crawls the page. Google actively detects and penalizes websites that use automated rolling `datePosted` timestamps to simulate fresh postings on evergreen pages.
3. **Incomplete Description (Thin Content)**: Google requires a full, detailed job description including responsibilities, qualifications, and working conditions. The current implementation passes a 5-to-10 word placeholder string (e.g. `"Verified warehouse helper gigs in Kolkata"`).
4. **Hiring Organization Identity Mismatch**: `hiringOrganization` is listed as `"Metro Mitra"`. Metro Mitra is a matchmaking platform/broker, not the direct employer hiring warehouse helpers for its own corporate entity.
5. **Missing Direct Application Mechanism**: Google requires either `directApply: true` with a functional application endpoint or detailed application instructions.
6. **Correct Taxonomy**: Generic role pages should use `WebPage` or `ItemPage` combined with Schema.org `Occupation` markup, or `CollectionPage` if representing a category of open gig opportunities.

---

### 2.3 `WebSite` & `SearchAction` Schema (OBSOLETE & BROKEN TARGET)

#### Where it occurs:
- `workforce_web/src/components/pages/HomePage.jsx` (line 21)
- `workforce_web/src/data/schema-helpers.js` (`createWebSiteSchema`, lines 34–49)

#### Code Implementation in `schema-helpers.js`:
```javascript
export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Metro Mitra',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
```

#### Deficiencies & Violations:
1. **Non-Existent Target Route (404 Error)**: The `urlTemplate` points to `https://metromitra.com/search?q={search_term_string}`. Inspection of `src/App.jsx` confirms there is **no `/search` route**. Any query submitted to this URL lands on the `NotFound` (404) view.
2. **Google Sitelinks Search Box Deprecated**: In November 2024, Google formally turned off Sitelinks Search Box support globally. Google Search Central now ignores Sitelinks Search Box markup. Having broken `SearchAction` markup creates validation warnings in Schema.org linters and violates Google's functional endpoint rule.
3. **Missing Graph Linkage**: The `WebSite` entity is not linked to the `Organization` via `publisher: { '@id': 'https://metromitra.com/#organization' }`.

---

### 2.4 `FAQPage` Schema (DUPLICATION & RESTRICTED RICH RESULTS)

#### Where it occurs:
- Direct primary schema in `pages.js`:
  - `/daily-payment-jobs` (line 243)
  - `/student-jobs` (line 312)
- Template automated injection:
  - `WorkerPageTemplate.jsx` (line 27)
  - `EmployerPageTemplate.jsx` (line 126)
  - `DualPageTemplate.jsx` (line 22)
- `schema-helpers.js` (`createFAQSchema`, lines 51–64)

#### Deficiencies & Violations:
1. **Duplicate `FAQPage` Script Emission**: On `/daily-payment-jobs` and `/student-jobs`, `page.schema` is set to `createFAQSchema(...)`, and the page template simultaneously executes:
   ```javascript
   const schemas = [page.schema].filter(Boolean)
   if (page.faqs?.length) schemas.push(createFAQSchema(page.faqs))
   ```
   This causes `SEO.jsx` to render **two identical `<script type="application/ld+json">` tags** containing the exact same `FAQPage` payload on the same page.
2. **Misrepresented Primary Entity**: Setting `@type: "FAQPage"` as the root entity tells search engines that the primary purpose of `/daily-payment-jobs` and `/student-jobs` is a reference FAQ directory, rather than a gig discovery and application portal.
3. **Google August 2023 Policy Change**: Google restricted FAQ rich results exclusively to well-known, authoritative government and health websites. Commercial platforms will not receive rich FAQ accordion snippets. FAQ content should be represented as a secondary node within a `@graph` attached to the `WebPage`, rather than superseding the primary page entity.

---

### 2.5 `HowTo` Schema (DEPRECATED & MARKETING MISUSE)

#### Where it occurs:
- `workforce_web/src/data/pages.js` (lines 495–503):
  - `/book-workers` (`name: 'How to Book On-Demand Workers with Metro Mitra'`)
- `workforce_web/src/data/schema-helpers.js` (`createHowToSchema`, lines 140–153)

#### Deficiencies & Violations:
1. **Google Deprecation of HowTo Rich Results**: In August 2023, Google completely deprecated `HowTo` rich results on desktop devices and severely restricted them on mobile.
2. **Promotional Process vs. Instructional Guide**: Google HowTo guidelines state that `HowTo` markup is intended for instructional step-by-step guides explaining how to complete a task (with required tools, supplies, and duration). Using `HowTo` for a 3-step marketing pitch ("Post Requirement" -> "AI Matches" -> "Workers Arrive") violates Google's policy against marking up promotional workflows as instructional tutorials.
3. **Correct Taxonomy**: `/book-workers` is a B2B conversion page. Its primary entity should be `Service` (with `serviceType: "On-Demand Logistics Workforce"`) or `WebPage`.

---

### 2.6 `Organization` Schema (MISPLACED PRIMARY ENTITY & DISCREPANCIES)

#### Where it occurs:
- Top-level schema in `pages.js`:
  - `/logistics-jobs` (line 383)
  - `/temporary-jobs` (line 448)
  - `/employer-hiring` (line 472)
  - `/workforce-solutions` (line 526)
- `workforce_web/src/data/schema-helpers.js` (`createOrganizationSchema`, lines 3–32)
- `workforce_web/index.html` (lines 13–24)

#### Deficiencies & Violations:
1. **Misplaced as Primary Page Entity**: On `/logistics-jobs`, `/temporary-jobs`, `/employer-hiring`, and `/workforce-solutions`, the top-level JSON-LD emitted is `@type: "Organization"`. Search engines interpret this as declaring that each of these individual sub-URLs *is* the organization itself, rather than a specific service, landing page, or industry guide published by the organization.
2. **Corporate Identity Discrepancies Across Codebase**:
   - `index.html`: `taxID: "U62099WR2026PTC293183"`, `name: "Parther Technologies Pvt. Ltd."`, `streetAddress: "Chiriyamore"`.
   - `schema-helpers.js`: `name: "Metro Mitra"`, `legalName: "Parther Technologies Pvt. Ltd."`, `foundingDate: "2022"`, `streetAddress: "Barrackpore"`, `addressLocality: "Kolkata"`.
   - `Footer.jsx`: `CIN: U62099WR2026PTC293183`.
   - Legacy `Layout.jsx`: `CIN: U60232WB2022PTC255655`.
3. **Correct Taxonomy**: Top-level `Organization` should be defined once on the Homepage or referenced via `@id: "https://metromitra.com/#organization"` in the `@graph` of subpages.

---

### 2.7 `BreadcrumbList` & `CollectionPage` Schema (UNDERUTILIZATION & DUPLICATION)

#### Where it occurs:
- `BreadcrumbList`: Generated automatically by `src/components/ui/SEO.jsx` (lines 18–29); helper in `schema-helpers.js` (lines 66–77) is dead/redundant code.
- `CollectionPage`: Used on 8 pages in `pages.js` (`/jobs-near-me`, `/loading-jobs`, `/warehouse-jobs`, `/daily-wage-jobs`, `/part-time-jobs`, `/weekend-jobs`, `/unloading-jobs`, `/truck-helper-jobs`).

#### Deficiencies:
1. **Lack of `ItemList` on Collection Pages**: While `CollectionPage` is the correct top-level type for gig category pages, current implementations omit the `mainEntity` property (`@type: "ItemList"` containing `ListItem` entries for active roles, locations, or service tiers).
2. **Missing Parent Graph References**: `CollectionPage` does not declare `isPartOf: { '@id': 'https://metromitra.com/#website' }` or `publisher: { '@id': 'https://metromitra.com/#organization' }`.

---

## 3. Comprehensive Page-by-Page Audit Matrix (All 21 URLs)

| # | Route / URL | Template | Current Primary Schema | Attached FAQs? | Current Breadcrumbs | Audit Findings & Violations | Severity | Recommended Corrective Action |
|---|---|---|---|---|---|---|---|---|
| **0** | `index.html` (Static Root) | N/A | Hardcoded `@graph`: `Organization` + `LocalBusiness` | No | None | Static JSON-LD loads on every SPA route before hydration; CIN format discrepancy (`WR` vs `WB`); competes with dynamic React Helmet schemas. | **High** | Streamline static `<head>` to basic metadata or let SSR/prerender manage JSON-LD. |
| **1** | `/` (Home) | `HomePage` | `WebSite` (with `SearchAction`) | No | None | Obsolete `SearchAction` targeting non-existent `/search` 404 URL; missing root `Organization` linkage. | **Critical** | Remove `SearchAction`; declare unified `@graph` with `WebSite` and `Organization`. |
| **2** | `/jobs-near-me` | `worker` | `CollectionPage` | Yes | Home > Jobs Near Me | Valid type; lacks `ItemList` of gig categories; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **3** | `/loading-jobs` | `worker` | `CollectionPage` | Yes | Home > Loading Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **4** | `/delivery-jobs-kolkata` | `worker` | `LocalBusiness` (`name: 'Delivery Jobs Kolkata'`) | Yes | Home > Delivery Jobs | **CRITICAL MISAPPLICATION**: Job category page labeled as physical business; missing street address/geo; `servesCuisine: undefined` artifact. | **Critical** | Replace `LocalBusiness` with `CollectionPage` (Local Delivery Hub) + `ItemList`. |
| **5** | `/warehouse-jobs` | `worker` | `CollectionPage` | Yes | Home > Warehouse Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **6** | `/daily-payment-jobs` | `worker` | `FAQPage` (Primary) | Yes | Home > Daily Payment Jobs | **CRITICAL MISAPPLICATION & DUPLICATION**: Primary schema is `FAQPage` AND template injects duplicate `FAQPage` script; wrong primary entity. | **Critical** | Change primary schema to `CollectionPage`; merge FAQs into single `@graph`. |
| **7** | `/daily-wage-jobs` | `worker` | `CollectionPage` | Yes | Home > Daily Wage Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **8** | `/helper-jobs-kolkata` | `worker` | `LocalBusiness` (`name: 'Helper Jobs Kolkata'`) | Yes | Home > Helper Jobs | **CRITICAL MISAPPLICATION**: Job category page labeled as physical business; spam signal under Google LocalBusiness guidelines. | **Critical** | Replace `LocalBusiness` with `CollectionPage` (Helper Roles Hub) + `ItemList`. |
| **9** | `/student-jobs` | `worker` | `FAQPage` (Primary) | Yes | Home > Student Jobs | **CRITICAL MISAPPLICATION & DUPLICATION**: Primary schema is `FAQPage` AND template injects duplicate `FAQPage` script. | **Critical** | Change primary schema to `CollectionPage`; merge FAQs into single `@graph`. |
| **10** | `/part-time-jobs` | `worker` | `CollectionPage` | Yes | Home > Part-Time Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **11** | `/weekend-jobs` | `worker` | `CollectionPage` | Yes | Home > Weekend Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **12** | `/logistics-jobs` | `dual` | `Organization` | Yes | Home > Logistics Jobs | **MISAPPLICATION**: Industry overview / role hub labeled as top-level `Organization`. | **High** | Change primary schema to `WebPage` / `CollectionPage` referencing `Organization` as publisher. |
| **13** | `/warehouse-helper` | `worker` | `JobPosting` (`title: 'Warehouse Helper'`) | Yes | Home > Warehouse Jobs > Helper | **CRITICAL POLICY VIOLATION**: Generic marketing page marked as `JobPosting`; rolling `new Date()` datePosted; thin 5-word description. | **Critical** | Replace `JobPosting` with `ItemPage` / `Occupation` schema (`Warehouse Helper`). |
| **14** | `/unloading-jobs` | `worker` | `CollectionPage` | Yes | Home > Unloading Jobs | Valid type; lacks `ItemList`; disjoint `<script>` tags. | **Low** | Upgrade to unified `@graph` with `CollectionPage`, `ItemList`, `BreadcrumbList`. |
| **15** | `/temporary-jobs` | `dual` | `Organization` | Yes | Home > Temporary Jobs | **MISAPPLICATION**: Temporary staffing service page labeled as top-level `Organization`. | **High** | Change primary schema to `Service` (`Temporary Staffing`) + `WebPage`. |
| **16** | `/employer-hiring` | `employer` | `Organization` | Yes | Home > Hire Workers | **MISAPPLICATION**: B2B hiring landing page labeled as top-level `Organization`. | **High** | Change primary schema to `Service` (`On-Demand Workforce Recruitment`) + `WebPage`. |
| **17** | `/book-workers` | `employer` | `HowTo` (`name: 'How to Book...'`) | Yes | Home > Book Workers | **MISAPPLICATION & DEPRECATED**: Deprecated Google rich result; marketing flow masquerading as instructional guide. | **High** | Change primary schema to `Service` (`On-Demand Labor Booking`) + `WebPage`. |
| **18** | `/workforce-solutions` | `employer` | `Organization` | Yes | Home > Enterprise Solutions | **MISAPPLICATION**: Enterprise solutions page labeled as top-level `Organization`. | **High** | Change primary schema to `Service` (`Enterprise Managed Workforce Solutions`) + `WebPage`. |
| **19** | `/forklift-operator` | `worker` | `JobPosting` (`title: 'Certified Forklift Operator'`) | Yes | Home > Warehouse Jobs > Forklift Operator | **CRITICAL POLICY VIOLATION**: Generic skilled role page marked as `JobPosting`; rolling `new Date()` datePosted; thin description. | **Critical** | Replace `JobPosting` with `ItemPage` / `Occupation` schema (`Forklift Operator`). |
| **20** | `/gig-jobs-kolkata` | `worker` | `LocalBusiness` (`name: 'Gig Jobs Kolkata'`) | Yes | Home > Gig Jobs | **CRITICAL MISAPPLICATION**: Broad Kolkata regional hub labeled as physical `LocalBusiness`. | **Critical** | Replace `LocalBusiness` with `CollectionPage` (Kolkata Gig Directory) + `ItemList`. |

---

## 4. Root-Cause Analysis & Risk Assessment

```
                                  ┌──────────────────────────────────────────────┐
                                  │       CURRENT STRUCTURED DATA DEFECTS        │
                                  └──────────────────────┬───────────────────────┘
                                                         │
         ┌───────────────────────────────┬───────────────┴───────────────┬───────────────────────────────┐
         ▼                               ▼                               ▼                               ▼
┌──────────────────┐           ┌──────────────────┐            ┌──────────────────┐            ┌──────────────────┐
│  LocalBusiness   │           │    JobPosting    │            │   SearchAction   │            │ Multi-Script Tag │
│  Misapplication  │           │ Policy Violation │            │  & HowTo Deprec. │            │  Fragmentation   │
├──────────────────┤           ├──────────────────┤            ├──────────────────┤            ├──────────────────┤
│ Category pages   │           │ Static pages use │            │ Deprecated Google│            │ Disjoint nodes;  │
│ marked as local  │           │ rolling dates;   │            │ SERP features;   │            │ duplicate FAQ    │
│ storefronts.     │           │ thin 5-word desc.│            │ 404 URL targets. │            │ script tags.     │
└────────┬─────────┘           └────────┬─────────┘            └────────┬─────────┘            └────────┬─────────┘
         │                              │                               │                               │
         └──────────────────────────────┼───────────────────────────────┴───────────────────────────────┘
                                        ▼
                       ┌──────────────────────────────────┐
                       │     POTENTIAL BUSINESS RISKS     │
                       ├──────────────────────────────────┤
                       │ 1. Google Manual Action penalty  │
                       │ 2. Job search indexing removal   │
                       │ 3. Loss of organic SERP trust    │
                       │ 4. Broken rich snippet parsing   │
                       └──────────────────────────────────┘
```

1. **Google Manual Action Risk**: Google's Webmaster Quality team routinely issues manual actions for structured data spam when sites use `JobPosting` for non-vacancies or `LocalBusiness` for non-physical entities.
2. **Schema Invalidation**: Search console logs validation errors for `LocalBusiness` missing `address.streetAddress` and `geo`.
3. **Graph Incoherence**: Emitting unlinked JSON-LD nodes forces search crawlers to guess entity relationships instead of understanding the platform's digital workforce hierarchy.
