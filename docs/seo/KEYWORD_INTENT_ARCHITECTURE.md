OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# Metro Mitra Keyword Intent Architecture & SEO Blueprint
**Artifact File:** `docs/seo/KEYWORD_INTENT_ARCHITECTURE.md`
**Source Specification:** `Metro Mitra SEO Architecture Blueprint.pdf` (Parther Technologies Pvt. Ltd.)

---

## 1. Executive Summary & Core Architectural Tenets

The keyword intent architecture for **Metro Mitra** (operated by **Parther Technologies Pvt. Ltd.**, Corporate Identification Number: `U62099WR2026PTC293183`, registered in Barrackpore, West Bengal) is engineered to solve three critical strategic imperatives:

1. **Brand Entity Disambiguation**: Distinct Knowledge Graph anchoring separating the Metro Mitra gig workforce platform from the Bengaluru auto-rickshaw mobility app (Agnibhu/ARDU/BMRCL).
2. **Dual-Sided Marketplace Namespace Separation**: Strict bifurcation between Worker B2C job-seeking intent (`/jobs/...`) and Employer B2B workforce procurement intent (`/hire-workers/...`) preventing keyword cannibalization.
3. **Anti-Spam & Evidence-First Programmatic Scalability**: Strict compliance with Google's March 2024 Scaled Content Abuse and Doorway Page policies through "Evidence-First" database thresholds (minimum active jobs, verified worker counts, localized wage averages, specific industrial zone citations) with hard 404/noindex gating on empty clusters.

---

## 2. Master Keyword Intent-to-Architecture Mapping Matrix

| # | Intent Classification | Search Query Examples | Target Audience | Page Type | Canonical URL Pattern | Primary Content Blueprint & GEO Grounding | Terminal CTA Strategy | Schema.org Structured Data | Internal Linking Topology |
|---|---|---|---|---|---|---|---|---|---|
| **1** | **Brand (Disambiguated)** | `metro mitra jobs`, `metro mitra workforce`, `metro mitra parther technologies`, `metro mitra app west bengal` | Existing gig workers, commercial partners, press, enterprise HR | Brand Authority / Entity Hub | `/` (Homepage) + `/about/` + `/parther-technologies/` | Corporate identity, CIN `U62099WR2026PTC293183`, Barrackpore HQ, digital public infrastructure positioning, platform stats, dual-funnel overview. | **Worker:** "Download Worker App"<br>**Employer:** "Hire Verified Staff" | `Organization`, `WebSite`, `LocalBusiness` (Barrackpore HQ only) | Links to Top Tier-1 City Hubs, Major Role Hubs, B2B Pillar, Legal/About |
| **2** | **Worker (B2C Discovery)** | `jobs near me`, `daily wage jobs`, `gig work kolkata`, `part time jobs near me`, `immediate joining jobs` | Blue-collar laborers, warehouse assistants, delivery riders, students | Worker Pillar Hub | `/jobs/` | Aggregated role categories, daily earnings breakdown, instant daily payout guarantees, e-Shram alignment, worker safety & benefits. | "Download App & Start Today" (Play Store / App Store QR) | `CollectionPage`, `BreadcrumbList`, `FAQPage` | Links down to Role Hubs (`/jobs/[role]/`) and City Hubs (`/jobs/[location]/`) |
| **3** | **Employer (B2B Commercial)** | `hire temporary workers`, `warehouse staffing solutions`, `logistics manpower supply`, `contract labor kolkata` | Operations managers, warehouse heads, HR directors, 3PL executives | B2B Commercial Pillar | `/hire-workers/` | Deployment SLAs (<2 hours), workforce scale capabilities (10–500+ workers), background verification, e-Shram & statutory compliance, cost estimator. | "Request Workforce Quote" / "Book Enterprise Demo" | `Service`, `Offer`, `BreadcrumbList`, `FAQPage` | Links down to B2B Service Clusters (`/hire-workers/[service]/`) & Industrial Hubs |
| **4** | **Role-Specific** | `warehouse helper jobs`, `delivery executive vacancy`, `forklift operator jobs`, `loading unloading work`, `picker packer jobs` | Skilled & semi-skilled gig workers seeking specific job profiles | Role Authority Hub | `/jobs/[role]/`<br>*(e.g., `/jobs/warehouse-helper/`)* | Machine-readable role definitions, daily task scope, physical requirements, Pan-India & WB wage benchmarks, active city feeds. | "View [Role] Jobs & Apply via App" | `ItemPage`, `BreadcrumbList`, `FAQPage` | Cross-links to City-specific Role pages (`/jobs/[role]/[location]/`) |
| **5** | **Geographic / Location** | `jobs in barrackpore`, `daily wage work dum dum`, `kolkata logistics jobs`, `jobs in siliguri` | Local workers in specific micro-markets | Location Hub | `/jobs/[location]/`<br>*(e.g., `/jobs/kolkata/`, `/jobs/barrackpore/`)* | Real-time active job counts, local minimum wage rates, industrial zones served, localized commute FAQs, transit hub access. | "Browse Active [Location] Jobs on App" | `Place`, `CollectionPage`, `BreadcrumbList`, `FAQPage` | Links to Role+Location pages in that city; breadcrumbs to `/jobs/` |
| **6** | **Service-Specific (B2B)** | `logistics staffing agency kolkata`, `on-demand warehouse loading service`, `contract labor supplier dankuni` | Logistics heads, supply chain managers, e-commerce fulfillment hubs | B2B Service Page | `/hire-workers/[service]/`<br>*(e.g., `/hire-workers/warehouse-staffing/`)* | Detailed scope of supply, turnaround times, multi-shift flexibility, compliance guarantees, replacement warranties, client case studies. | "Get Instant Staffing Rate Card" / "Deploy Crew Now" | `Service`, `OfferCatalog`, `BreadcrumbList`, `FAQPage` | Links to B2B Industrial Cluster pages (`/hire-workers/[service]/[location]/`) |
| **7** | **Transactional (Role + Location)** | `warehouse jobs in dankuni`, `loader jobs near me barasat`, `delivery boy jobs khardaha` | Active job seekers ready for immediate deployment | Hyper-Local Role Page | `/jobs/[role]/[location]/`<br>*(e.g., `/jobs/warehouse-helper/dankuni/`)* | Live active job listings in that cluster, hourly/daily payout rates, exact work shift timings, nearby logistics parks cited, live hiring status. | "Apply for [Role] in [Location] via App" | `ItemPage`, `BreadcrumbList`, `FAQPage` *(No JobPosting on aggregate list!)* | Direct links to Individual Job Detail pages; parent links to `/jobs/[role]/` and `/jobs/[location]/` |
| **8** | **Urgent / Immediate (B2B)** | `urgent workers required today kolkata`, `on demand warehouse labor now`, `emergency loading staff dankuni` | Plant managers facing sudden absenteeism or festive surge | Rapid-Deployment Landing Page | `/hire-workers/on-demand/` or `/book-workers/` | 60-to-120 minute SLA deployment protocol, live standby worker capacity, instant pricing calculator, emergency dispatch WhatsApp/Call bridge. | "Dispatch Emergency Crew Now" (Instant Call / Priority Lead Form) | `Service`, `SpecialAnnouncement` (Surge), `BreadcrumbList` | Direct escalation to dispatch system; cross-links to industrial zones |
| **9** | **Informational & Educational** | `what is gig workforce`, `temporary vs contract labor law india`, `e-shram card benefits for loaders`, `average warehouse salary west bengal` | Workers, HR researchers, journalists, policymakers | Educational Guide / Glossary | `/guides/[slug]/` or `/glossary/[term]/`<br>*(e.g., `/guides/temporary-vs-contract-labor-india/`)* | High-information-density explanatory content, statutory definitions (Code on Social Security 2020), structured comparison tables, FAQ clusters. | **Dual Contextual CTA:** "Download Worker App" (Workers) \| "Hire Compliant Staff" (Employers) | `Article`, `FAQPage`, `BreadcrumbList` | Contextual contextual in-text links to relevant Role Hubs, B2B Service pages, and Category Hubs |

---

## 3. Deep Architectural Breakdown by Intent Classification

### 3.1 Brand & Entity Disambiguation Intent
* **Problem**: Entity collision with the 2023 Bengaluru "Metro Mitra" auto-rickshaw application (Agnibhu Technologies / ARDU / BMRCL).
* **Architecture Solution**:
  * Mandatory title modifier: `<title>Metro Mitra - Gig Workforce Platform | Parther Technologies</title>`
  * Primary H1: `Metro Mitra — India's On-Demand Blue-Collar & Logistics Workforce Platform`
  * Knowledge Graph Anchor: Organization schema explicitly binding `legalName: "Parther Technologies Private Limited"`, `cin: "U62099WR2026PTC293183"`, `foundingLocation: "Barrackpore, West Bengal, India"`.
  * Single valid `LocalBusiness` entry tied strictly to official Barrackpore headquarters (no spamming fake virtual offices in Delhi/Mumbai).

### 3.2 Worker Intent (B2C High-Volume Discovery)
* **URL**: `/jobs/`
* **Content Hierarchy**:
  1. Instant daily earnings calculator (`₹600 - ₹1,200 / day`).
  2. Verified safety signals: same-day digital payouts, accident insurance coverage, e-Shram linkage.
  3. Browse by Role grid (Loading/Unloading, Warehouse Helper, Delivery Rider, Forklift Operator, Picker/Packer).
  4. Browse by Location grid (Kolkata, Dankuni, Barrackpore, Dum Dum, Howrah, Siliguri).
* **CTA**: Mobile app download QR code + direct Google Play Store & iOS App Store buttons.
* **Schema**: `CollectionPage` + `FAQPage` + `BreadcrumbList`.

### 3.3 Employer Commercial Intent (B2B Staffing & Manpower)
* **URL**: `/hire-workers/`
* **Content Hierarchy**:
  1. SLA Deployment Guarantee: 100% verified workers on-site in <2 hours.
  2. Compliance Armor: 100% Aadhaar-verified, police verification verified, e-Shram registered, ESIC/PF compliant.
  3. Dynamic Workforce Calculator: Enter role + number of shifts + location -> real-time cost estimate.
  4. Client Proof & Case Studies: Logistics hubs, FMCG warehouses, e-commerce fulfillment centers.
* **CTA**: "Request Instant Staffing Quote" (Sticky Form / Enterprise Consultation).
* **Schema**: `Service` (with `provider: Parther Technologies Pvt. Ltd.` and `areaServed: West Bengal, India`) + `OfferCatalog`.

### 3.4 Role-Specific Intent
* **URL Pattern**: `/jobs/[role]/` (e.g., `/jobs/warehouse-helper/`, `/jobs/forklift-operator/`)
* **Content Hierarchy**:
  1. Exact job scope definition (daily physical tasks, equipment handled, working hours).
  2. Required skills/certifications (e.g., Heavy Motor Vehicle / Forklift license vs entry-level physical stamina).
  3. Standard payout benchmarks (daily/monthly average in West Bengal and Pan-India).
  4. Active job clusters across cities.
* **GEO Strategy**: Semantic tables comparing responsibilities, wage ranges, and safety gear requirements.
* **CTA**: "Find [Role] Jobs Near You" -> Direct deep link into Metro Mitra Worker App.
* **Schema**: `ItemPage` + `FAQPage` + `BreadcrumbList`. *(Never inject `JobPosting` schema on aggregate role pages)*.

### 3.5 Geographic & Location Intent
* **URL Pattern**: `/jobs/[location]/` (e.g., `/jobs/barrackpore/`, `/jobs/kolkata/`, `/jobs/dankuni/`)
* **Phased Rollout Strategy**:
  * **Tier 1 Core Base (Immediate P0)**: Barrackpore (HQ), Dum Dum, Titagarh, Khardaha, Sodepur, Kamarhati, North Kolkata.
  * **Tier 1 Industrial Logistics (Immediate P0)**: Dankuni Logistics Park, Dhulagarh, Uluberia Industrial Park, Taratala.
  * **Tier 2 WB Regional Hubs (P1)**: Siliguri, Haldia Port, Asansol, Durgapur.
  * **Tier 3 Pan-India (P2 - Gated)**: Delhi NCR, Bengaluru, Mumbai, Pune (Indexed only when active local supply/demand passes threshold).
* **Evidence-First Content Elements**:
  * Live worker count in cluster.
  * Live job openings count.
  * Industrial zones and transport hubs cited (e.g., NH-19, Dankuni Freight Terminal).
* **Schema**: `Place` + `CollectionPage` + `BreadcrumbList`.

### 3.6 Service-Specific B2B Intent
* **URL Pattern**: `/hire-workers/[service]/` (e.g., `/hire-workers/warehouse-staffing/`, `/hire-workers/logistics-manpower/`)
* **Content Hierarchy**:
  1. Managed operational staffing models (daily spot labor vs monthly contract workforce).
  2. Attendance & Biometric geo-fenced tracking via Metro Mitra platform.
  3. Zero liability replacement guarantee within 45 minutes for absentee workers.
  4. Industry compliance checklist.
* **CTA**: "Request Custom Workforce SLA" / "Talk to Logistics Staffing Specialist".
* **Schema**: `Service` + `Offer` + `BreadcrumbList`.

### 3.7 Transactional Intent (Role + Location & Single Job Postings)
* **Aggregate Cluster URL**: `/jobs/[role]/[location]/` (e.g., `/jobs/warehouse-helper/dankuni/`)
  * **Content**: Real-time job feed in Dankuni for Warehouse Helpers; exact shift timings; daily wages (`₹650 - ₹850/day`).
  * **Schema**: `CollectionPage` + `BreadcrumbList`.
* **Individual Job Posting URL**: `/jobs/detail/[job-id]/` (e.g., `/jobs/detail/mm-dk-9481/`)
  * **Content**: Specific shift details, reporting warehouse address, exact pay, reporting supervisor, required attire (safety shoes).
  * **Strict Schema Rule**: `JobPosting` schema is **exclusively applied here**.
  * **Mandatory Properties**: `title`, `datePosted`, `validThrough` (mandatory ISO-8601 date), `hiringOrganization`, `jobLocation` (single physical geocoded address), `baseSalary`.
  * **Lifecycle Management**: When expired, return **HTTP 410 (Gone)** or **301 redirect** to parent `/jobs/[role]/[location]/`. Trigger **IndexNow API** immediately to de-index from Bing/search crawlers.

### 3.8 Urgent / Immediate B2B Deployment Intent
* **URL**: `/hire-workers/on-demand/` (or `/book-workers/`)
* **Target Queries**: `urgent warehouse workers kolkata`, `on demand warehouse labor now`, `emergency loading staff dankuni`
* **Content Blueprint**:
  1. "Deployment in 90 Minutes" countdown banner.
  2. Live available standby worker counter in Kolkata/Dankuni/Howrah.
  3. Direct 1-click dispatch hotline + high-priority lead capture form.
  4. Instant flat-rate pricing per shift/worker.
* **CTA**: "Dispatch Emergency Crew Now" (Direct Click-to-Call / WhatsApp API).
* **Schema**: `Service` + `SpecialAnnouncement` + `BreadcrumbList`.

### 3.9 Informational & Educational Intent (GEO & AI Grounding)
* **URL Patterns**: `/guides/[slug]/`, `/glossary/[term]/`
* **Target Queries**: `what is gig work in india`, `temporary vs contract labor law india`, `e-shram card benefits for loaders`, `average warehouse salary west bengal`
* **Content Blueprint**:
  * Definitive, authoritative 1,200+ word guides written with high semantic information density.
  * Structured markdown comparison tables formatted in semantic HTML (`<table>`, `<thead>`, `<tbody>`).
  * Explicit legal definitions cited from the Ministry of Labour & Employment.
* **GEO Advantage**: Feeds directly into Google AI Overviews, Perplexity, and OpenAI SearchBot for zero-click queries.
* **Schema**: `Article` + `FAQPage` + `BreadcrumbList`.

---

## 4. Programmatic Anti-Spam & Gating Architecture

To strictly comply with Google's **March 2024 Scaled Content Abuse and Doorway Page Policies**, the application enforces an **Evidence-First Gating Rule**:

```
                              [ Incoming Request ]
                                       │
                                       ▼
                       [ Check Database for Cluster ]
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [ Active Jobs >= 1 OR                  [ Active Jobs == 0 AND
        Registered Workers >= 10 ]             Registered Workers < 10 ]
                    │                                     │
                    ▼                                     ▼
      [ RENDER PROGRAMMATIC PAGE ]              [ SERVE HTTP 404 NOT FOUND ]
      • Render verified live counts             (or 301 to parent Region Hub)
      • Render local wage averages              (Do NOT index thin/empty page)
      • Inject Breadcrumbs & Schema
```

### Anti-Doorway Prohibitions
* ❌ **Prohibited**: Auto-generating micro-location spam pages without operational activity (e.g., `/jobs/loader/street-12-khardaha/`).
* ❌ **Prohibited**: Indexing dynamic internal search parameter URLs (e.g., `/search?q=jobs+in+kolkata`). All internal searches must 301-redirect to canonical static URLs (`/jobs/kolkata/`) and search query params must be disallowed in `robots.txt`.

---

## 5. Structured Data (Schema.org) Complete Specifications

### 5.1 Global Brand & Disambiguation Schema (`Organization` + `WebSite`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://workforce.gomytruck.com/#organization",
      "name": "Metro Mitra",
      "legalName": "Parther Technologies Private Limited",
      "url": "https://workforce.gomytruck.com",
      "logo": "https://workforce.gomytruck.com/images/brand/metro-mitra-logo.png",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "CIN",
        "value": "U62099WR2026PTC293183"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Barrackpore",
        "addressLocality": "North 24 Parganas",
        "addressRegion": "West Bengal",
        "postalCode": "700120",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["en", "bn", "hi"]
      },
      "sameAs": [
        "https://www.zaubacorp.com/company/PARTHER-TECHNOLOGIES-PRIVATE-LIMITED/U62099WR2026PTC293183"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://workforce.gomytruck.com/#website",
      "url": "https://workforce.gomytruck.com",
      "name": "Metro Mitra Gig Workforce",
      "publisher": {
        "@id": "https://workforce.gomytruck.com/#organization"
      }
    }
  ]
}
```

### 5.2 B2B Service Schema (`Service` on `/hire-workers/[service]/`)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "On-Demand Warehouse Staffing & Logistics Labor",
  "serviceType": "Industrial Workforce Supply",
  "provider": {
    "@type": "Organization",
    "name": "Metro Mitra",
    "legalName": "Parther Technologies Private Limited"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Kolkata"
    },
    {
      "@type": "AdministrativeArea",
      "name": "Dankuni Logistics Hub"
    },
    {
      "@type": "State",
      "name": "West Bengal"
    }
  ],
  "description": "Rapid deployment of verified, e-Shram registered warehouse helpers, loaders, and forklift operators with a 2-hour SLA.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "INR",
      "unitText": "per shift"
    }
  }
}
```

### 5.3 Individual Job Posting Schema (`JobPosting` on `/jobs/detail/[job-id]/`)
```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Warehouse Helper",
  "description": "<p>Responsible for material movement, loading/unloading cargo, and sorting packages at Dankuni Logistics Hub. Daily payout guaranteed.</p>",
  "identifier": {
    "@type": "PropertyValue",
    "name": "Metro Mitra Job ID",
    "value": "MM-DK-9481"
  },
  "datePosted": "2026-08-19T06:00:00+05:30",
  "validThrough": "2026-08-25T23:59:59+05:30",
  "employmentType": "TEMPORARY",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Metro Mitra by Parther Technologies",
    "sameAs": "https://workforce.gomytruck.com"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Dankuni Logistics Park, NH-19",
      "addressLocality": "Dankuni",
      "addressRegion": "West Bengal",
      "postalCode": "712311",
      "addressCountry": "IN"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "value": 750,
      "unitText": "DAY"
    }
  }
}
```

### 5.4 Breadcrumbs Schema (`BreadcrumbList` across all indexable URLs)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://workforce.gomytruck.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Jobs",
      "item": "https://workforce.gomytruck.com/jobs/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Warehouse Helper",
      "item": "https://workforce.gomytruck.com/jobs/warehouse-helper/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Dankuni",
      "item": "https://workforce.gomytruck.com/jobs/warehouse-helper/dankuni/"
    }
  ]
}
```

---

## 6. Internal Linking & Topical Silo Architecture

```
                                  [ Homepage: / ]
                                (Brand & Entity Hub)
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
            [ Worker Pillar: /jobs/ ]              [ Employer Pillar: /hire-workers/ ]
                    │                                         │
        ┌───────────┴───────────┐                 ┌───────────┴───────────┐
        ▼                       ▼                 ▼                       ▼
 [ Role Hubs:             [ Location Hubs:  [ B2B Service Hubs:     [ Industrial Hubs:
  /jobs/warehouse-helper/  /jobs/kolkata/    /hire-workers/staffing/ /hire-workers/dankuni/ ]
  /jobs/delivery-boy/      /jobs/dankuni/ ]  /hire-workers/loading/ ]       │
        │                       │                 │                         │
        └───────────┬───────────┘                 └───────────┬─────────────┘
                    ▼                                         ▼
        [ Role + Location Pages:                  [ B2B Service + Location Pages:
         /jobs/warehouse-helper/dankuni/ ]         /hire-workers/staffing/dankuni/ ]
                    │
                    ▼
        [ Individual Job Details:
         /jobs/detail/[job-id]/ ]
```

### Anchor Text Rules
* **Homepage -> Category Hubs**: Explicit exact-match anchors (e.g., `anchor="Warehouse Helper Jobs"`, `anchor="Jobs in Kolkata"`).
* **City Hub -> Role+Location Pages**: Contextual composite anchors (e.g., `anchor="Warehouse Jobs in Dankuni"`).
* **Role Hub -> Cross-City Roles**: Horizontal cluster links (e.g., `anchor="Warehouse Helpers in Siliguri"`).
* **Job Detail -> Parent Silos**: Breadcrumb link chain returning PageRank equity to parent `/jobs/[role]/[location]/`.
* **Zero JS Click Routing for Crawlers**: All internal navigation uses standard HTML `<a href="...">` elements to ensure total crawler traversal.

---

## 7. Technical Rendering, AI Crawlability & IndexNow Directives

### 7.1 Dynamic Rendering Layer (React/Vite)
* **Problem**: Pure Client-Side Rendering (CSR) induces rendering latency and indexation failures for secondary crawlers and AI bots.
* **Solution**: Edge Worker / Prerender Middleware intercepting verified crawlers (`Googlebot`, `Bingbot`, `OAI-SearchBot`) to serve pre-rendered HTML with fully inflated `<head>` (canonicals, meta, and JSON-LD). Human visitors receive the interactive CSR bundle.

### 7.2 Robots.txt Configuration
```txt
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: *
Allow: /
Disallow: /search
Disallow: /search?*
Disallow: /api/
Disallow: /admin/
Disallow: /worker/profile/
Disallow: /employer/dashboard/

Sitemap: https://workforce.gomytruck.com/sitemap.xml
```

### 7.3 IndexNow API Automation
* The backend publishing pipeline automatically triggers an HTTP POST to `https://api.indexnow.org/indexnow` whenever:
  1. A new job posting is published on `/jobs/detail/[job-id]/`.
  2. A job posting expires and transitions to HTTP 410 (Gone).
  3. A new Role+Location programmatic page reaches the active publishing threshold.

---

## 8. Summary of Architectural Deliverables for Implementation

| Deliverable | Implementation Scope | Target Path / Schema | Priority |
|---|---|---|---|
| **Disambiguation Head** | CIN, legal entity, Barrackpore HQ metadata | `Organization` + `WebSite` JSON-LD | **P0** |
| **Edge Dynamic Rendering** | Pre-render HTML for Googlebot / OAI-SearchBot | Cloudflare Edge Worker / Prerender.io | **P0** |
| **Intent Namespace Routing** | Separate `/jobs/` (B2C) and `/hire-workers/` (B2B) | React Router v7 routes | **P1** |
| **Active-Only Evidence Gating** | 404/noindex if jobs=0 and workers<10 | Programmatic Route Middleware | **P1** |
| **Strict JobPosting Lifecycle** | ISO `validThrough` + auto 410 on expiration | Backend API + IndexNow webhook | **P1** |
| **GEO Semantic Content** | High-density comparison tables & FAQ clusters | Reusable React FAQ & Guide templates | **P2** |
