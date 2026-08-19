// Interface contract for the Workforce Repository
export class WorkforceRepository {
  getServices() { throw new Error("Not implemented"); }
  getRoles() { throw new Error("Not implemented"); }
  getLocations() { throw new Error("Not implemented"); }
  getServiceBySlug(slug) { throw new Error("Not implemented"); }
  getRoleBySlug(slug) { throw new Error("Not implemented"); }
  getLocationBySlug(slug) { throw new Error("Not implemented"); }
  getJobsByRoleAndLocation(roleSlug, locationSlug) { throw new Error("Not implemented"); }
  getJobById(id) { throw new Error("Not implemented"); }
}
