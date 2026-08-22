import React from 'react';
import { X, Star, Plus, Minus } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';

export default function UCVariantModal({ item, isOpen, onClose }) {
  const { cart, addToCart, removeFromCart } = useUCCart();

  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-start sm:pt-[10vh] bg-black/50 p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full sm:w-[450px] max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (Sticky) */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-start gap-4">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">{item.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {item.rating && (
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 fill-black text-black" />
              <span className="font-bold">{item.rating.split(' ')[0]}</span>
              <span className="text-slate-500">{item.rating.split(' ').slice(1).join(' ')}</span>
            </div>
          )}

          <div className="space-y-4 mb-8">
            {item.options.map((variant) => {
              const inCart = cart.find(c => c.variant?.id === variant.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <div key={variant.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-purple-300 transition-colors">
                  <div className="pr-4">
                    <h4 className="font-bold text-slate-900 mb-1">{variant.title}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold">₹{variant.price}</span>
                      <span className="text-slate-500">• {variant.time}</span>
                    </div>
                    {variant.rating && (
                      <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                        <Star className="w-3 h-3 fill-black text-black" /> {variant.rating}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-24 h-10 flex-shrink-0">
                    {qty === 0 ? (
                      <button 
                        onClick={() => addToCart(item, variant)}
                        className="w-full h-full bg-white text-purple-700 border border-slate-200 shadow-sm font-bold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="w-full h-full bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-between overflow-hidden">
                        <button 
                          onClick={() => removeFromCart(item.id, variant.id)}
                          className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-purple-700 font-bold text-sm">{qty}</span>
                        <button 
                          onClick={() => addToCart(item, variant)}
                          className="w-8 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="font-bold text-lg mb-4">Our process</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">1</div>
                <div>
                  <h4 className="font-bold text-sm">Inspection</h4>
                  <p className="text-sm text-slate-600">We inspect the issue and share a repair quote for approval</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">2</div>
                <div>
                  <h4 className="font-bold text-sm">Quote approval</h4>
                  <p className="text-sm text-slate-600">You can approve the quote to proceed, or pay a visitation charge if declined</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">3</div>
                <div>
                  <h4 className="font-bold text-sm">Repair & spare parts</h4>
                  <p className="text-sm text-slate-600">If needed, we will source spare parts from the local market</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
