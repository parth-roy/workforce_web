# Workforce Job Type & Category Audit

## 1. Source of Truth for Categories
The job/service categories in the `workforce` Flutter app are **not API-driven**. They are purely UI labels defined as static lists (`List<Map<String, dynamic>>`) directly inside the widget files.

## 2. Category Definitions
There are two main places where job categories are defined for the individual hirer:

### A. Individual Hirer Home (`IndividualHirerHomeScreen`)
Displays a grid of services:
- Electrician
- Painter
- Plumber
- Cleaning
- AC Repair
- Appliance Repair
- Security

### B. Gig Categories (`HirerGigCategoryScreen`)
Displays a list of gig types:
- Loading/Unloading
- Electrician
- Plumber
- Cleaner / Sweeper
- General Helper
- Furniture Moving
- Heavy Loading
- Packer

## 3. Subcategories & Services
Each main category screen (e.g., `PlumberCategoryScreen`, `ApplianceCategoryScreen`) contains elaborate, hardcoded subcategories and specific services. 
For example, the Plumber category includes:
- **Tap & mixer** (e.g., Tap accessory installation)
- **Toilet** (e.g., Western toilet repair)
- **Bath & shower**
- **Basin & sink**
- **Drainage & blockage**
- **Water tank & motor**

All prices, durations (e.g., '30 mins'), options, and images for these subcategories are hardcoded and not fetched from any database.

## 4. Mapping UI Categories to Backend Types
In `hirer_gig_post_screen.dart`, there is a hardcoded map that translates the selected UI category into a specific gig type code for the backend (or dummy object):

```dart
const Map<String, String> _titleToCategory = {
  'Loading/Unloading':  'LOADER',
  'Electrician':        'ELECTRICIAN',
  'Plumber':            'HELPER',  // Note: Plumber maps to HELPER
  'Cleaner / Sweeper':  'CLEANER',
  'General Helper':     'HELPER',
  'Furniture Moving':   'FURNITURE_MOVER',
  'Heavy Loading':      'HEAVY_LOADER',
  'Packer':             'PACKER',
  'Rigger':             'RIGGER',
};
```
*Observation: Interestingly, "Plumber" is mapped to the `HELPER` backend category, indicating that either the backend doesn't support a dedicated plumber type yet, or this is a temporary mockup shortcut.*

## 5. Conclusion
Job and service categories are currently UI mockups. To make this production-ready, the app needs to fetch categories, subcategories, pricing, and specific backend codes from a centralized API (e.g., a `PricingConfig` or `ServiceCatalog` endpoint) rather than relying on hardcoded lists and `if/else` navigation blocks.
