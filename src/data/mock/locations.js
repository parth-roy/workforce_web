/**
 * indexabilityStatus values:
 *   "eligible"         — confirmed indexable; passed evidence threshold
 *   "not-yet-eligible" — architecturally valid, but lacks verified evidence
 *                        (will upgrade during geo-expansion rollout)
 *   "noindex"          — explicitly excluded
 */
export const mockLocations = [
  {
    id: 'loc-1',
    slug: 'barrackpore',
    name: 'Barrackpore',
    state: 'West Bengal',
    availability: 'active',
    // Tier-1 Core Base (HQ region). Eligible once active job count confirmed.
    indexabilityStatus: 'not-yet-eligible',
  },
  {
    id: 'loc-2',
    slug: 'dankuni',
    name: 'Dankuni',
    state: 'West Bengal',
    availability: 'active',
    // Tier-1 Industrial Logistics. Eligible once active job count confirmed.
    indexabilityStatus: 'not-yet-eligible',
  },
];
