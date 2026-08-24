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
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-28 pb-16 lg:pb-0 overflow-hidden border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
            <div className="max-w-2xl lg:py-16 xl:pl-12">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                All Service Categories
              </span>
              
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                Explore Our <br />
                <span className="text-emerald-600">Workforce Services</span>
              </h1>
              
              <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                From skilled daily wage workers to professional tradesmen, find the perfect match for your residential, commercial, or industrial needs.
              </p>
            </div>

            <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
              <img 
                src="/categories-hub-hero.webp" 
                alt="Service Categories" 
                className="w-full max-w-[650px] h-auto object-contain transform origin-bottom lg:scale-[0.95] xl:scale-[0.95] 2xl:scale-[1.0] xl:translate-x-[5%] xl:translate-y-[0%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
      
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