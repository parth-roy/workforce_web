OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# SEO & Architecture Codebase Forensic: `workforce_web`

**Date:** 2026-08-19  
**Platform:** Metro Mitra (Workforce Web)  
**Target Directory:** `/workforce_web`  
**Repository Branch:** `main` / `test`  
**Parent Org:** Parther Technologies Pvt. Ltd. (CIN: `U62099WR2026PTC293183`)

---

## 1. Executive Summary & Forensic Scorecard

The `workforce_web` directory contains the web portal for **Metro Mitra**, an on-demand blue-collar gig workforce platform operating in West Bengal. The frontend is built as a Single Page Application (SPA) using React 19, Vite, Tailwind CSS v3, React Router v7, and React Helmet Async.

### Forensic Scorecard

| Domain | Status | Rating | Key Finding |
|---|---|---|---|
| **Architecture & Routing** | 🟡 Functional SPA | 7/10 | Clean dynamic template pattern driven by `pages.js`; missing SSG/prerendering for non-JS web crawlers. |
| **SEO & Meta Tags** | 🟡 Partial | 6.5/10 | Client-side Helmet injects meta & JSON-LD dynamically; raw `index.html` lacks page-specific tags & OpenGraph defaults. |
| **Schema.org Structured Data** | 🟢 Good | 8/10 | Comprehensive helper generating `Organization`, `WebSite`, `FAQPage`, `BreadcrumbList`, `LocalBusiness`, `JobPosting`, `HowTo`, and `CollectionPage`. |
| **Sitemap & Robots.txt** | 🟢 Good | 8.5/10 | Automated build script generates `sitemap.xml` (21 URLs) and `robots.txt`; `llms.txt` present. |
| **Internal Linking & Breadcrumbs** | 🟡 Partial | 6.5/10 | Dynamic internal grids and BreadcrumbList schema wired; footer contains 3 dead routes (`/privacy-policy`, `/terms`, `/grievance`). |
| **Lead & Form Integrations** | 🟡 Mixed | 6/10 | Employer lead form posts to `https://api.gomytruck.com/api/v1/leads`; interactive `BookingFormModal` is alert-only simulation. |
| **Media & CWV Performance** | 🔴 Needs Optimization | 4.5/10 | Heavy uncompressed PNG assets (1.7MB–1.9MB each), missing `og-default.jpg` fallback image, high initial LCP risk. |
| **Dead Code & Hygiene** | 🔴 High Drift | 4/10 | 6 legacy/orphaned components from v1 codebase with outdated "GoMyTruck" branding and incorrect CIN numbers. |

---

## 2. Package.json & Dependency Architecture

### File: `workforce_web/package.json`

```json
{
  "name": "workforce_web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/generate-sitemap.js",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^1.25.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-helmet-async": "^3.0.0",
    "react-router-dom": "^7.18.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "autoprefixer": "^10.5.4",
    "oxlint": "^1.71.0",
    "postcss": "^8.5.20",
    "tailwindcss": "^3.4.17",
    "vite": "^8.1.1"
  }
}
```

### Forensic Findings:
1. **React 19 & Ecosystem**: Utilizes bleeding-edge `react@19.2.7` with `react-router-dom@7.18.1` and `react-helmet-async@3.0.0`.
2. **Missing Lint Dependency**: `scripts.lint` calls `eslint .`, but `eslint` is not declared in `devDependencies` (only `oxlint@^1.71.0` is present). Running `npm run lint` will fail unless ESLint is globally installed.
3. **No Static Prerender Tooling**: No SSG or prerender packages (e.g. `vite-plugin-prerender`, Nitro, or `@tanstack/react-start`) are installed, leaving the application as a client-rendered SPA.

---

## 3. Vite & Build Configuration Analysis

### File: `workforce_web/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
})
```

### Forensic Findings:
1. **Minimal Vite 8 Config**: Standard `@vitejs/plugin-react` setup.
2. **Missing Path Aliases**: No `@/` or `@components/` aliases configured; all components rely on deep relative paths (`../../data/pages`, `../ui/SEO`).
3. **No Code-Splitting / Manual Chunks**: All routes and landing pages are bundled into a standard monolithic JS chunk, rather than dynamic `React.lazy()` imports.

---

## 4. React Entry Point, Hydration & Root Architecture

### Files: `workforce_web/index.html` & `workforce_web/src/main.jsx`

#### `index.html`:
- Hardcoded static `<title>Metro Mitra</title>`.
- `<link rel="icon" type="image/png" href="/favicon.png" />`.
- Embedded static JSON-LD in `<head>`:
  - `Organization`: Parther Technologies Pvt. Ltd., `https://metromitra.com`, Logo: `https://metromitra.com/logo.png`, Tax ID: `U62099WR2026PTC293183`, Contact: `+91-9331488999`.
  - `LocalBusiness`: Metro Mitra, Parent Org: `#organization`, Chiriyamore, Barrackpore, West Bengal 700120, IN.
- **Deficiency**: Raw HTML lacks page-level `<meta name="description">`, `og:*`, `twitter:*`, and canonical tags. Search engine spiders that do not evaluate client JavaScript will only index the generic homepage title and static organization snippet.

#### `src/main.jsx`:
- Wraps root with `StrictMode` and `HelmetProvider`.
- Loads `src/index.css` (Tailwind base, components, utilities).

---

## 5. Routing & Page Rendering Architecture

### File: `workforce_web/src/App.jsx`

```javascript
// App.jsx dynamically mounts 20 SEO pages from src/data/pages.js
<BrowserRouter>
  <ScrollToTop />
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      {pages.map(page => (
        <Route 
          key={page.path} 
          path={page.path} 
          element={<PageRenderer page={page} />} 
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### Template Routing Pipeline:
- **`PageRenderer`** inspects `page.template`:
  1. `'worker'` → `WorkerPageTemplate` (14 routes)
  2. `'employer'` → `EmployerPageTemplate` (3 routes)
  3. `'dual'` → `DualPageTemplate` (3 routes: `logistics-jobs`, `temporary-jobs`, plus `/` handled by `HomePage`)
- **Scroll Restoration**: `ScrollToTop` resets window coordinates to `(0,0)` on route changes.
- **Custom 404 Page**: In-layout `NotFound` component rendering a return button.

---

## 6. Layouts, Navigation & Mobile Architecture

### Active vs Orphaned Layouts

| Component Path | Status | Branding / CIN | Header / Nav Links |
|---|---|---|---|
| `src/components/layout/Layout.jsx` | **ACTIVE** | Metro Mitra (`U62099WR2026PTC293183`) | Full dual nav, mega footer, WhatsApp widget |
| `src/components/Layout.jsx` | **ORPHANED** | GoMyTruck (`U60232WB2022PTC255655`) | Legacy hardcoded navigation |

### Active Header (`src/components/layout/Header.jsx`):
- **Scroll & Hero Detection**: Dynamically toggles header transparency if the current page has a `heroImage` or is `/`.
- **Workers Dropdown**:
  - `Jobs Near Me` (`/jobs-near-me`)
  - `Daily Payment Jobs` (`/daily-payment-jobs`)
  - `Gig Jobs Kolkata` (`/gig-jobs-kolkata`)
  - `Loading Jobs` (`/loading-jobs`)
  - `Warehouse Jobs` (`/warehouse-jobs`)
  - `All Worker Roles` (`/logistics-jobs`)
- **Employers Dropdown**:
  - `Hire Workers Now` (`/employer-hiring`)
  - `Book On-Demand` (`/book-workers`)
  - `Enterprise Solutions` (`/workforce-solutions`)
  - `Temporary Staffing` (`/temporary-jobs`)
- **Header Actions**: Direct phone call `tel:9331488999`, B2B button (`/employer-hiring`), and Play Store download link (`com.metromitra.workforce`).
- **Mobile Navigation**: Slide-out drawer with backdrop blur, scroll locking, and full link hierarchy.

### Active Footer (`src/components/layout/Footer.jsx`):
- 4 Columns:
  1. **Company & Legal Identity**: Parther Technologies Pvt. Ltd., Chiriyamore, Barrackpore, CIN: `U62099WR2026PTC293183`, social links (Phone, Mail `hello@parthertech.com`, WhatsApp, LinkedIn).
  2. **For Workers**: 6 key worker links + Play Store QR code WebP image.
  3. **For Employers & Top Roles**: 4 employer links + 5 role landing page links (`/forklift-operator`, `/truck-helper-jobs`, `/unloading-jobs`, `/warehouse-helper`, `/logistics-jobs`).
  4. **Locations & Legal**: City pages (`/gig-jobs-kolkata`, `/delivery-jobs-kolkata`, `/helper-jobs-kolkata`) + Legal (`/privacy-policy`, `/terms`, `/grievance`).
- **Compliance Bar**: Cites regulation under *Code on Social Security 2020*, *e-Shram Registered*, and *West Bengal Gatidhara Partner*.

---

## 7. Page Templates & Dynamic Section Architecture

### 1. `HomePage.jsx`
- SEO: `createWebSiteSchema()`, canonical `https://metromitra.com/`.
- Sections:
  - `HeroSection` (variant: `dual` with background HTML5 video `/workforce-hero.webm` & `/workforce-hero.mp4`, role carousel linked to `/employer-hiring?worker=${role.id}`, CTA to `/employer-hiring`).
  - `StatsBar` (currently returns `null`).
  - `IndustriesGrid` (6 industry vertical cards).
  - `ProblemSolution` (Before vs After comparison).
  - `HowItWorks` (with tabs for Worker / Employer).
  - `GovtAlignment` (e-Shram, Gatidhara, Code on Social Security 2020).
  - `TestimonialsSection` (Worker carousel + Employer quotes).
  - `TrustSignals` (6 trust badges).
  - `AppDownloadCTA` (App download & QR banner).

### 2. `WorkerPageTemplate.jsx`
- SEO: Injects `page.schema` + `createFAQSchema(page.faqs)` + `BreadcrumbList`.
- Sections driven by `page.sections`: `statsBar`, `problemSolution`, `earningsCalculator`, `howItWorks`, `trustSignals`, `govtAlignment`, `testimonialsSection`, `faqSection`, `appDownloadCTA`, `internalLinkGrid`.
- Features: `features.showLocalMap` renders `LocalZoneMap`.

### 3. `EmployerPageTemplate.jsx`
- SEO: Organization / HowTo schema + FAQ schema + BreadcrumbList.
- Sections: `wizardSteps`, `employerDashboardPreview`, `caseStudyBlock`, `govtAlignment`, `trustSignals`, `faqSection`, `internalLinkGrid`.
- Lead Capture: `EmployerLeadForm` executes `POST https://api.gomytruck.com/api/v1/leads` with `{ name, companyName, phone, city, role: 'EMPLOYER', notes }`.

### 4. `DualPageTemplate.jsx`
- SEO: Organization schema + FAQ schema + BreadcrumbList.
- Split CTA: Worker app download + Employer contact sales.
- Sections: `statsBar`, `howItWorks`, `caseStudyBlock`, `wizardSteps`, `govtAlignment`, `trustSignals`, `faqSection`, `appDownloadCTA`, `internalLinkGrid`.

---

## 8. Section Components Forensic Inventory

| Component File | Role & Purpose | Key Inputs / Interactive State |
|---|---|---|
| `HeroSection.jsx` | 3 Hero variants (`worker`, `employer`, `dual`) | Background video, role picker bubbles, modal launcher |
| `StatsBar.jsx` | 4 counting metrics | **DISABLED** (hardcoded to `return null;`) |
| `IndustriesGrid.jsx` | 6 Industry cards with sub-roles | Links to `/logistics-jobs`, `/warehouse-jobs`, etc. |
| `ProblemSolution.jsx` | Before (Labour Chowk) vs After (Metro Mitra) | 5 contrast rows with icons |
| `HowItWorks.jsx` | 3-step onboarding / deployment | Tab switch between Worker & Employer steps |
| `GovtAlignment.jsx` | e-Shram, Gatidhara, Code on SS 2020 | National Emblem SVG, external verification links |
| `TestimonialsSection.jsx` | Social proof with Star ratings | Worker carousel (3 reviews) + 2 Employer cards |
| `TrustSignals.jsx` | 6 compliance & trust badges | Grid with security, insurance & commission pills |
| `AppDownloadCTA.jsx` | Bottom acquisition callout | Google Play CTA + QR code WebP asset |
| `FAQSection.jsx` | Accessible FAQ Accordion | `aria-expanded`, dynamic max-height transitions |
| `InternalLinkGrid.jsx` | Related landing page cards | Links mapped from `page.relatedPages` |
| `EarningsCalculator.jsx` | Interactive wage estimator | 6 roles × 3 shift types (4hr, 6hr, 8hr) with daily/monthly output |
| `LocalZoneMap.jsx` | Kolkata demand zones SVG map | 8 pinpointed logistics hubs with Hooghly river SVG overlay |
| `WizardSteps.jsx` | 3-step employer execution flow | Step 01 (Post) → Step 02 (AI Match) → Step 03 (Execute) |
| `EmployerDashboardPreview.jsx` | Mock SaaS management UI | Visual mockup with fill rates, live GPS check-in stats |
| `CaseStudyBlock.jsx` | B2B enterprise success story | Dankuni Logistics case study (67% fulfillment reduction) |

---

## 9. SEO Components & Schema.org Implementation Analysis

### Two Competing SEO Components

1. **`src/components/ui/SEO.jsx` (ACTIVE)**:
   - Uses `react-helmet-async`.
   - Manages: `<title>`, `<meta name="description">`, `<link rel="canonical">`.
   - OpenGraph: `og:title`, `og:description`, `og:type="website"`, `og:url`, `og:image`, `og:site_name="Metro Mitra"`.
   - Twitter Cards: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`.
   - Dynamic Breadcrumb Schema: Auto-generates `BreadcrumbList` schema if `breadcrumbs` array is supplied.
   - Array of Schemas: Maps all schema objects into individual `<script type="application/ld+json">` tags.

2. **`src/components/SEO.jsx` (ORPHANED)**:
   - Minimal legacy component lacking OpenGraph, Twitter cards, canonical tags, and schema arrays.

### Schema Helpers (`src/data/schema-helpers.js`)

| Helper Function | Schema Type | Key Properties |
|---|---|---|
| `createOrganizationSchema()` | `Organization` | Legal name, foundingDate (2022), Barrackpore address, contactPoint with multilingual support ('en', 'bn', 'hi'), social profiles |
| `createWebSiteSchema()` | `WebSite` | Site URL, `SearchAction` entry point (`/search?q={search_term_string}`) |
| `createFAQSchema(faqs)` | `FAQPage` | `mainEntity` array with `Question` and `acceptedAnswer` |
| `createBreadcrumbSchema(breadcrumbs)` | `BreadcrumbList` | `itemListElement` array with position and absolute URLs |
| `createLocalBusinessSchema({ name, city, path })` | `LocalBusiness` | Address, `priceRange: 'Free'`, areaServed |
| `createJobPostingSchema({ title, description, baseSalary, city, path })` | `JobPosting` | datePosted (dynamic ISO), validThrough (+90 days), contractor employmentType, baseSalary (INR/DAY) |
| `createHowToSchema({ name, description, steps })` | `HowTo` | HowToStep list with step titles and instructions |
| `createCollectionPageSchema({ name, description, path })` | `CollectionPage` | Collection URL and publisher metadata |

---

## 10. Master Page & Keyword Configuration Analysis

Master configuration in `src/data/pages.js` defines **20 landing pages** + 1 Homepage:

| Path Slug | Template | Target Keyword Cluster | Primary Structured Data |
|---|---|---|---|
| `/` | Custom | Brand & General Gig Platform | `WebSite` |
| `/jobs-near-me` | `worker` | Daily payment jobs near me | `CollectionPage` + `FAQPage` |
| `/loading-jobs` | `worker` | Loading jobs, daily wage labour | `CollectionPage` + `FAQPage` |
| `/delivery-jobs-kolkata` | `worker` | Delivery jobs in Kolkata | `LocalBusiness` + `FAQPage` |
| `/warehouse-jobs` | `worker` | Warehouse picker & packer jobs | `CollectionPage` + `FAQPage` |
| `/daily-payment-jobs` | `worker` | Instant daily payment jobs | `FAQPage` |
| `/daily-wage-jobs` | `worker` | Verified daily wage jobs Kolkata | `CollectionPage` + `FAQPage` |
| `/helper-jobs-kolkata` | `worker` | Helper jobs in Kolkata hubs | `LocalBusiness` + `FAQPage` |
| `/student-jobs` | `worker` | Flexible student part-time gigs | `FAQPage` |
| `/part-time-jobs` | `worker` | Part-time logistics shifts | `CollectionPage` + `FAQPage` |
| `/weekend-jobs` | `worker` | Weekend surge gig work | `CollectionPage` + `FAQPage` |
| `/logistics-jobs` | `dual` | Logistics workforce West Bengal | `Organization` + `FAQPage` |
| `/warehouse-helper` | `worker` | Warehouse helper no experience | `JobPosting` + `FAQPage` |
| `/unloading-jobs` | `worker` | Container unloading daily wage | `CollectionPage` + `FAQPage` |
| `/temporary-jobs` | `dual` | Temporary workforce solutions | `Organization` + `FAQPage` |
| `/employer-hiring` | `employer` | Hire verified gig workers B2B | `Organization` + `FAQPage` |
| `/book-workers` | `employer` | Book on-demand workers | `HowTo` + `FAQPage` |
| `/workforce-solutions` | `employer` | Enterprise gig workforce API | `Organization` + `FAQPage` |
| `/forklift-operator` | `worker` | Certified forklift operator jobs | `JobPosting` + `FAQPage` |
| `/truck-helper-jobs` | `worker` | Truck helper & khalasi jobs | `CollectionPage` + `FAQPage` |
| `/gig-jobs-kolkata` | `worker` | Best gig jobs in Kolkata | `LocalBusiness` + `FAQPage` |

---

## 11. Role Data & Interactive Workforce Schemas

### Role Definitions (`src/data/roles.js`)
Configures 12 service/workforce roles with WebP icons:
1. `ac-cleaner` (AC Cleaner)
2. `ac-technician` (AC Technician)
3. `cctv-technician` (CCTV Tech)
4. `electrician` (Electrician)
5. `furniture-mover` (Furniture Mover)
6. `housekeeper` (Housekeeper)
7. `loader-unloader` (Loader/Unloader)
8. `painter` (Painter)
9. `picker-packer` (Picker Packer)
10. `plumber` (Plumber)
11. `security-guard` (Security Guard)
12. `sweeper` (Sweeper)

### Dynamic Role Form Fields (`src/data/workerSchemas.js`)
Contains tailored input schemas (AC types, phase type, furniture handling, cleaning types, weight estimates, shift durations) rendered inside `BookingFormModal.jsx`.

### Booking Form Modal (`src/components/modals/BookingFormModal.jsx`)
- Supports multi-role selection tab switching.
- Standard inputs: Date picker, time slot, service address, 10-digit phone number.
- Voice Note UI with timer counter.
- **Current Limitation**: Form submission triggers a client-side `alert('Booking Submitted Successfully!')` without backend dispatch.

---

## 12. Sitemap Generator, Robots.txt & LLMs.txt Audit

### 1. `scripts/generate-sitemap.js`
- Integrated into `npm run build`.
- Generates `public/sitemap.xml` with 21 URLs (Homepage priority 1.0, Employer priority 0.9, Worker/Dual priority 0.8; `changefreq`: `daily`).
- Generates `public/robots.txt`:
  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://metromitra.com/sitemap.xml
  ```

### 2. `public/llms.txt`
- Structured prompt briefing file for AI/LLM crawlers.
- Mentions corporate identity (Parther Technologies Pvt. Ltd., CIN: `U62099WR2026PTC293183`, Barrackpore), 0% commission model, Gatidhara/e-Shram alignment, vehicle fleet types, and contact info (`+91 9331488999`).

---

## 13. Internal Linking Architecture, Breadcrumbs & Broken Route Matrix

### Linking Structure
- **Header & Footer**: Direct links to all 20 pages categorized by Worker, Employer, Top Roles, and Cities.
- **Contextual In-Page Links**: `InternalLinkGrid` provides cross-linking across related career and employer paths based on `page.relatedPages`.
- **Breadcrumbs**: UI component `Breadcrumb.jsx` paired with Schema.org `BreadcrumbList` via `SEO.jsx`.

### Broken / Unimplemented Routes Matrix

| Trigger Location | Target Link | Codebase Route Status | HTTP Result |
|---|---|---|---|
| `Footer.jsx` Line 139 | `/privacy-policy` | **Not in `pages.js` or `App.jsx`** | Renders 404 Page |
| `Footer.jsx` Line 140 | `/terms` | **Not in `pages.js` or `App.jsx`** | Renders 404 Page |
| `Footer.jsx` Line 141 | `/grievance` | **Not in `pages.js` or `App.jsx`** | Renders 404 Page |
| `schema-helpers.js` Line 44 | `/search?q={search_term_string}` | **No search route in `App.jsx`** | Renders 404 Page |
| `DualHero.jsx` (Orphaned) | `https://metromitra.com/enterprise` | **Not implemented** | Broken External |

---

## 14. Assets, Media & Core Web Vitals (CWV) Performance Assessment

### Assets Breakdown (`public/`)

| Asset Path | Type | Size | Status & CWV Impact |
|---|---|---|---|
| `/all-worker-roles.png` | PNG | **1.91 MB** | 🔴 Unoptimized heavy image |
| `/warehouse-hero.png` | PNG | **1.89 MB** | 🔴 Unoptimized heavy image |
| `/gig-jobs-kolkata.png` | PNG | **1.87 MB** | 🔴 Unoptimized heavy image |
| `/loader-jobs.png` | PNG | **1.73 MB** | 🔴 Unoptimized heavy image |
| `/jobs-near-me.png` | PNG | **1.71 MB** | 🔴 Unoptimized heavy image |
| `/daily-payment.png` | PNG | **1.81 MB** | 🔴 Unoptimized heavy image |
| `/metromitra-logo.png` | PNG | **1.31 MB** | 🔴 Heavy logo asset |
| `/favicon.png` | PNG | **843 KB** | 🔴 Favicon too large |
| `/logo.png` | PNG | **843 KB** | 🔴 Logo too large |
| `/workforce-hero.mp4` | MP4 | **2.18 MB** | 🟡 Acceptable video size |
| `/workforce-hero.webm` | WebM | **2.02 MB** | 🟡 Acceptable video size |
| `/home-hero.webp` | WebP | **51 KB** | 🟢 Optimized WebP |
| `/employer-hiring-hero.webp`| WebP | **55 KB** | 🟢 Optimized WebP |
| `/services-icons-images/*.webp` | WebP (12) | 47 KB - 461 KB | 🟢 WebP formatted |
| `/og-default.jpg` | JPG | **MISSING** | 🔴 Referencing broken 404 image |

---

## 15. CI/CD Workflows, Deployment Architecture & Environment Config

### GitHub Actions Workflows

1. **Production Deployment (`.github/workflows/deploy.yml`)**:
   - Branch: `main`
   - Runner: `ubuntu-latest`
   - Action: `appleboy/ssh-action@v1.0.3`
   - Execution on Server:
     ```bash
     cd /var/www/workforce_web
     git fetch origin main
     git reset --hard origin/main
     npm install
     npm run build
     ```

2. **Staging / Test Deployment (`.github/workflows/deploy-test.yml`)**:
   - Branch: `test`
   - Target Directory: `/var/www/test-workforce`
   - Runs same pull & build pipeline on the test droplet.

---

## 16. API Integrations & External Endpoints Inventory

| Form / Integration | Component Location | HTTP Method & Target URL | Payload Schema | Live Status |
|---|---|---|---|---|
| **Employer Lead Form** | `EmployerPageTemplate.jsx` & `HeroSection.jsx` | `POST https://api.gomytruck.com/api/v1/leads` | `{ name, companyName, phone, city, role: 'EMPLOYER', notes }` | ✅ Operational |
| **Worker Booking Modal** | `BookingFormModal.jsx` | Client-side simulation (`alert()`) | N/A | ⚠️ Mockup only |
| **Worker App Download** | `Header.jsx`, `Footer.jsx`, `AppDownloadCTA.jsx` | `https://play.google.com/store/apps/details?id=com.metromitra.workforce` | N/A | ✅ Live Store Link |
| **WhatsApp Support** | `WhatsAppWidget.jsx`, `Footer.jsx` | `https://wa.me/919331488999` | Pre-filled inquiry text | ✅ Operational |
| **Direct Phone Dial** | `Header.jsx`, `Footer.jsx` | `tel:9331488999` | N/A | ✅ Operational |

---

## 17. Dead Code & Orphaned Files Forensic Catalog

The following files located directly inside `src/components/` are relics of the v1 build and are not imported by `App.jsx` or any active page template:

1. `src/components/Layout.jsx`: Legacy layout containing obsolete "GoMyTruck Workforce" branding and wrong CIN (`U60232WB2022PTC255655`).
2. `src/components/SEO.jsx`: Incomplete legacy SEO component superseded by `src/components/ui/SEO.jsx`.
3. `src/components/B2CPageTemplate.jsx`: Legacy v1 template.
4. `src/components/DualHero.jsx`: Legacy hero containing dead link to `/enterprise`.
5. `src/components/JobCard.jsx`: Legacy WhatsApp job card.
6. `src/components/TrustBadges.jsx`: Legacy trust badge bar.

---

## 18. Discovered Bugs, Defects & Risk Register

| Risk ID | Severity | Category | Description & Impact |
|---|---|---|---|
| **BUG-01** | **High** | SEO & Social | `og-default.jpg` is missing from `public/`, resulting in 404 for OpenGraph image previews on WhatsApp, Twitter, Facebook, and LinkedIn shares. |
| **BUG-02** | **High** | Broken Links / UX | Legal links in `Footer.jsx` (`/privacy-policy`, `/terms`, `/grievance`) are not configured in `App.jsx`, returning 404 errors. |
| **BUG-03** | **Medium** | Build / Tooling | `package.json` specifies `"lint": "eslint ."`, but `eslint` is missing from `devDependencies`, causing lint script failure. |
| **BUG-04** | **Medium** | SEO / Search Schema | `createWebSiteSchema()` declares a `SearchAction` on `/search?q=...`, but no search route exists in the application. |
| **BUG-05** | **Medium** | Performance / LCP | Hero background images in `public/` (`jobs-near-me.png`, `loader-jobs.png`, etc.) exceed 1.7 MB each, significantly harming Largest Contentful Paint (LCP). |
| **BUG-06** | **Low** | Code Health | 6 orphaned components in `src/components/` create technical debt and confusion with active components in subdirectories. |

---

## 19. Remediation Roadmap

1. **Immediate Fixes (P0)**:
   - Provide `public/og-default.jpg` (1200x630px WebP/JPG).
   - Add routes and basic static content for `/privacy-policy`, `/terms`, and `/grievance`.
   - Remove orphaned v1 components from `src/components/`.
2. **Performance Optimization (P1)**:
   - Convert all hero PNGs (1.7MB–1.9MB) to compressed WebP (under 100KB each).
   - Compress `favicon.png` and `logo.png` from 843KB to <20KB.
3. **SEO & Prerendering Upgrade (P2)**:
   - Introduce a build-time prerendering step (similar to the `/vahan` portal) so all 21 routes produce static HTML files with pre-baked meta tags for search spiders.
4. **Tooling & Form Fixes (P3)**:
   - Align `package.json` lint script with `oxlint`.
   - Wire `BookingFormModal.jsx` submission to `POST https://api.gomytruck.com/api/v1/leads` or a dedicated booking endpoint.

---
*Forensic inspection complete. No application files were modified.*
