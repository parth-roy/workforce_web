# B0_SERVICE_CATALOG_AUDIT

## Executive Summary
An audit of the backend (`server/`) was conducted to determine how the service catalog (e.g., Electrician, Plumber, Helper, etc.) is implemented. The findings reveal a flat, hardcoded implementation that differs significantly from the frozen web model hierarchy. 

## Technical Findings

1. **Implementation Type**: 
   - The service catalog is **NOT** represented in the database (Prisma schema).
   - It is hardcoded as a TypeScript union type/enum and constant dictionaries in the application code.

2. **Location of Data**:
   - `server/src/modules/gig/gig.pricing.types.ts`
   - `server/src/modules/gig/gig.pricing.ts`

3. **Current Data Structure**:
   - The services are defined as a simple flat union type `GigSkill`:
     ```typescript
     export type GigSkill = 'HELPER' | 'LOADER' | 'FURNITURE_MOVER' | 'HEAVY_LOADER' | 'PACKER' | 'CLEANER' | 'ELECTRICIAN' | 'RIGGER';
     ```
   - These skills are mapped to multipliers and display labels via `getSkillCatalog()` in `gig.pricing.ts`:
     - `HELPER` -> "General Helper" (Multiplier: 1.0)
     - `CLEANER` -> "Cleaning / Housekeeping" (Multiplier: 1.1)
     - `LOADER` -> "Loader / Unloader" (Multiplier: 1.2)
     - `PACKER` -> "Professional Packer" (Multiplier: 1.4)
     - `FURNITURE_MOVER` -> "Furniture Moving" (Multiplier: 1.3)
     - `HEAVY_LOADER` -> "Heavy Loading" (Multiplier: 1.5)
     - `ELECTRICIAN` -> "Electrician" (Multiplier: 2.0)
     - `RIGGER` -> "Certified Rigger" (Multiplier: 3.0)

## Comparison to the Frozen Web Model
The **frozen web model** expects a deeply hierarchical structure:
`Category -> Service Section -> Service Item -> Role -> Requirement`

**Current Backend State vs Web Model:**
- **Flat vs Hierarchical:** The backend has a single, flat list of `GigSkill`s. There are no Categories, Service Sections, or Service Items wrapping these roles.
- **Role Equivalency:** The `GigSkill` union essentially represents the "Role" level of the web model (e.g., Electrician, Helper, Packer), but completely lacks the required parent associations.
- **Missing Entities:** There is no representation of "Requirement" (e.g., tools needed, specific certifications) associated with these skills in the pricing engine or database schema.
- **Database Presence:** The web model's dynamic nature implies these should be database-driven entities, but they are currently static constants in code.

## Conclusion
The backend currently relies on a static, flat, and hardcoded `GigSkill` enumeration for gig pricing and cataloging. This is incompatible with the multi-level hierarchical frozen web model and would require significant structural refactoring (likely introducing new database models for Category, Section, Item, Role, and Requirement) to achieve alignment.
