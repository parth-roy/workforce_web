OBSOLETE — SUPERSEDED BY CURRENT FRONTEND ARCHITECTURE

# 04 Workforce Service Catalog (Frontend Domain Model)

This document defines the frontend domain model for the Service Catalog and Workforce Categories, mapped from the existing Flutter app and `workforce_web/src/data` configurations.

## 1. User Types

The application handles two primary modes: `EMPLOYEE` and `HIRER`. 
Hirers are further categorized into specific organization types.

```typescript
enum UserMode {
  EMPLOYEE = 'EMPLOYEE',
  HIRER = 'HIRER'
}

enum OrganizationType {
  OTHER = 'OTHER', // Individual
  COMPANY = 'COMPANY', // Company / Corporate
  CONTRACTOR = 'CONTRACTOR' // Manpower Contractor
}
```

## 2. Core Service Catalog Entities

Based on `roles.js`, `workerSchemas.js`, and the Flutter app structure, the catalog is structured hierarchically.

### 2.1 Role / Category

A top-level category of worker (e.g., Electrician, Plumber).

```typescript
interface Category {
  id: string; // e.g., 'electrician', 'plumber', 'ac-cleaner'
  name: string; // e.g., 'Electrician', 'Plumber'
  iconUrl: string; // e.g., '/services-icons-images/electrician.webp'
  badge?: string; // Optional badge like '25 min'
  isMore?: boolean; // UI flag for 'More' button
}
```

### 2.2 Subcategory (Service Section)

Used in the app to group related services within a Category (e.g., "Switch & socket", "Fan" under "Electrician").

```typescript
interface ServiceSection {
  id: string; 
  categoryId: string; // Links back to parent Category
  title: string; // e.g., 'Switch & socket', 'Fan', 'Wiring'
  services: ServiceItem[];
}
```

### 2.3 Service Item

An individual bookable service inside a section.

```typescript
interface ServiceItem {
  id: string;
  sectionId: string;
  title: string; // e.g., 'Switch/socket repair & replacement'
  rating: string; // e.g., '4.83'
  reviewsCount: string; // e.g., '196K'
  price: number; 
  timeEstimate?: string; // e.g., '30 mins'
  tag?: string; // e.g., 'SUPER SAVER'
  optionsCount: number; // 0 means standard "Add", >0 means has sub-options
  imageUrl: string; 
}
```

## 3. Dynamic Booking Schemas

When a hirer selects a service, they may be prompted with dynamic questions to specify the job details. These schemas correspond to `workerSchemas.js`.

```typescript
type SchemaFieldType = 'select' | 'number' | 'boolean' | 'text';

interface SchemaField {
  name: string;
  label: string;
  type: SchemaFieldType;
  options?: string[]; // Only for 'select' type
  min?: number; // Only for 'number' type
  max?: number;
}

interface WorkerBookingSchema {
  categoryId: string; // The role/category ID (e.g., 'electrician')
  fields: SchemaField[];
}
```

## 4. Domain Mapping Rules

- **Category Mapping:** Hardcoded roles in `roles.js` (`ac-cleaner`, `electrician`, etc.) map to `Category` domain objects.
- **Dynamic Schemas:** Booking form generation utilizes `WorkerBookingSchema`, directly resolving the structure defined in `workerSchemas.js`. 
- **Employee View vs Hirer View:** 
  - `EMPLOYEE`: Interacts with job feeds filtered by their selected `Category`.
  - `HIRER`: Browses `Category` -> `ServiceSection` -> `ServiceItem`, fills out the `WorkerBookingSchema`, and posts a gig.
