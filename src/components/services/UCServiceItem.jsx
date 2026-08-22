import React from 'react';
import { Star, Plus, Minus } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';

export default function UCServiceItem({ item, onViewDetails, onAddClick }) {
  const { cart, addToCart, removeFromCart } = useUCCart();
  
  // Find if this item (or any of its variants) is in cart to show total quantity
  const itemInCart = cart.filter(c => c.id === item.id);
  const totalQuantity = itemInCart.reduce((acc, curr) => acc + curr.quantity, 0);

  const isSuperSaver = item.isSuperSaver;
  const hasVariants = item.options && item.options.length > 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      onAddClick(item);
    } else {
      addToCart(item);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      onAddClick(item); // Open modal to manage variants
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex justify-between items-start py-6 border-b border-slate-200">
      <div className="flex-1 pr-4">
        {isSuperSaver && (
          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-sm mb-2">
            SUPER SAVER
          </div>
        )}
        <h3 
          className="text-lg font-bold text-slate-900 mb-1 cursor-pointer hover:text-purple-700 transition-colors"
          onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
        >
          {item.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
          <div className="flex items-center gap-1 text-black font-semibold">
            <Star className="w-4 h-4 fill-black text-black" />
            {item.rating.split(' ')[0]}
          </div>
          <span>{item.rating.split(' ').slice(1).join(' ')}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-slate-900">{typeof item.price === 'number' ? `₹${item.price}` : item.price}</span>
          {item.discount && <span className="text-sm text-green-600 font-semibold">{item.discount}</span>}
          {item.time && <span className="text-sm text-slate-500">• {item.time}</span>}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
          className="text-purple-700 font-semibold text-sm hover:underline"
        >
          View details
        </button>
      </div>

      <div className="relative w-32 h-32 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover rounded-xl border border-slate-200 cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
        />
        
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24">
          {totalQuantity === 0 ? (
            <button 
              onClick={handleAdd}
              className="w-full bg-white text-purple-700 border border-slate-200 shadow-sm font-bold py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
            >
              Add
            </button>
          ) : (
            <div className="w-full bg-white border border-slate-200 shadow-sm rounded-lg flex items-center justify-between overflow-hidden">
              <button 
                onClick={handleRemove}
                className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-purple-700 font-bold text-sm">{totalQuantity}</span>
              <button 
                onClick={handleAdd}
                className="w-8 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
          {hasVariants && totalQuantity === 0 && (
            <p className="text-[10px] text-slate-500 text-center mt-1 bg-white/80 rounded px-1">{item.options.length} options</p>
          )}
        </div>
      </div>
    </div>
  );
}
