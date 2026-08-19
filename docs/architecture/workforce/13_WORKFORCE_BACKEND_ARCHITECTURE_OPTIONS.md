# 13: Workforce Backend Architecture Options

As the Parther Logistics Platform expands to support the new Workforce Web client and advanced Workforce operations, we evaluated three primary architectural approaches for the Workforce backend domain.

## Option 1: GoMyTruck Module (Monolith)

Integrating all workforce logic into the existing monolithic Node.js + Express application (`server/src/modules/workforce`).

### Architecture Overview
- **Codebase:** Single repository (`server/`).
- **Database:** Shared PostgreSQL (Supabase) via Prisma.
- **Deployment:** Single Node.js process.
- **Communication:** In-memory function calls and EventBus.

### Pros
- **Maximum Reuse:** Leverages existing Auth, Payment, Socket.IO, and Notification modules without overhead.
- **Data Integrity:** Allows straightforward cross-domain transactions (e.g., Booking + Workforce updates) using Prisma transactions.
- **Simplicity:** No changes to existing CI/CD or infrastructure. Single deployment artifact.
- **Time to Market:** Fastest approach for adding new capabilities.

### Cons
- **Blast Radius:** A crash or memory leak in the Workforce module brings down the core customer and fleet APIs.
- **Monolith Bloat:** Increases the size and complexity of an already large codebase.
- **Tight Coupling:** Risk of entangling domain logic (e.g., Booking logic leaking into Workforce controllers).

---

## Option 2: Separate Backend (Microservice)

Creating a standalone backend specifically for the Workforce domain (e.g., `workforce-server`).

### Architecture Overview
- **Codebase:** Distinct repository or top-level directory.
- **Database:** Separate database or highly isolated schema.
- **Deployment:** Independently scaled Node.js/Go process.
- **Communication:** HTTP REST, gRPC, or Message Queue (e.g., RabbitMQ).

### Pros
- **Fault Isolation:** Total blast radius isolation; core systems survive workforce outages.
- **Independent Scalability:** Can scale workforce tracking independently of customer APIs.
- **Team Autonomy:** Dedicated team can work on the workforce backend without stepping on core team's toes.

### Cons
- **Data Synchronization:** Hardest challenge; requires complex eventual consistency for shared entities like Bookings and Users.
- **Operational Overhead:** Doubles the CI/CD pipelines, monitoring, and deployment infrastructure.
- **Latency:** Cross-domain operations require network hops.

---

## Option 3: Shared Platform (Modular Monolith / Service-Oriented)

Refactoring the system to extract common platform capabilities (Auth, Maps, Communications) into shared services or internal packages, while keeping domain services logically separated but potentially deployed together.

### Architecture Overview
- **Codebase:** Monorepo with separated packages (`@parther/auth`, `@parther/workforce`, `@parther/core`).
- **Database:** Shared Database but strictly enforced logical boundaries (no direct table joins across domains).
- **Deployment:** Can be deployed as one process or split into macro-services.

### Pros
- **Clean Boundaries:** Enforces strict modularity and separation of concerns.
- **Flexibility:** Allows extracting the Workforce module into its own microservice later if scale demands it.
- **Reusability:** Clean abstraction of core platform capabilities.

### Cons
- **Initial Refactoring Cost:** High effort to disentangle the current `server/` into clean packages.
- **Local Developer Experience:** Harder to set up and run multiple packages compared to a simple monolith.
- **Overengineering Risk:** Might be premature optimization given the current platform scale.
