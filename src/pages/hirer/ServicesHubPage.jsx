import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import ServiceHero from '../../components/hirer/ServiceHero';
import ServiceCard from '../../components/hirer/ServiceCard';
import FAQSection from '../../components/shared/FAQSection';
import SEO from '../../components/ui/SEO';
import { ServicesHubSEO } from '../../seo/pageMetadata';

export default function ServicesHubPage() {
  const { services } = useWorkforce();
  const individualServices = services.filter(s => s.audiences?.includes('individual'));

  const faqs = [
    { question: 'How does the future request flow work?', answer: 'You choose a service, tell us what you need and your location, and submit a request. A matching system will eventually handle the backend coordination.' },
    { question: 'How is pricing determined?', answer: 'Pricing can depend on the service, scope and location. Pricing details will be introduced when the live service flow is connected.' }
  ];

  return (
    <>
      <SEO {...ServicesHubSEO()} />
      <div>
      <ServiceHero 
        title="Get workforce help for everyday tasks" 
        subtitle="Explore local workforce services for electrical, plumbing, moving, and household maintenance needs."
      />
      
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-slate-900">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {individualServices.map(service => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>

        <section className="bg-blue-50 -mx-4 px-4 py-16 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12 text-slate-900">Request Flow Prototype</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="font-bold text-slate-900 mb-2">Choose Service</h3>
                <p className="text-slate-600 text-sm">Select the type of help you need.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="font-bold text-slate-900 mb-2">Describe</h3>
                <p className="text-slate-600 text-sm">Tell us exactly what needs to be done.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="font-bold text-slate-900 mb-2">Location</h3>
                <p className="text-slate-600 text-sm">Confirm where you need the service.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">4</div>
                <h3 className="font-bold text-slate-900 mb-2">Submit Prototype</h3>
                <p className="text-slate-600 text-sm">Submit the request to the frontend state machine.</p>
              </div>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} />
        
        <div className="max-w-4xl mx-auto text-center py-8 border-t mt-12">
          <p className="text-slate-600 mb-2">Looking for work?</p>
          <Link to="/jobs" className="text-blue-600 font-bold hover:underline">Find flexible job opportunities &rarr;</Link>
        </div>
      </main>
    </div>
    </>
  );
}
