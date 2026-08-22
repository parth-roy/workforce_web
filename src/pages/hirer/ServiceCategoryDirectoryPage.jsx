import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { ServiceCategoryDirectorySEO } from '../../seo/pageMetadata';
import { Grid, ArrowRight, Wrench, Shield } from 'lucide-react';

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
      <div className="bg-slate-950 text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-trust-blue-900 opacity-80 pointer-events-none"></div>
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="pulse-dot bg-action-green-400" />
              <span className="text-sm font-semibold text-white">All Service Categories</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Workforce Services</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
              From skilled daily wage workers to professional tradesmen, find the perfect match for your residential, commercial, or industrial needs.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto max-w-6xl px-4 py-16">
        <div className="space-y-20">
          {Object.entries(categories).map(([category, catServices]) => (
            <section key={category} className="scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Grid size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {category.endsWith('Services') ? category : `${category} Services`}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Verified professionals for your requirements</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {catServices.map((service) => (
                  <Link 
                    key={service.id} 
                    to={`/services/${service.slug}`} 
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-trust-blue-900/10 hover:border-trust-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-50">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 ${service.image ? 'hidden' : 'flex'}`}>
                        <Wrench size={48} className="opacity-20" />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent/10"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <h3 className="text-xl md:text-2xl font-bold">{service.name}</h3>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {service.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-5">
                        {service.useCases?.slice(0,2).map(uc => (
                          <span key={uc} className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                            {uc}
                          </span>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Shield size={14} className="text-emerald-500" /> 
                          Background Checked
                        </div>
                        <span className="text-trust-blue-600 text-sm font-bold group-hover:text-trust-blue-700 flex items-center gap-1">
                          Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
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