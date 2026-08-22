import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, ChevronRight, CheckCircle2, Shield, Plus, Minus, X, 
  Power, Fan, Lightbulb, Cable, Bell, Zap, Tv, Users, ShoppingCart
} from 'lucide-react';
import { electricianCategories, electricianServices } from '../../../data/mock/electricianCatalog';

const ICON_MAP = { Power, Fan, Lightbulb, Cable, Bell, Zap, Tv, Users };

export default function ServiceCatalogLayout({ service }) {
  const [activeCategory, setActiveCategory] = useState('switch-socket');
  const [cart, setCart] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create refs for scrolling
  const sectionRefs = useRef({});

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isModalOpen]);

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      // Offset for sticky header if any, maybe 100px
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  // Handle scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset
      
      for (const category of electricianCategories) {
        const element = sectionRefs.current[category.id];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddClick = (item) => {
    if (item.optionsCount > 0) {
      setSelectedService(item);
      setIsModalOpen(true);
    } else {
      addToCart(item, item); // For items with no options
    }
  };

  const addToCart = (serviceItem, optionItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === optionItem.id);
      if (existing) {
        return prev.map(c => c.id === optionItem.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { 
        id: optionItem.id, 
        serviceId: serviceItem.id,
        title: optionItem.title || serviceItem.title, 
        price: optionItem.price || serviceItem.price,
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, quantity: Math.max(0, c.quantity + delta) };
      }
      return c;
    }).filter(c => c.quantity > 0));
  };
  
  const getItemQuantity = (id) => {
    const item = cart.find(c => c.id === id);
    return item ? item.quantity : 0;
  };
  
  const getServiceTotalQuantity = (serviceId) => {
    return cart.filter(c => c.serviceId === serviceId).reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-4">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[250px_1fr_300px] gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="hidden md:block">
          <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Electrician</h1>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                4.87 (2.8M bookings)
              </div>
            </div>
            
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">UC security & damage cover</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-5">
              <h3 className="text-sm text-slate-500 mb-4 uppercase font-semibold">Select a service</h3>
              <div className="grid grid-cols-2 gap-4">
                {electricianCategories.map(cat => {
                  const Icon = ICON_MAP[cat.icon] || Zap;
                  return (
                    <button 
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className="flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center border transition-all ${activeCategory === cat.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white group-hover:border-slate-400'}`}>
                        <Icon strokeWidth={1.5} className={activeCategory === cat.id ? 'text-slate-900 w-7 h-7' : 'text-slate-500 w-7 h-7'} />
                      </div>
                      <span className={`text-xs text-center font-medium ${activeCategory === cat.id ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-8">
          
          {/* Banner */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between p-6 md:p-8">
            <div className="flex-1 pr-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-2">
                30-day warranty <br/>included
              </h2>
              <p className="text-lg text-slate-600">On every Electrician service</p>
            </div>
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 mt-6 sm:mt-0 relative">
              <div className="absolute inset-0 bg-teal-600 rounded-bl-[40px] rounded-tr-[40px] flex items-center justify-center transform rotate-3">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Categories & Services List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            {electricianCategories.map((category) => {
              const catServices = electricianServices.filter(s => s.categoryId === category.id);
              if (catServices.length === 0) return null;
              
              return (
                <div 
                  key={category.id} 
                  ref={el => sectionRefs.current[category.id] = el}
                  className="mb-12 last:mb-0"
                >
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">{category.label}</h2>
                  
                  <div className="space-y-8 border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                    {catServices.map((service, index) => (
                      <div key={service.id}>
                        <div className="flex justify-between gap-4 group">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => handleAddClick(service)}>
                              {service.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2">
                              <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                              {service.rating} <span className="text-slate-500 font-normal">({service.reviews} reviews)</span>
                            </div>
                            <p className="font-bold text-slate-900 mb-2">{service.priceText}</p>
                            
                            {service.bullets && (
                              <ul className="text-sm text-slate-600 list-disc list-inside mb-3 space-y-1">
                                {service.bullets.map((b, i) => <li key={i}>{b}</li>)}
                              </ul>
                            )}
                            
                            <button 
                              className="text-purple-700 font-bold text-sm hover:underline"
                              onClick={() => handleAddClick(service)}
                            >
                              View details
                            </button>
                          </div>
                          
                          <div className="shrink-0 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-100 mb-3 cursor-pointer" onClick={() => handleAddClick(service)}>
                              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            </div>
                            
                            {getServiceTotalQuantity(service.id) > 0 ? (
                               <div className="bg-white border border-emerald-600 rounded-lg flex items-center justify-between w-24 h-9 font-bold text-emerald-700 shadow-sm">
                                 <button className="w-8 h-full flex items-center justify-center hover:bg-emerald-50 rounded-l-lg text-emerald-600" onClick={() => {
                                     // if multiple options, open modal, else just minus
                                     if(service.optionsCount > 0) { setIsModalOpen(true); setSelectedService(service); } 
                                     else { updateQuantity(service.id, -1); }
                                 }}><Minus className="w-4 h-4" /></button>
                                 <span>{getServiceTotalQuantity(service.id)}</span>
                                 <button className="w-8 h-full flex items-center justify-center hover:bg-emerald-50 rounded-r-lg text-emerald-600" onClick={() => {
                                     if(service.optionsCount > 0) { setIsModalOpen(true); setSelectedService(service); }
                                     else { updateQuantity(service.id, 1); }
                                 }}><Plus className="w-4 h-4" /></button>
                               </div>
                            ) : (
                              <button 
                                onClick={() => handleAddClick(service)}
                                className="bg-white border border-slate-200 text-purple-700 font-bold rounded-lg w-24 py-1.5 shadow-sm hover:bg-slate-50 transition-colors"
                              >
                                Add
                              </button>
                            )}
                            
                            {service.optionsCount > 0 && (
                              <p className="text-[11px] text-slate-500 mt-1 font-medium">{service.optionsCount} options</p>
                            )}
                          </div>
                        </div>
                        {index < catServices.length - 1 && <hr className="my-8 border-slate-100" />}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Get visitation fee off</p>
                <p className="text-xs text-slate-500">On orders above ₹499</p>
              </div>
            </div>
            
            <div className="border border-slate-100 rounded-xl p-5 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-full opacity-50"></div>
              
              <h3 className="font-bold text-slate-900 text-lg mb-4 relative z-10">UC Promise</h3>
              
              <ul className="space-y-3 relative z-10">
                {['Verified Professionals', 'Hassle Free Booking', 'Transparent Pricing'].map((promise, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-slate-900" /> {promise}
                  </li>
                ))}
              </ul>
              
              <div className="absolute top-4 right-4 z-10">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center min-h-[200px] sticky top-[380px]">
            {cart.length === 0 ? (
              <>
                <ShoppingCart className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No items in your cart.</p>
              </>
            ) : (
              <div className="w-full text-left">
                <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-3">Your Cart</h3>
                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="text-sm text-slate-700 truncate pr-2 max-w-[150px]">{item.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">₹{item.price * item.quantity}</span>
                        <div className="flex items-center bg-white border border-emerald-600 rounded-md">
                          <button className="w-6 h-6 flex items-center justify-center text-emerald-600 hover:bg-emerald-50" onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button className="w-6 h-6 flex items-center justify-center text-emerald-600 hover:bg-emerald-50" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* FULL SCREEN MODAL */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white w-full sm:w-[600px] sm:max-w-full sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:fade-in duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 z-20 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <div className="p-6 pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 pr-10">{selectedService.title}</h2>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-700 mt-2 mb-2">
                  <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                  {selectedService.rating} <span className="text-slate-500 font-normal">({selectedService.reviews} reviews)</span>
                </div>
              </div>
              
              {/* Options Carousel */}
              <div className="bg-slate-50 p-6 pt-4 pb-8 overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                  {selectedService.options?.map(opt => {
                    const qty = getItemQuantity(opt.id);
                    return (
                      <div key={opt.id} className="snap-start shrink-0 w-[280px] bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-900 text-lg leading-tight">{opt.title}</h3>
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0 ml-2">
                              <img src={opt.image} alt={opt.title} className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-2">
                            <Star className="w-3 h-3 fill-slate-900 text-slate-900" />
                            {opt.rating} <span className="text-slate-500 font-normal">({opt.reviews} reviews)</span>
                          </div>
                          <p className="font-bold text-slate-900">₹{opt.price}</p>
                        </div>
                        
                        <div className="mt-4">
                          {qty > 0 ? (
                            <div className="bg-white border border-emerald-600 rounded-lg flex items-center justify-between h-10 font-bold text-emerald-700 shadow-sm w-full">
                              <button className="w-10 h-full flex items-center justify-center hover:bg-emerald-50 rounded-l-lg text-emerald-600" onClick={() => updateQuantity(opt.id, -1)}><Minus className="w-4 h-4" /></button>
                              <span>{qty}</span>
                              <button className="w-10 h-full flex items-center justify-center hover:bg-emerald-50 rounded-r-lg text-emerald-600" onClick={() => updateQuantity(opt.id, 1)}><Plus className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => addToCart(selectedService, opt)}
                              className="w-full bg-white border border-slate-200 text-purple-700 font-bold rounded-lg py-2 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Process */}
              <div className="p-6 bg-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Our process</h3>
                <div className="space-y-6">
                  {selectedService.process?.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-900 border border-slate-200 shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{step.title}</h4>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modal Footer Cart Summary */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold">{cart.reduce((a,c) => a + c.quantity, 0)} items in cart</p>
                  <p className="text-lg font-black text-slate-900">₹{cart.reduce((a,c) => a + (c.price * c.quantity), 0)}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  View cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
