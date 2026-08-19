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
  getLocationBySlug(slug) { return mockLocations.find(l => l.slug === slug); }
  getJobsByRoleAndLocation(roleSlug, locationSlug) {
    return mockJobs.filter(j => 
      (!roleSlug || j.roleSlug === roleSlug) && 
      (!locationSlug || j.locationSlug === locationSlug)
    );
  }
  getJobById(id) { return mockJobs.find(j => j.id === id); }
}
