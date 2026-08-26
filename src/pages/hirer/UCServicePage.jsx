import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, ArrowLeft, Percent, CheckCircle2 } from 'lucide-react';
import { ucServicesData } from '../../data/mock/ucServicesData';
import UCServiceItem from '../../components/services/UCServiceItem';
import UCVariantModal from '../../components/modals/UCVariantModal';
import { useUCCart } from '../../context/UCCartContext';

function CartSidebar() {
  const { cart, getTotalPrice, setIsCartOpen } = useUCCart();
  
  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col items-center justify-center text-center min-h-[250px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl grayscale opacity-40">🛒</span>
        </div>
        <p className="text-slate-500 font-medium">No items in your cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <h3 className="font-bold text-lg mb-4">Cart</h3>
      <div className="space-y-4 mb-4">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm">
            <div className="flex-1 pr-2">
              <p className="font-semibold">{item.variant ? item.variant.title : item.title}</p>
              <p className="text-slate-500">
                ₹{item.variant ? item.variant.price : parseInt((item.price || '0').replace(/[^0-9]/g, ''))} × {item.quantity}
              </p>
            </div>
            <p className="font-bold">
              ₹{(item.variant ? item.variant.price : parseInt((item.price || '0').replace(/[^0-9]/g, ''))) * item.quantity}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 pt-4 mb-4 flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>₹{getTotalPrice()}</span>
      </div>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function MobileCartBottomBar() {
  const { cart, getTotalPrice, setIsCartOpen } = useUCCart();
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.08)] z-40 lg:hidden flex justify-between items-center animate-in slide-in-from-bottom-2">
      <div>
        <p className="text-sm font-bold text-slate-900">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
        <p className="text-purple-700 font-bold">₹{getTotalPrice()}</p>
      </div>
      <button 
        onClick={() => setIsCartOpen(true)}
        className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-slate-800 transition-colors"
      >
        Checkout
      </button>
    </div>
  );
}

function UCServicePageContent() {
  const { service: id } = useParams();
  const navigate = useNavigate();
  const service = ucServicesData[id];
  
  const [activeCategory, setActiveCategory] = useState(service?.categories[0]?.id || '');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const mobileBarRef = useRef(null);
  const mobileButtonsRef = useRef({});
  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef(null);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <button onClick={() => navigate(-1)} className="text-purple-700 font-semibold underline">Go Back</button>
      </div>
    );
  }

  const handleAddClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Scroll to section when category is clicked
  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);

    const el = document.getElementById(`category-${catId}`);
    if (el) {
      const headerOffset = window.innerWidth < 768 ? 165 : 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }

    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 850);
  };

  // Auto-scroll the mobile horizontal category bar to center the active pill
  useEffect(() => {
    const activeBtn = mobileButtonsRef.current[activeCategory];
    const container = mobileBarRef.current;
    if (activeBtn && container) {
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
        behavior: 'smooth'
      });
    }
  }, [activeCategory]);

  // Robust Scroll-Spy Listener with requestAnimationFrame
  useEffect(() => {
    let animFrameId = null;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;

      if (animFrameId) cancelAnimationFrame(animFrameId);

      animFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // 1. If user has scrolled near bottom of page, always activate the last category
        if (windowHeight + scrollY >= docHeight - 90) {
          const lastCat = service.categories[service.categories.length - 1];
          if (lastCat && activeCategory !== lastCat.id) {
            setActiveCategory(lastCat.id);
          }
          return;
        }

        // 2. Otherwise find the category currently occupying the top reading threshold
        const threshold = window.innerWidth < 768 ? 180 : 120;
        let matchedCatId = null;

        for (let i = service.categories.length - 1; i >= 0; i--) {
          const cat = service.categories[i];
          const el = document.getElementById(`category-${cat.id}`);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            matchedCatId = cat.id;
            break;
          }
        }

        if (!matchedCatId && service.categories.length > 0) {
          matchedCatId = service.categories[0].id;
        }

        if (matchedCatId && matchedCatId !== activeCategory) {
          setActiveCategory(matchedCatId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [service, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Header Placeholder spacing */}
      <div className="h-16" />

      {/* Main Container */}
      <main className="container mx-auto px-4 max-w-7xl pt-4">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => navigate('/services')} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            title="Back to services"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <span className="text-sm font-semibold text-slate-500">Services / {service.title}</span>
        </div>

        {/* Hero Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{service.title}</h1>
            <div className="flex items-center gap-2 text-sm mb-3">
              <div className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 fill-black text-black" />
                {service.rating}
              </div>
            </div>
            <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {service.deliveryTime}
            </div>
          </div>
          
          <div className="flex-1 flex justify-start md:justify-end">
            {service.banner?.type === 'warranty' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between min-w-[280px] w-full max-w-md">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{service.banner.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">{service.banner.subtitle}</p>
                </div>
                <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden ml-3">
                   <Shield className="w-7 h-7 text-teal-600 z-10" />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between min-w-[280px] w-full max-w-md">
                <div>
                  <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1 uppercase tracking-wide">Super Saver</span>
                  <h3 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{service.banner?.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm">{service.banner?.subtitle}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Categories Floating Bar */}
        <div className="md:hidden sticky top-16 z-30 bg-white/98 backdrop-blur-md -mx-4 px-4 py-3 border-b border-slate-200 shadow-sm">
          <div 
            ref={mobileBarRef}
            className="flex overflow-x-auto gap-3.5 pb-1 custom-scrollbar scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {service.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  ref={(el) => { mobileButtonsRef.current[cat.id] = el; }}
                  onClick={() => scrollToCategory(cat.id)}
                  className="flex flex-col items-center justify-start shrink-0 w-[72px] transition-transform active:scale-95 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl overflow-hidden mb-1.5 border-2 transition-all p-0.5 ${
                    isActive ? 'border-purple-600 shadow-md ring-2 ring-purple-100 bg-purple-50' : 'border-slate-200 bg-slate-50'
                  } flex items-center justify-center`}>
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <span className={`text-[11px] leading-tight text-center px-0.5 line-clamp-2 w-full font-semibold transition-colors ${
                    isActive ? 'text-purple-700' : 'text-slate-600'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Desktop Layout */}
        <div className="flex gap-8 relative mt-6">
          
          {/* Left Sidebar (Categories) */}
          <aside className="w-[120px] lg:w-[150px] hidden md:block shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar pr-1">
              <div className="space-y-4 pb-12">
                {service.categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className="flex flex-col items-center justify-center w-full text-center group transition-transform active:scale-95"
                    >
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden mb-1.5 border-2 transition-all p-1 ${
                        isActive 
                          ? 'border-purple-600 shadow-md ring-2 ring-purple-100 bg-purple-50' 
                          : 'border-transparent bg-slate-50 group-hover:border-slate-200'
                      } flex items-center justify-center`}>
                        <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <span className={`text-xs font-semibold transition-colors ${
                        isActive ? 'text-purple-700' : 'text-slate-500 group-hover:text-slate-900'
                      }`}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Middle Content (Items) */}
          <div className="flex-1 max-w-3xl min-w-0 pb-48">
            {service.categories.map((cat) => (
              <section key={cat.id} id={`category-${cat.id}`} className="mb-12 pt-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {cat.name}
                </h2>
                <div className="flex flex-col">
                  {cat.items.map((item) => (
                    <UCServiceItem 
                      key={item.id} 
                      item={item} 
                      onAddClick={handleAddClick}
                      onViewDetails={handleAddClick} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Right Sidebar (Cart & Promise) */}
          <aside className="w-[320px] hidden lg:block shrink-0">
            <div className="sticky top-20 space-y-6">
              
              {/* Promo Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Percent className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Get visitation fee off</h4>
                    <p className="text-xs text-slate-500">On orders above ₹499</p>
                  </div>
                </div>
                <div className="text-slate-400">&rsaquo;</div>
              </div>

              {/* UC Promise */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">UC Promise</h3>
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-black" /> Verified Professionals
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-black" /> Hassle Free Booking
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-black" /> Transparent Pricing
                  </li>
                </ul>
              </div>

              {/* Cart */}
              <CartSidebar />
            </div>
          </aside>
        </div>
      </main>

      <UCVariantModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedItem(null), 200);
        }} 
      />
      
      <MobileCartBottomBar />
    </div>
  );
}

export default function UCServicePage() {
  return <UCServicePageContent />;
}
