// Frontend Route Registry
export const routes = {
  home: {
    name: 'Home',
    path: '/',
    builder: () => '/',
    pageType: 'HomePageTemplate',
    audience: 'all',
    buildable: true,
    indexable: true,
  },
  
  // Worker Experience
  workerHub: {
    name: 'Worker Hub',
    path: '/jobs',
    builder: () => '/jobs',
    pageType: 'WorkerHubPage',
    audience: 'worker',
    buildable: true,
    indexable: true,
  },
  role: {
    name: 'Role Page',
    path: '/jobs/:role',
    builder: (role) => `/jobs/${role}`,
    pageType: 'RolePage',
    audience: 'worker',
    buildable: true,
    indexable: true,
  },
  location: {
    name: 'Location Page',
    path: '/jobs/location/:location',
    builder: (location) => `/jobs/location/${location}`,
    pageType: 'LocationPage',
    audience: 'worker',
    buildable: true,
    indexable: true,
  },
  roleLocation: {
    name: 'Role + Location Page',
    path: '/jobs/:role/:location',
    builder: (role, location) => `/jobs/${role}/${location}`,
    pageType: 'RoleLocationPage',
    audience: 'worker',
    buildable: true,
    indexable: true,
  },
  jobDetail: {
    name: 'Job Detail Page',
    path: '/jobs/detail/:jobId',
    builder: (jobId) => `/jobs/detail/${jobId}`,
    pageType: 'JobDetailPage',
    audience: 'worker',
    buildable: true,
    indexable: true, // Should be true for real jobs, guarded by isDemo logic
  },

  // B2B Employer Hub (Corporate/Staffing)
  hireWorkers: {
    name: 'Hire Workers Hub',
    path: '/hire-workers',
    builder: () => '/hire-workers',
    pageType: 'HireWorkersHubPage',
    audience: 'corporate',
    buildable: true,
    indexable: true,
  },
  b2bService: {
    name: 'B2B Service',
    path: '/hire-workers/:service',
    builder: (service) => `/hire-workers/${service}`,
    pageType: 'B2BServicePage',
    audience: 'corporate',
    buildable: true,
    indexable: true,
  },
  b2bServiceLocation: {
    name: 'B2B Service + Location',
    path: '/hire-workers/:service/:location',
    builder: (service, location) => `/hire-workers/${service}/${location}`,
    pageType: 'B2BServiceLocationPage', // Future implementation
    audience: 'corporate',
    buildable: false,
    indexable: false,
  },

  // B2C Individual Hirer Hub
  servicesHub: {
    name: 'Services Hub',
    path: '/services',
    builder: () => '/services',
    pageType: 'ServicesHubPage',
    audience: 'individual',
    buildable: true,
    indexable: true,
  },
  individualService: {
    name: 'Individual Service',
    path: '/services/:service',
    builder: (service) => `/services/${service}`,
    pageType: 'IndividualServicePage',
    audience: 'individual',
    buildable: true,
    indexable: true,
  },
  individualServiceLocation: {
    name: 'Individual Service + Location',
    path: '/services/:service/:location',
    builder: (service, location) => `/services/${service}/${location}`,
    pageType: 'IndividualServiceLocationPage', // Future implementation
    audience: 'individual',
    buildable: false,
    indexable: false, // Wait for backend supply
  },

  // Dedicated Contractor & Corporate Landings
  forContractors: {
    name: 'For Contractors',
    path: '/for-contractors',
    builder: () => '/for-contractors',
    pageType: 'ContractorPage',
    audience: 'contractor',
    buildable: true,
    indexable: true,
  },
  forCompanies: {
    name: 'For Companies',
    path: '/for-companies',
    builder: () => '/for-companies',
    pageType: 'CorporatePage',
    audience: 'corporate',
    buildable: true,
    indexable: true,
  },
};
