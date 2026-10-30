/**
 * src/utils/slugMapper.js
 * ─────────────────────────────────────────────────────────────────────────────
 * METRO MITRA — Bidirectional Service-to-Role Slug Mapping
 *
 * Prevents 200 OK Soft 404s by ensuring cross-funnel links always resolve to
 * valid registered routes.
 */

export const SERVICE_TO_ROLE_MAP = {
  'electrician': 'electrician',
  'painter': 'painter',
  'plumber': 'plumber',
  'cleaning': 'cleaner',
  'ac-repair': 'ac-technician',
  'appliance-repair': 'appliance-technician',
  'security': 'security-guard',
  'carpenter': 'carpenter',
  'loading-unloading': 'loader-unloader',
  'general-helper': 'general-helper',
  'furniture-moving': 'furniture-mover',
  'packer': 'packer',
  'last-mile-delivery': 'delivery-associate'
};

export const ROLE_TO_SERVICE_MAP = {
  'electrician': 'electrician',
  'painter': 'painter',
  'plumber': 'plumber',
  'cleaner': 'cleaning',
  'ac-technician': 'ac-repair',
  'appliance-technician': 'appliance-repair',
  'security-guard': 'security',
  'carpenter': 'carpenter',
  'loader-unloader': 'loading-unloading',
  'general-helper': 'general-helper',
  'furniture-mover': 'furniture-moving',
  'packer': 'packer',
  'delivery-associate': 'last-mile-delivery'
};

export function getRoleSlugForService(serviceSlug) {
  return SERVICE_TO_ROLE_MAP[serviceSlug] || serviceSlug;
}

export function getServiceSlugForRole(roleSlug) {
  return ROLE_TO_SERVICE_MAP[roleSlug] || roleSlug;
}
