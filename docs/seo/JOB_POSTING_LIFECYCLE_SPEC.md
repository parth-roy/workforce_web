OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# JOB POSTING LIFECYCLE SPECIFICATION

This document outlines the official lifecycle and structured data policy for JobPostings on Metro Mitra, strictly aligning with Google JobPosting guidelines.

## 1. Structured Data Eligibility
*   **JobPosting Schema MUST ONLY** be used for genuine, individual, specific job openings.
*   **JobPosting Schema MUST NEVER** be used on evergreen job category pages (e.g., general "Warehouse Helper" pages).
*   **Fake timestamps** (e.g., `Date.now() + 90 days`) are strictly prohibited.

## 2. Expiration & ValidThrough Rules
| Job Condition | `validThrough` Handling |
|---|---|
| **Known Expiration Date** | Explicitly include `validThrough` property. |
| **No Known Expiration Date** | Omit `validThrough`. Do not invent a future date. |

## 3. Expired Job URL Handling Matrix
| Job State | HTTP Status | Indexability | Schema Treatment |
|---|---|---|---|
| **Active** | 200 OK | Indexable | Complete `JobPosting` schema |
| **Closed (No replacement value)** | 404 Not Found or 410 Gone | Removed from Index | N/A (Page removed) |
| **Closed (Useful semantic replacement exists)** | 301 Permanent Redirect | Redirects to replacement | N/A |
| **Expired (but kept live)** | STRICTLY PROHIBITED | STRICTLY PROHIBITED | STRICTLY PROHIBITED |

*Never keep an expired JobPosting live and accessible as though it is an active opportunity.*
