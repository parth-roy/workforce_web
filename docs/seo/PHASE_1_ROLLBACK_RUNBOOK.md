OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# PHASE 1 ROLLBACK RUNBOOK

If Phase 1 execution causes build failures, rendering errors, or unacceptable SEO drops, the following exact rollback steps must be executed.

## 1. Application (Git Rollback)
Restore the React codebase to the pre-Phase 1 state.
```bash
git checkout main
git reset --hard <pre-phase-1-commit-hash>
npm install
npm run build
```

## 2. Infrastructure (Nginx & Routing)
Restore the Nginx proxy behavior and remove the 301 migration redirects.
```bash
# On the Droplet
sudo cp /etc/nginx/sites-available/metromitra.com.bak /etc/nginx/sites-available/metromitra.com
sudo systemctl reload nginx
```
This restores the previous route mappings and preserves safe old routes.

## 3. SEO & Schema
By resetting the Git repository, the `react-helmet-async` definitions in `src/data/pages.js` and the schema helpers in `src/data/schema-helpers.js` will revert to their original forms, restoring the previous metadata/schema implementations.

## 4. Sitemap & Robots
Reverting Git will restore the original `generate-sitemap.js` and `public/robots.txt` generator behaviors.

## 5. URL Migration Reversal
The Nginx revert ensures that old URLs (e.g., `/logistics-jobs`) return 200 OK via the CSR SPA router again instead of 301 redirecting.

## Verification of Rollback
- Run `curl -I https://metromitra.com/logistics-jobs` and verify it returns `200 OK` (not `301`).
- Verify the `emblem.svg` returns to the homepage.
- Verify `view-source:https://metromitra.com` shows the empty `<div id="root"></div>` (original CSR behavior).
