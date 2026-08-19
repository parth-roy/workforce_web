# 18. Scalability & Maturity Model

This document outlines the evolutionary path of the Parther Logistics Workforce platform architecture, detailing how it will scale to handle increased volume, geographical expansion, and complex bidding dynamics.

## 1. Maturity Stages

### Level 1: Foundation (Current State)
- **Architecture:** Monolithic Node.js/Express backend servicing all domains (Customer, Driver, Admin).
- **Database:** Single PostgreSQL (Supabase) instance with Prisma ORM.
- **Real-time:** Socket.IO running on the main node instance (`/tracking`, `/marketplace`).
- **Matching:** Synchronous auto-assignment logic based on basic geo-radius (Mapbox API).
- **Limitations:** High DB contention during surge hours; Socket.IO connections bound to a single server process.

### Level 2: Separation & Caching (Near Term)
- **Architecture:** API Gateway with logical service boundaries. Separation of heavy read endpoints from write-heavy transactional paths.
- **Caching:** Introduce Upstash Redis for caching active job metadata, worker availability states, and pricing configuration, reducing Prisma/Postgres load.
- **Scaling Sockets:** Implement a Redis Adapter for Socket.IO to allow horizontal scaling of the real-time servers across multiple Node instances.
- **Worker Matching:** Move dispatch logic to a dedicated background worker (e.g., BullMQ) to avoid blocking the main event loop.

### Level 3: Micro-services & Event-Driven (Medium Term)
- **Architecture:** Extract Workforce matching, Marketplace (Private Bidding), and Pricing Engine into distinct micro-services.
- **Event Bus:** Utilize Kafka or RabbitMQ as the central nervous system. A booking creation emits a `BookingRequested` event, consumed asynchronously by the Pricing and Marketplace services.
- **Database:** Implement Read Replicas for high-volume queries (e.g., fetching available loads for fleet owners).

### Level 4: Geographical Sharding & ML (Long Term)
- **Architecture:** Multi-region deployment to minimize latency for drivers in different states/countries.
- **Database:** Shard the PostgreSQL database by geographical region (e.g., `region_north`, `region_south`) as workforce pools rarely cross massive geographical boundaries for hyper-local logistics.
- **Intelligence:** Implement ML models for predictive demand (Surge Pricing) and intelligent worker-to-load matching (minimizing deadhead miles).

## 2. Capacity Planning & Limits

| Component | Current Capacity | Target (Level 2) | Target (Level 3) |
| :--- | :--- | :--- | :--- |
| **Concurrent WebSockets** | ~5,000 | 50,000 (Redis Adapter) | 500,000+ (Dedicated WS Fleet) |
| **Bid Processing / Sec** | ~50 TPS | 500 TPS | 5,000 TPS (Event-driven) |
| **Location Updates** | DB Write Heavy | Redis Geospatial cache | In-Memory Grid |

## 3. Resilience and Failover

- **Rate Limiting:** IP and Token-based rate limiting (via Redis) to prevent abuse of the marketplace endpoints.
- **Circuit Breakers:** External API calls (Mapbox, Razorpay, Gov APIs) are wrapped in circuit breakers to fail gracefully, falling back to cached estimates or queuing payouts for later retry.
- **Idempotency:** All critical workforce actions (accepting a job, submitting a bid) require an idempotency key to prevent double-booking or double-charging during network retries.

## 4. Observability and SLOs

- **Metrics:** Track `Time to Match`, `Bid Acceptance Rate`, and `Worker App Crash Rate`.
- **Alerting:** PagerDuty/Slack alerts triggered if the Pricing Engine fails or if background jobs (BullMQ) queue depth exceeds 10,000 items.
- **SLOs:** 
  - 99.9% uptime for the `Workforce API`.
  - < 200ms response time for active job retrieval.
  - < 50ms latency for WebSocket location broadcasts.
