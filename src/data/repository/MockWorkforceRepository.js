import { WorkforceRepository } from './WorkforceRepository';
import { mockServices } from '../mock/services';
import { mockRoles } from '../mock/roles';
import { mockLocations } from '../mock/locations';
import { mockJobs } from '../mock/jobs';

export class MockWorkforceRepository extends WorkforceRepository {
  getServices() { return mockServices; }
  getRoles() { return mockRoles; }
  getLocations() { return mockLocations; }
  getServiceBySlug(slug) { return mockServices.find(s => s.slug === slug); }
  getRoleBySlug(slug) { return mockRoles.find(r => r.slug === slug); }
  getLocationBySlug(slug) {
    if (!slug) return null;
    const found = mockLocations.find(l => l.slug === slug);
    if (found) return found;
    const formattedName = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      id: `loc-${slug}`,
      slug: slug,
      name: formattedName,
      type: 'SEO_HUB',
      districtId: `d-${slug}`,
      stateId: 's-in',
      countryCode: 'IN',
      state: 'India',
      region: `${formattedName} Region`,
      latitude: 20.5937,
      longitude: 78.9629,
      schemaData: {
        addressLocality: formattedName,
        addressRegion: 'India',
        postalCode: '100001',
        geo: { lat: 20.5937, lng: 78.9629 }
      },
      localPricingConfig: { minimumFare: 250 },
      description: `Trusted on-demand home service technicians, daily wage labor, and verified gig workers in ${formattedName}.`,
      context: `${formattedName} is an active urban economic center with strong local demand for skilled home service technicians, commercial helpers, and daily gig workers.`,
      availability: 'active',
      industries: ['Home Services', 'Retail', 'Hospitality', 'Logistics', 'Trade Services', 'Construction'],
      indexabilityStatus: 'eligible',
      featured: true
    };
  }
  getJobsByRoleAndLocation(roleSlug, locationSlug) {
    return mockJobs.filter(j => 
      (!j.isDemo) &&
      (!roleSlug || j.roleSlug === roleSlug) && 
      (!locationSlug || j.locationSlug === locationSlug)
    );
  }
  getJobById(id) { return mockJobs.find(j => j.id === id); }
}
