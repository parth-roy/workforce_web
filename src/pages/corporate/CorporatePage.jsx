import React from 'react';
import CorporateHero from '../../components/corporate/CorporateHero';
import CorporateUseCases from '../../components/corporate/CorporateUseCases';
import CorporateProcess from '../../components/corporate/CorporateProcess';
import CorporateWorkforceRequirementBuilder from '../../components/corporate/CorporateWorkforceRequirementBuilder';
import CorporateWorkspacePreview from '../../components/corporate/CorporateWorkspacePreview';
import FAQSection from '../../components/shared/FAQSection';
import SEO from '../../components/ui/SEO';
import { CorporateSEO } from '../../seo/pageMetadata';

export default function CorporatePage() {
  const faqs = [
    { question: 'What is the difference between Corporate and Contractor requests?', answer: 'Corporate requests allow you to structure complex workforce needs across multiple locations and shifts from a centralized organization view. Contractor requests are optimized for fast, single-site operational needs.' },
    { question: 'Can I manage multiple warehouse locations?', answer: 'Yes, the enterprise model allows you to define distinct roles, quantities, and shifts for every operational site you manage.' },
    { question: 'When will the full dashboard be available?', answer: 'The current flow is a frontend prototype to structure your requirements. Complete dashboard integration with live matching and reporting will follow.' }
  ];

  return (
    <>
      <SEO {...CorporateSEO()} />
      <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <CorporateHero 
        title="Workforce solutions for growing operations and distributed teams" 
        subtitle="Structure and manage multiple roles, locations, and operational requirements through one centralized enterprise workflow."
      />
      
      <main>
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Who this is for</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Designed for companies, enterprises, and large organizations requiring structured workforce procurement and management capabilities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700">Logistics Companies</span>
              <span className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700">Distribution Centers</span>
              <span className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700">Manufacturing Plants</span>
              <span className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700">Retail Operations</span>
            </div>
          </div>
        </section>

        <CorporateUseCases />

        <CorporateProcess />

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Enterprise Request Flow</h2>
              <p className="text-slate-600">Model your multi-location workforce demand</p>
            </div>
            <CorporateWorkforceRequirementBuilder />
          </div>
        </section>

        <section className="py-20 bg-white border-t px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Future Workspace Architecture</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                A preview of the structural shell where organizations will eventually manage active requests, monitor deployment status, and administer user permissions.
              </p>
            </div>
            <CorporateWorkspacePreview />
          </div>
        </section>

        <section className="mt-20 border-t pt-16 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </section>
      </main>
    </div>
    </>
  );
}
