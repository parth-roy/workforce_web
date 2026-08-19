import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/HomePage';
import WorkerHubPage from './pages/worker/WorkerHubPage';
import RolePage from './pages/worker/RolePage';
import LocationPage from './pages/worker/LocationPage';
import RoleLocationPage from './pages/worker/RoleLocationPage';
import JobDetailPage from './pages/worker/JobDetailPage';

import ServicesHubPage from './pages/hirer/ServicesHubPage';
import IndividualServicePage from './pages/hirer/IndividualServicePage';
import IndividualServiceLocationPage from './pages/hirer/IndividualServiceLocationPage';

import B2BHirerHubPage from './pages/b2b/B2BHirerHubPage';
import B2BServicePage from './pages/b2b/B2BServicePage';
import B2BServiceLocationPage from './pages/b2b/B2BServiceLocationPage';

import ContractorPage from './pages/contractor/ContractorPage';
import CorporatePage from './pages/corporate/CorporatePage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Worker Routes */}
      <Route path="/jobs" element={<WorkerHubPage />} />
      <Route path="/jobs/:role" element={<RolePage />} />
      <Route path="/jobs/location/:location" element={<LocationPage />} />
      <Route path="/jobs/:role/:location" element={<RoleLocationPage />} />
      <Route path="/jobs/detail/:jobId" element={<JobDetailPage />} />
      
      {/* Individual Hirer Routes */}
      <Route path="/services" element={<ServicesHubPage />} />
      <Route path="/services/:service" element={<IndividualServicePage />} />
      <Route path="/services/:service/:location" element={<IndividualServiceLocationPage />} />

      {/* B2B Hire Workers Routes */}
      <Route path="/hire-workers" element={<B2BHirerHubPage />} />
      <Route path="/hire-workers/:service" element={<B2BServicePage />} />
      <Route path="/hire-workers/:service/:location" element={<B2BServiceLocationPage />} />

      {/* Contractor Route */}
      <Route path="/for-contractors" element={<ContractorPage />} />

      {/* Corporate Route */}
      <Route path="/for-companies" element={<CorporatePage />} />
    </Routes>
  );
}
