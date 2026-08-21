import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Plus, Minus, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';

const MOCK_CATALOG = {
  electrician: [
    { section: 'Switch & Socket', items: [{ id: 'e1', title: 'Switch/socket repair', price: 69 }, { id: 'e2', title: 'New switchbox installation', price: 149 }] },
    { section: 'Fan', items: [{ id: 'e3', title: 'Fan repair', price: 149 }, { id: 'e4', title: 'Fan installation', price: 99 }] }
  ],
  plumber: [
    { section: 'Tap & Shower', items: [{ id: 'p1', title: 'Tap installation/repair', price: 89 }, { id: 'p2', title: 'Shower installation', price: 129 }] },
    { section: 'Drain & Basin', items: [{ id: 'p3', title: 'Drain blockage removal', price: 199 }, { id: 'p4', title: 'Wash basin leakage repair', price: 149 }] }
  ],
  painter: [
    { section: 'Interior Painting', items: [{ id: 'pa1', title: 'Single Room Painting', price: 2999 }, { id: 'pa2', title: 'Touch-up Painting', price: 999 }] },
    { section: 'Exterior Painting', items: [{ id: 'pa3', title: 'Balcony Painting', price: 1499 }] }
  ],
  cleaning: [
    { section: 'Deep Cleaning', items: [{ id: 'c1', title: '1 BHK Deep Cleaning', price: 1999 }, { id: 'c2', title: 'Bathroom Deep Cleaning', price: 499 }] },
    { section: 'Routine Cleaning', items: [{ id: 'c3', title: 'Floor Sweeping & Mopping', price: 299 }] }
  ],
  'ac-repair': [
    { section: 'Servicing', items: [{ id: 'ac1', title: 'Foam-jet AC Service', price: 499 }, { id: 'ac2', title: 'Power-jet AC Service', price: 699 }] },
    { section: 'Repair', items: [{ id: 'ac3', title: 'AC Gas Check & Refill', price: 1299 }, { id: 'ac4', title: 'AC Cooling Issue Fix', price: 399 }] }
  ],
  'appliance-repair': [
    { section: 'Washing Machine', items: [{ id: 'ap1', title: 'Top Load Repair', price: 299 }, { id: 'ap2', title: 'Front Load Repair', price: 399 }] },
    { section: 'Refrigerator', items: [{ id: 'ap3', title: 'Single Door Repair', price: 299 }, { id: 'ap4', title: 'Double Door Repair', price: 399 }] }
  ],
  security: [
    { section: 'Guards', items: [{ id: 's1', title: 'Day Shift Guard (8 Hours)', price: 899 }, { id: 's2', title: 'Night Shift Guard (12 Hours)', price: 1299 }] },
    { section: 'Event Security', items: [{ id: 's3', title: 'Bouncer / Close Protection', price: 1999 }] }
  ],
  carpenter: [
    { section: 'Furniture Assembly', items: [{ id: 'ca1', title: 'Bed Assembly', price: 399 }, { id: 'ca2', title: 'Wardrobe Assembly', price: 599 }] },
    { section: 'Repairs', items: [{ id: 'ca3', title: 'Door Hinge/Lock Repair', price: 199 }, { id: 'ca4', title: 'Chair/Table Repair', price: 249 }] }
  ],
  'loading-unloading': [
    { section: 'Labor Needed', items: [{ id: 'lu1', title: '2 Helpers (2 Hours)', price: 999 }, { id: 'lu2', title: '4 Helpers (Half Day)', price: 2499 }] }
  ],
  'general-helper': [
    { section: 'General Labor', items: [{ id: 'gh1', title: '1 Helper (4 Hours)', price: 599 }, { id: 'gh2', title: '1 Helper (8 Hours)', price: 999 }] }
  ],
  'furniture-moving': [
    { section: 'Moving Help', items: [{ id: 'fm1', title: 'In-house Shifting (2 Movers)', price: 899 }, { id: 'fm2', title: 'Floor-to-Floor Shifting', price: 1299 }] }
  ],
  packer: [
    { section: 'Packing Help', items: [{ id: 'pk1', title: 'Carton Packing (2 Packers)', price: 999 }, { id: 'pk2', title: 'Fragile Item Wrapping', price: 1499 }] }
  ],
  'last-mile-delivery': [
    { section: 'Delivery Associate', items: [{ id: 'lm1', title: 'Bike Courier (Full Day)', price: 1199 }, { id: 'lm2', title: 'E-Rickshaw Delivery (Full Day)', price: 1599 }] }
  ]
};

export default function ServiceBookingWizard({ service, onClose }) {
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const catalog = MOCK_CATALOG[service.slug] || [
    { section: 'Standard Services', items: [{ id: 'gen1', title: 'Consultation & Visit', price: 199 }] }
  ];

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    let itemPrice = 0;
    catalog.forEach(sec => {
      const it = sec.items.find(i => i.id === id);
      if (it) itemPrice = it.price;
    });
    return sum + (itemPrice * qty);
  }, 0);

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateCart = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) delete newCart[id];
      else newCart[id] = next;
      return newCart;
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full bg-white text-center rounded-2xl">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-6">Your request for {service.name} has been received. A professional will be assigned shortly.</p>
        <button onClick={onClose} className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full md:h-[600px] rounded-t-2xl md:rounded-2xl bg-slate-50 relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b sticky top-0 z-10 shadow-sm">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
        <h2 className="font-bold text-slate-900 text-lg">{service.name}</h2>
        <button onClick={onClose} className="text-emerald-600 font-bold text-sm">Close</button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {step === 1 && (
          <div className="p-4 space-y-6">
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Select Sub-Services</h4>
                <p className="text-xs mt-1">Add the specific tasks you need help with.</p>
              </div>
            </div>

            {catalog.map(sec => (
              <div key={sec.section}>
                <h3 className="font-bold text-xl text-slate-900 mb-4">{sec.section}</h3>
                <div className="space-y-4">
                  {sec.items.map(item => {
                    const qty = cart[item.id] || 0;
                    return (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.title}</h4>
                          <p className="font-semibold text-slate-600 mt-1">₹{item.price}</p>
                        </div>
                        {qty === 0 ? (
                          <button 
                            onClick={() => updateCart(item.id, 1)}
                            className="text-emerald-600 font-bold bg-emerald-50 px-6 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-1">
                            <button onClick={() => updateCart(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white text-emerald-700 rounded-md shadow-sm"><Minus className="w-4 h-4" /></button>
                            <span className="font-bold w-4 text-center">{qty}</span>
                            <button onClick={() => updateCart(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white text-emerald-700 rounded-md shadow-sm"><Plus className="w-4 h-4" /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="h-px bg-slate-200 my-6"></div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="p-4 space-y-6">
            <h3 className="font-bold text-2xl text-slate-900">When do you need the service?</h3>
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <label className="block font-bold text-slate-700 mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-600" /> Select Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
            </div>
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <label className="block font-bold text-slate-700 mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-600" /> Select Time</label>
              <select value={time} onChange={e => setTime(e.target.value)} className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="">Choose a time slot...</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 space-y-6">
            <h3 className="font-bold text-2xl text-slate-900">Where do you need the service?</h3>
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <label className="block font-bold text-slate-700 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-600" /> Service Location</label>
              <textarea 
                rows={3} 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="Enter your full address (e.g., Flat 101, Building A...)" 
                className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none bg-white"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-4 space-y-6">
            <h3 className="font-bold text-2xl text-slate-900">Review Booking</h3>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-slate-50 p-4 border-b">
                <h4 className="font-bold text-slate-800">Order Summary</h4>
              </div>
              <div className="p-4 space-y-3">
                {Object.entries(cart).map(([id, qty]) => {
                  let itm = null;
                  catalog.forEach(sec => {
                    const found = sec.items.find(i => i.id === id);
                    if (found) itm = found;
                  });
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-slate-700">{qty}x {itm.title}</span>
                      <span className="font-semibold text-slate-900">₹{itm.price * qty}</span>
                    </div>
                  );
                })}
                <div className="pt-3 border-t flex justify-between font-bold text-lg text-emerald-700">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm"><Calendar className="w-5 h-5 text-slate-400 shrink-0" /><span className="text-slate-700 font-medium">{date || 'Not selected'}</span></div>
              <div className="flex items-center gap-3 text-sm"><Clock className="w-5 h-5 text-slate-400 shrink-0" /><span className="text-slate-700 font-medium">{time || 'Not selected'}</span></div>
              <div className="flex items-center gap-3 text-sm"><MapPin className="w-5 h-5 text-slate-400 shrink-0" /><span className="text-slate-700 font-medium">{location || 'No address provided'}</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] z-20">
        {step === 1 ? (
          <button 
            disabled={cartItemsCount === 0}
            onClick={() => setStep(2)}
            className="w-full bg-emerald-600 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-between px-6 transition-colors shadow-sm"
          >
            <span>{cartItemsCount > 0 ? `₹${cartTotal} • ${cartItemsCount} Items` : 'Select Services'}</span>
            <span className="flex items-center gap-1">Continue <ChevronRight className="w-5 h-5" /></span>
          </button>
        ) : step < 4 ? (
          <button 
            disabled={(step === 2 && (!date || !time)) || (step === 3 && !location.trim())}
            onClick={() => setStep(step + 1)}
            className="w-full bg-emerald-600 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Proceed <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={() => setSubmitted(true)}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-md"
          >
            Confirm & Book Now
          </button>
        )}
      </div>
    </div>
  );
}

