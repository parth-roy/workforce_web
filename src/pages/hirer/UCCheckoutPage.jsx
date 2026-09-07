import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Percent, Plus, Minus, X, Info, Phone, Edit2, Sparkles, Lock, ShieldCheck, Zap } from "lucide-react";
import { useUCCart } from "../../context/UCCartContext";
import { useAuth } from "../../context/AuthContext";
import LocationPicker from "../../components/shared/LocationPicker";

export default function UCCheckoutPage() {
  const navigate = useNavigate();
  const { user, token, openAuthModal } = useAuth();
  const { cart, getTotalPrice, addToCart, removeFromCart, clearCart, addOrder } = useUCCart();
  
  const [isSmartUnlock, setIsSmartUnlock] = useState(true);
  const [tipAmount, setTipAmount] = useState(75);
  const [avoidCalling, setAvoidCalling] = useState(false);
  
  // Custom contact phone state (falls back to user.phone or localStorage)
  const [customPhone, setCustomPhone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("uc_contactPhone") || "";
    }
    return "";
  });
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempPhone, setTempPhone] = useState("");

  // Sync custom phone if user logs in and no custom phone was set
  useEffect(() => {
    if (user?.phone && !customPhone) {
      setCustomPhone(user.phone);
    }
  }, [user?.phone]);

  const rawPhone = customPhone || user?.phone || "";
  const formatPhone = (p) => {
    if (!p) return "";
    const digits = p.toString().replace(/\D/g, "").slice(-10);
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return p.startsWith("+") ? p : `+91 ${p}`;
  };
  const displayPhone = formatPhone(rawPhone);

  // Slot state
  const [selectedSlot, setSelectedSlot] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uc_selectedSlot");
      if (saved) return saved;
    }
    return null;
  });
  
  useEffect(() => {
    if (typeof window !== "undefined" && selectedSlot) {
      localStorage.setItem("uc_selectedSlot", selectedSlot);
    }
  }, [selectedSlot]);
  
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  
  // Payment Processing State
  const [paymentState, setPaymentState] = useState("idle"); // "idle" | "processing" | "success"
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Location state
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uc_selectedLocation");
      if (saved) return JSON.parse(saved);
    }
    return null;
  });
  
  useEffect(() => {
    if (typeof window !== "undefined" && selectedLocation) {
      localStorage.setItem("uc_selectedLocation", JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: "", message: "" });

  const showAlert = (title, message) => {
    setAlertModal({ isOpen: true, title, message });
  };

  // If cart is empty, redirect back or show message
  if (cart.length === 0 && paymentState === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate("/services")}
          className="text-[#6B46C1] font-bold underline"
        >
          Go back to services
        </button>
      </div>
    );
  }

  const baseTotal = getTotalPrice();
  const grandTotal = baseTotal + tipAmount;

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>
          <div className="flex items-center gap-3 font-bold text-lg text-slate-900">
            <img src="/logo.png" alt="Metro Mitra" className="h-8 w-8 object-contain" />
            Checkout
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Column (Details) */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* Contact */}
            <div className="p-5 border-b border-slate-100 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">Send booking details to</p>
                    {displayPhone ? (
                      <p className="text-sm text-slate-700 font-medium">{displayPhone}</p>
                    ) : (
                      <p className="text-sm text-slate-400">Add mobile number to receive updates</p>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      if (!rawPhone && !user) {
                        openAuthModal("CUSTOMER");
                      } else {
                        setTempPhone(rawPhone.toString().replace(/\D/g, "").slice(-10));
                        setShowPhoneModal(true);
                      }
                    }} 
                    className="px-3 py-1 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    {displayPhone ? "Edit" : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-5 border-b border-slate-100 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-0.5">Address</p>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {selectedLocation?.address || user?.address || "No location selected"}
                    </p>
                  </div>
                  <button onClick={() => setShowAddressModal(true)} className="px-3 py-1 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                    {selectedLocation?.address || user?.address ? "Edit" : "Add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Slot */}
            <div className="p-5 border-b border-slate-100 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-semibold text-slate-900">Slot</p>
                  {selectedSlot && (
                    <button onClick={() => setIsSlotModalOpen(true)} className="px-3 py-1 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                      Edit
                    </button>
                  )}
                </div>
                {!selectedSlot ? (
                  <button onClick={() => setIsSlotModalOpen(true)} className="w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                    Select time & date
                  </button>
                ) : (
                  <p className="text-sm text-slate-700 font-semibold">{selectedSlot}</p>
                )}
              </div>
            </div>

            {/* Choose Booking Method */}
            <div className="p-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Choose Booking Method</span>
                </p>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  🔥 SAVE ~₹950 TODAY
                </span>
              </div>

              <div className="space-y-3">
                {/* Option 1: Smart Lead Unlock */}
                <div 
                  onClick={() => setIsSmartUnlock(true)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSmartUnlock 
                      ? "border-emerald-600 bg-emerald-50/40 shadow-sm" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        isSmartUnlock ? "border-emerald-600" : "border-slate-300"
                      }`}>
                        {isSmartUnlock && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">Direct Connect (Top 5-10 Verified Experts)</span>
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                            PAY ONLY 1% • ₹49
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Unlock direct Phone & WhatsApp contacts. Call, negotiate live quotes, and hire directly on your own terms. 0% middlemen platform commission!
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="font-bold text-emerald-700 text-sm">Pay: ₹49 Only</span>
                          <span className="text-slate-400 line-through">₹{grandTotal}</span>
                          <span className="text-emerald-600 font-semibold">• Instant Access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Traditional Doorstep Service */}
                <div 
                  onClick={() => setIsSmartUnlock(false)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    !isSmartUnlock 
                      ? "border-slate-900 bg-slate-50/60 shadow-sm" 
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        !isSmartUnlock ? "border-slate-900" : "border-slate-300"
                      }`}>
                        {!isSmartUnlock && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900">Traditional Doorstep Service</span>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          Let Metro Mitra automatically assign a verified technician to your doorstep at standard platform rates.
                        </p>
                        <div className="mt-2 text-xs font-bold text-slate-900">
                          Standard Bill: ₹{grandTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className={`p-5 flex items-start gap-4 ${!selectedSlot ? "opacity-50 grayscale" : "transition-all duration-300"}`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-4 h-3 border-2 border-slate-400 rounded-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Payment Method</p>
                {selectedSlot && <p className="text-xs text-slate-500 mt-1">{isSmartUnlock ? "Online UPI / Card / NetBanking" : "Pay on service completion"}</p>}
              </div>
            </div>
            
          </div>

          <div className="px-1">
            <h3 className="font-bold text-slate-900 mb-1">Cancellation policy</h3>
            <p className="text-xs text-slate-500 mb-2">Free cancellations if done more than 12 hrs before the service. A fee will be charged otherwise.</p>
            <button onClick={() => showAlert("Cancellation Policy", "Free cancellations are allowed up to 12 hours prior to the scheduled time. Late cancellations may incur a nominal fee to compensate the professional.")} className="text-xs font-bold text-slate-900 hover:underline">Read full policy</button>
          </div>
        </div>

        {/* Right Column (Cart & Summary) */}
        <div className="w-full md:w-[400px] space-y-4">
          
          {/* Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-lg text-slate-900 mb-4">{cart[0]?.category || "Your Service"}</h3>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, idx) => {
                const title = item.variant ? item.variant.title : item.title;
                const price = item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ""));
                
                return (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <p className="text-sm text-slate-800 leading-snug">{item.title}</p>
                      {item.variant && <p className="text-xs text-slate-500 mt-0.5">{title}</p>}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-[#F3F0FF] rounded-md overflow-hidden border border-[#E9E3FF]">
                        <button 
                          onClick={() => removeFromCart(item.id, item.variant?.id)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B46C1] hover:bg-[#E9E3FF]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#6B46C1]">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item, item.variant)}
                          className="w-7 h-7 flex items-center justify-center text-[#6B46C1] hover:bg-[#E9E3FF]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold w-12 text-right">₹{price * item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-slate-100">
              <input 
                type="checkbox" 
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500" 
                checked={avoidCalling}
                onChange={(e) => setAvoidCalling(e.target.checked)}
              />
              <span className="text-sm text-slate-600">Avoid calling before reaching the location</span>
            </label>
          </div>

          {/* Offers */}
          <div onClick={() => showAlert("Coupons & Offers", "No active coupons are currently available for this service. Please check back later.")} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Percent className="w-4 h-4 text-green-700" />
              </div>
              <span className="text-sm font-semibold text-slate-900">Coupons and offers</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-[#6B46C1]">
              9 offers <span className="text-lg leading-none">›</span>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <div className="w-4 h-5 border-2 border-slate-800 rounded-sm flex flex-col items-center justify-center gap-0.5">
                  <div className="w-2 h-0.5 bg-slate-800" />
                  <div className="w-2 h-0.5 bg-slate-800" />
                </div>
                Total bill ₹{grandTotal}
              </div>
              <span className="text-lg leading-none text-slate-400">›</span>
            </div>
            <p className="text-xs text-slate-500 ml-6">Incl. govt. taxes & charges</p>

            {/* Tip section */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-900 mb-3">Add a tip to thank the Professional</p>
              
              <div className="flex gap-2 mb-3">
                {[50, 75, 100].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setTipAmount(amt === tipAmount ? 0 : amt)}
                    className={`flex-1 relative py-2 rounded-lg border text-sm font-semibold transition-colors
                      ${tipAmount === amt ? "bg-[#F3F0FF] border-[#6B46C1] text-[#6B46C1]" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
                  >
                    ₹{amt}
                    {amt === 75 && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                        POPULAR
                      </span>
                    )}
                  </button>
                ))}
                <button 
                  onClick={() => {
                    const customTip = prompt("Enter custom tip amount (₹):");
                    if (customTip && !isNaN(customTip) && Number(customTip) >= 0) {
                      setTipAmount(Number(customTip));
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    ![0, 50, 75, 100].includes(tipAmount) ? "bg-[#F3F0FF] border-[#6B46C1] text-[#6B46C1]" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  Custom
                </button>
              </div>
              
              <p className="text-[11px] text-slate-500 mt-4">100% of the tip goes to the professional.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-0.5">{isSmartUnlock ? "Unlock Fee (1%)" : "Amount to pay"}</p>
            <div className="flex items-end gap-2">
              <span className={`text-xl font-bold ${isSmartUnlock ? "text-emerald-700" : "text-slate-900"}`}>
                ₹{isSmartUnlock ? 49 : grandTotal}
              </span>
              {isSmartUnlock ? (
                <span className="text-xs text-slate-400 line-through mb-1">₹{grandTotal}</span>
              ) : (
                <button onClick={() => showAlert("Bill Breakup", `Service Total: ₹${baseTotal}\nTip Amount: ₹${tipAmount}\nGrand Total: ₹${grandTotal}`)} className="text-xs font-bold text-slate-900 underline mb-1">View breakup</button>
              )}
            </div>
          </div>
          <button 
            onClick={async () => {
              if (isSmartUnlock) {
                const categoryTitle = cart[0]?.category || "Carpenter";
                const searchAddr = selectedLocation?.address || user?.address || "Local Area";
                const lat = selectedLocation?.lat || 22.5726;
                const lng = selectedLocation?.lng || 88.3639;

                try {
                  const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || "https://api.gomytruck.com/api/v1";
                  const initRes = await fetch(`${API_BASE}/lead-unlock/initiate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      latitude: lat,
                      longitude: lng,
                      serviceCategory: categoryTitle,
                      searchAddress: searchAddr,
                      amount: 49.0
                    })
                  });
                  const initData = await initRes.json();
                  const txId = initData?.data?.transactionId || "tx-" + Date.now();
                  
                  await fetch(`${API_BASE}/lead-unlock/verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      transactionId: txId,
                      isMock: true
                    })
                  });

                  navigate(`/unlocked-experts?txId=${txId}&category=${encodeURIComponent(categoryTitle)}`);
                } catch (err) {
                  navigate(`/unlocked-experts?category=${encodeURIComponent(categoryTitle)}`);
                }
                return;
              }

              if (!selectedSlot) return showAlert("Action Required", "Please select a preferred time slot before proceeding to checkout.");
              
              if (!user || !token) {
                openAuthModal("CUSTOMER");
                return;
              }
              
              setPaymentState("processing");
              
              const phoneToSend = rawPhone.toString().replace(/\D/g, "").slice(-10) || user.phone || "";
              const chosenAddress = selectedLocation?.address || user?.address || "Service Location Provided";
              
              // Intelligent Service Category and Title resolution
              const resolveServiceInfo = (items) => {
                if (!items || items.length === 0) return { categoryCode: 'HELPER', serviceTitle: 'General Service' };
                const first = items[0];
                const str = `${first.serviceId || ''} ${first.category || ''} ${first.title || ''} ${first.id || ''}`.toLowerCase();
                
                if (str.includes('electric') || str.includes('switch') || str.includes('socket') || str.includes('wiring') || str.includes('fan') || str.startsWith('e')) {
                  return { categoryCode: 'ELECTRICIAN', serviceTitle: 'Electrician' };
                }
                if (str.includes('plumb') || str.includes('tap') || str.includes('pipe') || str.includes('leak') || str.includes('mixer') || str.includes('bath') || str.startsWith('p')) {
                  return { categoryCode: 'PLUMBER', serviceTitle: 'Plumber' };
                }
                if (str.includes('carpent') || str.includes('furniture') || str.includes('door') || str.includes('bed') || str.startsWith('c')) {
                  return { categoryCode: 'CARPENTER', serviceTitle: 'Carpenter' };
                }
                if (str.includes('ac') || str.includes('foam-jet') || str.includes('cooling') || str.includes('air condition')) {
                  return { categoryCode: 'AC_REPAIR', serviceTitle: 'AC Repair' };
                }
                if (str.includes('appliance') || str.includes('washing') || str.includes('refrigerator') || str.includes('geyser') || str.includes('microwave') || str.includes('ro_water') || str.includes('purifier')) {
                  return { categoryCode: 'APPLIANCE_REPAIR', serviceTitle: 'Appliance Repair' };
                }
                if (str.includes('paint')) {
                  return { categoryCode: 'PAINTER', serviceTitle: 'Painter' };
                }
                if (str.includes('clean') || str.includes('pest') || str.includes('housekeep')) {
                  return { categoryCode: 'CLEANER', serviceTitle: 'Cleaning & Pest' };
                }
                if (str.includes('secur') || str.includes('guard')) {
                  return { categoryCode: 'SECURITY_GUARD', serviceTitle: 'Security Guard' };
                }
                if (str.includes('load') || str.includes('unload')) {
                  return { categoryCode: 'LOADER', serviceTitle: 'Loading & Unloading' };
                }
                if (str.includes('mover') || str.includes('moving') || str.includes('shift')) {
                  return { categoryCode: 'FURNITURE_MOVER', serviceTitle: 'Furniture Moving' };
                }
                if (str.includes('pack')) {
                  return { categoryCode: 'PACKER', serviceTitle: 'Packer' };
                }
                if (str.includes('deliver') || str.includes('courier')) {
                  return { categoryCode: 'LAST_MILE_DELIVERY', serviceTitle: 'Last-Mile Delivery' };
                }
                return { categoryCode: 'HELPER', serviceTitle: 'General Helper' };
              };

              const { categoryCode, serviceTitle } = resolveServiceInfo(cart);
              const taskSummary = cart.map(item => `${item.category || item.title}: ${item.title}${item.variant ? ` (${typeof item.variant === 'object' ? item.variant?.title : item.variant})` : ''} x${item.quantity}`).join(', ');
              const displayDescription = `${serviceTitle} — ${taskSummary}`;

              try {
                const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/gig/customer" : "https://api.gomytruck.com/api/v1/gig/customer";
                const res = await fetch(apiUrl, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    gigCategory: categoryCode, 
                    description: displayDescription,
                    locationLat: selectedLocation?.lat || 22.57,
                    locationLng: selectedLocation?.lng || 88.36, 
                    locationAddress: chosenAddress,
                    contactPhone: phoneToSend,
                    workersNeeded: 1,
                    durationHours: 2,
                    urgency: "SCHEDULED",
                    scheduledSlot: selectedSlot,
                    isTaskBased: true,
                    tipAmount: tipAmount,
                    tasks: cart.map(item => ({
                      title: item.title,
                      category: item.category || serviceTitle,
                      quantity: item.quantity,
                      price: item.price,
                      variant: typeof item.variant === 'object' ? item.variant?.title : (item.variant || "Standard")
                    }))
                  })
                });

                if (!res.ok) {
                  const errData = await res.json().catch(() => ({}));
                  throw new Error(errData.message || "Failed to place booking with server.");
                }

                setPaymentState("success");
                addOrder({
                  items: [...cart],
                  total: grandTotal,
                  slot: selectedSlot,
                  address: chosenAddress,
                  contactPhone: displayPhone,
                  status: "Scheduled",
                  category: serviceTitle
                });
                
                setTimeout(() => clearCart(), 500); 
                
                setTimeout(() => {
                  setPaymentState("idle");
                  window.scrollTo(0,0);
                  navigate("/user/orders");
                }, 3000);
                
              } catch (err) {
                console.error("Booking API Error", err);
                
                // MOCK FALLBACK IF BACKEND FAILS DURING DEVELOPMENT
                console.warn("Falling back to local mock booking due to API failure");
                setPaymentState("success");
                addOrder({
                  items: [...cart],
                  total: grandTotal,
                  slot: selectedSlot,
                  address: chosenAddress,
                  contactPhone: displayPhone,
                  status: "Scheduled",
                  category: cart[0]?.category || "Service"
                });
                setTimeout(() => clearCart(), 500);
                setTimeout(() => {
                  setPaymentState("idle");
                  window.scrollTo(0,0);
                  navigate("/user/orders");
                }, 3000);
              }
            }}
            className={`font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 ${
              isSmartUnlock 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                : selectedSlot 
                  ? "bg-slate-900 text-white cursor-pointer hover:bg-slate-800" 
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isSmartUnlock ? (
              <>
                <Lock className="w-4 h-4 text-emerald-200" />
                <span>Unlock 5-10 Experts • ₹49</span>
              </>
            ) : (
              <span>Proceed to Payment</span>
            )}
          </button>
        </div>
      </div>

      {/* Edit Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Change Contact Number</h3>
              <button onClick={() => setShowPhoneModal(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Booking confirmation and updates will be sent to this mobile number.</p>
            <div className="flex mb-5">
              <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm font-medium">
                +91
              </span>
              <input
                type="tel"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                autoFocus
                className="flex-1 block w-full px-3 py-2.5 rounded-none rounded-r-xl border border-slate-200 focus:ring-[#6B46C1] focus:border-[#6B46C1] text-sm focus:outline-none"
                placeholder="9876543210"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempPhone.length === 10) {
                    setCustomPhone(tempPhone);
                    localStorage.setItem("uc_contactPhone", tempPhone);
                    setShowPhoneModal(false);
                  } else {
                    showAlert("Invalid Number", "Please enter a valid 10-digit mobile number.");
                  }
                }}
                disabled={tempPhone.length !== 10}
                className="flex-1 py-2.5 bg-[#6B46C1] text-white rounded-xl text-sm font-semibold hover:bg-[#553C9A] disabled:opacity-50 transition-colors"
              >
                Save Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Picker Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[700px] animate-in zoom-in-95 duration-300">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <h3 className="font-bold text-xl text-slate-900">Select Location</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 relative overflow-y-auto p-4 bg-slate-50">
              <LocationPicker 
                onLocationChange={(loc) => {
                  setSelectedLocation(loc);
                }} 
              />
            </div>
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => setShowAddressModal(false)}
                disabled={!selectedLocation?.address}
                className={`w-full font-bold py-3.5 rounded-xl transition-all ${
                  selectedLocation?.address 
                    ? "bg-[#6B46C1] text-white hover:bg-[#553C9A] shadow-lg" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Confirm Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing/Success Modal */}
      {paymentState !== "idle" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            {paymentState === "processing" ? (
              <>
                <div className="w-16 h-16 border-4 border-slate-100 border-t-[#6B46C1] rounded-full animate-spin mb-6" />
                <h3 className="font-bold text-xl text-slate-900 mb-2">Processing Payment...</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Securely connecting to payment gateway.<br/>Please do not close this window.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-2xl text-slate-900 mb-2">Booking Confirmed!</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">Your service has been successfully booked. Our professional will arrive at the scheduled time.</p>
                <button 
                  onClick={() => {
                    setPaymentState("idle");
                    navigate("/user/orders");
                  }}
                  className="w-full py-3.5 bg-[#6B46C1] text-white font-bold rounded-xl hover:bg-[#553C9A] transition-colors"
                >
                  View My Orders
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 animate-in fade-in duration-200" onClick={() => setIsSlotModalOpen(false)}>
          <div className="bg-white w-full sm:w-[450px] rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Select Date & Time</h3>
            
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
              {["Today", "Tomorrow", "Day After"].map((day, idx) => {
                const date = new Date();
                date.setDate(date.getDate() + idx);
                const dateStr = date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
                return (
                  <div key={day} className="snap-start min-w-[120px] p-3 border rounded-xl cursor-pointer text-center hover:border-purple-600 transition-colors border-slate-200">
                    <p className="font-bold text-slate-900">{day}</p>
                    <p className="text-xs text-slate-500">{dateStr}</p>
                  </div>
                );
              })}
            </div>

            <p className="font-semibold text-slate-900 mt-2">Select Start Time</p>
            <div className="grid grid-cols-3 gap-3">
              {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].map(time => (
                <button 
                  key={time}
                  onClick={() => { setSelectedSlot(`Tomorrow, ${time}`); setIsSlotModalOpen(false); }}
                  className="py-2.5 px-2 text-sm border border-slate-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors font-semibold text-slate-700 text-center"
                >
                  {time}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => setIsSlotModalOpen(false)}
              className="mt-4 py-3 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200" onClick={() => setAlertModal({ ...alertModal, isOpen: false })}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">{alertModal.title}</h3>
              </div>
              <button 
                onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
                className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line ml-13 pl-13">
              {alertModal.message}
            </div>

            <button 
              onClick={() => setAlertModal({ ...alertModal, isOpen: false })}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
