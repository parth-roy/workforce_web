# 10. GEO / AI SEARCH ARCHITECTURE

**Status:** APPROVED FOR F6.5
**Domain:** Metro Mitra Public Web

## 1. Traceability Principles
Every GEO / AI Search implementation decision strictly follows:
`Research Blueprint -> Search/Information Intent -> Page Type -> Content Requirement -> Implementation -> Validation`

## 2. Entity Identity
The platform explicitly identifies as:
**Metro Mitra**
*Category:* Gig Workforce Platform
Corporate/legal relationships are intentionally conservative until authoritative verification supports additional public entity relationships.

We establish positive entity identity by stating what we ARE (services, roles, locations, product category), rather than what we are NOT (no mention of "not the Bengaluru transit app").

## 3. Page Intent & Answerability Framework
Every public page acts as an authoritative source of truth for its domain. Pages are structured to rapidly answer the intent of human users and AI retrieval engines.

**Information Hierarchy Pattern:**
```
H1: Core Subject
  ↓
Primary Definition/Answer Paragraph
  ↓
H2: Supporting Concept
  ↓
H3: Specific Details (Lists/Tables/FAQs)
```

## 4. First-Party Definitions & Terminology
We use consistent vocabulary based on the page's target audience:
- **Worker Pages:** "gig jobs", "shift work", "job opportunities"
- **Individual/Consumer Pages:** "services", "hire help", "task assistance"
- **B2B/Contractor/Corporate Pages:** "staffing", "workforce", "manpower"

Glossary terms (e.g., "Gig Workforce", "Warehouse Helper") are defined contextually within the pages where users need them, not in a massive standalone SEO glossary.

## 5. Geo-Location & AI Content Evidence Model
Location pages (`/jobs/location/:loc`, `/jobs/:role/:loc`, `/services/:service/:loc`, etc.) only become eligible for search indexing when there is **Verified Data Evidence**.
- Content must reflect genuine operational availability, real supply, real demand, and unique useful information.
- We explicitly forbid doorway page tactics (e.g., swapping `{location}` in generic text). 
- If a location is not-yet-eligible, it receives NO geo expansion content, remains `noindex`, and stays out of the internal link graph.

## 6. AI Crawler & Retrieval Policy
- **Search Crawlers:** Publicly indexable pages are crawlable.
- **AI Search/Retrieval:** We design for factual extraction (clear definitions, bullet points, FAQs). We do NOT use hidden text or "AI-only" keyword spam.
- **llms.txt:** We maintain an optional `llms.txt` file at the root to summarize the platform's entity identity and core public pages for LLM crawlers. This acts as supplementary reference documentation, not a guaranteed ranking factor.

## 7. Content Quality Guard
Before making a programmatic page indexable, it must pass the following checks:
1. Does it answer a real question?
2. Is the information unique and factual?
3. Is there evidence supporting local relevance?
4. Is it free from unverified operational claims?
