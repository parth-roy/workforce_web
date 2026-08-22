import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Percent, Plus, Minus, X, Info } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';

export default function UCCheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, addToCart, removeFromCart, clearCart, addOrder } = useUCCart();
  const [tipAmount, setTipAmount] = useState(75);
  const [avoidCalling, setAvoidCalling] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  
  // Payment Processing State
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

  const showAlert = (title, message) => {
    setAlertModal({ isOpen: true, title, message });
  };

  // If cart is empty, redirect back or show message
  if (cart.length === 0 && paymentState === 'idle') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/services')}
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
                <div className="w-3 h-3 bg-slate-400 rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 mb-0.5">Send booking details to</p>
                <p className="text-sm text-slate-500">+91 9876543210</p>
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
                    <p className="text-sm text-slate-500 line-clamp-1">Home - 1st floor, Ghosh Para Rd, Barrackpore...</p>
                  </div>
                  <button onClick={() => showAlert('Edit Address', 'Address editing functionality will be available soon.')} className="px-3 py-1 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                    Edit
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

            {/* Payment Method */}
            <div className={`p-5 flex items-start gap-4 ${!selectedSlot ? 'opacity-50 grayscale' : 'transition-all duration-300'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-4 h-3 border-2 border-slate-400 rounded-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Payment Method</p>
                {selectedSlot && <p className="text-xs text-slate-500 mt-1">Pay on service completion</p>}
              </div>
            </div>
            
          </div>

          <div className="px-1">
            <h3 className="font-bold text-slate-900 mb-1">Cancellation policy</h3>
            <p className="text-xs text-slate-500 mb-2">Free cancellations if done more than 12 hrs before the service. A fee will be charged otherwise.</p>
            <button onClick={() => showAlert('Cancellation Policy', 'Free cancellations are allowed up to 12 hours prior to the scheduled time. Late cancellations may incur a nominal fee to compensate the professional.')} className="text-xs font-bold text-slate-900 hover:underline">Read full policy</button>
          </div>
        </div>

        {/* Right Column (Cart & Summary) */}
        <div className="w-full md:w-[400px] space-y-4">
          
          {/* Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-lg text-slate-900 mb-4">{cart[0]?.category || 'Your Service'}</h3>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, idx) => {
                const title = item.variant ? item.variant.title : item.title;
                const price = item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''));
                
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
          <div onClick={() => showAlert('Coupons & Offers', 'No active coupons are currently available for this service. Please check back later.')} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
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
                      ${tipAmount === amt ? 'bg-[#F3F0FF] border-[#6B46C1] text-[#6B46C1]' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
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
                    const customTip = prompt('Enter custom tip amount (₹):');
                    if (customTip && !isNaN(customTip) && Number(customTip) >= 0) {
                      setTipAmount(Number(customTip));
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    ![0, 50, 75, 100].includes(tipAmount) ? 'bg-[#F3F0FF] border-[#6B46C1] text-[#6B46C1]' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
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
            <p className="text-sm font-semibold text-slate-500 mb-0.5">Amount to pay</p>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-slate-900">₹{grandTotal}</span>
              <button onClick={() => showAlert('Bill Breakup', `Service Total: ₹${baseTotal}\nTip Amount: ₹${tipAmount}\nGrand Total: ₹${grandTotal}`)} className="text-xs font-bold text-slate-900 underline mb-1">View breakup</button>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!selectedSlot) return showAlert('Action Required', 'Please select a preferred time slot before proceeding to checkout.');
              setPaymentState('processing');
              setTimeout(() => {
                setPaymentState('success');
                addOrder({
                  items: [...cart],
                  total: grandTotal,
                  slot: selectedSlot,
                  address: 'Home - 1st floor, Ghosh Para Rd, Barrackpore...',
                  status: 'Scheduled',
                  category: cart[0]?.category || 'Service'
                });
                // Wait for the modal animation, then clear cart
                setTimeout(() => clearCart(), 500); 
                
                // Automatically redirect to orders page after 2.5 seconds of success
                setTimeout(() => {
                  setPaymentState('idle');
                  navigate('/user/orders');
                }, 3000);
              }, 2500);
            }}
            className={`${selectedSlot ? 'bg-slate-900 text-white cursor-pointer hover:bg-slate-800' : 'bg-slate-300 text-slate-500 cursor-not-allowed'} font-bold py-3 px-8 rounded-lg transition-colors`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Payment Processing/Success Modal */}
      {paymentState !== 'idle' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            {paymentState === 'processing' ? (
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
                    setPaymentState('idle');
                    navigate('/user/orders');
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
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Select Date & Time</h3>
            <div className="space-y-3">
              {['Tomorrow, 09:00 AM - 11:00 AM', 'Tomorrow, 12:00 PM - 02:00 PM', 'Tomorrow, 04:00 PM - 06:00 PM'].map(slot => (
                <button 
                  key={slot}
                  onClick={() => { setSelectedSlot(slot); setIsSlotModalOpen(false); }}
                  className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-colors font-semibold text-slate-700"
                >
                  {slot}
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
