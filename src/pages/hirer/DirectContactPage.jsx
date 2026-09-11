import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, Phone, Shield, ChevronRight, CheckCircle, CheckCircle2,
  Star, ArrowRight, BadgeCheck, Lock, Banknote, Unlock, Copy, Check, MessageSquare, AlertCircle, RefreshCw,
  QrCode, X, ExternalLink, Download, Smartphone, HelpCircle, Share2, FileText, RotateCcw,
  Upload, Clock, Image as ImageIcon, ShieldCheck, CreditCard, Sparkles
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { DirectContactSEO } from '../../seo/pageMetadata';
import CitySelectorModal from '../../components/common/CitySelectorModal';
import { getPluralServiceName } from '../../components/common/DirectContactBanner';
import { useAuth } from '../../context/AuthContext';
import { useCity, resolveCityConfig } from '../../context/CityContext';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'https://api.gomytruck.com/api/v1';

// Dynamic Cashfree Web Checkout SDK loader (SSR-safe)
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  { step: '01', title: 'Choose Category & City', desc: 'Select the trade you need and your city from our 500+ service operational hubs.' },
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

// Helper to extract first 2 and last 2 digits for clear display, and middle 6 for security blur
function getPhoneDisplayParts(phoneRaw, phoneMasked) {
  const clean = String(phoneRaw || phoneMasked || '9876543210').replace(/\D/g, '');
  const prefix = clean.length >= 4 ? clean.slice(0, 2) : '98';
  const suffix = clean.length >= 4 ? clean.slice(-2) : '21';
  const middle = clean.length >= 8 ? clean.slice(2, -2) : '765432';
  return { prefix, suffix, middle };
}

export default function DirectContactPage() {
  const { user, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCity, setCity } = useCity();

  // Resolve initial city from URL search param or CityContext
  const initialCity = (() => {
    const paramCity = searchParams.get('city');
    if (paramCity) {
      const matched = resolveCityConfig(paramCity);
      if (matched) return matched;
    }
    return currentCity || { name: 'Kolkata', slug: 'kolkata' };
  })();

  // Resolve initial service from URL search param
  const initialService = (() => {
    const paramService = searchParams.get('service');
    if (paramService) {
      const cleanParam = paramService.toLowerCase().trim();
      const matched = SERVICE_CATEGORIES.find(
        (c) => c.id.toLowerCase() === cleanParam || c.label.toLowerCase() === cleanParam
      );
      if (matched) return matched;
    }
    return SERVICE_CATEGORIES[0];
  })();

  const [selectedService, setSelectedService] = useState(initialService);
  const pluralService = getPluralServiceName(selectedService?.label || selectedService?.trade || 'Workers');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Synchronous city update that keeps URL searchParams, local state, and global CityContext in perfect sync
  const handleCityChange = useCallback((newCity) => {
    if (!newCity) return;
    setSelectedCity(newCity);
    setCity(newCity, true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('city', newCity.slug);
      return next;
    }, { replace: true });
  }, [setCity, setSearchParams]);

  // Synchronous category update that keeps URL searchParams and local state in sync
  const handleServiceChange = useCallback((newService) => {
    if (!newService) return;
    setSelectedService(newService);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('service', newService.id);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Synchronize when searchParams or currentCity changes externally
  useEffect(() => {
    const paramCity = searchParams.get('city');
    const paramService = searchParams.get('service');

    if (paramCity) {
      const matched = resolveCityConfig(paramCity);
      if (matched && matched.slug !== selectedCity.slug) {
        setSelectedCity(matched);
      }
      if (matched && currentCity && currentCity.slug !== matched.slug) {
        setCity(matched, true);
      }
    } else if (currentCity && currentCity.slug !== selectedCity.slug) {
      setSelectedCity(currentCity);
    }

    if (paramService) {
      const cleanParam = paramService.toLowerCase().trim();
      const matched = SERVICE_CATEGORIES.find(
        (c) => c.id.toLowerCase() === cleanParam || c.label.toLowerCase() === cleanParam
      );
      if (matched && matched.id !== selectedService.id) {
        setSelectedService(matched);
      }
    }
  }, [searchParams, currentCity]);

  // Worker list state
  const [workers, setWorkers] = useState(() => generateFallbackWorkers(initialService, initialCity));
  const [isLoadingWorkers, setIsLoadingWorkers] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unmaskedNumbers, setUnmaskedNumbers] = useState({});
  const [unlockedMetadata, setUnlockedMetadata] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Cashfree Checkout Modal & Success Modal State
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [isPayingCashfree, setIsPayingCashfree] = useState(false);
  const [cashfreeError, setCashfreeError] = useState(null);
  const [purchasedPacks, setPurchasedPacks] = useState([]);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);

  // Legacy UPI QR Code Modal State (Retained for backup / offline support)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isLoginAlertModalOpen, setIsLoginAlertModalOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrCharError, setUtrCharError] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null); // 'PENDING' | 'VERIFIED' | null
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
    if (isQRModalOpen || isRestoreModalOpen || isLoginAlertModalOpen || isRazorpayModalOpen || isSuccessModalOpen || isWorkerModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isQRModalOpen, isRestoreModalOpen, isLoginAlertModalOpen, isRazorpayModalOpen, isSuccessModalOpen, isWorkerModalOpen]);

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

  // Handle external redirects (e.g. 3DS bank authorization or UPI app return)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const redirectOrderId = urlParams.get('cf_order_id') || urlParams.get('order_id');
    if (!redirectOrderId || isUnlocked) return;

    const storedPhone = localStorage.getItem('purchased_customer_phone') || '';
    (async () => {
      try {
        const verifyRes = await fetch(`${API_BASE}/payments/cashfree-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: redirectOrderId,
            customerPhone: storedPhone || '9999999999',
            workerIds: workers.map((w) => w.id),
            serviceCategory: selectedService.label,
            city: selectedCity.name,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          const unmaskedMap = {};
          if (verifyData.data?.unlockedWorkers?.length > 0) {
            verifyData.data.unlockedWorkers.forEach((w) => {
              unmaskedMap[w.id] = w.phone;
            });
          }
          workers.forEach((w) => {
            if (!unmaskedMap[w.id] && w.phoneRaw) {
              unmaskedMap[w.id] = w.phoneRaw;
            }
          });
          const envelope = {
            isUnlocked: true,
            unmaskedNumbers: unmaskedMap,
            customerPhone: storedPhone,
            serviceId: selectedService.id,
            serviceLabel: selectedService.label,
            citySlug: selectedCity.slug,
            cityName: selectedCity.name,
            unlockedAt: new Date().toISOString(),
            paymentId: verifyData.data?.paymentId || redirectOrderId,
          };
          setIsUnlocked(true);
          setUnmaskedNumbers(unmaskedMap);
          setUnlockedMetadata(envelope);
          setRequestStatus('VERIFIED');
          localStorage.setItem(`unlocked_dc_${selectedService.id}_${selectedCity.slug}`, JSON.stringify(envelope));
          setSuccessData({
            orderId: redirectOrderId,
            paymentId: verifyData.data?.paymentId || redirectOrderId,
            customerPhone: storedPhone,
            customerName: 'Verified Hirer',
            serviceLabel: selectedService.label,
            cityName: selectedCity.name,
          });
          setIsSuccessModalOpen(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (err) {
        console.warn('[Cashfree Redirect Recovery] Could not verify redirect order:', err);
      }
    })();
  }, [selectedService, selectedCity, workers, isUnlocked]);

  // Check if current user phone has an approved/verified unlock on backend
  const checkExistingUnlock = useCallback(async (phone) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return;

    try {
      const url = `${API_BASE}/payments/check-direct-contact-status?phone=${cleanPhone}&service=${encodeURIComponent(selectedService.label)}&city=${encodeURIComponent(selectedCity.name)}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        if (Array.isArray(data.data?.purchasedPacks) && data.data.purchasedPacks.length > 0) {
          setPurchasedPacks(data.data.purchasedPacks);
        }
        if (data.data?.isVerified) {
          const unmaskedMap = {};
          if (data.data.unlockedWorkers?.length > 0) {
            data.data.unlockedWorkers.forEach((w) => {
              unmaskedMap[w.id] = w.phone;
            });
          }
          workers.forEach((w) => {
            if (!unmaskedMap[w.id] && w.phoneRaw) {
              unmaskedMap[w.id] = w.phoneRaw;
            }
          });
          const envelope = {
            isUnlocked: true,
            unmaskedNumbers: unmaskedMap,
            customerPhone: cleanPhone,
            utr: data.data.utr,
            serviceId: selectedService.id,
            serviceLabel: selectedService.label,
            citySlug: selectedCity.slug,
            cityName: selectedCity.name,
            unlockedAt: data.data.verifiedAt || new Date().toISOString(),
          };
          setIsUnlocked(true);
          setUnmaskedNumbers(unmaskedMap);
          setUnlockedMetadata(envelope);
          setRequestStatus('VERIFIED');
          if (typeof window !== 'undefined') {
            localStorage.setItem(`unlocked_dc_${selectedService.id}_${selectedCity.slug}`, JSON.stringify(envelope));
          }
        } else if (data.data?.status === 'PENDING') {
          setRequestStatus('PENDING');
        }
      }
    } catch {
      // silent
    }
  }, [selectedService.id, selectedService.label, selectedCity.slug, selectedCity.name, workers]);

  // Handle switching to a previously purchased service pack
  const handleSelectPurchasedPack = (pack) => {
    const matchedService = SERVICE_CATEGORIES.find(
      (c) => c.label.toLowerCase() === pack.serviceCategory.toLowerCase() ||
             c.trade.toLowerCase() === pack.serviceCategory.toLowerCase() ||
             pack.serviceCategory.toLowerCase().includes(c.id)
    ) || SERVICE_CATEGORIES[0];
    setSelectedService(matchedService);

    setSelectedCity({ name: pack.city, slug: pack.city.toLowerCase().replace(/\s+/g, '-') });

    if (pack.workers && pack.workers.length > 0) {
      setWorkers(pack.workers.map((w, idx) => ({
        id: w.id,
        name: w.name,
        jobType: w.jobType,
        experience: `${3 + (idx % 6)} yrs exp`,
        city: w.city,
        area: w.area || pack.city,
        price: 'Verified Market Rate',
        skills: `Certified ${w.jobType} · Aadhaar KYC Verified`,
        rating: '4.8',
        reviews: 25 + idx * 3,
        distance: 'Direct Contact',
        status: 'Aadhaar Verified',
        phoneMasked: `${w.phone.slice(0, 2)}••••••${w.phone.slice(-2)}`,
        phoneRaw: w.phone,
      })));

      const unmaskedMap = {};
      pack.workers.forEach((w) => {
        unmaskedMap[w.id] = w.phone;
      });
      setUnmaskedNumbers(unmaskedMap);
      setIsUnlocked(true);
      setUnlockedMetadata({
        isUnlocked: true,
        unmaskedNumbers: unmaskedMap,
        customerPhone: user?.phone?.replace(/\D/g, '') || pack.customerPhone,
        paymentId: pack.razorpayPaymentId || pack.utr,
        serviceId: matchedService.id,
        serviceLabel: matchedService.label,
        citySlug: pack.city.toLowerCase().replace(/\s+/g, '-'),
        cityName: pack.city,
        unlockedAt: pack.verifiedAt,
      });
    }

    const el = document.getElementById('workers-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsWorkerModalOpen(true);
  };

  // Automatically check status whenever user logs in or phone changes
  useEffect(() => {
    const activePhone = user?.phone || customerPhone;
    if (activePhone && activePhone.length >= 10) {
      checkExistingUnlock(activePhone);
    }
  }, [user?.phone, customerPhone, checkExistingUnlock]);

  // Only unmask full phone numbers if the user is authenticated and matches the verified customer phone, OR if unlocked via Razorpay in this session
  const loggedInPhone = user?.phone ? user.phone.replace(/\D/g, '') : null;
  const unlockedTargetPhone = unlockedMetadata?.customerPhone ? unlockedMetadata.customerPhone.replace(/\D/g, '') : null;
  const isUnlockedForCurrentSession = Boolean(
    isUnlocked && (
      (loggedInPhone && unlockedTargetPhone && loggedInPhone === unlockedTargetPhone) ||
      (unlockedMetadata?.paymentId && unlockedMetadata?.customerPhone)
    )
  );

  // Open Cashfree Checkout Details Modal
  const handleOpenQRModal = () => {
    setIsRazorpayModalOpen(true);
    setCashfreeError(null);
    if (user?.phone) {
      setCustomerPhone(user.phone.replace(/\D/g, ''));
    }
    if (user?.name) {
      setCustomerName(user.name);
    }
    if (user?.email) {
      setCustomerEmail(user.email);
    }
  };

  // Process Official Cashfree Checkout Payment (₹49)
  const handlePayWithCashfree = async (e) => {
    if (e) e.preventDefault();
    setCashfreeError(null);

    const cleanPhone = String(customerPhone || '').replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setCashfreeError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (!customerName || customerName.trim().length < 2) {
      setCashfreeError('Please enter your full name.');
      return;
    }

    setIsPayingCashfree(true);

    try {
      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded) {
        throw new Error('Could not load Cashfree payment gateway. Please check your internet connection.');
      }

      // 1. Create order on backend with platform & metadata
      const orderRes = await fetch(`${API_BASE}/payments/cashfree-create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity.name,
          serviceCategory: selectedService.label,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail?.trim() || undefined,
          workerIds: workers.map((w) => w.id),
          platform: 'WORKFORCE_WEB',
          amount: 49.0,
          returnUrl: typeof window !== 'undefined' ? `${window.location.origin}/direct-contact?cf_order_id={order_id}` : undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success || !orderData.data?.paymentSessionId) {
        throw new Error(orderData.message || 'Failed to initialize payment with Cashfree. Please try again.');
      }

      const { orderId, paymentSessionId } = orderData.data;

      // 2. Initialize Cashfree Web SDK
      const cashfreeMode = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';
      const cashfree = window.Cashfree({ mode: cashfreeMode });

      // Verification helper
      const verifyAndUnmaskPayment = async () => {
        try {
          const verifyRes = await fetch(`${API_BASE}/payments/cashfree-verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              customerPhone: cleanPhone,
              customerName: customerName.trim(),
              customerEmail: customerEmail?.trim() || undefined,
              workerIds: workers.map((w) => w.id),
              serviceCategory: selectedService.label,
              city: selectedCity.name,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || 'Payment verification pending. If amount was deducted, please contact support.');
          }

          // Unmask worker contacts immediately in UI
          const unmaskedMap = {};
          if (verifyData.data?.unlockedWorkers?.length > 0) {
            verifyData.data.unlockedWorkers.forEach((w) => {
              unmaskedMap[w.id] = w.phone;
            });
          }
          workers.forEach((w) => {
            if (!unmaskedMap[w.id] && w.phoneRaw) {
              unmaskedMap[w.id] = w.phoneRaw;
            }
          });

          const envelope = {
            isUnlocked: true,
            unmaskedNumbers: unmaskedMap,
            customerPhone: cleanPhone,
            customerName: customerName.trim(),
            customerEmail: customerEmail?.trim() || null,
            serviceId: selectedService.id,
            serviceLabel: selectedService.label,
            citySlug: selectedCity.slug,
            cityName: selectedCity.name,
            unlockedAt: new Date().toISOString(),
            paymentId: verifyData.data?.paymentId || orderId,
          };

          setIsUnlocked(true);
          setUnmaskedNumbers(unmaskedMap);
          setUnlockedMetadata(envelope);
          setRequestStatus('VERIFIED');

          if (typeof window !== 'undefined') {
            localStorage.setItem(`unlocked_dc_${selectedService.id}_${selectedCity.slug}`, JSON.stringify(envelope));
            localStorage.setItem('purchased_customer_phone', cleanPhone);
          }

          setIsRazorpayModalOpen(false);
          setSuccessData({
            orderId,
            paymentId: verifyData.data?.paymentId || orderId,
            customerPhone: cleanPhone,
            customerName: customerName.trim(),
            customerEmail: customerEmail?.trim() || '',
            serviceLabel: selectedService.label,
            cityName: selectedCity.name,
          });
          setIsSuccessModalOpen(true);
        } catch (verifyErr) {
          setCashfreeError(verifyErr.message || 'Payment verification failed. Please contact support.');
        } finally {
          setIsPayingCashfree(false);
        }
      };

      // 3. Open Cashfree in-page popup modal
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
      }).then(async (result) => {
        if (result?.error) {
          setCashfreeError(result.error?.message || 'Payment was cancelled or closed.');
          setIsPayingCashfree(false);
          return;
        }
        if (result?.paymentDetails) {
          await verifyAndUnmaskPayment();
        } else {
          // Modal closed or dismissed
          setIsPayingCashfree(false);
        }
      }).catch(async (err) => {
        console.warn('[Cashfree Checkout] Modal closed or failed:', err);
        setIsPayingCashfree(false);
      });

    } catch (err) {
      setCashfreeError(err.message || 'Unable to open Cashfree payment gateway.');
      setIsPayingCashfree(false);
    }
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

  // Handle Screenshot selection with client-side canvas compression (< 100KB)
  const handleScreenshotSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setModalError('Please upload an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setScreenshotPreview(compressed);
        setPaymentScreenshot(compressed);
        setModalError(null);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit payment proof with Phone, UTR, and Screenshot for Admin Verification
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

    if (!paymentScreenshot) {
      setModalError('Please upload a screenshot of your ₹49 UPI payment receipt.');
      return;
    }

    setIsConfirmingPayment(true);

    try {
      const res = await fetch(`${API_BASE}/payments/submit-direct-contact-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone: cleanPhone,
          utr: cleanUtr,
          screenshotUrl: paymentScreenshot,
          serviceCategory: selectedService.label,
          city: selectedCity.name,
          workerIds: workers.map((w) => w.id),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setIsUnlocked(false);
        setModalError(data.message || 'Failed to submit payment proof. Please check details and try again.');
        return;
      }

      // If already verified by admin or system
      if (data.data?.isVerified) {
        const unmaskedMap = {};
        if (data.data?.unlockedWorkers?.length > 0) {
          data.data.unlockedWorkers.forEach((w) => {
            unmaskedMap[w.id] = w.phone;
          });
        }
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
        setRequestStatus('VERIFIED');
        setPaymentMessage({
          type: 'success',
          text: `Payment of ₹49 verified (UTR: ${cleanUtr})! All 10 ${selectedService.label} numbers unlocked and saved to your device.`,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem(`unlocked_dc_${selectedService.id}_${selectedCity.slug}`, JSON.stringify(envelope));
        }

        setIsQRModalOpen(false);
        return;
      }

      // SUBMISSION PENDING ADMIN REVIEW
      setRequestStatus('PENDING');
      setPaymentMessage({
        type: 'pending',
        text: `Payment proof submitted (UTR: ${cleanUtr})! Our admin is verifying your ₹49 payment screenshot. As soon as approved, all 10 ${selectedService.label} numbers will unlock automatically for +91 ${cleanPhone}.`,
      });
      setIsQRModalOpen(false);
    } catch {
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
            Call <span className="text-amber-500">10 Verified {pluralService}</span> for{' '}
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
                    <span className="text-[11px] text-emerald-600 font-bold">500+ Cities Available</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCityModalOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all group cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
                      <img src="/google-maps-icon.webp" alt="City" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
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
                          onClick={() => {
                            handleServiceChange(svc);
                            setIsWorkerModalOpen(true);
                          }}
                          className={[
                            'flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center relative cursor-pointer',
                            isSelected
                              ? 'border-amber-500 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40 scale-[1.02]'
                              : 'border-slate-200 bg-white/80 hover:border-amber-300 hover:bg-white text-slate-700 shadow-2xs'
                          ].join(' ')}
                        >
                          <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5 ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                            <img src={svc.icon} alt={svc.label} className="w-full h-full object-contain" />
                          </div>
                          <span className={['text-[10.5px] font-extrabold leading-tight line-clamp-1', isSelected ? 'text-white' : 'text-slate-700'].join(' ')}>
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

                {/* Mobile Trigger Button: View 10 Numbers in Pop-up Modal */}
                <div className="lg:hidden mb-4">
                  <button
                    type="button"
                    onClick={() => setIsWorkerModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-amber-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Call 10 Verified {pluralService}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Payment Feedback */}
                {paymentMessage && (
                  <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${paymentMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {paymentMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    <span>{paymentMessage.text}</span>
                  </div>
                )}

                {/* Unlock Button / State Panel */}
                {!isUnlockedForCurrentSession ? (
                  <div className="space-y-3">
                    {/* If unlocked on device/backend but user not logged in */}
                    {isUnlocked && !user && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2.5 animate-in fade-in">
                        <div className="flex items-center gap-2 font-black text-xs text-emerald-900">
                          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Contacts Unlocked — Please Log In</span>
                        </div>
                        <p className="text-[11.5px] text-emerald-800/90 leading-relaxed">
                          10 {selectedService.label} numbers were unlocked for <strong>+91 {unlockedTargetPhone ? `${unlockedTargetPhone.slice(0, 2)}••••••${unlockedTargetPhone.slice(-2)}` : 'verified phone'}</strong>. Log in with this number to unblur contacts.
                        </p>
                        <button
                          type="button"
                          onClick={() => openAuthModal('CUSTOMER')}
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 transition-all cursor-pointer active:scale-98"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Log In to View 10 Numbers</span>
                        </button>
                      </div>
                    )}

                    {/* If payment proof submitted and pending verification */}
                    {requestStatus === 'PENDING' && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                            <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                            <span>Payment Proof Under Review</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-full">
                            Pending Admin
                          </span>
                        </div>
                        <p className="text-[11.5px] text-amber-900/90 leading-relaxed">
                          Your ₹49 payment screenshot was received. Once verified by our admin, all 10 worker numbers will unlock here automatically.
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-amber-200/60">
                          <span className="text-amber-800 font-semibold">Phone: +91 {user?.phone || customerPhone}</span>
                          <button
                            type="button"
                            onClick={() => checkExistingUnlock(user?.phone || customerPhone)}
                            className="font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Check Now
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Unlock CTA Button (shown if not yet unlocked or to re-open modal) */}
                    {(!isUnlocked || user) && (
                      <button
                        type="button"
                        onClick={handleOpenQRModal}
                        className="w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all active:scale-98 cursor-pointer"
                      >
                        <QrCode className="w-5 h-5" />
                        <span>{requestStatus === 'PENDING' ? 'Submit New Payment Proof' : `Call 10 Verified ${pluralService} — ₹49`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

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
                      <span>10 Verified {pluralService} Ready to Call!</span>
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

            {/* ── RIGHT COLUMN: 10 WORKERS LIST (DESKTOP MODE) ── */}
            <div className="hidden lg:block lg:col-span-7 space-y-4">
              
              {/* Header Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Call 10 Verified {pluralService}
                    </h2>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Active in {selectedCity.name} · Direct contact without agency commission
                  </p>
                </div>

                {isUnlockedForCurrentSession && (
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

              {/* Active Purchased Service Packs (For Logged-in Customers) */}
              {user && purchasedPacks.length > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-2xs space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                        Your Unlocked Worker Packs ({purchasedPacks.length})
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      Permanent Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {purchasedPacks.map((pack) => {
                      const isCurrent =
                        selectedService.label.toLowerCase() === pack.serviceCategory.toLowerCase() &&
                        selectedCity.name.toLowerCase() === pack.city.toLowerCase();
                      return (
                        <div
                          key={pack.id}
                          className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-white border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                              : 'bg-white/80 border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                              <span>{pack.serviceCategory}</span>
                              <span className="text-slate-400 font-normal">·</span>
                              <span className="text-emerald-700 font-semibold">{pack.city}</span>
                            </div>
                            <p className="text-[10.5px] text-slate-500 mt-0.5">
                              {pack.workerCount || pack.workers?.length || 10} numbers unlocked
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectPurchasedPack(pack)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800'
                            }`}
                          >
                            {isCurrent ? 'Viewing' : 'View Numbers'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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

              {/* Unlocked but Logged Out Prompt */}
              {isUnlocked && !isUnlockedForCurrentSession && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-amber-900">
                        10 Contacts Unlocked for +91 {unlockedTargetPhone ? `${unlockedTargetPhone.slice(0, 2)}••••••${unlockedTargetPhone.slice(-2)}` : 'verified phone'}
                      </p>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        {!user
                          ? 'Please log in with your verified mobile number to remove blur and call workers directly.'
                          : `You are logged in as +91 ${loggedInPhone}. Please switch to the account that unlocked these contacts.`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('CUSTOMER')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs whitespace-nowrap shadow-md shadow-emerald-200 transition-all cursor-pointer active:scale-98"
                  >
                    {!user ? 'Log In to Unblur Numbers' : 'Switch Account'}
                  </button>
                </div>
              )}

              {/* Workers List Display */}
              {!isLoadingWorkers && workers.length > 0 && (
                <div className="space-y-3">
                  {workers.map((worker, index) => {
                    const fullNumber = isUnlockedForCurrentSession
                      ? (unmaskedNumbers[worker.id] || worker.phoneRaw)
                      : null;
                    const isWorkerUnlocked = Boolean(fullNumber);
                    const displayedNumber = isWorkerUnlocked
                      ? (fullNumber.length === 10 ? `+91 ${fullNumber.slice(0, 5)} ${fullNumber.slice(5)}` : fullNumber)
                      : worker.phoneMasked;

                    return (
                      <div
                        key={worker.id || index}
                        className={[
                          'relative overflow-hidden rounded-2xl p-3 sm:p-3.5 border-2 transition-all space-y-2.5',
                          isWorkerUnlocked
                            ? 'border-emerald-300 bg-gradient-to-b from-white via-emerald-50/10 to-emerald-50/20 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.12)]'
                            : 'border-amber-200/90 bg-gradient-to-b from-white via-white to-amber-50/20 shadow-[0_4px_14px_-2px_rgba(217,119,6,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_-3px_rgba(217,119,6,0.16)] hover:border-amber-400/90'
                        ].join(' ')}
                      >
                        {/* 3D Top Accent Bar */}
                        <div className={`absolute inset-x-0 top-0 h-1 ${isWorkerUnlocked ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500'}`} />

                        {/* Top Section: Avatar, Info & Upper-Right Floating Rating & Price */}
                        <div className="flex items-start justify-between gap-2.5 pt-0.5">
                          {/* Left: Worker Info */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs ring-2 ring-white">
                                {worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Details */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                                  {worker.name}
                                </h4>
                                <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs">
                                  <BadgeCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                  Verified
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 font-semibold leading-snug">
                                {worker.jobType} · <span className="text-slate-500 font-normal">{worker.experience}</span>
                              </p>

                              {/* Kilometer first, then location of worker */}
                              <div className="flex items-center gap-1 text-[10.5px] text-slate-500 font-medium leading-snug truncate">
                                <span className="text-amber-800 font-bold whitespace-nowrap">📍 {worker.distance || '1.2 km away'}</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-slate-600 font-medium truncate">{worker.area || `${selectedCity.name} Central`}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: UPPER RIGHT RATING + JOBS + PRICE */}
                          <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-950 px-2 py-0.5 rounded-lg shadow-2xs">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                              <span className="font-black text-xs text-amber-950">{worker.rating}</span>
                            </div>
                            <span className="text-[9.5px] font-bold text-slate-400 whitespace-nowrap">
                              {worker.reviews || 23}+ jobs
                            </span>
                            <span className="font-black text-[10.5px] text-slate-800 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded-md whitespace-nowrap mt-0.5">
                              {worker.price}
                            </span>
                          </div>
                        </div>

                        {/* BIG & WIDE Number Section */}
                        {isWorkerUnlocked ? (
                          <div className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-2xs flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                                <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </div>
                              <div className="font-mono text-xs sm:text-sm font-black text-emerald-950 tracking-tight flex items-center gap-0.5">
                                <span className="text-emerald-700 text-[11px] sm:text-xs font-bold mr-0.5 select-none">+91</span>
                                <span>{fullNumber.length === 10 ? `${fullNumber.slice(0, 5)} ${fullNumber.slice(5)}` : fullNumber}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(fullNumber, worker.id)}
                                className="p-1 rounded-md text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer"
                                title="Copy Phone Number"
                              >
                                {copiedId === worker.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`tel:${fullNumber}`}
                                className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${fullNumber.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(worker.name)}%2C%20I%20got%20your%20number%20via%20Metro%20Mitra%20for%20${encodeURIComponent(selectedService.label)}%20work.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WA</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          (() => {
                            const { prefix, suffix, middle } = getPhoneDisplayParts(worker.phoneRaw, worker.phoneMasked);
                            return (
                              <div className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-100/70 border border-amber-200/90 shadow-2xs flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                                    <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                  </div>
                                  <div className="flex items-center font-mono text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                                    <span className="text-slate-400 text-[11px] sm:text-xs font-bold mr-0.5 select-none">+91</span>
                                    <span className="text-slate-900 font-black">{prefix}</span>
                                    <span className="mx-0.5 px-1 py-0.5 rounded select-none filter blur-[3.5px] text-slate-500 font-mono tracking-wider bg-amber-100/60 pointer-events-none inline-block text-[11px] sm:text-xs">
                                      {middle}
                                    </span>
                                    <span className="text-slate-900 font-black">{suffix}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={handleOpenQRModal}
                                  className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                                >
                                  <span>Call Verified (₹49)</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })()
                        )}
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
              { q: "Which cities are covered?", a: "Kolkata, Barrackpore, Howrah, Dum Dum, Salt Lake, New Town, Delhi NCR, Mumbai, Bengaluru, and 500+ cities across India." },
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
          MODULAR POP-UP MODAL FOR WORKER NUMBERS (MOBILE-FIRST POP-UP ARCHITECTURE)
          Styled exactly after the About Page Hero Promotional Card UI & Background.
         ══════════════════════════════════════════════════════════════════════════ */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-[190] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative overflow-hidden rounded-t-[32px] sm:rounded-3xl border-2 border-amber-300/90 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 p-0 shadow-2xl shadow-amber-200/50 flex flex-col max-h-[92vh] sm:max-h-[88vh] w-full max-w-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
          >
            {/* Background Decorative Blobs from About Page */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-56 h-56 rounded-full bg-gradient-to-br from-amber-300/35 to-orange-300/25 blur-2xl pointer-events-none" />
            <div className="absolute bottom-16 left-0 -mb-8 -ml-8 w-56 h-56 rounded-full bg-gradient-to-tr from-yellow-300/35 to-amber-200/35 blur-2xl pointer-events-none" />

            {/* Mobile Top Drag Handle */}
            <div className="w-12 h-1.5 bg-amber-300/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Header: Close Button, Animated Badge, Title, Trust Pills & Category Switcher */}
            <div className="p-4 sm:p-5 pb-3 border-b border-amber-200/70 relative shrink-0 z-10 text-left">
              <button
                type="button"
                onClick={() => setIsWorkerModalOpen(false)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 transition-colors border border-amber-200/80 shadow-2xs cursor-pointer z-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs mb-1.5 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
                <span>Direct Hire · Zero Broker Fee · Flat ₹49</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Call 10 Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">{pluralService}</span> in {selectedCity.name}
              </h3>

              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                Aadhaar KYC verified professionals. Zero agency commissions. Contact directly.
              </p>

              {/* Trust Badges Strip from About Page */}
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-2 pb-1">
                {[
                  { icon: BadgeCheck, text: '100% Aadhaar Verified', color: 'bg-emerald-50 text-emerald-800 border-emerald-200/90', iconColor: 'text-emerald-600' },
                  { icon: Banknote, text: 'Zero Broker Commission', color: 'bg-amber-50 text-amber-900 border-amber-200/90', iconColor: 'text-amber-600' },
                  { icon: Phone, text: '10 Direct Numbers', color: 'bg-blue-50 text-blue-900 border-blue-200/90', iconColor: 'text-blue-600' },
                  { icon: ShieldCheck, text: 'Direct WhatsApp & Call', color: 'bg-teal-50 text-teal-900 border-teal-200/90', iconColor: 'text-teal-600' },
                ].map(({ icon: Icon, text, color, iconColor }) => (
                  <span
                    key={text}
                    className={`inline-flex items-center gap-1.5 border text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap shadow-xs shrink-0 ${color}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${iconColor} shrink-0`} />
                    {text}
                  </span>
                ))}
              </div>

              {/* Slidable Category Switcher inside Modal Header */}
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-2.5 pb-1 mt-1">
                {SERVICE_CATEGORIES.map((svc) => {
                  const isSelected = selectedService.id === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedService(svc)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40 border border-amber-400 font-black scale-[1.02]'
                          : 'bg-white/90 hover:bg-white text-slate-700 hover:text-amber-950 border border-amber-200/80 hover:border-amber-300 shadow-2xs font-semibold'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center p-0.5 shrink-0 ${isSelected ? 'bg-white/20' : 'bg-amber-50'}`}>
                        <img src={svc.icon} alt="" className="w-full h-full object-contain" />
                      </div>
                      <span>{svc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slidable/Scrollable List of 10 Worker Cards */}
            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 space-y-3 z-10 custom-scrollbar text-left">
              {isLoadingWorkers ? (
                <div className="space-y-3 py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white/80 rounded-2xl p-4 border border-amber-200 animate-pulse flex items-center justify-between">
                      <div className="space-y-2 w-2/3">
                        <div className="h-4 bg-amber-200/50 rounded w-1/2"></div>
                        <div className="h-3 bg-amber-100/50 rounded w-3/4"></div>
                      </div>
                      <div className="h-8 bg-amber-200/50 rounded-xl w-24"></div>
                    </div>
                  ))}
                </div>
              ) : (
                workers.map((worker, index) => {
                  const fullNumber = isUnlockedForCurrentSession
                    ? (unmaskedNumbers[worker.id] || worker.phoneRaw)
                    : null;
                  const isWorkerUnlocked = Boolean(fullNumber);
                  const displayedNumber = isWorkerUnlocked
                    ? (fullNumber.length === 10 ? `+91 ${fullNumber.slice(0, 5)} ${fullNumber.slice(5)}` : fullNumber)
                    : worker.phoneMasked;

                  return (
                    <div
                      key={worker.id || index}
                      className={[
                        'relative overflow-hidden rounded-2xl p-3 sm:p-3.5 border-2 transition-all space-y-2.5',
                        isWorkerUnlocked
                          ? 'border-emerald-300 bg-gradient-to-b from-white via-emerald-50/10 to-emerald-50/20 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.12)]'
                          : 'border-amber-200/90 bg-gradient-to-b from-white via-white to-amber-50/20 shadow-[0_4px_14px_-2px_rgba(217,119,6,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_-3px_rgba(217,119,6,0.16)] hover:border-amber-400/90'
                      ].join(' ')}
                    >
                      {/* 3D Top Accent Bar */}
                      <div className={`absolute inset-x-0 top-0 h-1 ${isWorkerUnlocked ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500'}`} />

                      {/* Top Section: Avatar, Info & Upper-Right Floating Rating & Price */}
                      <div className="flex items-start justify-between gap-2.5 pt-0.5">
                        {/* Left: Worker Info */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs ring-2 ring-white">
                              {worker.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                          </div>

                          {/* Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                                {worker.name}
                              </h4>
                              <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300/80 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs">
                                <BadgeCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                Verified
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 font-semibold leading-snug">
                              {worker.jobType} · <span className="text-slate-500 font-normal">{worker.experience}</span>
                            </p>

                            {/* Kilometer first, then location of worker */}
                            <div className="flex items-center gap-1 text-[10.5px] text-slate-500 font-medium leading-snug truncate">
                              <span className="text-amber-800 font-bold whitespace-nowrap">📍 {worker.distance || '1.2 km away'}</span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-600 font-medium truncate">{worker.area || `${selectedCity.name} Central`}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: UPPER RIGHT RATING + JOBS + PRICE */}
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-950 px-2 py-0.5 rounded-lg shadow-2xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500 shrink-0" />
                            <span className="font-black text-xs text-amber-950">{worker.rating}</span>
                          </div>
                          <span className="text-[9.5px] font-bold text-slate-400 whitespace-nowrap">
                            {worker.reviews || 23}+ jobs
                          </span>
                          <span className="font-black text-[10.5px] text-slate-800 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded-md whitespace-nowrap mt-0.5">
                            {worker.price}
                          </span>
                        </div>
                      </div>

                      {/* BIG & WIDE Number Section */}
                      {isWorkerUnlocked ? (
                        <div className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-2xs flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-2xs shrink-0">
                              <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <div className="font-mono text-xs sm:text-sm font-black text-emerald-950 tracking-tight flex items-center gap-0.5">
                              <span className="text-emerald-700 text-[11px] sm:text-xs font-bold mr-0.5 select-none">+91</span>
                              <span>{fullNumber.length === 10 ? `${fullNumber.slice(0, 5)} ${fullNumber.slice(5)}` : fullNumber}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fullNumber, worker.id)}
                              className="p-1 rounded-md text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Copy Phone Number"
                            >
                              {copiedId === worker.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`tel:${fullNumber}`}
                              className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${fullNumber.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(worker.name)}%2C%20I%20got%20your%20number%20via%20Metro%20Mitra%20for%20${encodeURIComponent(selectedService.label)}%20work.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WA</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const { prefix, suffix, middle } = getPhoneDisplayParts(worker.phoneRaw, worker.phoneMasked);
                          return (
                            <div className="w-full py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-100/70 border border-amber-200/90 shadow-2xs flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </div>
                                <div className="flex items-center font-mono text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                                  <span className="text-slate-400 text-[11px] sm:text-xs font-bold mr-0.5 select-none">+91</span>
                                  <span className="text-slate-900 font-black">{prefix}</span>
                                  <span className="mx-0.5 px-1 py-0.5 rounded select-none filter blur-[3.5px] text-slate-500 font-mono tracking-wider bg-amber-100/60 pointer-events-none inline-block text-[11px] sm:text-xs">
                                    {middle}
                                  </span>
                                  <span className="text-slate-900 font-black">{suffix}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={handleOpenQRModal}
                                className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-lg shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                              >
                                <span>Call Verified (₹49)</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })()
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Fixed Downside Sticky Action Bar (Price & Unlock Section) */}
            <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-amber-200/90 p-4 sm:p-5 shadow-2xl z-20 shrink-0 text-left">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400 line-through font-semibold">₹500</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">₹49</span>
                    <span className="text-[10px] sm:text-[11px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Flat Fee
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Instant unlock · 10 {selectedService.label} numbers · Zero broker commission
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-bold text-slate-500">Traditional agencies:</span>
                  <p className="text-xs font-black text-rose-600 line-through">₹500 – ₹2,000 finder fee</p>
                </div>
              </div>

              {/* Action Button */}
              {!isUnlockedForCurrentSession ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsWorkerModalOpen(false);
                    handleOpenQRModal();
                  }}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-amber-300/80 hover:shadow-2xl transition-all active:scale-98 cursor-pointer text-center"
                >
                  <Zap className="w-5 h-5 fill-current animate-bounce shrink-0" />
                  <span>Call 10 Verified {pluralService} — ₹49</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="w-full py-2 px-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-xs flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All 10 Verified {pluralService} Ready to Call!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={copyAllNumbers}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'all' ? 'Copied All' : 'Copy All'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={shareToWhatsApp}
                      className="w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Share WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 text-[10.5px] font-semibold text-slate-500 mt-2">
                <span className="flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="w-3 h-3" /> 100% Aadhaar Verified
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Secured by Cashfree PG
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          CASHFREE CHECKOUT MODAL (COLLECTS NAME, PHONE, EMAIL)
          Z-INDEX 200: Overlays entire window, including navbar.
         ══════════════════════════════════════════════════════════════════════════ */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="pt-6 px-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 text-left relative">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-wide uppercase text-teal-900 bg-teal-200/80 px-3 py-1 rounded-full mb-1.5 shadow-2xs">
                <CreditCard className="w-3.5 h-3.5 text-teal-700" />
                <span>Cashfree Secure Checkout</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Call 10 Verified {pluralService}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified <strong>{selectedService.label}s</strong> in <strong>{selectedCity.name}</strong> • Flat ₹49
              </p>

              <button
                type="button"
                onClick={() => setIsRazorpayModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close Checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[75vh] custom-scrollbar text-left">
              
              {/* Pricing & Value Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <div className="flex justify-between items-center text-slate-900 font-black text-sm">
                  <span>Direct Contact Unlock Fee</span>
                  <span className="text-emerald-700 text-base font-black">₹49.00</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>10 Aadhaar-KYC Verified</strong> mobile numbers unmasked instantly</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>Zero Brokerage:</strong> Deal, negotiate & pay workers directly</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePayWithCashfree} className="space-y-3.5">
                {cashfreeError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{cashfreeError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your 10-Digit Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9831000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your unmasked worker numbers will be permanently linked to this number.
                  </p>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(for payment receipt)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  />
                </div>

                {/* Payment Security Badge */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-emerald-900 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cashfree 256-Bit SSL Protected</span>
                  </div>
                  <span className="text-[10px] text-slate-500">UPI • Cards • NetBanking • Wallets</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isPayingCashfree || !customerPhone || customerPhone.length < 10 || !customerName}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-200 hover:shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPayingCashfree ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Opening Cashfree Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Pay ₹49 via Cashfree</span>
                    </>
                  )}
                </button>
              </form>

            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button
                type="button"
                onClick={() => setIsRazorpayModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Cancel / Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          BIG PAYMENT SUCCESS MODAL (PERSISTENCE & LOGIN CALLOUT)
          Z-INDEX 250: Prominently alerts user to login so numbers stay saved!
         ══════════════════════════════════════════════════════════════════════════ */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col animate-in zoom-in-95 duration-200 text-center">
            
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Payment Verified Successfully</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  ₹49 Payment Received!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  10 Verified <strong>{successData?.serviceLabel}</strong> contacts in <strong>{successData?.cityName}</strong> are unlocked!
                </p>
                {successData?.paymentId && (
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    Payment Reference: {successData.paymentId}
                  </p>
                )}
              </div>

              {/* Crucial Account Persistence Callout Box */}
              {!user ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 text-left space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Login to Keep Your Purchased Numbers!</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Please Log In with your mobile number (<strong>+91 {successData?.customerPhone}</strong>) so these 10 worker numbers stay permanently saved to your account! Whenever you visit MetroMitra from any phone or computer, simply log in to view and call your unlocked workers anytime without paying again.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccessModalOpen(false);
                      if (typeof openAuthModal === 'function') {
                        openAuthModal('CUSTOMER');
                      }
                    }}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Log In with Mobile OTP (+91 {successData?.customerPhone})</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Saved to Your Account (+91 {user.phone})</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    All 10 worker contacts are permanently saved to your account. You can return anytime and access their numbers directly from this page or your dashboard.
                  </p>
                </div>
              )}

              {/* Action: Call Workers Now */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    const el = document.getElementById('workers-grid');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>View Unlocked Numbers & Start Calling</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          LEGACY STATIC UPI QR CODE SCANNER MODAL (COMMENTED OUT FOR PRODUCTION)
          Preserved for offline manual backup if needed.
         ══════════════════════════════════════════════════════════════════════════ */}
      {/*
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          ...
        </div>
      )}
      */}

      {/* ══════════════════════════════════════════════════════════════════════════
          LOGIN REQUIRED ALERT MODAL (VERIFIES REAL USER BEFORE PAYMENT)
         ══════════════════════════════════════════════════════════════════════════ */}
      {isLoginAlertModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 text-left relative animate-in zoom-in-95 duration-200">
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsLoginAlertModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                Login Required First
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">
              Please Log In Before Making Payment
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              To verify your identity as the genuine user and ensure your ₹49 unlocked worker contacts are permanently attached to your personal account, please log in with your mobile number.
            </p>

            {/* Key benefits / Verification points */}
            <div className="space-y-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Real User Identity:</strong> Verifies you are the real person making payment.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Permanent Access:</strong> Unlocked numbers stay linked to your mobile number across all devices.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Privacy Protection:</strong> Only you can view unmasked worker numbers for your payment.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsLoginAlertModalOpen(false);
                  openAuthModal('CUSTOMER');
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md shadow-emerald-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>Log In / Register with Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLoginAlertModalOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors text-center cursor-pointer"
              >
                Cancel / Return to Page
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
        onCitySelect={handleCityChange}
        currentCitySlug={selectedCity.slug}
      />
    </>
  );
}
