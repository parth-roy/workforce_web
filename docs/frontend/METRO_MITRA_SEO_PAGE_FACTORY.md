# Metro Mitra SEO Page Factory Pattern

During the extreme frontend UI completion, we extended our SEO Page Factory to seamlessly support deep hierarchies without bloating React components.

## Pattern Rules

1. **Centralized Metadata Definition**
   All metadata rules (title, description, canonical, robots, audience) reside inside `src/seo/pageMetadata.js`.
   React components simply import a factory function, optionally pass a domain object (e.g. `mockRole`), and spread the resulting payload into the `<SEO />` component.

2. **No Inline JSX SEO**
   You will never find `<meta name="description" content="..." />` hardcoded inside `ServiceCategoryDirectoryPage.jsx`.
   Instead:
   \`\`\`javascript
   import { ServiceCategoryDirectorySEO } from '../../seo/pageMetadata';
   
   export default function Page() {
     return <SEO {...ServiceCategoryDirectorySEO()} />
   }
   \`\`\`

3. **Deterministic Indexability**
   The factory explicitly controls robots directives based on the domain object's `indexabilityStatus`.
   - `eligible` -> `index, follow`
   - `not-yet-eligible` -> `noindex, nofollow` (Used for geo-stubs lacking threshold data).

4. **Structured Data Injection**
   The factory handles the assembly of JSON-LD schemas using `src/data/schema-helpers.js`. 
   For instance, a Service Page automatically injects \`WebPage\`, \`BreadcrumbList\`, and \`Service\` schemas if it is deemed indexable.

## New Factories Added

- `WorkerRolesDirectorySEO()`
- `WorkerOnboardingSEO()`
- `WorkerHowItWorksSEO()`
- `WorkerFAQSEO()`
- `ServiceCategoryDirectorySEO()`
- `ServiceHowItWorksSEO()`
- `ServiceFAQSEO()`
- `ServiceHiringFlowSEO(service)`

All of these are rigorously tested in `scripts/test-ssr.js`.
