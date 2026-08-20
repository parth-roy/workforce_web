/**
 * indexabilityStatus values:
 *   "eligible"         — confirmed indexable; passed evidence threshold
 *   "not-yet-eligible" — architecturally valid, but lacks verified evidence
 *   "noindex"          — explicitly excluded
 */
export const mockLocations = [
  {
    id: 'loc-1',
    slug: 'barrackpore',
    name: 'Barrackpore',
    state: 'West Bengal',
    region: 'North 24 Parganas',
    description: 'An industrial and residential hub north of Kolkata, with growing logistics and manufacturing activity.',
    context: 'Barrackpore has a mix of small-scale manufacturing units, logistics warehouses, and residential demand for home services. Metro Mitra is building its worker network in this area.',
    availability: 'active',
    industries: ['Logistics', 'Manufacturing', 'Home Services'],
    indexabilityStatus: 'not-yet-eligible',
  },
  {
    id: 'loc-2',
    slug: 'dankuni',
    name: 'Dankuni',
    state: 'West Bengal',
    region: 'Hooghly',
    description: 'A key logistics and industrial corridor in Hooghly district, connecting major freight routes.',
    context: 'Dankuni is one of West Bengal\'s most active logistics corridors, hosting warehouses for major FMCG and e-commerce companies. Worker demand for helpers, loaders, and packers is consistently high in this area.',
    availability: 'active',
    industries: ['Logistics', 'Warehousing', 'FMCG Distribution'],
    indexabilityStatus: 'not-yet-eligible',
  },
  {
    id: 'loc-3',
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    region: 'Kolkata Metropolitan Area',
    description: 'The commercial and cultural capital of West Bengal, with diverse workforce requirements.',
    context: 'Kolkata has high demand for home services (electricians, plumbers, cleaners) and B2B staffing for retail, hospitality, and warehousing.',
    availability: 'active',
    industries: ['Home Services', 'Retail', 'Hospitality', 'Logistics'],
    indexabilityStatus: 'not-yet-eligible',
  },
  {
    id: 'loc-4',
    slug: 'hooghly',
    name: 'Hooghly',
    state: 'West Bengal',
    region: 'Hooghly District',
    description: 'An industrial district with textile, chemical, and logistics facilities.',
    context: 'Hooghly district hosts numerous manufacturing and logistics facilities along the Ganges corridor. Labour demand for shift-based work is significant.',
    availability: 'active',
    industries: ['Manufacturing', 'Logistics', 'Textiles'],
    indexabilityStatus: 'not-yet-eligible',
  },
];
