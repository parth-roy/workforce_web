# Metro Mitra Public Page Inventory

This document details the exhaustive public page index generated for Metro Mitra during the Extreme Frontend Product Completion Sprint.

## Core Hub Pages
| Path | Target Audience | Indexable |
|------|-----------------|-----------|
| `/` | General | Yes |
| `/jobs` | Workers | Yes |
| `/services` | Individuals | Yes |
| `/hire-workers` | B2B | Yes |
| `/for-contractors` | Contractors | Yes |
| `/for-companies` | Companies | Yes |
| `/about` | General | Yes |
| `/contact` | General | Yes |
| `/faq` | General | Yes |
| `/guides` | General | Yes |

## Worker Discovery (Domain A)
| Path | Target Audience | Indexable | Notes |
|------|-----------------|-----------|-------|
| `/jobs/roles` | Workers | Yes | Complete directory of supported roles |
| `/join-as-worker` | Workers | Yes | Onboarding flow overview |
| `/workers/how-it-works` | Workers | Yes | Visual steps to get hired |
| `/workers/faq` | Workers | Yes | Expanded worker support |
| `/jobs/:role` | Workers | Yes | Pre-rendered role categories |
| `/jobs/location/:location` | Workers | Yes | Pre-rendered city hubs |
| `/jobs/:role/:location` | Workers | No | Stubs until density threshold met |

## Service Hiring (Domain B)
| Path | Target Audience | Indexable | Notes |
|------|-----------------|-----------|-------|
| `/services/categories` | Individuals | Yes | Complete directory of B2C services |
| `/services/how-it-works` | Individuals | Yes | Request tracking overview |
| `/services/faq` | Individuals | Yes | Expanded hirer support |
| `/services/:service` | Individuals | Yes | Specific service overview page |
| `/services/:service/hire` | Individuals | No | Multi-step request wizard flow |
| `/services/:service/:location` | Individuals | No | Geo-stubs for services |

## B2B Workforce
| Path | Target Audience | Indexable | Notes |
|------|-----------------|-----------|-------|
| `/hire-workers/:service` | B2B | Yes | Specific B2B staffing offering |
| `/hire-workers/:service/:location`| B2B | No | Geo-stubs |

*Total unique dynamic paths tested in SSR: ~140*
