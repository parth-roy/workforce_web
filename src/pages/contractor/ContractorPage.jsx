import React from 'react';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import ContractorHero from '../../components/contractor/ContractorHero';
import ContractorRequirementBuilder from '../../components/contractor/ContractorRequirementBuilder';
import FAQSection from '../../components/shared/FAQSection';
import SEO from '../../components/ui/SEO';
import { ContractorSEO } from '../../seo/pageMetadata';

export default function ContractorPage() {
  const { services } = useWorkforce();
  const contractorServices = services.filter(s => s.audiences?.includes('contractor'));

  const faqs = [
    { question: 'What types of workforce can I request?', answer: 'You can request temporary workforce, logistics helpers, warehouse staff, and other blue-collar roles supported by our platform.' },
    { question: 'How are shifts and durations handled?', answer: 'You specify your preferred shift times and duration (e.g., single day, multiple weeks). This information helps in matching the right workforce for your operational schedule.' },
    { question: 'When is a request confirmed?', answer: 'The current flow is a frontend prototype to capture your requirements. The live workflow will provide status updates after backend integration is completed.' }
  ];

  return (
    <>
      <SEO {...ContractorSEO()} />
      <div className="bg-slate-50 min-h-screen pb-20">
      <ContractorHero 
        title="Get the workforce you need for your site, shift or operation" 
        subtitle="Manage multi-worker requirements for warehouse, logistics, and temporary operations."
      />
      
      <main className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1 order-2 lg:order-1 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Who this is for</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center gap-3"><span className="text-blue-600 font-bold">✓</span> Manpower contractors</li>
                <li className="flex items-center gap-3"><span className="text-blue-600 font-bold">✓</span> Site proprietors</li>
                <li className="flex items-center gap-3"><span className="text-blue-600 font-bold">✓</span> Small workforce suppliers</li>
                <li className="flex items-center gap-3"><span className="text-blue-600 font-bold">✓</span> Local businesses requiring multiple workers</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Workforce Requirements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contractorServices.map(service => (
                  <div key={service.slug} className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{service.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Workforce Request Process</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
                {[
                  { step: '1', title: 'Tell us your requirement', desc: 'Choose workforce category.' },
                  { step: '2', title: 'Choose roles & quantity', desc: 'Specify how many of each role.' },
                  { step: '3', title: 'Select location', desc: 'Where is the worksite?' },
                  { step: '4', title: 'Choose shifts & duration', desc: 'When do you need them?' },
                  { step: '5', title: 'Review & Submit', desc: 'Confirm your request prototype.' }
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-blue-600 text-white font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {item.step}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-slate-50">
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-center text-sm font-bold text-blue-600 bg-blue-50 py-3 rounded-lg border border-blue-100">
                Note: The current website is preparing the request experience. Live fulfillment connects later.
              </p>
            </section>
          </div>

          <div className="w-full lg:w-[500px] xl:w-[600px] order-1 lg:order-2">
            <div className="sticky top-6">
              <ContractorRequirementBuilder />
            </div>
          </div>
          
        </div>

        <div className="mt-20 border-t pt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <FAQSection faqs={faqs} />
        </div>
        
      </main>
    </div>
    </>
  );
}
