import React from 'react';
import { Link } from 'react-router-dom';
import { mockRoles } from '../../data/mock/roles';
import { mockLocations } from '../../data/mock/locations';
import { mockServices } from '../../data/mock/services';
import { mockJobs } from '../../data/mock/jobs';

// -----------------------------------------------------------------------------
// HELPER METHODS (Indexability Aware)
// NOTE: SEO-linked pages use only 'eligible' items.
// UI navigation uses all 'not-yet-eligible' + 'eligible' items (internal links).
// -----------------------------------------------------------------------------
const getEligibleRoles = () => mockRoles.filter(r => r.indexabilityStatus === 'eligible');
const getNavigableRoles = (excludeSlug) => mockRoles.filter(r => r.indexabilityStatus !== 'noindex' && r.slug !== excludeSlug);
const getEligibleLocations = () => mockLocations.filter(l => l.indexabilityStatus === 'eligible');
const getNavigableLocations = (excludeSlug) => mockLocations.filter(l => l.indexabilityStatus !== 'noindex' && l.slug !== excludeSlug);
const getEligibleServices = (audience) =>
  mockServices.filter(s => s.indexabilityStatus === 'eligible' && (!audience || s.audiences.includes(audience)));
const getNavigableServices = (audience, excludeSlug) =>
  mockServices.filter(s => s.indexabilityStatus !== 'noindex' && (!audience || s.audiences.includes(audience)) && s.slug !== excludeSlug);
const getEligibleJobs = (roleSlug, locSlug) =>
  mockJobs.filter(j =>
    !j.isDemo &&
    j.status === 'active' &&
    j.indexabilityStatus !== 'noindex' &&
    (!roleSlug || j.roleSlug === roleSlug) &&
    (!locSlug || j.locationSlug === locSlug)
  );

// -----------------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------------

export function RelatedRoles({ max = 10, currentSlug, title = 'Explore Roles' }) {
  // Prefer eligible; fall back to navigable for UI completeness
  const eligible = getEligibleRoles().slice(0, max);
  const roles = eligible.length > 0 ? eligible : getNavigableRoles(currentSlug).slice(0, max);
  if (roles.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {roles.map(role => (
          <li key={role.id}>
            <Link
              to={`/jobs/${role.slug}`}
              className="text-emerald-700 hover:text-emerald-900 hover:underline border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-1.5 block text-sm font-medium transition-colors"
            >
              {role.name} Jobs
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedLocations({ basePath = '/jobs/location', max = 10, suffix = 'Jobs', currentSlug, title = 'Explore Locations' }) {
  const eligible = getEligibleLocations().slice(0, max);
  const locs = eligible.length > 0 ? eligible : getNavigableLocations(currentSlug).slice(0, max);
  if (locs.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {locs.map(loc => (
          <li key={loc.id}>
            <Link
              to={`${basePath}/${loc.slug}`}
              className="text-slate-700 hover:text-slate-900 hover:underline border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 block text-sm font-medium transition-colors"
            >
              {suffix} in {loc.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedJobs({ roleSlug, locationSlug, max = 5 }) {
  const jobs = getEligibleJobs(roleSlug, locationSlug).slice(0, max);
  if (jobs.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Latest Active Jobs</h3>
      <ul className="space-y-2">
        {jobs.map(job => (
          <li key={job.id}>
            <Link
              to={`/jobs/detail/${job.id}`}
              className="text-emerald-700 hover:underline font-medium"
            >
              {job.title} - {job.employer}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RelatedServices({ audience, basePath, max = 10, currentSlug, title = 'Related Services' }) {
  const eligible = getEligibleServices(audience).slice(0, max);
  const services = eligible.length > 0 ? eligible : getNavigableServices(audience, currentSlug).slice(0, max);
  if (services.length === 0) return null;
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {services.map(service => (
          <li key={service.id}>
            <Link
              to={`${basePath}/${service.slug}`}
              className="text-emerald-700 hover:text-emerald-900 hover:underline border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-1.5 block text-sm font-medium transition-colors"
            >
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
