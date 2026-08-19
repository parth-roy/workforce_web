OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# REDIRECT IMPLEMENTATION SPECIFICATION

React Router redirects are insufficient for SEO. Redirects must occur at the infrastructure layer before the application boots.

## Infrastructure Analysis
Based on `.github/workflows/deploy.yml`, the application is deployed directly to an Ubuntu Droplet via SSH to `/var/www/workforce_web`. The server runs **Nginx**.

## Implementation Strategy
All 301 redirects will be implemented directly in the Nginx server block configuration.

### Implementation Layer
- **Target File:** `/etc/nginx/sites-available/metromitra.com` (or equivalent).
- **Behavior:** Explicit `return 301` directives.

### Exact 301 Behavior Example
```nginx
server {
    server_name metromitra.com;

    # Exact match redirects
    location = /logistics-jobs {
        return 301 https://metromitra.com/jobs/logistics/;
    }
    location = /employer-hiring {
        return 301 https://metromitra.com/hire-workers/;
    }
    
    # ... other mappings from URL_MIGRATION_MATRIX.md
}
```

### Prevention Rules
1. **No Redirect Chains:** All redirects point directly to the final destination canonical URL.
2. **No Redirect Loops:** The Nginx rules will strictly match exact paths (`location = /path`) to prevent regex loops.
3. **Canonical Synchronization:** The destination HTML will contain `<link rel="canonical" href="...">` matching the exact destination URL.

### Rollback Process
Reverting the Nginx configuration to the previous state and running `sudo systemctl reload nginx`. This ensures immediate fallback.
