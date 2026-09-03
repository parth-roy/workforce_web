import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import { B2BHirerHubSEO } from '../../seo/pageMetadata';
import { 
  Users, ShieldCheck, Clock, FileText, 
  Building2, HardHat, TrendingUp, CheckCircle2,
  ArrowRight, PhoneCall, Zap
} from 'lucide-react';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function B2BHirerHubPage() {
  const { roles } = useWorkforce();
  
  // Filter roles that make sense for bulk hiring
  const b2bRoles = roles.filter(r => 
    ['loader-unloader', 'general-helper', 'security-guard', 'delivery-associate', 'cleaner', 'packer'].includes(r.slug)
  );

  return (
    <>
      <SEO {...B2BHirerHubSEO()} />
      <div className="bg-slate-50 min-h-screen font-sans">
        
        {/* Brand-Aligned Hero Section */}
        <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-28 pb-16 lg:pb-0 overflow-hidden border-b border-slate-200">
          <div className="max-w-[1400px] mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
              <div className="max-w-2xl lg:py-16 xl:pl-12">
                <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  B2B & Enterprise Solutions
                </span>
                
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                  Hire Gig Workers & Teams<br />
                  <span className="text-emerald-600">At Scale. On Demand.</span>
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                  The best place to hire construction workers, logistics staff, and warehouse helpers. Our workforce solutions deliver verified gig workers across West Bengal.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link to="/contact" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                    Talk to Sales <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/jobs" className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 hover:text-emerald-600 hover:shadow-[0_8px_24px_-8px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
                    View Workforce Roster
                  </Link>
                </div>
              </div>

              <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
                <img 
                  src="/hire-hub-hero.webp" 
                  alt="Hire Workforce" 
                  className="w-full max-w-[900px] h-auto object-contain transform origin-bottom lg:scale-[1.15] xl:scale-[1.25] 2xl:scale-[1.3] xl:translate-x-[10%] xl:translate-y-[2%]"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="border-b bg-white relative z-20 -mt-8 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-lg shadow-slate-200/50">
          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-slate-100">
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-4xl font-black text-slate-900 mb-1">24hr</div>
                <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Deployment</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-4xl font-black text-slate-900 mb-1">98%</div>
                <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Fulfillment Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-4xl font-black text-slate-900 mb-1">Zero</div>
                <div className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Compliance</div>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Worker Contact Banner — Right After Hero & Stats */}
        <section className="pt-8 pb-4 px-4">
          <div className="container mx-auto max-w-5xl">
            <DirectContactBanner variant="default" />
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Choose Metro Mitra for Bulk Hiring?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">We handle the heavy lifting of recruitment, verification, and compliance so you can focus on your core business.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: '100% Background Verified', desc: 'Every worker undergoes strict identity and address verification before they can accept corporate jobs.' },
                { icon: Clock, title: 'Quick Replacements', desc: 'Worker didn\'t show up? Our deep roster ensures we can deploy backup personnel within hours.' },
                { icon: FileText, title: 'Consolidated Billing', desc: 'Stop managing dozens of individual daily wagers. Get one clean, GST-compliant invoice at the end of the month.' },
                { icon: Zap, title: 'On-Demand Scaling', desc: 'Scale your workforce up during peak seasons and scale down when demand drops, without HR overhead.' },
                { icon: Users, title: 'Dedicated Supervisor', desc: 'For large deployments, we provide an on-ground supervisor to manage attendance and coordination.' },
                { icon: TrendingUp, title: 'High Retention', desc: 'We offer fair payouts and benefits to our workers, resulting in higher reliability and lower churn for your business.' },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Most Requested Roles (Using dynamic data) */}
        <section className="py-24 bg-slate-900 text-white px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Most Requested B2B Roles</h2>
                <p className="text-slate-400 text-lg">Browse the types of workers we frequently deploy for enterprise and contractor clients.</p>
              </div>
              <Link to="/contact" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2 whitespace-nowrap">
                Hire These Roles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {b2bRoles.map(role => (
                <div key={role.slug} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{role.description}</p>
                  <ul className="space-y-2 mb-6">
                    {role.requirements.slice(0, 2).map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-slate-700 text-emerald-400 font-semibold text-sm">
                    Usually deployed in batches of 5-20
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 bg-emerald-50">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">How B2B Hiring Works</h2>
              <p className="text-lg text-slate-600">A streamlined process designed for businesses moving at speed.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-emerald-200 z-0"></div>
              
              {[
                { step: '1', title: 'Share Requirements', desc: 'Tell us the roles, headcount, location, and duration.' },
                { step: '2', title: 'Get a Quote', desc: 'We provide a transparent, all-inclusive rate card.' },
                { step: '3', title: 'Deployment', desc: 'Verified workers report to your site on the agreed date.' },
                { step: '4', title: 'Consolidated Billing', desc: 'Pay once a month via standard corporate invoicing.' },
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-6 shadow-lg shadow-emerald-900/20 border-4 border-emerald-50">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl bg-slate-900 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <HardHat className="w-48 h-48 text-white" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to scale your workforce?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Stop worrying about manpower shortages and compliance. Partner with Metro Mitra today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg flex items-center justify-center gap-2 text-lg">
                  <PhoneCall className="w-5 h-5" /> Contact Sales Team
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
