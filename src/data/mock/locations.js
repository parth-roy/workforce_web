/**
 * indexabilityStatus values:
 *   "eligible"         — confirmed indexable; passed evidence threshold
 *   "not-yet-eligible" — architecturally valid, but lacks verified evidence
 *   "noindex"          — explicitly excluded
 */
export const geoEntities = {
  countries: [
    { id: 'c-IN', code: 'IN', name: 'India', indexabilityStatus: 'eligible' }
  ],
  states: [
    { id: 's-WB', code: 'WB', name: 'West Bengal', countryId: 'c-IN', indexabilityStatus: 'eligible' }
  ],
  districts: [
    { id: 'd-N24P', slug: 'north-24-parganas', name: 'North 24 Parganas', stateId: 's-WB', indexabilityStatus: 'eligible' },
    { id: 'd-HGLY', slug: 'hooghly-district', name: 'Hooghly District', stateId: 's-WB', indexabilityStatus: 'eligible' },
    { id: 'd-KOL', slug: 'kolkata-district', name: 'Kolkata District', stateId: 's-WB', indexabilityStatus: 'eligible' }
  ]
};

export const mockLocations = [
  {
    id: 'loc-1',
    slug: 'barrackpore',
    name: 'Barrackpore',
    type: 'SEO_HUB',
    districtId: 'd-N24P',
    stateId: 's-WB',
    countryCode: 'IN',
    state: 'West Bengal',
    region: 'North 24 Parganas',
    latitude: 22.7600,
    longitude: 88.3700,
    schemaData: {
      addressLocality: 'Barrackpore',
      addressRegion: 'West Bengal',
      postalCode: '700120',
      geo: { lat: 22.7600, lng: 88.3700 }
    },
    localPricingConfig: {
      minimumFare: 275,
    },
    description: 'An industrial and residential hub north of Kolkata, with growing logistics and manufacturing activity.',
    context: 'Barrackpore has a mix of small-scale manufacturing units, logistics warehouses, and residential demand for home services. Metro Mitra is building its worker network in this area.',
    availability: 'active',
    industries: ['Logistics', 'Manufacturing', 'Home Services'],
    indexabilityStatus: 'eligible',
  },
  {
    id: 'loc-2',
    slug: 'dankuni',
    name: 'Dankuni',
    type: 'LOCALITY',
    parentHubId: 'loc-4',
    districtId: 'd-HGLY',
    stateId: 's-WB',
    countryCode: 'IN',
    state: 'West Bengal',
    region: 'Hooghly',
    latitude: 22.6738,
    longitude: 88.2917,
    schemaData: {
      addressLocality: 'Dankuni',
      addressRegion: 'West Bengal',
      postalCode: '712311',
      geo: { lat: 22.6738, lng: 88.2917 }
    },
    localPricingConfig: {
      minimumFare: 300,
    },
    description: 'A key logistics and industrial corridor in Hooghly district, connecting major freight routes.',
    context: 'Dankuni is one of West Bengal\'s most active logistics corridors, hosting warehouses for major FMCG and e-commerce companies. Worker demand for helpers, loaders, and packers is consistently high in this area.',
    availability: 'active',
    industries: ['Logistics', 'Warehousing', 'FMCG Distribution'],
    indexabilityStatus: 'eligible',
  },
  {
    id: 'loc-3',
    slug: 'kolkata',
    name: 'Kolkata',
    type: 'SEO_HUB',
    districtId: 'd-KOL',
    stateId: 's-WB',
    countryCode: 'IN',
    state: 'West Bengal',
    region: 'Kolkata Metropolitan Area',
    latitude: 22.5726,
    longitude: 88.3639,
    schemaData: {
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700001',
      geo: { lat: 22.5726, lng: 88.3639 }
    },
    localPricingConfig: {
      minimumFare: 250,
    },
    description: 'The commercial and cultural capital of West Bengal, with diverse workforce requirements.',
    context: 'Kolkata has high demand for home services (electricians, plumbers, cleaners) and B2B staffing for retail, hospitality, and warehousing.',
    availability: 'active',
    industries: ['Home Services', 'Retail', 'Hospitality', 'Logistics'],
    indexabilityStatus: 'eligible',
  },
  {
    id: 'loc-4',
    slug: 'hooghly',
    name: 'Hooghly',
    type: 'SEO_HUB',
    districtId: 'd-HGLY',
    stateId: 's-WB',
    countryCode: 'IN',
    state: 'West Bengal',
    region: 'Hooghly District',
    latitude: 22.9010,
    longitude: 88.3962,
    schemaData: {
      addressLocality: 'Chinsurah',
      addressRegion: 'West Bengal',
      postalCode: '712101',
      geo: { lat: 22.9010, lng: 88.3962 }
    },
    localPricingConfig: {
      minimumFare: 250,
    },
    description: 'An industrial district with textile, chemical, and logistics facilities.',
    context: 'Hooghly district hosts numerous manufacturing and logistics facilities along the Ganges corridor. Labour demand for shift-based work is significant.',
    availability: 'active',
    industries: ['Manufacturing', 'Logistics', 'Textiles'],
    indexabilityStatus: 'eligible',
  },
];
