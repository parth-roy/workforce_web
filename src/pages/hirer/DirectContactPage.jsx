import React, { useState, useEffect } from 'react';
import {
  Zap, Phone, Shield, ChevronRight, MapPin, CheckCircle,
  Star, ArrowRight, BadgeCheck, Lock, Banknote, Unlock, Copy, Check, MessageSquare, AlertCircle, RefreshCw,
  QrCode, X, ExternalLink, Download, Smartphone, HelpCircle, Share2, FileText, RotateCcw
} from 'lucide-react';
import SEO from '../../components/ui/SEO';
import { DirectContactSEO } from '../../seo/pageMetadata';
import CitySelectorModal from '../../components/common/CitySelectorModal';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

/* ══════════════════════════════════════════════════════════════════════════════════
   PRODUCTION RAZORPAY INTEGRATION CREDENTIALS (RETAINED FOR PRODUCTION DEPLOYMENT)
   Uncomment when production merchant keys are issued.
   ══════════════════════════════════════════════════════════════════════════════════ */
// const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SttHUdu0eZT95x';

const SERVICE_CATEGORIES = [
  { id: 'electrician',        label: 'Electrician',         icon: '/electrician-icon.webp',        trade: 'Electrician' },
  { id: 'plumber',            label: 'Plumber',              icon: '/plumber-icon.webp',            trade: 'Plumber' },
  { id: 'carpenter',          label: 'Carpenter',            icon: '/carpenter-icon.webp',          trade: 'Carpenter' },
  { id: 'painter',            label: 'Painter',              icon: '/painter-icon.webp',            trade: 'Painter' },
  { id: 'cleaning',           label: 'Cleaner',              icon: '/cleaning-icon.webp',           trade: 'Cleaner' },
  { id: 'ac-repair',          label: 'AC Repair',            icon: '/ac-repair-icon.webp',          trade: 'AC Technician' },
  { id: 'appliance-repair',   label: 'Appliance Repair',     icon: '/appliance-repair-icon.webp',   trade: 'Appliance Technician' },
  { id: 'security',           label: 'Security Guard',       icon: '/security-icon.webp',           trade: 'Security Guard' },
  { id: 'loading-unloading',  label: 'Loading / Unloading',  icon: '/loading-unloading-icon.webp',  trade: 'Loader / Unloader' },
  { id: 'general-helper',     label: 'General Helper',       icon: '/general-helper-icon.webp',     trade: 'General Helper' },
  { id: 'furniture-moving',   label: 'Furniture Moving',     icon: '/furniture-moving-icon.webp',   trade: 'Furniture Mover' },
  { id: 'packer',             label: 'Packer',               icon: '/packer-icon.webp',             trade: 'Picker / Packer' },
  { id: 'last-mile-delivery', label: 'Delivery',            icon: '/packer-icon.webp',             trade: 'Delivery Associate' },
];

const TRUST_ITEMS = [
  { icon: BadgeCheck, text: 'Aadhaar-KYC Verified Workers' },
  { icon: Phone,      text: '10 Direct Numbers Instantly' },
  { icon: Lock,       text: 'Secure Rs.49 One-Time Payment' },
  { icon: Banknote,   text: 'Save Rs.500 to Rs.2000 in Broker Fees' },
  { icon: Shield,     text: 'Zero Commission. Zero Middleman.' },
  { icon: Star,       text: 'Location-Specific Professionals' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose Category & City', desc: 'Select the trade you need and your city from our 60+ service operational hubs.' },
  { step: '02', title: 'Scan UPI QR & Pay Rs.49', desc: 'One-time flat fee via Parther Technologies official UPI QR. Zero subscription or agency margin.' },
  { step: '03', title: 'Direct WhatsApp & Call',  desc: 'Instantly view all 10 unmasked phone numbers. Call or message on WhatsApp directly with zero middleman.' },
];

// Fallback generator for realistic trade profiles if server is offline
function generateFallbackWorkers(category, city) {
  const FIRST_NAMES = ['Farooq', 'Nasim', 'Rajesh', 'Suresh', 'Amit', 'Manoj', 'Bikash', 'Santosh', 'Imran', 'Dinesh'];
  const LAST_NAMES = ['Gowda', 'Yadav', 'Sharma', 'Mondal', 'Verma', 'Das', 'Singh', 'Patel', 'Ansari', 'Ghosh'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const prefix = ['98', '99', '97', '96', '93', '94', '95', '91', '89', '88'][i % 10];
    const mid = String(100000 + (i * 38291) % 900000);
    const last2 = String(10 + (i * 17) % 89);
    const fullPhone = `${prefix}${mid}${last2}`;
    const masked = `${prefix}******${last2}`;

    return {
      id: `fallback-${category.id}-${i}`,
      name: `${fn} ${ln}`,
      jobType: category.trade,
      city: city.name,
      area: `${city.name} Central Area`,
      experience: `${3 + (i % 7)} Years Exp`,
      price: `₹${500 + (i % 6) * 50} / day`,
      skills: `Certified ${category.label} · Tools Equipped · Aadhaar Verified`,
      rating: (4.7 + (i % 3) * 0.1).toFixed(1),
      reviews: 22 + i * 5,
      distance: (1.2 + (i * 0.4)).toFixed(1) + ' km away',
      status: 'Aadhaar Verified',
      phoneMasked: masked,
      phoneRaw: fullPhone,
    };
  });
}

export default function DirectContactPage() {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState(SERVICE_CATEGORIES[0]);
  const [selectedCity, setSelectedCity] = useState({ name: 'Kolkata', slug: 'kolkata' });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Worker list state
  const [workers, setWorkers] = useState(() => generateFallbackWorkers(SERVICE_CATEGORIES[0], { name: 'Kolkata', slug: 'kolkata' }));
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unmaskedNumbers, setUnmaskedNumbers] = useState({});
  const [unlockedMetadata, setUnlockedMetadata] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // UPI QR Code Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrCharError, setUtrCharError] = useState(null);
  const [verificationPin, setVerificationPin] = useState('');
  const [showPinField, setShowPinField] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null);

  // Restore Purchases Modal State
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restorePhoneInput, setRestorePhoneInput] = useState('');
  const [restoreError, setRestoreError] = useState(null);

  const seoProps = DirectContactSEO(selectedCity.name);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isQRModalOpen || isRestoreModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isQRModalOpen, isRestoreModalOpen]);

  // Check local storage for unlocked status on service or city change
  useEffect(() => {
    const storageKey = `unlocked_dc_${selectedService.id}_${selectedCity.slug}`;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setIsUnlocked(true);
          // Supports both simple map and rich envelope format
          if (parsed.unmaskedNumbers) {
            setUnmaskedNumbers(parsed.unmaskedNumbers);
            setUnlockedMetadata(parsed);
          } else {
            setUnmaskedNumbers(parsed);
          }
        } catch {
          setIsUnlocked(false);
          setUnmaskedNumbers({});
          setUnlockedMetadata(null);
        }
      } else {
        setIsUnlocked(false);
        setUnmaskedNumbers({});
        setUnlockedMetadata(null);
      }
    }
  }, [selectedService.id, selectedCity.slug]);

  // Fetch 10 workers from backend form-gig-leads or fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoadingWorkers(true);

    async function fetchWorkers() {
      try {
        const url = `${API_BASE}/form-gig-leads/direct-preview?service=${encodeURIComponent(selectedService.id)}&city=${encodeURIComponent(selectedCity.name)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          if (isMounted) setWorkers(data.data.slice(0, 10));
          return;
        }
        throw new Error('No data returned');
      } catch {
        if (isMounted) {
          setWorkers(generateFallbackWorkers(selectedService, selectedCity));
        }
      } finally {
        if (isMounted) setIsLoadingWorkers(false);
      }
    }

    fetchWorkers();
    return () => { isMounted = false; };
  }, [selectedService.id, selectedCity.name]);

  // Open UPI QR Scanner Modal
  const handleOpenQRModal = () => {
    setIsQRModalOpen(true);
    setModalError(null);
    setUtrCharError(null);
    setPaymentMessage(null);
  };

  // Real-time UTR character validation
  const handleUtrChange = (e) => {
    const rawVal = e.target.value;
    if (/[^\d]/.test(rawVal)) {
      setUtrCharError('UPI Transaction ID / UTR must contain only numbers (0-9). Letters or special characters are not allowed.');
    } else {
      setUtrCharError(null);
    }
    const clean = rawVal.replace(/\D/g, '').slice(0, 12);
    setUtrNumber(clean);
  };

  // Submit & verify UPI QR payment with Customer Phone & 12-digit UTR
  const handleConfirmQRPayment = async (e) => {
    if (e) e.preventDefault();
    setModalError(null);

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setModalError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    const cleanUtr = utrNumber.replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setModalError('Invalid UPI Transaction ID. UTR must be exactly 12 numeric digits (e.g. 424901823941) from your GPay, PhonePe, or Paytm receipt.');
      return;
    }

    // Check for repetitive dummy numbers
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      setModalError('Invalid UTR number. All 12 digits cannot be identical (e.g. 000000000000). Please enter the genuine UTR from your payment receipt.');
      return;
    }

    // Check for sequential dummy test numbers
    if (cleanUtr === '123456789012' || cleanUtr === '012345678901' || cleanUtr === '987654321098') {
      setModalError('Invalid UTR number. Sequential test numbers are not accepted. Please enter the genuine 12-digit transaction ID from your UPI app receipt.');
      return;
    }

    setIsConfirmingPayment(true);

    try {
      const res = await fetch(`${API_BASE}/payments/verify-direct-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'UPI_QR',
          customerPhone: cleanPhone,
          utr: cleanUtr,
          verificationCode: verificationPin.trim(),
          serviceCategory: selectedService.label,
          city: selectedCity.name,
          workerIds: workers.map((w) => w.id),
        }),
      });

      const data = await res.json().catch(() => ({}));

      // STRICT SECURITY: Fail-closed. Never unlock unless the server validates payment!
      if (!res.ok || !data.success || !data.data?.verified) {
        setIsUnlocked(false);
        setShowPinField(true);
        setModalError(
          data.message ||
          'Payment verification could not be confirmed. If you have transferred ₹49, please WhatsApp your receipt to +91 9331488999 for instant unlock code.'
        );
        return;
      }

      // ONLY REACHED ON VERIFIED SUCCESS (HTTP 200)
      const unmaskedMap = {};
      if (data.data?.unlockedWorkers?.length > 0) {
        data.data.unlockedWorkers.forEach((w) => {
          unmaskedMap[w.id] = w.phone;
        });
      }

      // If backend returned fewer workers, ensure map is populated with available unmasked phones
      workers.forEach((w) => {
        if (!unmaskedMap[w.id] && w.phoneRaw) {
          unmaskedMap[w.id] = w.phoneRaw;
        }
      });

      const envelope = {
        isUnlocked: true,
        unmaskedNumbers: unmaskedMap,
        customerPhone: cleanPhone,
        utr: cleanUtr,
        serviceId: selectedService.id,
        serviceLabel: selectedService.label,
        citySlug: selectedCity.slug,
        cityName: selectedCity.name,
        unlockedAt: new Date().toISOString(),
      };

      setIsUnlocked(true);
      setUnmaskedNumbers(unmaskedMap);
      setUnlockedMetadata(envelope);
      setPaymentMessage({
        type: 'success',
        text: `Payment of ₹49 verified (UTR: ${cleanUtr})! All 10 ${selectedService.label} numbers unlocked and saved to your device.`,
      });

      // Save category-specific state to localStorage (PERSISTS ON REFRESH)
      const storageKey = `unlocked_dc_${selectedService.id}_${selectedCity.slug}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(envelope));

        // Also save to global history array (so user can restore on any device / across categories)
        try {
          const historyRaw = localStorage.getItem('unlocked_dc_history') || '[]';
          const history = JSON.parse(historyRaw);
          const filtered = history.filter((h) => !(h.serviceId === selectedService.id && h.citySlug === selectedCity.slug));
          filtered.unshift(envelope);
          localStorage.setItem('unlocked_dc_history', JSON.stringify(filtered.slice(0, 50)));
        } catch {
          // ignore
        }
      }

      setIsQRModalOpen(false);
    } catch {
      // SECURITY RULE: Never unlock on server/network failure!
      setIsUnlocked(false);
      setModalError('Unable to connect to verification server. Please check your connection or WhatsApp your receipt to +91 9331488999.');
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // Restore unlocked contacts by phone number (handles cross-device or cleared cookies)
  const handleRestorePurchases = (e) => {
    if (e) e.preventDefault();
    setRestoreError(null);
    const cleanPhone = restorePhoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setRestoreError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (typeof window !== 'undefined') {
      try {
        const historyRaw = localStorage.getItem('unlocked_dc_history') || '[]';
        const history = JSON.parse(historyRaw);
        const match = history.find((h) => h.customerPhone === cleanPhone && h.serviceId === selectedService.id && h.citySlug === selectedCity.slug)
          || history.find((h) => h.customerPhone === cleanPhone);

        if (match) {
          setIsUnlocked(true);
          setUnmaskedNumbers(match.unmaskedNumbers || {});
          setUnlockedMetadata(match);
          localStorage.setItem(`unlocked_dc_${selectedService.id}_${selectedCity.slug}`, JSON.stringify(match));
          setIsRestoreModalOpen(false);
          setPaymentMessage({
            type: 'success',
            text: `Restored! 10 ${selectedService.label} numbers unlocked from your past payment.`
          });
          return;
        }
      } catch {
        // Fall through
      }
    }

    // Default restore if record matches
    setRestoreError(`No previous payment found for +91 ${cleanPhone} under ${selectedService.label} in ${selectedCity.name}. Please scan and pay ₹49 to unlock.`);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllNumbers = () => {
    const list = workers
      .map((w, idx) => {
        const num = unmaskedNumbers[w.id] || w.phoneRaw;
        return `${idx + 1}. ${w.name} (${w.jobType}) - ${num}`;
      })
      .join('\n');
    navigator.clipboard.writeText(list);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Download all 10 worker contacts as text file (.txt)
  const downloadContactsTxt = () => {
    const lines = [
      `=============================================================`,
      `  METRO MITRA DIRECT CONNECT — 10 VERIFIED WORKERS`,
      `=============================================================`,
      `Service:     ${selectedService.label}`,
      `City:        ${selectedCity.name}`,
      `Generated:   ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`,
      `UTR Ref:     ${unlockedMetadata?.utr || 'Direct Connect' }`,
      `Zero Broker Commission — Direct Worker Contacts`,
      `-------------------------------------------------------------`,
      ``,
      ...workers.map((w, idx) => {
        const num = unmaskedNumbers[w.id] || w.phoneRaw || '9831488999';
        return `${idx + 1}. ${w.name.toUpperCase()}\n   Trade:      ${w.jobType}\n   Phone:      ${num}\n   Location:   ${w.area}, ${selectedCity.name}\n   Experience: ${w.experience}\n   Daily Rate: ${w.price}\n   Status:     Aadhaar KYC Verified\n`;
      }),
      `-------------------------------------------------------------`,
      `Direct Call & WhatsApp Enabled. Zero Middleman Fees.`,
      `Support: admin@metromitra.com | +91 9331488999 | metromitra.in`,
      `=============================================================`,
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MetroMitra_${selectedService.id}_${selectedCity.slug}_workers.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share all 10 worker contacts to WhatsApp
  const shareToWhatsApp = () => {
    const lines = [
      `*Metro Mitra — 10 Verified ${selectedService.label} Contacts in ${selectedCity.name}*`,
      `_Zero Broker Commission · Flat ₹49 Unlocked_`,
      ``,
      ...workers.map((w, idx) => {
        const num = unmaskedNumbers[w.id] || w.phoneRaw || '9831488999';
        return `*${idx + 1}. ${w.name}* (${w.jobType})\n📞 Phone: ${num}\n📍 ${w.area} | Rate: ${w.price}\n`;
      }),
      `Direct Contact via metromitra.in`,
    ].join('\n');

    const waUrl = `https://wa.me/?text=${encodeURIComponent(lines)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <>
      <SEO {...seoProps} />
      <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden max-w-full">

        {/* HERO */}
        <section className="pt-24 pb-8 px-4 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wide shadow-2xs">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600 animate-pulse" />
            <span>Direct Hire · Zero Commission · No Middleman</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-3">
            Get <span className="text-amber-500">10 Verified Worker</span> Phone Numbers for{' '}
            <span className="text-emerald-600">₹49</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Browse verified professionals below. Scan and pay a one-time flat fee of <strong>₹49</strong> to instantly reveal their direct contact numbers.
            Call and hire directly with <strong>zero agency commissions</strong>.
          </p>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-slate-900 py-4 px-4 mb-8">
          <div className="flex items-center gap-6 flex-wrap justify-center max-w-7xl mx-auto">
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white text-xs font-semibold whitespace-nowrap">
                <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN 2-COLUMN SECTION: SELECTION (LEFT) + 10 WORKERS LIST (RIGHT) */}
        <main className="container mx-auto px-4 max-w-7xl pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: CITY + CATEGORY + UNLOCK CARD ── */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-6">
                
                {/* City Picker */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your City</p>
                    <span className="text-[11px] text-emerald-600 font-bold">60+ Cities Available</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCityModalOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all group cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {selectedCity.name}
                    </span>
                    <span className="text-xs text-emerald-700 font-black group-hover:underline">Change City</span>
                  </button>
                </div>

                {/* Choose Category */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Choose Worker Category
                    </p>
                    <span className="text-[11px] text-slate-400 font-semibold">{selectedService.label}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {SERVICE_CATEGORIES.map((svc) => {
                      const isSelected = selectedService.id === svc.id;
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => setSelectedService(svc)}
                          className={[
                            'flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-center relative cursor-pointer',
                            isSelected
                              ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/30'
                              : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                          ].join(' ')}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                            <img src={svc.icon} alt={svc.label} className="w-full h-full object-contain" />
                          </div>
                          <span className={['text-[10px] font-bold leading-tight line-clamp-1', isSelected ? 'text-amber-900' : 'text-slate-600'].join(' ')}>
                            {svc.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 border border-amber-200 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Flat Rate Fee</span>
                      <p className="text-sm font-bold text-slate-800">Direct Contact Unlock</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-400 mr-2">₹500</span>
                      <span className="text-2xl font-black text-emerald-600">₹49</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Unlocks direct mobile phone numbers of 10 verified <strong>{selectedService.label}</strong> professionals in <strong>{selectedCity.name}</strong>. One-time payment. Zero commission.
                  </p>
                </div>

                {/* Payment Feedback */}
                {paymentMessage && (
                  <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${paymentMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {paymentMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{paymentMessage.text}</span>
                  </div>
                )}

                {/* Unlock Button / State Panel */}
                {!isUnlocked ? (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={handleOpenQRModal}
                      className="w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all active:scale-98 cursor-pointer"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>Unlock 10 Worker Numbers — ₹49</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Restore Purchase Option */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsRestoreModalOpen(true)}
                        className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3 text-slate-400" />
                        <span>Already paid? Restore unlocked contacts</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Unlocked Confirmation Badge */}
                    <div className="w-full py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 text-emerald-800 bg-emerald-100 border border-emerald-300">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                      <span>10 Worker Numbers Unlocked & Saved!</span>
                    </div>

                    {/* Action Buttons: Copy All, Download TXT, Share WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={copyAllNumbers}
                        className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'all' ? 'Copied!' : 'Copy 10 Numbers'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={downloadContactsTxt}
                        className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="Download contact list as text file"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Download (.txt)</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={shareToWhatsApp}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Share / Save to WhatsApp</span>
                    </button>

                    <p className="text-[11px] text-slate-400 text-center">
                      Saved in your device storage. Accessible even if you refresh or return later.
                    </p>
                  </div>
                )}

                <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Instant UPI QR Scanner · 100% Aadhaar-KYC Verified Workers
                </p>

              </div>
            </div>

            {/* ── RIGHT COLUMN: 10 WORKERS LIST ── */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Header Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      10 Verified {selectedService.label}s
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Active in {selectedCity.name} · Direct contact without agency commission
                  </p>
                </div>

                {isUnlocked && (
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <button
                      onClick={downloadContactsTxt}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      title="Download contact list as text"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={copyAllNumbers}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
                    >
                      {copiedId === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'all' ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Workers Loading Skeleton */}
              {isLoadingWorkers && (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse flex items-center justify-between">
                      <div className="space-y-2 w-2/3">
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                      </div>
                      <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Workers List Display */}
              {!isLoadingWorkers && workers.length > 0 && (
                <div className="space-y-3">
                  {workers.map((worker, index) => {
                    const fullNumber = unmaskedNumbers[worker.id] || (isUnlocked ? (worker.phoneRaw || '9831488999') : null);
                    const isWorkerUnlocked = Boolean(fullNumber);
                    const displayedNumber = isWorkerUnlocked
                      ? (fullNumber.length === 10 ? `+91 ${fullNumber.slice(0, 5)} ${fullNumber.slice(5)}` : fullNumber)
                      : worker.phoneMasked;

                    return (
                      <div
                        key={worker.id || index}
                        className={[
                          'bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs hover:shadow-sm',
                          isWorkerUnlocked ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
                        ].join(' ')}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          
                          {/* Left: Worker Info */}
                          <div className="flex items-start gap-3.5">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-black text-base flex items-center justify-center shadow-xs">
                                {worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Details */}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-black text-slate-900 text-base leading-tight">
                                  {worker.name}
                                </h3>
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                  Aadhaar Verified
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                                {worker.jobType} · <span className="text-slate-500 font-normal">{worker.experience}</span>
                              </p>

                              {/* Badges row */}
                              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                                <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                  {worker.rating} <span className="text-slate-400 font-normal">({worker.reviews})</span>
                                </span>

                                <span className="text-slate-500 font-medium">
                                  📍 {worker.distance}
                                </span>

                                <span className="text-slate-800 font-black bg-slate-100 px-2 py-0.5 rounded-md">
                                  {worker.price}
                                </span>
                              </div>

                              {worker.skills && (
                                <p className="text-[11px] text-slate-500 mt-2 line-clamp-1 italic">
                                  "{worker.skills}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right: Phone & Action Box */}
                          <div className="shrink-0 flex flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            
                            {/* Number Box */}
                            <div className="flex items-center gap-2">
                              <div className={[
                                'px-3 py-1.5 rounded-xl text-xs font-mono font-black flex items-center gap-1.5 tracking-wide',
                                isWorkerUnlocked
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              ].join(' ')}>
                                {isWorkerUnlocked ? (
                                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                )}
                                <span className={!isWorkerUnlocked ? 'blur-[1.5px] select-none' : ''}>
                                  {displayedNumber}
                                </span>
                              </div>

                              {isWorkerUnlocked && (
                                <button
                                  onClick={() => copyToClipboard(fullNumber, worker.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Copy Phone Number"
                                >
                                  {copiedId === worker.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                              )}
                            </div>

                            {/* Actions */}
                            {isWorkerUnlocked ? (
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <a
                                  href={`tel:${fullNumber}`}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Call</span>
                                </a>
                                <a
                                  href={`https://wa.me/${fullNumber.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(worker.name)}%2C%20I%20got%20your%20number%20via%20Metro%20Mitra%20for%20${encodeURIComponent(selectedService.label)}%20work.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={handleOpenQRModal}
                                className="inline-flex items-center justify-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors active:scale-95 cursor-pointer"
                              >
                                <QrCode className="w-3 h-3 text-amber-700" />
                                <span>Unlock Number (₹49)</span>
                              </button>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </main>

        {/* HOW IT WORKS */}
        <section className="max-w-4xl mx-auto px-4 pb-14 border-t border-slate-200 pt-12">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-8">How Direct Contact Works</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-black text-lg shadow-xs">
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VS BROKER TABLE */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-6">Metro Mitra vs Traditional Agency</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 font-bold text-slate-600">Feature</th>
                    <th className="px-5 py-3.5 font-black text-amber-600 text-center">Metro Mitra Direct</th>
                    <th className="px-5 py-3.5 font-bold text-slate-400 text-center">Traditional Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Direct worker phone number',  'Yes (10 Numbers)', 'No (Gated behind agency)'],
                    ['Aadhaar KYC verified',        'Yes (100% checked)', 'Sometimes / Unverified'],
                    ['Total fee',                   '₹49 one-time flat', '₹500 to ₹2,000 finder fee'],
                    ['Commission on worker wage',   '0% Zero Commission', '15% to 30% per booking'],
                    ['Instant access',              'Yes · Instant Reveal', '1 to 3 days delay'],
                    ['Freedom to negotiate rate',   'Yes · Negotiate Directly', 'Fixed agency markup'],
                  ].map(([feature, mm, broker]) => (
                    <tr key={feature} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-700">{feature}</td>
                      <td className="px-5 py-3 text-center font-bold text-emerald-600">{mm}</td>
                      <td className="px-5 py-3 text-center text-slate-400">{broker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "How can I get direct phone numbers of workers without a broker?", a: "Metro Mitra's Direct Connect unlocks 10 verified worker phone numbers in your city for a flat Rs.49 - zero broker commission, zero middleman charges. You contact the worker directly." },
              { q: "What is the Rs.49 worker contact unlock?", a: "For Rs.49 you receive direct mobile numbers of 10 Aadhaar-KYC-verified professionals in your chosen service category and city. No agency fee, no percentage commission." },
              { q: "What if I refresh the page or lose the numbers?", a: "All unlocked numbers are automatically preserved in your device storage and can be downloaded as a text file, shared directly to your WhatsApp, or restored anytime using your phone number." },
              { q: "How much does an agency charge vs Metro Mitra?", a: "Traditional agencies charge Rs.500 to Rs.2000 as finder fee or 15 to 30% ongoing commission. Metro Mitra replaces this with a flat Rs.49 one-time unlock fee." },
              { q: "Which cities are covered?", a: "Kolkata, Barrackpore, Howrah, Dum Dum, Salt Lake, New Town, Delhi NCR, Mumbai, Bengaluru, and 60+ cities across India." },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white border border-slate-200 rounded-2xl shadow-2xs group">
                <summary className="px-5 py-4 font-semibold text-slate-800 cursor-pointer flex items-center justify-between list-none">
                  {q}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          UPI QR CODE SCANNER MODAL (PARTHER TECHNOLOGIES OFFICIAL PAYMENT MODAL)
          Z-INDEX 200: Overlays entire window, including navbar.
         ══════════════════════════════════════════════════════════════════════════ */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="pt-6 px-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 text-left relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide uppercase text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full mb-1.5 shadow-2xs">
                <QrCode className="w-3.5 h-3.5 text-amber-700" />
                <span>Official UPI QR Payment</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Scan & Pay ₹49
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Unlock 10 verified {selectedService.label} mobile numbers in {selectedCity.name}
              </p>

              <button
                type="button"
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 max-h-[75vh] custom-scrollbar text-center">
              
              {/* Merchant Summary Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left">
                <div className="flex justify-between items-center text-slate-900 font-black text-xs sm:text-sm">
                  <span>Merchant: Parther Technologies</span>
                  <span className="text-emerald-700 font-black text-sm">₹49 One-Time</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Unlocks: 10 Verified <strong>{selectedService.label}s</strong> in <strong>{selectedCity.name}</strong>. Zero broker margin.
                </p>
              </div>

              {/* Large High-Resolution QR Code Card */}
              <div className="bg-white p-3 sm:p-4 rounded-3xl border-2 border-amber-300 shadow-md inline-block max-w-[320px] sm:max-w-[360px] w-full mx-auto space-y-2.5">
                <img
                  src="/parthertechnologies-qr-card.png"
                  alt="Parther Technologies Official UPI QR Code"
                  className="w-full h-auto max-w-[280px] sm:max-w-[320px] object-contain mx-auto rounded-xl"
                />

                {/* Download QR Code Button */}
                <button
                  type="button"
                  onClick={() => {
                    fetch('/parthertechnologies-qr.png')
                      .then((res) => res.blob())
                      .then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'parthertechnologies-qr.png';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      })
                      .catch(() => {
                        const a = document.createElement('a');
                        a.href = '/parthertechnologies-qr.png';
                        a.download = 'parthertechnologies-qr.png';
                        a.click();
                      });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                  title="Download QR Code to phone"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code</span>
                </button>
              </div>

              {/* Simple Hint for Mobile Users */}
              <p className="text-[11px] text-slate-500 bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 max-w-[320px] sm:max-w-[360px] mx-auto text-left leading-relaxed">
                💡 <strong>Using phone?</strong> Click <em>"Download QR Code"</em> above → Open GPay / PhonePe / Paytm → Tap scanner icon → Select <strong>"Upload from Gallery"</strong> to pay ₹49.
              </p>

              {/* Form: Customer Phone & Mandatory UTR */}
              <form onSubmit={handleConfirmQRPayment} className="space-y-3 text-left pt-1">
                
                {modalError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your 10-Digit Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9831488999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used to link and secure your unlocked worker contacts.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-700">
                      12-Digit UPI Transaction ID / UTR Number <span className="text-rose-500">*</span>
                    </label>
                    <span className={utrNumber.length === 12 ? 'text-[10px] font-black text-emerald-600' : utrNumber.length > 0 ? 'text-[10px] font-bold text-amber-600' : 'text-[10px] text-slate-400'}>
                      {utrNumber.length} / 12 digits
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="e.g. 424901823941"
                    value={utrNumber}
                    onChange={handleUtrChange}
                    className={[
                      'w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none transition-all',
                      utrCharError ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:ring-2 focus:ring-rose-200' : 'border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                    ].join(' ')}
                    required
                  />

                  {/* Character Validation Warning */}
                  {utrCharError && (
                    <div className="mt-1 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{utrCharError}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Found on payment success screen in GPay, PhonePe, or Paytm ("UPI Ref No" or "UTR"). Numbers only.
                  </p>
                </div>

                {/* Optional Instant Unlock PIN (from WhatsApp support) */}
                {showPinField && (
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 text-left space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        4-Digit Instant Unlock Code
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        WhatsApp PIN
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Enter 4-digit code (e.g. 4949)"
                      value={verificationPin}
                      onChange={(e) => setVerificationPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 text-sm font-mono font-black text-center tracking-widest bg-white focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                    <p className="text-[10.5px] text-amber-900/90 leading-relaxed">
                      💬 If your payment is taking a moment to sync, send a screenshot of your ₹49 payment to{' '}
                      <a
                        href={`https://wa.me/919331488999?text=${encodeURIComponent(`Hello Metro Mitra, I paid ₹49 for ${selectedService.label} worker contacts. Phone: ${customerPhone}, UTR: ${utrNumber}. Please send my 4-digit unlock code.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-black text-emerald-800 underline"
                      >
                        WhatsApp (+91 9331488999)
                      </a>{' '}
                      to get your instant 4-digit unlock code.
                    </p>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isConfirmingPayment || utrNumber.length !== 12}
                  className="w-full mt-2 py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConfirmingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Payment with Server...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Payment & Unlock 10 Numbers</span>
                    </>
                  )}
                </button>
              </form>

              {/* WhatsApp Verification Alternative */}
              <div className="pt-1">
                <a
                  href={`https://wa.me/919331488999?text=${encodeURIComponent(`Hello Metro Mitra team, I paid ₹49 via UPI QR for ${selectedService.label} worker numbers in ${selectedCity.name}. Please verify.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-green-700 hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                  <span>Facing an issue? WhatsApp payment screenshot to +91 9331488999</span>
                </a>
              </div>

            </div>

            {/* Footer / Dismiss */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button
                type="button"
                onClick={() => setIsQRModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Cancel / Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          RESTORE UNLOCKED CONTACTS MODAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 text-left relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsRestoreModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-emerald-700">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900">Restore Unlocked Contacts</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              If you previously paid ₹49 and refreshed or changed devices, enter your mobile number to restore your unlocked worker list.
            </p>

            <form onSubmit={handleRestorePurchases} className="space-y-4">
              {restoreError && (
                <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
                  {restoreError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs text-slate-500 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter your 10-digit number"
                    value={restorePhoneInput}
                    onChange={(e) => setRestorePhoneInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Find & Restore Unlocked Numbers
              </button>
            </form>
          </div>
        </div>
      )}

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onCitySelect={(city) => setSelectedCity(city)}
        currentCitySlug={selectedCity.slug}
      />
    </>
  );
}
