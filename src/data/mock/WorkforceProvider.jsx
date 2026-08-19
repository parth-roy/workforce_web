import React, { createContext, useContext, useMemo } from 'react';
import { MockWorkforceRepository } from '../repository/MockWorkforceRepository';

const WorkforceContext = createContext(null);
const defaultRepository = new MockWorkforceRepository();

// Presentation Mapper
function mapToJobViewModel(job, repository) {
  if (!job) return null;
  const location = repository.getLocationBySlug(job.locationSlug);
  const role = repository.getRoleBySlug(job.roleSlug);
  
  return {
    id: job.id,
    title: job.title,
    employerName: job.employer,
    role: role ? { name: role.name, slug: role.slug } : null,
    location: location ? { name: location.name, slug: location.slug } : null,
    compensation: job.compensation,
    employmentType: job.employmentType || 'Standard',
    shift: job.shift,
    requirements: job.requirements,
    description: job.description,
    status: job.status,
    isDemo: job.isDemo
  };
}

export function WorkforceProvider({ children, repository = defaultRepository }) {
  const value = useMemo(() => {
    return {
      services: repository.getServices(),
      roles: repository.getRoles(),
      locations: repository.getLocations(),
      getServiceBySlug: (slug) => repository.getServiceBySlug(slug),
      getRoleBySlug: (slug) => repository.getRoleBySlug(slug),
      getLocationBySlug: (slug) => repository.getLocationBySlug(slug),
      
      // Normalized View Models
      getJobById: (id) => mapToJobViewModel(repository.getJobById(id), repository),
      getJobsByRoleAndLocation: (roleSlug, locSlug) => 
        repository.getJobsByRoleAndLocation(roleSlug, locSlug)
                  .map(job => mapToJobViewModel(job, repository)),
      
      loading: false
    };
  }, [repository]);

  return (
    <WorkforceContext.Provider value={value}>
      {children}
    </WorkforceContext.Provider>
  );
}

export const useWorkforce = () => {
  const context = useContext(WorkforceContext);
  if (!context) {
    throw new Error('useWorkforce must be used within a WorkforceProvider');
  }
  return context;
};
