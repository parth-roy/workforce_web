# 08 Auth & Identity Analysis

## Overview
This document analyzes the authentication, identity, and User model architecture within the Parther Logistics backend (`server/`), specifically examining how personas (Customer, Driver, Worker, Fleet Owner) are handled and whether a single account can hold multiple roles simultaneously.

## Findings: Multi-Persona Support

**Conclusion: Yes, the platform natively supports multi-persona users.** 
A single physical user (bound by a unique phone number) can act as a Customer, a Driver, a Worker, and a Fleet Owner simultaneously, without needing separate phone numbers or accounts.

### 1. Database Schema
The database schema (`User` model) centrally identifies users by their `phone` number (which is `@unique`). The `User` record holds optional 1-to-1 relationships to each persona:
- `driver Driver?`
- `worker Worker?`
- `fleetOwner FleetOwner?`

While there is a root `role UserRole @default(CUSTOMER)` field on the `User` table, it acts primarily as a default. The existence of the related persona records (`Driver`, `Worker`, `FleetOwner`) physically enables a single user to participate in multiple facets of the platform.

### 2. Contextual Authentication (JWTs)
The platform uses OTP-based authentication (`auth.service.ts` for Customer/Driver/Fleet, and `workforce.service.ts` for Worker). The auth flow is designed for **Contextual Login**:

- When an OTP is verified, the client application passes its intended `role` (e.g., `WORKER` from the Workforce app, `DRIVER` from the Driver app).
- The `verifyOtp` function upserts the `User` based on the phone number. If the user already exists (e.g., they previously registered as a Customer), it retains their existing user record.
- It then ensures the respective persona record is created (e.g., `prisma.worker.upsert` or `prisma.driver.create`).
- Finally, it issues an `accessToken` and `refreshToken` (JWTs). **Crucially, the `role` embedded in the JWT payload is the contextual role requested by the app during login, not the base DB role.**
- The `authenticate` middleware (`auth.middleware.ts`) extracts `req.user.role` directly from the JWT payload.

### 3. Impact on Workforce + Individual Hirer
Because the authentication mechanism validates API endpoints based on the `role` in the JWT payload, a user's phone number could be used to:
1. Log into the **Customer/Hirer App** → Receives a JWT with `role: 'CUSTOMER'`. Can create gig listings and truck bookings.
2. Log into the **Workforce App** → Receives a separate JWT with `role: 'WORKER'`. Can browse and accept gigs.

Both apps can be logged in concurrently on the same device or different devices. The actions will be isolated by the JWT context, but ultimately link back to the same `userId` and `phone` in the database.

## Summary
The backend architecture fully supports users having multiple roles. Identity is centralized around the phone number, and persona-based authorization is decentralized via contextual JWTs. There is no architectural block preventing a single person from being both a Worker and an Individual Hirer (Customer).
