import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { ServiceHowItWorksSEO } from '../../seo/pageMetadata';
import { Search, Calendar, FileText, CheckCircle, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServiceHowItWorksPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // 3 seconds per slide
    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

  const steps = [
    { icon: Search, title: 'Choose Service', desc: 'Select the exact service or worker type you need from our directory.' },
    { icon: FileText, title: 'Tell Us What You Need', desc: 'Specify how many workers you need and briefly describe the task.' },
    { icon: ({ className }) => <img src="/google-maps-icon.webp" alt="Location" width={24} height={24} className={className || "w-6 h-6 object-contain"} />, title: 'Add Location', desc: 'Provide the worksite location so we can match you with nearby professionals.' },
    { icon: Calendar, title: 'Select Timing', desc: 'Choose the duration and schedule for when the work should happen.' },
    { icon: CheckCircle, title: 'Review & Request', desc: 'Review your total estimate (when available) and submit your request.' },
    { icon: Truck, title: 'Worker Fulfillment', desc: 'Verified workers accept your request and arrive at your location to complete the job.' }
  ];

  return (
    <>
      <SEO {...ServiceHowItWorksSEO()} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-32 pb-16 lg:pt-32 lg:pb-0 overflow-x-clip border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-stretch">
            <div className="max-w-2xl lg:pt-16 lg:pb-64 xl:pl-12 flex flex-col justify-start">
              <div>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                  How It Works
                </span>
                
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                  How Hiring Works
                </h1>
                
                <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                  A simple, transparent process to request services and hire verified workers on Metro Mitra.
                </p>
              </div>
            </div>

            <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
              <img 
                src="/service-how-it-works-hero.webp" 
                alt="How Hiring Works on Metro Mitra" 
                className="w-full max-w-[900px] h-auto object-contain transform origin-bottom lg:scale-[1.1] xl:scale-[1.2] 2xl:scale-[1.25] xl:translate-x-[5%] xl:translate-y-[0%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-center mb-16">
          <div className="order-2 md:order-1 lg:sticky lg:top-24 h-full flex flex-col justify-center">
            <div className="relative w-full mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50">
              
              {/* Images Container */}
              <div 
                className="flex w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="w-full shrink-0 relative">
                    <img 
                      src={`/how-it-works-screen-${num}.webp`} 
                      alt={`Hiring Step ${num}`} 
                      className="w-full h-auto object-cover" 
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Navigation Controls & Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 z-10">
                <button 
                  onClick={prevSlide}
                  className="bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2">
                  {[...Array(totalSlides)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                        i === currentSlide ? 'bg-emerald-600 w-8' : 'bg-white/90 w-2.5 hover:bg-emerald-400'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextSlide}
                  className="bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Hiring Process</h2>
            <p className="text-slate-600 mb-6 text-lg max-w-2xl">
              From requesting a service to final payment, our platform ensures a smooth and transparent experience for all hirers.
            </p>
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{s.title}</h3>
                    <p className="text-slate-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to hire?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">Explore our services and submit a request today. <em>Note: This is currently a mock experience. Live worker matching will be available soon.</em></p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
              Browse Services
            </Link>
            <Link to="/services/faq" className="bg-white text-slate-700 border border-slate-300 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Read Hiring FAQ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}