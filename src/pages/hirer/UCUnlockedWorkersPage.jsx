import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, CheckCircle, Star, ShieldCheck, Sparkles, Award, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPluralServiceName } from '../../components/common/DirectContactBanner';

export default function UCUnlockedWorkersPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user, openAuthModal } = useAuth();
  const txId = searchParams.get('txId');
  const serviceCat = searchParams.get('category') || 'Carpenter';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(Boolean(txId));

  const activeCategory = (data && data.serviceCategory) || serviceCat || 'Workers';
  const pluralCategory = getPluralServiceName(activeCategory);

  const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'https://api.gomytruck.com/api/v1';

  useEffect(() => {
    async function fetchWorkers() {
      setLoading(true);
      // Case 1: Unpaid Preview Mode (No valid txId) -> Fetch from live preview API
      if (!txId) {
        setIsUnlocked(false);
        try {
          const res = await fetch(`${API_BASE}/lead-unlock/preview?serviceCategory=${encodeURIComponent(serviceCat)}&latitude=22.5726&longitude=88.3639`);
          const json = await res.json();
          if (json.success && json.data && json.data.previews && json.data.previews.length > 0) {
            setData({
              serviceCategory: serviceCat,
              amount: 49,
              workers: json.data.previews.map((p, idx) => ({
                workerId: p.id || String(idx + 1),
                name: p.name || `${serviceCat} Specialist`,
                phone: p.phoneMasked || '+91 98••••••89',
                rawPhone: '',
                whatsappUrl: '',
                rating: p.rating || 4.8,
                totalJobs: p.totalJobs || 50,
                experienceYears: p.experienceYears || 5,
                distanceKm: p.distanceKm || (1.5 + idx * 0.8),
                badges: ['Verified Pro', 'Background Checked'],
                availableTime: 'Available Now',
                isLocked: true,
              }))
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Preview API fetch error, using category-specific locked preview:', err);
        }

        const sampleNames = [
          `Rajesh ${serviceCat} Specialist`,
          `Amit Pro ${serviceCat} Works`,
          `Suresh Master ${serviceCat}`,
          `Kiran ${serviceCat} Services`,
          `MetroCare ${serviceCat} Pro`
        ];

        setData({
          serviceCategory: serviceCat,
          amount: 49,
          workers: sampleNames.map((n, idx) => ({
            workerId: String(idx + 1),
            name: n,
            phone: '+91 98••••••89',
            rawPhone: '',
            whatsappUrl: '',
            rating: Math.round((4.6 + (idx % 4) * 0.1) * 10) / 10,
            totalJobs: 80 + idx * 25,
            experienceYears: 4 + idx * 2,
            distanceKm: Math.round((1.8 + idx * 1.1) * 10) / 10,
            badges: ['Verified Pro', 'ID Checked'],
            availableTime: idx === 0 ? 'Available Now' : 'Within 45 mins',
            isLocked: true,
          }))
        });
        setLoading(false);
        return;
      }

      // Case 2: Paid Unlocked Mode (Valid txId exists) -> Fetch decrypted contacts
      try {
        const res = await fetch(`${API_BASE}/lead-unlock/${txId}/workers`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setIsUnlocked(true);
        } else {
          // If transaction is not verified, fall back to locked preview
          setIsUnlocked(false);
        }
      } catch (err) {
        console.error('Unlocked API fetch error:', err);
        setIsUnlocked(false);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, [txId, token, serviceCat, API_BASE]);

  const handleUnlockClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/services')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-800" />
            </button>
            <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <img src="/logo.png" alt="Metro Mitra" className="h-7 w-7 object-contain" />
              <span>{isUnlocked ? 'Unlocked Experts Near You' : `Top Verified ${serviceCat}s`}</span>
            </div>
          </div>
          <span className={`font-bold text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 ${
            isUnlocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isUnlocked ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
            {isUnlocked ? '100% Unlocked' : 'Preview Mode'}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                {isUnlocked ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Lock className="w-3.5 h-3.5 text-amber-300" />}
                {isUnlocked ? 'Direct Connect Active' : 'Pay 1% (₹49) to Call 10 Verified'}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Call 10 Verified {pluralCategory}
              </h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                {isUnlocked 
                  ? 'Call or WhatsApp experts directly. Negotiate prices and book immediately with 0% platform commission!' 
                  : 'Call 10 verified expert phone & WhatsApp contacts for just ₹49. Call and hire directly to save ₹300 - ₹950!'}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3 text-center min-w-[200px]">
              <div className="text-xs text-emerald-100 font-medium">{isUnlocked ? 'Your Total Savings' : 'Estimated Savings'}</div>
              <div className="text-2xl font-black text-amber-300 mt-0.5">Save ~₹950</div>
              <div className="text-[11px] text-emerald-200">{isUnlocked ? 'Fee Paid: ₹49 only' : 'Pass Fee: ₹49 only'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All Experts Verified</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>ID & Background Checked</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Experience Verified</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            <span>Rated & Reviewed</span>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium text-sm">Loading verified expert contacts near you...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(data && data.workers || []).map((w, idx) => (
              <div key={w.workerId || idx} className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">{w.name}</h3>
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md border border-amber-200">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {w.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="font-semibold text-slate-700">{w.experienceYears} Yrs Exp</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <img src="/google-maps-icon.webp" alt="Location" width={12} height={12} className="w-3 h-3 object-contain" />
                        {w.distanceKm} km away
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                        {w.availableTime || 'Available Now'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm tracking-wide flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-sans font-medium text-xs">Direct Contact:</span>
                      {isUnlocked ? (
                        <span className="bg-emerald-50 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                          {w.phone}
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          <span className="font-mono text-slate-500 text-xs font-bold">+91</span>
                          <span className="font-mono text-slate-800 text-xs font-bold">
                            {w.phoneMasked ? w.phoneMasked.slice(4, 6) : (w.phone ? w.phone.replace(/\D/g, '').slice(-10, -8) : '98')}
                          </span>
                          <span className="font-mono text-slate-400 text-xs font-extrabold tracking-widest blur-[3px] select-none bg-slate-200 px-1 rounded">
                            582914
                          </span>
                          <span className="font-mono text-slate-800 text-xs font-bold">
                            {w.phoneMasked ? w.phoneMasked.slice(-2) : (w.phone ? w.phone.replace(/\D/g, '').slice(-2) : '89')}
                          </span>
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1">
                            <Lock className="w-2.5 h-2.5" /> LOCKED
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isUnlocked ? (
                    <>
                      <a
                        href={'tel:' + w.rawPhone}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={w.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={handleUnlockClick}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95"
                    >
                      <Lock className="w-4 h-4 text-emerald-200" />
                      <span>Call 10 Verified • ₹49</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
