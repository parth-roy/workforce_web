import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Package, CheckCircle2 } from 'lucide-react';
import { useUCCart } from '../../context/UCCartContext';

export default function UCOrdersPage() {
  const navigate = useNavigate();
  const { orders } = useUCCart();

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/services')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-800" />
            </button>
            <div className="flex items-center gap-3 font-bold text-lg text-slate-900">
              <img src="/logo.png" alt="Metro Mitra" className="h-8 w-8 object-contain" />
              My Bookings
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't booked any services yet.</p>
            <button 
              onClick={() => navigate('/services')}
              className="bg-[#6B46C1] hover:bg-[#553C9A] text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-700 bg-green-100 px-3 py-1.5 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {order.status}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">{order.category}</h3>
                  
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-slate-500">{item.quantity}x</span>
                          <span className="text-slate-800">{item.variant ? item.variant.title : item.title}</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ₹{(item.variant ? item.variant.price : parseInt(item.price.replace(/[^0-9]/g, ''))) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                    <div className="flex-1 flex items-start gap-3">
                      <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-0.5">Scheduled for</p>
                        <p className="text-sm text-slate-900">{order.slot}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-0.5">Service Address</p>
                        <p className="text-sm text-slate-900 line-clamp-1">{order.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-600">Total Amount Paid</span>
                  <span className="text-lg font-bold text-slate-900">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
