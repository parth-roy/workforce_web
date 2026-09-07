import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import SEO from '../../components/ui/SEO';
import { WorkerOnboardingSEO } from '../../seo/pageMetadata';
import { mockRoles } from '../../data/mock/roles';
import LocationPicker from '../../components/shared/LocationPicker';
import PlayStoreIcon from '../../components/ui/PlayStoreIcon';
import {
  User, FileText, MapPin, Truck, CheckCircle2, Briefcase, ShieldCheck, ArrowRight,
  Sparkles, Zap, Crown, CreditCard, QrCode, Copy, Check, AlertCircle, X,
  Loader2, Lock, Phone, MessageCircle, CheckCircle, ExternalLink
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'https://api.gomytruck.com/api/v1';

// Dynamic Cashfree Web Checkout SDK loader (SSR-safe)
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Cashfree) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Dynamic Razorpay SDK loader (SSR-safe fallback)
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function WorkerOnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobType: '',
    city: '',
    area: '',
    vehicleType: '',
    vehicleMake: '',
    aadharNumber: '',
    panNumber: '',
    dlNumber: '',
    rcNumber: '',
    insuranceDetails: ''
  });

  const [givenLocation, setGivenLocation] = useState(null);
  const [autoLocation, setAutoLocation] = useState(null);

  const [files, setFiles] = useState({
    profilePhoto: null,
    aadharFront: null,
    aadharBack: null,
    panFront: null,
    dlFront: null,
    dlBack: null,
    rcBook: null,
    insurance: null
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState('GATEWAY'); // 'GATEWAY' | 'QR'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Parse URL query for pre-selected role
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && mockRoles.some(r => r.slug === roleParam)) {
      setFormData(prev => ({ ...prev, jobType: roleParam }));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

  // Background GPS Fetching (Silent)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const MAPBOX_TOKEN = 'pk.eyJ1IjoicGFydGhyb3k0ODAiLCJhIjoi' + 'Y21wZ3ZjdTJzMDB6ZzJwc2R0MW0zajZwayJ9' + '.EeQV2fucMtGp-bM8tuf-dg';
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              const feature = data.features[0];
              let street = '', district = '', state = '', pincode = '';
              data.features.forEach(f => {
                if (f.place_type.includes('postcode')) pincode = f.text;
                if (f.place_type.includes('region')) state = f.text;
                if (f.place_type.includes('district') || f.place_type.includes('place')) district = f.text;
                if (f.place_type.includes('address') || f.place_type.includes('neighborhood')) street = f.text;
              });
              setAutoLocation({
                address: feature.place_name,
                street: street || feature.text,
                district,
                state,
                pincode,
                lat,
                lng
              });
            }
          } catch (e) {
            console.warn('Auto location fetch failed in background', e);
          }
        },
        (error) => {
          console.warn('User denied background location or error occurred', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Dynamic QR Code generation for ₹49 UPI on modal open
  useEffect(() => {
    if (isPaymentModalOpen && typeof window !== 'undefined') {
      const upiUrl = `upi://pay?pa=rzppay@icici&pn=MetroMitra&am=49&cu=INR&tn=${encodeURIComponent(
        'Worker Onboarding Fee 49'
      )}`;
      QRCode.toDataURL(upiUrl, {
        width: 320,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.warn('QR generation error', err));
    }
  }, [isPaymentModalOpen]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      const maxBytes = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
      ];

      if (file.size > maxBytes) {
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        e.target.value = '';
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported. Please upload JPEG, PNG, WEBP, GIF, or PDF.`);
        e.target.value = '';
        return;
      }

      setFiles(prev => ({ ...prev, [name]: file }));
    }
  };

  const isDriverRole = ['delivery-associate', 'driver', 'bike-rider', 'tempo-driver'].includes(formData.jobType);

  // Intercept form submission: Validate required fields and open ₹49 Payment Modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName || formData.firstName.trim().length < 2) {
      setErrorMessage('Please enter your first name.');
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    if (!formData.lastName || formData.lastName.trim().length < 1) {
      setErrorMessage('Please enter your last name.');
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }

    if (!formData.jobType) {
      setErrorMessage('Please select your primary job role.');
      return;
    }

    if (!formData.city && !givenLocation?.district) {
      setErrorMessage('Please specify your working city or select location on the map.');
      return;
    }

    const cleanAadhaar = formData.aadharNumber.replace(/\D/g, '');
    if (cleanAadhaar.length < 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!formData.panNumber || formData.panNumber.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-character PAN number.');
      return;
    }

    if (!files.aadharFront) {
      setErrorMessage('Please upload your Aadhaar Card document.');
      return;
    }

    if (!files.panFront) {
      setErrorMessage('Please upload your PAN Card document.');
      return;
    }

    if (isDriverRole) {
      if (!formData.vehicleType || formData.vehicleType === 'none') {
        setErrorMessage('Vehicle selection is required for driver and rider roles.');
        return;
      }
      if (!formData.dlNumber || formData.dlNumber.trim().length < 5) {
        setErrorMessage('Driving License number is required for driving roles.');
        return;
      }
    }

    // All form validation passed — open ₹49 Payment Modal
    setIsPaymentModalOpen(true);
  };

  // 1. Online Gateway Checkout (Cashfree primary, Razorpay fallback)
  const handlePayWithGateway = async () => {
    setPaymentError('');
    setIsPaying(true);

    try {
      const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const userCity = formData.city || givenLocation?.district || autoLocation?.district || 'West Bengal';

      // 1. Create ₹49 onboarding order on backend
      const res = await fetch(`${API_BASE}/form-gig-leads/create-onboarding-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone: cleanPhone,
          email: formData.email?.trim() || `${cleanPhone}@metromitra.com`,
          city: userCity,
          jobType: formData.jobType,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success || !orderData.data) {
        throw new Error(orderData.message || 'Failed to initialize payment gateway order. Please try again.');
      }

      const { gateway, orderId, paymentSessionId, amount, keyId } = orderData.data;

      // Gateway Branch: CASHFREE
      if (gateway === 'CASHFREE' && paymentSessionId) {
        const scriptLoaded = await loadCashfreeScript();
        if (!scriptLoaded) {
          throw new Error('Could not load Cashfree payment gateway. Please check your internet connection.');
        }

        const cashfreeMode = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';
        const cashfree = window.Cashfree({ mode: cashfreeMode });

        cashfree.checkout({
          paymentSessionId,
          redirectTarget: '_modal',
        }).then(async (result) => {
          if (result.error) {
            setIsPaying(false);
            setPaymentError(result.error.message || 'Payment was cancelled or failed.');
          } else if (result.paymentDetails) {
            await submitOnboardingWithPayment({
              paymentMethod: 'CASHFREE',
              cashfree_order_id: orderId,
            });
          }
        });
        return;
      }

      // Gateway Branch: RAZORPAY Fallback
      const rzpLoaded = await loadRazorpayScript();
      if (!rzpLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your connection.');
      }

      const liveKey = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TXq11IOe0ZKrQH';
      const options = {
        key: liveKey,
        amount: amount || 100,
        currency: 'INR',
        name: 'Metro Mitra',
        description: 'Worker Onboarding Fee (Test ₹1) & 90-Day Premium Membership',
        image: '/icon-192.png',
        order_id: orderId,
        prefill: {
          name: fullName,
          contact: cleanPhone,
          email: formData.email?.trim() || `${cleanPhone}@metromitra.com`,
        },
        theme: { color: '#059669' },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
        handler: async function (response) {
          await submitOnboardingWithPayment({
            paymentMethod: 'RAZORPAY',
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (failResp) {
        setIsPaying(false);
        setPaymentError(failResp.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      console.error('Payment Gateway Error:', err);
      setIsPaying(false);
      setPaymentError(err.message || 'Payment initialization failed.');
    }
  };

  // 2. Static UPI QR Code UTR Submission (₹49)
  const handleConfirmUtrPayment = async (e) => {
    if (e) e.preventDefault();
    setPaymentError('');

    const cleanUtr = String(utrNumber || '').replace(/\D/g, '');
    if (cleanUtr.length !== 12) {
      setPaymentError('Invalid UPI Transaction ID. UTR must be exactly 12 numeric digits from your payment receipt.');
      return;
    }
    if (/^(\d)\1{11}$/.test(cleanUtr) || cleanUtr === '123456789012') {
      setPaymentError('Invalid UPI Transaction ID. Please enter the genuine 12-digit UTR from your payment receipt.');
      return;
    }

    setIsPaying(true);
    await submitOnboardingWithPayment({
      paymentMethod: 'UPI_QR',
      utr: cleanUtr,
    });
  };

  // Submits complete onboarding payload with payment tokens to backend
  const submitOnboardingWithPayment = async (paymentDetails) => {
    setIsPaying(true);
    setPaymentError('');

    try {
      const data = new FormData();

      // Resolve city and area cleanly
      const resolvedCity = formData.city || givenLocation?.district || autoLocation?.district || '';
      const resolvedArea = formData.area || givenLocation?.address || autoLocation?.address || resolvedCity;

      // Append text fields from formData, skipping location keys to avoid duplicate entries
      const locationKeys = new Set([
        'city', 'area',
        'givenAddress', 'givenStreet', 'givenDistrict', 'givenState', 'givenPincode', 'givenLat', 'givenLng',
        'autoAddress', 'autoStreet', 'autoDistrict', 'autoState', 'autoPincode', 'autoLat', 'autoLng'
      ]);

      Object.keys(formData).forEach((key) => {
        if (!locationKeys.has(key) && formData[key] !== null && formData[key] !== undefined) {
          data.set(key, String(formData[key]));
        }
      });

      // Explicitly set single city and area
      data.set('city', resolvedCity);
      data.set('area', resolvedArea);

      // Append Given Location Data
      if (givenLocation) {
        if (givenLocation.address) data.set('givenAddress', givenLocation.address);
        if (givenLocation.street) data.set('givenStreet', givenLocation.street);
        if (givenLocation.district) data.set('givenDistrict', givenLocation.district);
        if (givenLocation.state) data.set('givenState', givenLocation.state);
        if (givenLocation.pincode) data.set('givenPincode', givenLocation.pincode);
        if (givenLocation.lat) data.set('givenLat', String(givenLocation.lat));
        if (givenLocation.lng) data.set('givenLng', String(givenLocation.lng));
      }

      // Append Auto Location Data
      if (autoLocation) {
        if (autoLocation.address) data.set('autoAddress', autoLocation.address);
        if (autoLocation.street) data.set('autoStreet', autoLocation.street);
        if (autoLocation.district) data.set('autoDistrict', autoLocation.district);
        if (autoLocation.state) data.set('autoState', autoLocation.state);
        if (autoLocation.pincode) data.set('autoPincode', autoLocation.pincode);
        if (autoLocation.lat) data.set('autoLat', String(autoLocation.lat));
        if (autoLocation.lng) data.set('autoLng', String(autoLocation.lng));
      }

      // Append file uploads
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.set(key, files[key]);
        }
      });

      // Append payment details
      Object.keys(paymentDetails).forEach((key) => {
        if (paymentDetails[key] !== undefined && paymentDetails[key] !== null) {
          data.set(key, String(paymentDetails[key]));
        }
      });

      const response = await fetch(`${API_BASE}/form-gig-leads/onboard-with-payment`, {
        method: 'POST',
        body: data,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit registration. Please try again.');
      }

      setIsPaymentModalOpen(false);
      setSuccessData(json.data);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Onboarding Submission Error:', error);
      setPaymentError(error.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsPaying(false);
    }
  };

  const copyVpaToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('rzppay@icici');
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    }
  };

  const copyRefToClipboard = () => {
    if (typeof navigator !== 'undefined' && successData?.refId) {
      navigator.clipboard.writeText(successData.refId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // ── SUCCESS CONFIRMATION SCREEN ──
  if (status === 'success') {
    const formattedExpiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const refCode = successData?.refId || `MM-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-16 flex items-center justify-center px-4 sm:px-6">
        <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl p-8 sm:p-10 text-center border-t-8 border-emerald-500 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          {/* Subtle glowing blob */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-md">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Registration &amp; ₹{successData?.amountPaid != null ? Number(successData.amountPaid).toFixed(0) : (successData?.paymentMethod === 'UPI_QR' ? '49' : '1')} Payment Verified</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Welcome to Metro Mitra! 👷
          </h1>

          <p className="text-sm text-slate-600 mb-6">
            Congratulations <strong>{formData.firstName} {formData.lastName}</strong>! Your gig worker profile and ₹{successData?.amountPaid != null ? Number(successData.amountPaid).toFixed(0) : (successData?.paymentMethod === 'UPI_QR' ? '49' : '1')} onboarding payment are verified.
          </p>

          {/* Reference ID Card */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-center mb-5 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Application Reference ID</span>
              <span className="text-sm sm:text-base font-mono font-black text-slate-900">{refCode}</span>
            </div>
            <button
              onClick={copyRefToClipboard}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedRef ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Active 90-Day Premium Membership Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border-2 border-emerald-300 text-left mb-6 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>90-Day Verified Worker Membership</span>
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
              Direct homeowner and contractor job alerts are now active for your trade (<strong>{formData.jobType || 'Gig Worker'}</strong>) across your registered operating location with <strong>0% commission deductions</strong>!
            </p>
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-emerald-200/60 text-emerald-900 font-bold">
              <span>Valid Until:</span>
              <span className="text-emerald-700 font-black">
                {formattedExpiryDate} (90 Days)
              </span>
            </div>
          </div>

          {/* Login Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left mb-6 space-y-1 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Registered Mobile Number</span>
            </div>
            <p className="font-mono font-bold text-slate-900 text-sm">
              +91 {formData.phone}
            </p>
            <p className="text-[11px] text-slate-500">
              You can log in anytime on Metro Mitra Web or our Worker App using this number to view incoming job leads and manage your verified status.
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.gomytruck.workforce"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-sm"
            >
              <PlayStoreIcon size={18} /> Download Metro Mitra Worker App
            </a>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-3 rounded-xl transition-all text-xs cursor-pointer"
              >
                Browse Open Jobs
              </button>
              <a
                href="https://wa.me/919331488999?text=Hello%20MetroMitra%20Team%2C%20I%20have%20completed%20my%20Rs.49%20worker%20onboarding%20registration%20(Phone%3A%20"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-3 px-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...WorkerOnboardingSEO()} />
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#f8fbfe] via-white to-[#eef7fb] pt-28 pb-16 lg:pb-0 overflow-hidden border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
            <div className="max-w-2xl lg:py-16 xl:pl-12">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs sm:text-sm font-bold tracking-wide mb-6 border border-emerald-100 uppercase">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                Join as Verified Professional
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                Find Flexible Gig Economy Jobs<br />
                <span className="text-emerald-600">Near You</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 mb-8 max-w-lg leading-relaxed font-medium">
                Metro Mitra is the premier direct gig work portal. Connect directly with homeowners, businesses, and contractors across West Bengal with 0% commission.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <a 
                  href="#onboarding-form" 
                  className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  Fill Application <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.gomytruck.workforce" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white border-2 border-slate-100 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 hover:text-emerald-600 hover:shadow-[0_8px_24px_-8px_rgba(5,150,105,0.3)] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] flex items-center gap-2"
                >
                  <PlayStoreIcon size={20} /> Download App
                </a>
              </div>
            </div>

            <div className="relative w-full h-full flex items-end justify-center lg:justify-end mt-8 lg:mt-0 animate-slide-up-fade opacity-0" style={{ animationFillMode: 'forwards' }}>
              <img 
                src="/jobs-hub-hero.webp" 
                alt="Gig Work" 
                className="w-full max-w-[900px] h-auto object-contain transform origin-bottom lg:scale-[1.15] xl:scale-[1.25] 2xl:scale-[1.3] xl:translate-x-[10%] xl:translate-y-[2%]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>
      
      <main id="onboarding-form" className="container mx-auto max-w-3xl px-4 py-12 scroll-mt-20">
        
        {/* ── 🌟 BRIGHT ANIMATED 90-DAY PREMIUM MEMBERSHIP & ₹49 ONBOARDING FEE ── */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-7 rounded-3xl text-white shadow-xl animate-in fade-in duration-300 mb-8">
          {/* Glowing animated background blobs */}
          <div
            className="absolute -top-10 -right-10 w-44 h-44 bg-white/20 rounded-full blur-2xl pointer-events-none animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-200 border border-emerald-300/40 shadow-xs">
                <Sparkles
                  className="w-3.5 h-3.5 text-emerald-300 animate-spin"
                  style={{ animationDuration: '4s' }}
                />
                <span>90-Day Verified Premium Gig Worker Membership</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                One-Time Onboarding Fee:{' '}
                <span className="underline decoration-yellow-300 underline-offset-4 font-extrabold text-yellow-300">
                  ₹49
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
                Pay ₹49 to activate your <strong>90-Day Verified Membership</strong>.
                Get direct hiring calls from verified homeowners and businesses in your operating hub with <strong>0% commission deductions</strong>!
              </p>
            </div>

            <div className="shrink-0 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center min-w-[170px] shadow-md">
              <span className="text-[10px] uppercase font-black text-emerald-200 tracking-wider block">
                Membership Term
              </span>
              <span className="text-xl font-black text-white block mt-0.5">
                90 Days Active
              </span>
              <span className="inline-block mt-1 text-[11px] font-bold text-emerald-100 bg-emerald-800/40 px-2 py-0.5 rounded-md">
                Priority Allocation
              </span>
            </div>
          </div>
        </div>

        {/* Secure Onboarding Note */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 mb-8 text-emerald-800">
          <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600" />
          <p className="text-sm">
            <strong>Secure Verification:</strong> Your documents are encrypted with 256-bit bank-grade security. Aadhaar and PAN are required for direct payment processing. Vehicle documents are only required if you are applying for driving or delivery roles.
          </p>
        </div>

        {/* Form Error Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 mb-8 flex items-start gap-3 text-rose-800 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Please correct the following before continuing:</p>
              <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Job Type */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Job Profile</h2>
                <p className="text-sm text-slate-500">Select the primary gig role you are applying for</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Role (Required) <span className="text-rose-500">*</span></label>
              <select 
                name="jobType" 
                value={formData.jobType} 
                onChange={handleInput}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
              >
                <option value="">-- Select Job Role --</option>
                {mockRoles.map(r => (
                  <option key={r.slug} value={r.slug}>{r.name} - {r.category}</option>
                ))}
              </select>
            </div>
          </section>

          {/* 2. Personal Info */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">Your basic contact and verification details</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name (Required) <span className="text-rose-500">*</span></label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. Rahul" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name (Required) <span className="text-rose-500">*</span></label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. Sharma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800" placeholder="e.g. rahul@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number (Required) <span className="text-rose-500">*</span></label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInput} maxLength={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono" placeholder="10-digit mobile number" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo (Optional)</label>
              <input type="file" name="profilePhoto" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
            </div>
          </section>

          {/* 3. Location */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Work Location</h2>
                <p className="text-sm text-slate-500">Where you prefer to take gig jobs</p>
              </div>
            </div>
            <div className="w-full">
              <LocationPicker 
                onLocationChange={(loc) => {
                  setGivenLocation(loc);
                  setFormData(prev => ({ 
                    ...prev, 
                    city: loc.district || loc.state || prev.city || '', 
                    area: loc.address || loc.street || loc.pincode || prev.area || '',
                  }));
                }} 
              />
              {(formData.city || givenLocation?.district) && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Selected Hub / Location:</p>
                    <p className="text-sm text-emerald-700">{formData.area || givenLocation?.address || ''}, {formData.city || givenLocation?.district || ''}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 4. Vehicle Details (Optional/Required based on role) */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle Details</h2>
                  <p className="text-sm text-slate-500">Required only for drivers &amp; riders</p>
                </div>
              </div>
              {!isDriverRole && <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">Optional</span>}
              {isDriverRole && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Required</span>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleInput} required={isDriverRole} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800">
                  <option value="">-- Select --</option>
                  <option value="bike">Two Wheeler / Bike</option>
                  <option value="toto">Toto / E-Rickshaw</option>
                  <option value="pickup">Pickup Truck / Tata Ace</option>
                  <option value="none">No Vehicle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Registration Number</label>
                <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleInput} required={isDriverRole && formData.vehicleType !== 'none'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 uppercase font-mono" placeholder="e.g. WB-00-XXXX" />
              </div>
            </div>
          </section>

          {/* 5. Documents */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verification Documents</h2>
                <p className="text-sm text-slate-500">Identity check &amp; background verification</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Aadhaar Card Number (Required) <span className="text-rose-500">*</span></label>
                <input required type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInput} maxLength={14} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono" placeholder="XXXX XXXX XXXX" />
                <div>
                  <span className="block text-xs text-slate-500 mb-1 font-medium">Aadhaar Document Upload (Front) <span className="text-rose-500">*</span></span>
                  <input required type="file" name="aadharFront" onChange={handleFileChange} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">PAN Card Number (Required) <span className="text-rose-500">*</span></label>
                <input required type="text" name="panNumber" value={formData.panNumber} onChange={handleInput} maxLength={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase" placeholder="XXXXX0000X" />
                <div>
                  <span className="block text-xs text-slate-500 mb-1 font-medium">PAN Document Upload (Front) <span className="text-rose-500">*</span></span>
                  <input required type="file" name="panFront" onChange={handleFileChange} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6 mt-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Driving License
                  {isDriverRole ? <span className="text-rose-500">*</span> : <span className="text-slate-400 text-xs font-normal">(Optional)</span>}
                </label>
                <input required={isDriverRole} type="text" name="dlNumber" value={formData.dlNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase" placeholder="DL Number" />
                <input required={isDriverRole} type="file" name="dlFront" onChange={handleFileChange} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Vehicle RC
                  {isDriverRole ? <span className="text-rose-500">*</span> : <span className="text-slate-400 text-xs font-normal">(Optional)</span>}
                </label>
                <input required={isDriverRole} type="text" name="rcNumber" value={formData.rcNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono uppercase" placeholder="RC Number" />
                <input required={isDriverRole} type="file" name="rcBook" onChange={handleFileChange} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
              </div>
            </div>
          </section>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-200 active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Continue to Verification &amp; Pay ₹49</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Flat ₹49 one-time activation fee. 0% Commission on all future gig earnings.</span>
            </p>
          </div>
        </form>
      </main>

      {/* ── DUAL PAYMENT MODAL (₹49) ── */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-black text-lg">Worker Onboarding &amp; Membership</h3>
                  <p className="text-xs text-emerald-100">
                    {paymentTab === 'GATEWAY'
                      ? 'Pay ₹1.00 (Test Activation) for instant verified status'
                      : 'Pay ₹49.00 to activate verified worker status'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isPaying) {
                    setIsPaymentModalOpen(false);
                    setPaymentError('');
                  }
                }}
                disabled={isPaying}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setPaymentTab('GATEWAY');
                  setPaymentError('');
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'GATEWAY'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Instant Checkout (₹1)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentTab('QR');
                  setPaymentError('');
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentTab === 'QR'
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Static UPI QR Code (₹49)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[75vh] text-left">
              {/* Membership Breakdown Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-slate-900 font-black text-sm">
                  <span>90-Day Verified Gig Worker Membership</span>
                  <span className="text-emerald-700 text-base font-black">
                    {paymentTab === 'GATEWAY' ? '₹1.00' : '₹49.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Operating District / Hub</span>
                  <span className="font-bold text-slate-800">
                    {formData.city || givenLocation?.district || autoLocation?.district || 'Pan-India Hub'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Direct Hiring Calls &amp; 0% Commission</span>
                  <span className="text-emerald-600 font-bold">Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-bold">Total Amount Payable</span>
                  <span className="text-slate-900 font-black text-base">
                    {paymentTab === 'GATEWAY' ? '₹1.00' : '₹49.00'}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* TAB 1: INSTANT GATEWAY CHECKOUT */}
              {paymentTab === 'GATEWAY' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-bold">Instant Online Activation via Cashfree / Official Gateway</p>
                    <p className="text-[11px] text-emerald-800">
                      Production test fee: ₹1.00. Pay using UPI, Cards, or NetBanking.
                      Your 90-day verified worker membership will activate automatically on success.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayWithGateway}
                    disabled={isPaying}
                    className="w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-300/80 transition-all active:scale-98 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-center"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Opening Secure Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-current animate-bounce shrink-0 text-yellow-300" />
                        <span>Pay ₹1 via Instant Gateway</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* TAB 2: STATIC UPI QR CODE */}
              {paymentTab === 'QR' && (
                <div className="space-y-4 pt-1">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      Scan with any UPI App (GPay, PhonePe, Paytm, BHIM)
                    </p>

                    {/* QR Code Container */}
                    <div className="w-48 h-48 mx-auto p-2 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-inner flex items-center justify-center">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="₹49 Onboarding UPI QR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Generating QR...</span>
                        </div>
                      )}
                    </div>

                    {/* UPI ID Pill & Copy Button */}
                    <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-full px-3 py-1 text-xs">
                      <span className="text-slate-500 font-semibold">UPI ID:</span>
                      <span className="font-mono font-bold text-slate-900">rzppay@icici</span>
                      <button
                        type="button"
                        onClick={copyVpaToClipboard}
                        className="ml-1 p-1 hover:bg-slate-200 rounded-full text-slate-700 transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedVpa ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* UTR Input Form */}
                  <form onSubmit={handleConfirmUtrPayment} className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Enter 12-Digit UPI Transaction ID / UTR <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        pattern="\d{12}"
                        placeholder="e.g. 423456789012"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono font-bold tracking-wider focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Find the 12-digit UTR in your payment receipt from GPay, PhonePe, or Paytm.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isPaying || utrNumber.length !== 12}
                      className="w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Payment...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Submit UTR &amp; Complete Onboarding</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Security Badge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Bank-Grade Encryption</span>
                </span>
                <span className="font-bold text-slate-700">Official Metro Mitra Partner</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
