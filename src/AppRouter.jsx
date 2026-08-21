import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import FloatingContact from './components/layout/FloatingContact.jsx';

import HomePage from './components/pages/HomePage';
import WorkerHubPage from './pages/worker/WorkerHubPage';
import RolePage from './pages/worker/RolePage';
import LocationPage from './pages/worker/LocationPage';
import RoleLocationPage from './pages/worker/RoleLocationPage';
import JobDetailPage from './pages/worker/JobDetailPage';
import WorkerRolesDirectoryPage from './pages/worker/WorkerRolesDirectoryPage';
import WorkerOnboardingPage from './pages/worker/WorkerOnboardingPage';
import WorkerHowItWorksPage from './pages/worker/WorkerHowItWorksPage';
import WorkerFAQPage from './pages/worker/WorkerFAQPage';

import ServicesHubPage from './pages/hirer/ServicesHubPage';
import IndividualServicePage from './pages/hirer/IndividualServicePage';
import IndividualServiceLocationPage from './pages/hirer/IndividualServiceLocationPage';
import ServiceCategoryDirectoryPage from './pages/hirer/ServiceCategoryDirectoryPage';
import ServiceHowItWorksPage from './pages/hirer/ServiceHowItWorksPage';
import ServiceFAQPage from './pages/hirer/ServiceFAQPage';
import ServiceHiringFlowPage from './pages/hirer/ServiceHiringFlowPage';

import B2BHirerHubPage from './pages/b2b/B2BHirerHubPage';
import B2BServicePage from './pages/b2b/B2BServicePage';
import B2BServiceLocationPage from './pages/b2b/B2BServiceLocationPage';

import ContractorPage from './pages/contractor/ContractorPage';
import CorporatePage from './pages/corporate/CorporatePage';

import AboutPage from './pages/shared/AboutPage';
import ContactPage from './pages/shared/ContactPage';
import FAQPage from './pages/shared/FAQPage';
import GuidesPage from './pages/shared/GuidesPage';

export default function AppRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Worker Routes */}
      <Route path="/jobs" element={<WorkerHubPage />} />
      <Route path="/jobs/roles" element={<WorkerRolesDirectoryPage />} />
      <Route path="/jobs/location/:location" element={<LocationPage />} />
      <Route path="/jobs/detail/:jobId" element={<JobDetailPage />} />
      <Route path="/jobs/:role" element={<RolePage />} />
      <Route path="/jobs/:role/:location" element={<RoleLocationPage />} />
      
      <Route path="/join-as-worker" element={<WorkerOnboardingPage />} />
      <Route path="/workers/how-it-works" element={<WorkerHowItWorksPage />} />
      <Route path="/workers/faq" element={<WorkerFAQPage />} />

      {/* Individual Hirer Routes */}
      <Route path="/services" element={<ServicesHubPage />} />
      <Route path="/services/categories" element={<ServiceCategoryDirectoryPage />} />
      <Route path="/services/how-it-works" element={<ServiceHowItWorksPage />} />
      <Route path="/services/faq" element={<ServiceFAQPage />} />
      <Route path="/services/:service" element={<IndividualServicePage />} />
      <Route path="/services/:service/hire" element={<ServiceHiringFlowPage />} />
      <Route path="/services/:service/:location" element={<IndividualServiceLocationPage />} />

      {/* B2B Hire Workers Routes */}
      <Route path="/hire-workers" element={<B2BHirerHubPage />} />
      <Route path="/hire-workers/:service" element={<B2BServicePage />} />
      <Route path="/hire-workers/:service/:location" element={<B2BServiceLocationPage />} />

      {/* Contractor Route */}
      <Route path="/for-contractors" element={<ContractorPage />} />

      {/* Corporate Route */}
      <Route path="/for-companies" element={<CorporatePage />} />

      {/* Shared/Supporting Routes */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/guides" element={<GuidesPage />} />
    </Routes>
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
