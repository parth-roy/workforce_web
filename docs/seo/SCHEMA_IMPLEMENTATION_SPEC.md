OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# Workforce Web — Structured Data Technical Specification & Blueprint

**Target Platform:** `workforce_web` (Metro Mitra)  
**Standard:** Schema.org Core Vocabulary & Google Search Central Guidelines (2026 Standards)  
**Architecture:** Single Unified `@graph` JSON-LD per Route  
**Domain Authority:** `https://metromitra.com`  
**Corporate Entity:** Parther Technologies Pvt. Ltd. (CIN: `U62099WR2026PTC293183`)

---

## 1. Architectural Principles

### 1.1 Single `@graph` JSON-LD Array
Every route must output exactly **one** `<script type="application/ld+json">` tag containing a top-level `@graph` array. All entities within the graph must be interconnected using standard `@id` URIs:
- `https://metromitra.com/#organization` (Corporate Identity)
- `https://metromitra.com/#website` (Web Platform)
- `https://metromitra.com${path}/#webpage` (Specific Page Instance)
- `https://metromitra.com${path}/#breadcrumb` (Breadcrumb Hierarchy)
- `https://metromitra.com${path}/#service` or `#itemlist` (Primary Subject Matter)

### 1.2 Strict Policy Compliance
1. **Zero Fake `JobPosting` Markup**: Never use `JobPosting` on generic role or category landing pages. Use `ItemPage` with `Occupation` schema for skilled worker role overviews.
2. **Zero Fake `LocalBusiness` Markup**: Never use `LocalBusiness` on job category or regional hub pages. Use `CollectionPage` with an `areaServed` geographic property and `ItemList` of occupational categories.
3. **No Obsolete `SearchAction`**: Omit Sitelinks Search Box markup.
4. **No Desktop `HowTo` on Marketing Pages**: Represent onboarding processes as `Service` offerings or structured `ItemList` features.
5. **No Duplicate `FAQPage` Scripts**: Include FAQ items inside the single `@graph` array using a unified `mainEntity: [...]` Question/Answer structure.

---

## 2. Canonical Entity Taxonomy by Page Archetype

```
                               ┌──────────────────────────────────────────────┐
                               │            CANONICAL ENTITY GRAPH            │
                               └──────────────────────┬───────────────────────┘
                                                      │
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │   Organization (#organization)
                                       │   Name: Metro Mitra         │
                                       │   Legal: Parther Tech Ltd   │
                                       └──────────────┬──────────────┘
                                                      │ publisher
                                                      ▼
                                       ┌─────────────────────────────┐
                                       │     WebSite (#website)      │
                                       │     URL: metromitra.com     │
                                       └──────────────┬──────────────┘
                                                      │ isPartOf
                                                      ▼
        ┌─────────────────────────────────────────────┴─────────────────────────────────────────────┐
        ▼                                             ▼                                             ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐           ┌───────────────────────────────┐
│   ARCHETYPE A: CATEGORY HUB   │           │    ARCHETYPE B: SKILLED ROLE  │           │   ARCHETYPE C: B2B SERVICE    │
│   (e.g., /delivery-jobs-kolkata)          │   (e.g., /forklift-operator)  │           │   (e.g., /employer-hiring)    │
├───────────────────────────────┤           ├───────────────────────────────┤           ├───────────────────────────────┤
│ @type: CollectionPage         │           │ @type: ItemPage / WebPage     │           │ @type: WebPage                │
│ mainEntity: ItemList          │           │ mainEntity: Occupation        │           │ mainEntity: Service           │
│ hasPart: BreadcrumbList       │           │ hasPart: BreadcrumbList       │           │ hasPart: BreadcrumbList       │
│ subjectOf: FAQPage (if FAQs)  │           │ subjectOf: FAQPage (if FAQs)  │           │ subjectOf: FAQPage (if FAQs)  │
└───────────────────────────────┘           └───────────────────────────────┘           └───────────────────────────────┘
```

### Archetype A: Job Category & Local Hub Pages (14 Pages)
- **Applicable Routes:** `/jobs-near-me`, `/loading-jobs`, `/delivery-jobs-kolkata`, `/warehouse-jobs`, `/daily-payment-jobs`, `/daily-wage-jobs`, `/helper-jobs-kolkata`, `/student-jobs`, `/part-time-jobs`, `/weekend-jobs`, `/logistics-jobs`, `/unloading-jobs`, `/truck-helper-jobs`, `/gig-jobs-kolkata`.
- **Top-Level Node:** `CollectionPage`
- **Main Entity:** `ItemList` (cataloging roles, hubs, and benefits)
- **Secondary Nodes:** `BreadcrumbList`, `FAQPage` (when FAQs exist).

### Archetype B: Skilled Role Informational Pages (2 Pages)
- **Applicable Routes:** `/warehouse-helper`, `/forklift-operator`.
- **Top-Level Node:** `ItemPage` (or `WebPage`)
- **Main Entity:** `Occupation` (Schema.org Occupational Classification)
  - `name`: e.g. "Forklift Operator"
  - `description`: Formal role responsibilities, training standards, and certification pathways.
  - `estimatedSalary`: Quantitative value in INR per day.
  - `occupationalCategory`: Standard National Classification of Occupations (NCO) / SOC code.
- **Secondary Nodes:** `BreadcrumbList`, `FAQPage`.

### Archetype C: B2B Employer & Managed Solutions Pages (4 Pages)
- **Applicable Routes:** `/employer-hiring`, `/book-workers`, `/workforce-solutions`, `/temporary-jobs`.
- **Top-Level Node:** `WebPage`
- **Main Entity:** `Service` (or `B2BService`)
  - `name`: e.g. "On-Demand Logistics Workforce Deployment"
  - `serviceType`: "Workforce Staffing & Management"
  - `provider`: Reference to `#organization`
  - `areaServed`: "West Bengal, IN"
  - `offers`: Service availability terms
- **Secondary Nodes:** `BreadcrumbList`, `FAQPage`.

### Archetype D: Root Platform Homepage (1 Page)
- **Applicable Route:** `/`
- **Top-Level Nodes in `@graph`:**
  1. `Organization` (`#organization`)
  2. `WebSite` (`#website`)
  3. `WebPage` (`#webpage`)

---

## 3. Detailed Specification for Every Route (All 21 URLs)

| Route / Path | Primary Entity `@type` | `mainEntity` `@type` | Additional Graph Nodes | Canonical `@id` Targets |
|---|---|---|---|---|
| `/` | `WebSite` + `Organization` | N/A | `WebPage` | `#organization`, `#website`, `https://metromitra.com/#webpage` |
| `/jobs-near-me` | `CollectionPage` | `ItemList` | `BreadcrumbList`, `FAQPage` | `.../jobs-near-me/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/loading-jobs` | `CollectionPage` | `ItemList` | `BreadcrumbList`, `FAQPage` | `.../loading-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/delivery-jobs-kolkata` | `CollectionPage` | `ItemList` (Delivery Roles) | `BreadcrumbList`, `FAQPage` | `.../delivery-jobs-kolkata/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/warehouse-jobs` | `CollectionPage` | `ItemList` (Warehouse Roles) | `BreadcrumbList`, `FAQPage` | `.../warehouse-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/daily-payment-jobs` | `CollectionPage` | `ItemList` (Instant Pay Gigs) | `BreadcrumbList`, `FAQPage` | `.../daily-payment-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/daily-wage-jobs` | `CollectionPage` | `ItemList` (Daily Wage Roles) | `BreadcrumbList`, `FAQPage` | `.../daily-wage-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/helper-jobs-kolkata` | `CollectionPage` | `ItemList` (Helper Roles) | `BreadcrumbList`, `FAQPage` | `.../helper-jobs-kolkata/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/student-jobs` | `CollectionPage` | `ItemList` (Flexible Student Gigs) | `BreadcrumbList`, `FAQPage` | `.../student-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/part-time-jobs` | `CollectionPage` | `ItemList` (Shift Options) | `BreadcrumbList`, `FAQPage` | `.../part-time-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/weekend-jobs` | `CollectionPage` | `ItemList` (Surge Weekend Gigs) | `BreadcrumbList`, `FAQPage` | `.../weekend-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/logistics-jobs` | `CollectionPage` | `ItemList` (Logistics Directory) | `BreadcrumbList`, `FAQPage` | `.../logistics-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/warehouse-helper` | `ItemPage` | `Occupation` (Warehouse Helper) | `BreadcrumbList`, `FAQPage` | `.../warehouse-helper/#webpage`, `.../#occupation`, `.../#breadcrumb` |
| `/unloading-jobs` | `CollectionPage` | `ItemList` (Container Gigs) | `BreadcrumbList`, `FAQPage` | `.../unloading-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/temporary-jobs` | `WebPage` | `Service` (Temporary Staffing) | `BreadcrumbList`, `FAQPage` | `.../temporary-jobs/#webpage`, `.../#service`, `.../#breadcrumb` |
| `/employer-hiring` | `WebPage` | `Service` (KYC Workforce Recruitment) | `BreadcrumbList`, `FAQPage` | `.../employer-hiring/#webpage`, `.../#service`, `.../#breadcrumb` |
| `/book-workers` | `WebPage` | `Service` (On-Demand Labor Booking) | `BreadcrumbList`, `FAQPage` | `.../book-workers/#webpage`, `.../#service`, `.../#breadcrumb` |
| `/workforce-solutions` | `WebPage` | `Service` (Enterprise Workforce API) | `BreadcrumbList`, `FAQPage` | `.../workforce-solutions/#webpage`, `.../#service`, `.../#breadcrumb` |
| `/forklift-operator` | `ItemPage` | `Occupation` (Certified Operator) | `BreadcrumbList`, `FAQPage` | `.../forklift-operator/#webpage`, `.../#occupation`, `.../#breadcrumb` |
| `/truck-helper-jobs` | `CollectionPage` | `ItemList` (Transit & Helper Gigs) | `BreadcrumbList`, `FAQPage` | `.../truck-helper-jobs/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
| `/gig-jobs-kolkata` | `CollectionPage` | `ItemList` (Kolkata Hub Roles) | `BreadcrumbList`, `FAQPage` | `.../gig-jobs-kolkata/#webpage`, `.../#itemlist`, `.../#breadcrumb` |
