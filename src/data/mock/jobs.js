export const mockJobs = [
  {
    id: 'demo-job',
    title: 'Sample Job Title',
    employer: 'Demo Employer',
    locationSlug: 'dankuni',
    roleSlug: 'warehouse-helper',
    compensation: 'Demo Compensation',
    shift: 'Demo Shift',
    employmentType: 'Demo Type',
    requirements: 'Sample Requirement',
    description: 'Sample Description for structural UI testing only.',
    status: 'active',
    // Demo jobs are permanently excluded from indexing, sitemap, and schema.
    isDemo: true,
    indexabilityStatus: 'noindex',
  },
];
