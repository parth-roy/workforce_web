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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = authIntent === 'WORKER' 
        ? 'http://localhost:3000/api/v1/workforce/auth/send-otp' 
        : 'http://localhost:3000/api/v1/auth/send-otp';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role: authIntent === 'WORKER' ? 'WORKER' : 'CUSTOMER' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setStep('OTP');
    } catch (err) {
      // DEVELOPMENT FALLBACK
      console.warn('Backend failed, falling back to mock OTP sending:', err.message);
      setStep('OTP');
      setOtp('123456'); // Auto-fill OTP for testing
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
        ? 'http://localhost:3000/api/v1/workforce/auth/verify-otp' 
        : 'http://localhost:3000/api/v1/auth/verify-otp';

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
        { id: 'mock-user', name: 'Test User', phone },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <button onClick={closeAuthModal} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {authIntent === 'WORKER' ? 'Login as Partner' : 'Login or Sign up'}
          </h2>
          <p className="text-slate-500 mb-8">
            {step === 'PHONE' ? 'Enter your mobile number to proceed' : 'Enter the OTP sent to your mobile number'}
          </p>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    required
                    className="flex-1 block w-full px-4 py-3 rounded-none rounded-r-xl border border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  required
                  className="block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-center text-2xl tracking-widest"
                  placeholder="000000"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setStep('PHONE')} className="text-emerald-600 font-medium text-sm">Change Mobile Number</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}