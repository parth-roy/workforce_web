import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, getTotalPrice, isCartOpen, setIsCartOpen, removeFromCart, clearCart } = useUCCart();
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      openAuthModal('CUSTOMER');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[110] animate-in fade-in" 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[120] shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🛒</span>
              </div>
              <p className="font-medium text-lg">Your cart is empty</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/services'); }}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 leading-tight mb-1">
                      {item.variant ? item.variant.title : item.title}
                    </p>
                    <p className="text-slate-500 text-sm mb-2">
                      ₹{item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''))} x {item.quantity}
                    </p>
                    <p className="font-bold text-emerald-700">
                      ₹{(item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''))) * item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant?.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove 1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">₹{getTotalPrice()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#6B46C1] text-white font-black text-lg py-4 rounded-xl shadow-lg hover:bg-[#553C9A] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Checkout <span className="font-normal opacity-80 text-sm">(Login required)</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
