import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Shield, ArrowLeft, Percent, CheckCircle2, MapPin, Search } from 'lucide-react';
import { ucServicesData } from '../../data/mock/ucServicesData';
import UCServiceItem from '../../components/services/UCServiceItem';
import UCVariantModal from '../../components/modals/UCVariantModal';
import { useUCCart, UCCartProvider } from '../../context/UCCartContext';

function CartSidebar() {
  const { cart, getTotalPrice } = useUCCart();
  
  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-6 border border-slate-100 flex flex-col items-center justify-center text-center min-h-[250px]">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl grayscale opacity-40">🛒</span>
        </div>
        <p className="text-slate-500 font-medium">No items in your cart</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-6 border border-slate-100">
      <h3 className="font-bold text-lg mb-4">Cart</h3>
      <div className="space-y-4 mb-4">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm">
            <div className="flex-1 pr-2">
              <p className="font-semibold">{item.variant ? item.variant.title : item.title}</p>
              <p className="text-slate-500">₹{item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''))} × {item.quantity}</p>
            </div>
            <p className="font-bold">₹{(item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''))) * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 pt-4 mb-4 flex justify-between items-center font-bold text-lg">
        <span>Total</span>
        <span>₹{getTotalPrice()}</span>
      </div>
      <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
}

function MobileCartBottomBar() {
  const { cart, getTotalPrice } = useUCCart();
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 lg:hidden flex justify-between items-center animate-in slide-in-from-bottom-2">
      <div>
        <p className="text-sm font-bold text-slate-900">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
        <p className="text-purple-700 font-bold">₹{getTotalPrice()}</p>
      </div>
      <button className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-slate-800 transition-colors">
        Checkout
      </button>
    </div>
  );
}

function UCServicePageContent() {
  const { service: id } = useParams();
  const navigate = useNavigate();
  const service = ucServicesData[id];
  
  const [activeCategory, setActiveCategory] = useState(service?.categories[0]?.id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentRef = useRef(null);
  
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

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    const el = document.getElementById(`category-${catId}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const categories = service.categories.map(c => document.getElementById(`category-${c.id}`));
      let currentActive = activeCategory;
      
      for (const el of categories) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          currentActive = el.id.replace('category-', '');
          break;
        }
      }
      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategory, service]);

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-slate-100 h-10 rounded-lg flex items-center px-4 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder={`Search in ${service.title}`}
              className="bg-transparent border-none outline-none w-full text-sm"
              disabled
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        {/* Top Title & Banner */}
        <div className="mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{service.title}</h1>
            <div className="flex items-center gap-2 text-sm mb-4">
              <div className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 fill-black text-black" />
                {service.rating}
              </div>
            </div>
            <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {service.deliveryTime}
            </div>
          </div>
          
          <div className="flex-1 flex justify-end">
            {service.banner.type === 'warranty' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between min-w-[300px] w-full max-w-md">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 mb-1 leading-tight">{service.banner.title.replace('included', 'included')}</h3>
                  <p className="text-slate-500 text-sm">{service.banner.subtitle}</p>
                </div>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                   <Shield className="w-8 h-8 text-teal-600 z-10" />
                   <div className="absolute inset-0 bg-teal-200 opacity-50 transform -skew-x-12" />
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between min-w-[300px] w-full max-w-md overflow-hidden relative">
                <div className="z-10">
                  <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2 uppercase tracking-wide">Super Saver</span>
                  <h3 className="font-bold text-2xl text-slate-900 mb-1 leading-tight">{service.banner.title}</h3>
                  <p className="text-slate-600 text-lg">{service.banner.subtitle}</p>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-blue-100 rounded-tl-full opacity-50"></div>
              </div>
            )}
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex gap-8 relative">
          
          {/* Left Sidebar (Categories) */}
          <aside className="w-[120px] lg:w-[150px] hidden md:block shrink-0">
            <div className="sticky top-24">
              <div className="space-y-4">
                {service.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    className="flex flex-col items-center justify-center w-full text-center group"
                  >
                    <div className={`w-16 h-16 rounded-xl overflow-hidden mb-2 border-2 transition-colors ${activeCategory === cat.id ? 'border-black' : 'border-transparent group-hover:border-slate-200'} bg-slate-50 p-2 flex items-center justify-center`}>
                      <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className={`text-xs ${activeCategory === cat.id ? 'font-bold text-black' : 'font-medium text-slate-500 group-hover:text-black'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Middle Content (Items) */}
          <div className="flex-1 max-w-3xl" ref={contentRef}>
            {service.categories.map((cat) => (
              <section key={cat.id} id={`category-${cat.id}`} className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{cat.name}</h2>
                <div className="flex flex-col border-t border-slate-100">
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
            <div className="sticky top-24 space-y-6">
              
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
  return (
    <UCCartProvider>
      <UCServicePageContent />
    </UCCartProvider>
  );
}
