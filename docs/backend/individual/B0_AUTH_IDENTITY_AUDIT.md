# Auth & Identity Forensic Audit

## 1. How Individual Hirer Authentication Works

The authentication model relies on Contextual JWTs rather than strictly enforcing a single database-level role per user for authorization. 

1. **OTP Verification & Role Request**: During login (`verifyOtp` in `auth.service.ts`), the client specifies the context they are logging in as by providing a `role` parameter (e.g., `role: 'CUSTOMER'`).
2. **Initial DB Creation vs Subsequent Logins**: If the user is new, their root `User.role` in the database is set to the requested role. However, for existing users, the `User.role` is *not* updated in the database during login.
3. **Contextual JWT Issuance**: The `issueTokenPair` function injects the *requested* `role` into the JWT payload, ignoring the user's root DB role for the session.
4. **Middleware Extraction**: On subsequent API requests, `auth.middleware.ts` extracts the `role` from the JWT and attaches it to `req.user.role`.
5. **Context Resolution**: The `workspaceResolverRegistry` inspects the request. Since Individual Hirers do not pass an `x-organization-id` header, it defaults to the `PERSONAL` workspace.
6. **Final Identity**: The resulting request context sets `workspace.type = 'PERSONAL'` and `platformIdentity.type = req.user.role` (which is `CUSTOMER`).

## 2. Comparison: WORKER vs COMPANY/CONTRACTOR Contexts

- **WORKER Context**: This behaves exactly like the Individual Hirer path. The Workforce app sends `role: 'WORKER'` during login, receives a `WORKER` JWT, and operates within a `PERSONAL` workspace with a `WORKER` platform identity.
- **COMPANY/CONTRACTOR (Organization) Context**: Users operating on behalf of an organization include an `x-organization-id` header in their API requests. The `OrganizationWorkspaceResolver` intercepts this, verifies the user's active membership in the organization, and overrides the context. The `workspace.type` becomes `ORGANIZATION`, and `platformIdentity.type` becomes `ORGANIZATION_MEMBER`, with `platformIdentity.role` set to their specific organization role (e.g., `ADMIN`, `MEMBER`).

## 3. Support for Individual Hirers Without Organization Creation

**Yes, the contextual JWT model natively supports an Individual Hirer without requiring Organization creation.**

Because the session context is defined dynamically by the JWT payload and the `PERSONAL` workspace is the default fallback, a single physical user (one phone number account) can seamlessly operate as both a Worker and a Customer:
- Logging in via the Workforce app yields a `WORKER` JWT (Personal Workspace).
- Logging in via the Customer app yields a `CUSTOMER` JWT (Personal Workspace).

The system seamlessly switches their `platformIdentity` based on the token provided, eliminating the need to force Individual Hirers into single-person Organizations or require separate phone numbers for different app roles.
