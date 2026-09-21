import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import AuthModal from '../../components/auth/AuthModal';
import {
  Briefcase, MapPin, Calendar, Users, DollarSign, ChevronRight, ChevronLeft,
  CheckCircle2, Zap, Clock, Star, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

// ─── Service catalog matching UCCheckoutPage categories ───────────────────────
const SERVICE_CATEGORIES = [
  { id: 'electrician',       label: 'Electrician',        icon: '⚡', skill: 'ELECTRICIAN',      color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { id: 'plumber',           label: 'Plumber',            icon: '🔧', skill: 'PLUMBER',          color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { id: 'carpenter',         label: 'Carpenter',          icon: '🪚', skill: 'CARPENTER',        color: 'bg-amber-50 border-amber-200 text-amber-800' },
  { id: 'painter',           label: 'Painter',            icon: '🎨', skill: 'PAINTER',          color: 'bg-pink-50 border-pink-200 text-pink-800' },
  { id: 'cleaning',          label: 'Cleaning',           icon: '🧹', skill: 'CLEANER',          color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },
  { id: 'ac-repair',         label: 'AC Repair',          icon: '❄️', skill: 'AC_REPAIR',        color: 'bg-sky-50 border-sky-200 text-sky-800' },
  { id: 'appliance-repair',  label: 'Appliance Repair',   icon: '🔨', skill: 'APPLIANCE_REPAIR', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { id: 'security',          label: 'Security Guard',     icon: '🛡️', skill: 'SECURITY_GUARD',   color: 'bg-slate-50 border-slate-200 text-slate-800' },
  { id: 'loading-unloading', label: 'Loading / Unloading', icon: '📦', skill: 'LOADER',          color: 'bg-violet-50 border-violet-200 text-violet-800' },
  { id: 'general-helper',    label: 'General Helper',     icon: '🙋', skill: 'GENERAL_HELPER',   color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { id: 'furniture-moving',  label: 'Furniture Moving',   icon: '🛋️', skill: 'FURNITURE_MOVER',  color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { id: 'packer',            label: 'Packer',             icon: '📫', skill: 'PACKER',           color: 'bg-teal-50 border-teal-200 text-teal-800' },
];

const URGENCY_OPTIONS = [
  { value: 'SCHEDULED',    label: 'Scheduled',      desc: 'Plan ahead',         icon: <Calendar size={18} /> },
  { value: 'WITHIN_HOUR',  label: 'Within 1 Hour',  desc: 'Urgent but flexible', icon: <Clock size={18} /> },
  { value: 'IMMEDIATE',    label: 'Immediate',       desc: 'Right now',          icon: <Zap size={18} /> },
];

const WORKER_COUNT = [1, 2, 3, 4, 5, 6, 8, 10];
const DURATION_OPTIONS = [1, 2, 3, 4, 6, 8, 10, 12];

const STEPS = ['Service', 'Details', 'Schedule', 'Review'];

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user, token, openAuthModal, isAuthModalOpen, closeAuthModal, login } = useAuth();
  const { currentCity } = useCity();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pendingSubmit, setPendingSubmit] = useState(false); // true after auth if we need to re-submit

  const [form, setForm] = useState({
    service: null,       // SERVICE_CATEGORIES item
    description: '',
    address: currentCity?.name ? `${currentCity.name}` : '',
    locationLat: 22.5726,
    locationLng: 88.3639,
    workers: 1,
    duration: 2,
    urgency: 'SCHEDULED',
    scheduledSlot: '',
    contactPhone: '',
  });

  // When the city changes pre-fill address
  useEffect(() => {
    if (currentCity?.name && !form.address) {
      setForm(f => ({ ...f, address: currentCity.name }));
    }
  }, [currentCity]);

  // After user logs in while pendingSubmit, re-submit
  useEffect(() => {
    if (pendingSubmit && user && token) {
      setPendingSubmit(false);
      submitJob(token);
    }
  }, [user, token, pendingSubmit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!form.service;
    if (step === 1) return form.address.trim().length >= 3;
    if (step === 2) return true;
    return true;
  };

  const handleNext = () => {
    if (!canNext()) return;
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const submitJob = async (authToken) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        gigCategory:     form.service.skill,
        description:     form.description || `${form.service.label} service requested`,
        locationAddress: form.address,
        locationLat:     form.locationLat,
        locationLng:     form.locationLng,
        workersNeeded:   form.workers,
        durationHours:   form.duration,
        urgency:         form.urgency,
        scheduledSlot:   form.scheduledSlot || undefined,
        contactPhone:    form.contactPhone || undefined,
        paymentMethod:   'CASH',
        paymentStatus:   'PENDING',
        source:          'WEB',
      };

      const res = await fetch(`${API_BASE}/gig/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Error ${res.status}`);
      }

      navigate('/user/posted-jobs', { state: { success: true } });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!user || !token) {
      // Collect form first, then require login
      setPendingSubmit(true);
      openAuthModal('CUSTOMER');
      return;
    }
    submitJob(token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            <Briefcase size={15} />
            Post a Job — Free
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">Find Skilled Workers Fast</h1>
          <p className="text-purple-100 text-sm sm:text-base">
            Describe what you need — qualified workers will respond instantly.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${i === step ? 'text-purple-700' : 'text-slate-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          {/* STEP 0 — Service Picker */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-1">What service do you need?</h2>
              <p className="text-sm text-slate-500 mb-5">Choose the type of worker you're looking for.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => set('service', cat)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all font-bold text-sm
                      ${form.service?.id === cat.id
                        ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-md scale-[1.02]'
                        : `${cat.color} border hover:scale-[1.01] hover:shadow-sm`}`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — Location & Description */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1">Where is the work?</h2>
                <p className="text-sm text-slate-500 mb-4">Tell us the address or area so workers nearby can find you.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  <MapPin size={14} className="inline mr-1 text-purple-500" />
                  Full Address / Area *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder={`e.g. Salt Lake Sector V, ${currentCity?.name || 'Kolkata'}`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact Number (optional)</label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={e => set('contactPhone', e.target.value)}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Describe the Job (optional)</label>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={3}
                  placeholder={`e.g. Need a ${form.service?.label || 'worker'} to fix the kitchen fan and one bedroom light...`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Schedule */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1">When &amp; How many?</h2>
                <p className="text-sm text-slate-500 mb-4">Set the timing and worker count for your job.</p>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">How soon do you need it?</label>
                <div className="grid grid-cols-3 gap-2">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => set('urgency', opt.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all
                        ${form.urgency === opt.value
                          ? 'border-purple-500 bg-purple-50 text-purple-800'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {opt.icon}
                      <span className="text-xs font-bold leading-tight">{opt.label}</span>
                      <span className="text-[10px] text-slate-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scheduled Slot */}
              {form.urgency === 'SCHEDULED' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Preferred Slot</label>
                  <input
                    type="datetime-local"
                    value={form.scheduledSlot}
                    onChange={e => set('scheduledSlot', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              )}

              {/* Workers Needed */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Users size={14} className="inline mr-1 text-purple-500" />
                  Workers Needed
                </label>
                <div className="flex flex-wrap gap-2">
                  {WORKER_COUNT.map(n => (
                    <button
                      key={n}
                      onClick={() => set('workers', n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all
                        ${form.workers === n
                          ? 'border-purple-500 bg-purple-600 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-purple-300'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  <Clock size={14} className="inline mr-1 text-purple-500" />
                  Duration (hours)
                </label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map(h => (
                    <button
                      key={h}
                      onClick={() => set('duration', h)}
                      className={`px-3 h-10 rounded-xl text-sm font-bold border-2 transition-all
                        ${form.duration === h
                          ? 'border-purple-500 bg-purple-600 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-purple-300'}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-1">Review your Job Post</h2>
                <p className="text-sm text-slate-500 mb-4">Confirm the details before posting.</p>
              </div>

              <div className="space-y-3">
                <ReviewRow label="Service" value={`${form.service?.icon} ${form.service?.label}`} />
                <ReviewRow label="Location" value={form.address} />
                {form.description && <ReviewRow label="Description" value={form.description} />}
                <ReviewRow label="Workers" value={`${form.workers} worker${form.workers > 1 ? 's' : ''}`} />
                <ReviewRow label="Duration" value={`${form.duration} hour${form.duration > 1 ? 's' : ''}`} />
                <ReviewRow label="Urgency" value={URGENCY_OPTIONS.find(o => o.value === form.urgency)?.label} />
                {form.scheduledSlot && <ReviewRow label="Slot" value={new Date(form.scheduledSlot).toLocaleString('en-IN')} />}
                {form.contactPhone && <ReviewRow label="Phone" value={form.contactPhone} />}
              </div>

              {!user && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium mt-4">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  You'll be asked to log in with your mobile number before your job is posted. It only takes 30 seconds.
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium mt-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all
                  ${canNext()
                    ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Posting...</>
                ) : (
                  <><Zap size={16} /> Post Job Now</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-slate-500 font-medium">
          {['✅ Free to post', '⚡ Instant worker alerts', '📱 Track responses live', '🔒 Verified workers only'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* AuthModal — triggers after form fill if not logged in */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onSuccess={login}
          intent="CUSTOMER"
        />
      )}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50">
      <span className="text-xs font-bold text-slate-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
