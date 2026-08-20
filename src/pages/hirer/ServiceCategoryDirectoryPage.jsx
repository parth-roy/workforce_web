import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { ServiceCategoryDirectorySEO } from '../../seo/pageMetadata';
import { Grid, ArrowRight } from 'lucide-react';

export default function ServiceCategoryDirectoryPage() {
  const { services } = useWorkforce();
  
  // Group services by category
  const categories = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <>
      <SEO {...ServiceCategoryDirectorySEO()} />
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-black mb-4">Service Categories</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Browse our wide range of services to find the perfect workforce or professional for your needs.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="space-y-16">
          {Object.entries(categories).map(([category, catServices]) => (
            <section key={category}>
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
                <Grid className="w-8 h-8 text-emerald-600" />
                <h2 className="text-3xl font-bold text-slate-900">{category} Services</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catServices.map((service) => (
                  <Link key={service.id} to={`/services/${service.slug}`} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                    <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}