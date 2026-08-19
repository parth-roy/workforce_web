/**
 * indexabilityStatus values:
 *   "eligible"         — confirmed indexable
 *   "not-yet-eligible" — architecturally valid, lacking verified evidence
 *   "noindex"          — explicitly excluded
 */
export const mockRoles = [
  {
    id: 'role-1',
    slug: 'warehouse-helper',
    name: 'Warehouse Helper',
    description: 'Assist in daily warehouse operations, inventory management, and manual labor tasks.',
    requirements: ['Physical fitness', 'Basic reading skills'],
    earningModel: 'Per Shift',
    relatedServices: ['warehouse-staffing'],
    // Active operational role with presence in core zones.
    indexabilityStatus: 'not-yet-eligible',
  },
  {
    id: 'role-2',
    slug: 'electrician',
    name: 'Electrician',
    description: 'Perform electrical repairs and installations.',
    requirements: ['ITI Certification', '2+ years experience'],
    earningModel: 'Per Task',
    relatedServices: ['electrician'],
    indexabilityStatus: 'not-yet-eligible',
  },
];
