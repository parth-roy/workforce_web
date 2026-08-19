# 07_ROBOTS_CRAWLER_POLICY

**Status:** ACTIVE
**Phase:** F6.3
**Last Updated:** 2026-08-19

## 1. Primary Crawler Policy
The `robots.txt` configuration for Metro Mitra is designed to optimize standard search engine discovery while rigorously defending private corporate endpoints and search-parameter crawl traps. 

### Core Configuration
```text
User-agent: *
Allow: /

# Prevent uncontrolled crawl/indexation of internal search/filter traps
Disallow: /*?q=
Disallow: /*?filter=
Disallow: /*?sort=

# Protect private/authenticated areas (Future Scale)
Disallow: /company/dashboard/
Disallow: /company/requests/
Disallow: /company/locations/
Disallow: /contractor/dashboard/
Disallow: /contractor/requests/

# Expose Canonical Sitemap
Sitemap: https://metromitra.com/sitemap.xml
```

## 2. Intentionality of `robots.txt` vs `noindex`
- **`robots.txt`** is used ONLY to control *crawl budget* and access. It prevents crawlers from spinning their wheels in infinite query-parameter spaces (like filters).
- **`noindex` (via Meta Tags)** is used to control *indexability* for pages that are public but shouldn't be indexed (e.g., demo jobs, geo-stubs). We do NOT put `Disallow: /jobs/detail/demo-job` in `robots.txt`, because if Google cannot crawl it, it cannot see the `noindex` tag.

## 3. Authenticated Route Protection
The `robots.txt` preemptively blocks the `/company/*` and `/contractor/*` dashboards. Although these routes require authentication (which search engines cannot bypass), adding explicit `Disallow` rules provides an extra layer of defense against accidental URL leakage (e.g. if a user posts a dashboard link publicly).

## 4. AI Crawler Policy
Currently, Metro Mitra does not implement bespoke blocks for Large Language Model (LLM) training bots (e.g., `GPTBot`, `CCBot`, `Anthropic-ai`).
- **Search Crawling (Googlebot, Bingbot):** Allowed.
- **Data Scraping / Training:** Inherits the global `Allow: /` rule.

*Note:* Blocking AI bots has no verified correlation with improving organic search rankings on Google. If the business decides to restrict proprietary training data collection in the future, explicit User-Agent blocks (e.g., `User-agent: GPTBot \n Disallow: /`) will be appended here. This decision is deferred to Legal/Compliance.
