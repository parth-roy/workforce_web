import React, { useState, useEffect } from 'react';
import { X, Wrench, HardHat, Building2, HelpCircle, ArrowRight, Check, Sparkles } from 'lucide-react';

const INTENTS = [
  {
    id: 'HIRE',
    title: 'Hire a Worker / Book Service',
    badge: 'Customer / Home',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: Wrench,
    subtitle: 'Electrician, plumber, cleaning, carpenter, or shifting helper',
    defaultService: 'Electrician',
    options: ['Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Carpenter', 'Painter', 'Shifting Helper', 'Loading Labour']
  },
  {
    id: 'JOIN',
    title: 'Join as Worker / Get Daily Work',
    badge: 'Worker / Job',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: HardHat,
    subtitle: 'Find daily jobs, 0% commission & instant daily payouts',
    defaultService: 'General Helper',
    options: ['General Helper', 'Loading Worker', 'Electrician', 'Plumber', 'Painter', 'Carpenter', 'Cleaner', 'AC Technician']
  },
  {
    id: 'BULK',
    title: 'Bulk Labour & Contractor Hiring',
    badge: 'B2B / Site',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Building2,
    subtitle: 'Hire 3+ verified workers for commercial site, warehouse or project',
    defaultService: 'General Helpers',
    options: ['General Helpers', 'Loading & Unloading Team', 'Skilled Technicians', 'Construction Labour']
  },
  {
    id: 'SUPPORT',
    title: 'Support & General Inquiry',
    badge: 'Support',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: HelpCircle,
    subtitle: 'Help with an existing booking, payment, or general question',
    defaultService: 'Existing Booking Status',
    options: ['Existing Booking Status', 'Payment / Billing Inquiry', 'Direct Numbers Access', 'General Question']
  }
];

export default function WhatsAppIntentModal({ isOpen, onClose, initialIntent = 'HIRE' }) {
  const [selectedIntent, setSelectedIntent] = useState(initialIntent);
  
  // Quick-fill state for Hire
  const [hireService, setHireService] = useState('Electrician');
  const [hireLocation, setHireLocation] = useState('');
  const [hireTiming, setHireTiming] = useState('Today (Urgent)');

  // Quick-fill state for Join
  const [workerTrade, setWorkerTrade] = useState('General Helper');
  const [workerName, setWorkerName] = useState('');
  const [workerCity, setWorkerCity] = useState('');

  // Quick-fill state for Bulk
  const [bulkType, setBulkType] = useState('General Helpers');
  const [bulkCount, setBulkCount] = useState('5 - 10 Workers');
  const [bulkLocation, setBulkLocation] = useState('');

  // Quick-fill state for Support
  const [supportTopic, setSupportTopic] = useState('Existing Booking Status');
  const [supportPhone, setSupportPhone] = useState('');

  // Keep selectedIntent in sync if initialIntent changes
  useEffect(() => {
    if (initialIntent) {
      setSelectedIntent(initialIntent);
    }
  }, [initialIntent]);

  // Prevent background scroll and support ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build the pre-formatted WhatsApp template based on selected intent
  const getWhatsAppMessage = () => {
    if (selectedIntent === 'HIRE') {
      return (
`👋 Hello MetroMitra Team,

I want to *book a service / hire a worker*:
🛠️ Service Needed: ${hireService}
📍 Location / Area: ${hireLocation.trim() || 'My Location'}
📅 Timing: ${hireTiming}

Please connect me with available verified experts and share the rate estimate!`
      );
    }

    if (selectedIntent === 'JOIN') {
      return (
`👋 Hello MetroMitra Team,

I want to *join as a worker / earn daily*:
👤 My Name: ${workerName.trim() || '[My Name]'}
🛠️ My Skill / Trade: ${workerTrade}
📍 My City / Area: ${workerCity.trim() || '[My City]'}

Please guide me on how to register and start getting daily jobs!`
      );
    }

    if (selectedIntent === 'BULK') {
      return (
`👋 Hello MetroMitra Team,

I have a *bulk / commercial workforce requirement*:
👥 Workers Needed: ${bulkCount} (${bulkType})
📍 Work Site Location: ${bulkLocation.trim() || '[Site Location]'}

Please connect with me for contractor rates and immediate workforce availability!`
      );
    }

    // SUPPORT
    return (
`👋 Hello MetroMitra Team,

I need *support / have an inquiry*:
📋 Topic: ${supportTopic}
📱 Contact Mobile: ${supportPhone.trim() || '[My Mobile Number]'}

Kindly assist me. Thank you!`
    );
  };

  const handleOpenWhatsApp = () => {
    const text = getWhatsAppMessage();
    const url = `https://wa.me/919331488999?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  const currentIntentConfig = INTENTS.find(i => i.id === selectedIntent) || INTENTS[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-intent-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
              MetroMitra Official WhatsApp
            </span>
          </div>

          <h2 id="whatsapp-intent-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            How can we help you today?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1">
            Choose what you need so our team responds immediately with the right details.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Step 1: Select Intent */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
              1. Select your requirement:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTENTS.map((intent) => {
                const Icon = intent.icon;
                const isSelected = selectedIntent === intent.id;
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0 pr-5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {intent.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {intent.subtitle}
                      </p>
                    </div>

                    {/* Radio Indicator */}
                    <div className="absolute top-3.5 right-3.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Smart Quick Customizer for Selected Intent */}
          <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              2. Quick Details (Optional):
            </label>

            {/* Customizer for HIRE */}
            {selectedIntent === 'HIRE' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Choose Service:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentIntentConfig.options.map((svc) => (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => setHireService(svc)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                          hireService === svc
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Your City / Area:</label>
                    <input
                      type="text"
                      placeholder="e.g. Barrackpore, Kolkata"
                      value={hireLocation}
                      onChange={(e) => setHireLocation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Timing:</label>
                    <select
                      value={hireTiming}
                      onChange={(e) => setHireTiming(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Today (Urgent)">Today (Urgent)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Weekend">This Weekend</option>
                      <option value="Flexible / Exploring">Flexible / Exploring</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Customizer for JOIN */}
            {selectedIntent === 'JOIN' && (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1.5">Select Your Skill / Trade:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentIntentConfig.options.map((trade) => (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => setWorkerTrade(trade)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                          workerTrade === trade
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {trade}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Your City / Area:</label>
                    <input
                      type="text"
                      placeholder="e.g. Kolkata"
                      value={workerCity}
                      onChange={(e) => setWorkerCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Customizer for BULK */}
            {selectedIntent === 'BULK' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Worker Type:</label>
                    <select
                      value={bulkType}
                      onChange={(e) => setBulkType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {currentIntentConfig.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1">Workers Count:</label>
                    <select
                      value={bulkCount}
                      onChange={(e) => setBulkCount(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="2 - 5 Workers">2 - 5 Workers</option>
                      <option value="5 - 10 Workers">5 - 10 Workers</option>
                      <option value="10 - 25 Workers">10 - 25 Workers</option>
                      <option value="25+ Workers (Enterprise)">25+ Workers (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Work Site / City:</label>
                  <input
                    type="text"
                    placeholder="e.g. Dankuni Industrial Area / Rajarhat Site"
                    value={bulkLocation}
                    onChange={(e) => setBulkLocation(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Customizer for SUPPORT */}
            {selectedIntent === 'SUPPORT' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Inquiry Topic:</label>
                  <select
                    value={supportTopic}
                    onChange={(e) => setSupportTopic(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {currentIntentConfig.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Registered Phone / Booking ID:</label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or MM-12345"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Realistic WhatsApp Chat Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live WhatsApp Message Preview:
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Pre-formatted template</span>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#EFEAE2] border border-slate-200/80 shadow-inner">
              <div className="bg-[#E7FFDB] text-slate-900 text-xs sm:text-[13px] font-sans leading-relaxed p-3 sm:p-3.5 rounded-2xl rounded-tr-xs shadow-xs border border-emerald-200/60 whitespace-pre-line">
                {getWhatsAppMessage()}
                <div className="flex justify-end items-center gap-1 text-[10px] text-slate-500 mt-2">
                  <span>Just now</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>Open WhatsApp Chat</span>
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 text-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official Number: +91 9331488999 · Typical reply in &lt; 5 mins</span>
          </div>
        </div>

      </div>
    </div>
  );
}
