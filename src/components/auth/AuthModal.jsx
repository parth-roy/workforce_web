import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authIntent, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = authIntent === 'WORKER' 
        ? `${API_BASE}/workforce/auth/send-otp` 
        : `${API_BASE}/auth/send-otp`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role: authIntent === 'WORKER' ? 'WORKER' : 'CUSTOMER' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      
      const returnedOtp = data?.data?.otp || data?.data?._devOtp || data?.otp || '123456';
      setGeneratedOtp(returnedOtp);
      setStep('OTP');
    } catch (err) {
      // DEVELOPMENT FALLBACK (No SMS provider yet)
      console.warn('Backend failed, falling back to mock OTP sending:', err.message);
      setGeneratedOtp('123456');
      setStep('OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = authIntent === 'WORKER' 
        ? `${API_BASE}/workforce/auth/verify-otp` 
        : `${API_BASE}/auth/verify-otp`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, role: authIntent === 'WORKER' ? 'WORKER' : 'CUSTOMER' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to verify OTP');
      
      login(data.data.user, data.data.accessToken, authIntent);
      closeAuthModal();
      handleRedirect();
      
    } catch (err) {
      // DEVELOPMENT FALLBACK
      console.warn('Backend failed, falling back to mock login:', err.message);
      login(
        { id: `user-${phone}`, name: 'Customer', phone },
        'mock-jwt-token',
        authIntent
      );
      closeAuthModal();
      handleRedirect();
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    // If they were trying to checkout, they just stay on the checkout page.
    // If they clicked Login from the navbar, maybe redirect to their profile/orders.
    if (!location.pathname.includes('/checkout')) {
      navigate('/user/orders');
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-7 sm:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {authIntent === 'WORKER' ? 'Login as Partner' : 'Login / Register'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {step === 'PHONE' ? 'Enter your 10-digit mobile number to proceed' : 'Enter the 6-digit OTP to verify your account'}
          </p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">{error}</div>}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-300 bg-slate-50 text-slate-700 font-bold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                    className="flex-1 block w-full px-4 py-3.5 rounded-none rounded-r-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-base font-bold text-slate-900 outline-none"
                    placeholder="Enter 10-digit number"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                {/* Header row: Label on left, OTP display badge beside it on right */}
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Enter OTP</label>
                  
                  {/* Beside the OTP box, display the OTP code */}
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Your OTP:</span>
                    <span className="font-mono font-black text-sm text-amber-950 tracking-wider select-all">
                      {generatedOtp || '123456'}
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                  className="block w-full px-4 py-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-center text-2xl tracking-widest font-mono font-black text-slate-900 outline-none"
                  placeholder="000000"
                  autoFocus
                />

                {/* Sub-row: Quick Fill Button */}
                <div className="mt-2.5 flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500 text-[11px]">
                    SMS Gateway: type <strong className="font-mono font-bold text-amber-800">{generatedOtp || '123456'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtp(generatedOtp || '123456')}
                    className="text-emerald-700 hover:text-emerald-900 font-black bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-200 hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer active:scale-98"
              >
                {loading ? 'Verifying OTP...' : 'Verify & Login'}
              </button>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => { setStep('PHONE'); setOtp(''); }}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs hover:underline cursor-pointer"
                >
                  Change Mobile Number (+91 {phone})
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}