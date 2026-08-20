import React, { useState } from 'react';
import { mockServices } from '../../data/mock/services';
import {
  CheckCircle, ArrowLeft, ArrowRight, X, Zap, Wrench, Package, Sparkles, Truck, Users,
  MapPin, Clock, Calendar, FileText, ClipboardList, AlertTriangle
} from 'lucide-react';

const SERVICE_ICONS = {
  Zap: Zap, Wrench: Wrench, Package: Package, Sparkles: Sparkles, Truck: Truck, Users: Users,
};

const TOTAL_STEPS = 9;

const DURATION_OPTIONS = ['1 hour', '2 hours', '4 hours', '8 hours', '12 hours'];
const URGENCY_OPTIONS = [
  { value: 'immediate', label: 'Immediately', desc: 'As soon as possible' },
  { value: 'within_hour', label: 'Within 1 Hour', desc: 'Flexible start, soon' },
  { value: 'scheduled', label: 'Schedule for Later', desc: 'Pick a date and time' },
];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i + 1 < current ? 'bg-emerald-500' :
            i + 1 === current ? 'bg-emerald-600' :
            'bg-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

function CancelButton({ onCancel }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600">Are you sure?</span>
        <button onClick={onCancel} className="text-red-600 text-sm font-semibold hover:underline">Yes, cancel</button>
        <button onClick={() => setConfirm(false)} className="text-slate-600 text-sm hover:underline">Keep editing</button>
      </div>
    );
  }
  return (
    <button onClick={() => setConfirm(true)} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm transition-colors">
      <X className="w-4 h-4" /> Cancel
    </button>
  );
}

export default function RequestForm({ service: preselectedService, initialLocationSlug, onClose }) {
  const individualServices = mockServices.filter(s => s.audiences.includes('individual'));

  const [step, setStep] = useState(preselectedService ? 2 : 1);
  const [formData, setFormData] = useState({
    service: preselectedService || null,
    workerType: '',
    location: initialLocationSlug || '',
    workers: 1,
    duration: '2 hours',
    urgency: 'immediate',
    scheduleDate: '',
    scheduleTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const clearErr = (key) => setErrors(prev => ({ ...prev, [key]: undefined }));

  const validate = () => {
    const e = {};
    if (step === 1 && !formData.service) e.service = 'Please select a service.';
    if (step === 2 && !formData.workerType) e.workerType = 'Please select a worker type.';
    if (step === 3 && !formData.location.trim()) e.location = 'Please enter your location.';
    if (step === 6 && formData.urgency === 'scheduled' && !formData.scheduleDate) e.scheduleDate = 'Please select a date.';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
    else setStep(TOTAL_STEPS); // go to review
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setFormData({ service: null, workerType: '', location: '', workers: 1, duration: '2 hours', urgency: 'immediate', scheduleDate: '', scheduleTime: '', notes: '' });
    setStep(1); setSubmitted(false); setErrors({});
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Request Submitted</h2>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 text-sm">Request Submitted</p>
            <p className="text-emerald-800 text-sm">No booking has been placed. This is a prototype UI — backend integration is coming soon. Your request was not sent to any worker.</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-5 text-left mb-6 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-semibold">{formData.service?.name}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-semibold">{formData.workerType || '—'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-semibold">{formData.location}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Workers</span><span className="font-semibold">{formData.workers}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Duration</span><span className="font-semibold">{formData.duration}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Urgency</span><span className="font-semibold capitalize">{formData.urgency.replace('_', ' ')}</span></div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={handleReset} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            New Request
          </button>
          {onClose && (
            <button onClick={onClose} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Review step
  if (step === TOTAL_STEPS) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-slate-900">Review Your Request</h2>
          <CancelButton onCancel={onClose || handleReset} />
        </div>
        <StepIndicator current={TOTAL_STEPS} total={TOTAL_STEPS} />

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 mb-6">
          {[
            { label: 'Service', value: formData.service?.name },
            { label: 'Worker Type', value: formData.workerType || 'General' },
            { label: 'Location', value: formData.location },
            { label: 'Workers Needed', value: formData.workers },
            { label: 'Duration', value: formData.duration },
            { label: 'Urgency', value: URGENCY_OPTIONS.find(u => u.value === formData.urgency)?.label },
            formData.urgency === 'scheduled' && { label: 'Scheduled', value: `${formData.scheduleDate} ${formData.scheduleTime}` },
            formData.notes && { label: 'Notes', value: formData.notes },
          ].filter(Boolean).map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
              <span className="text-slate-500 text-sm shrink-0">{label}</span>
              <span className="font-semibold text-slate-900 text-sm text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep(TOTAL_STEPS - 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            Submit Request
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          This is a Request Submitted. Submitting will not create a real booking or contact any worker.
        </p>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">What service do you need?</h2>
            <p className="text-slate-500 text-sm mb-6">Select the type of task you need help with.</p>
            {errors.service && <p className="text-red-600 text-sm mb-3">{errors.service}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {individualServices.map(svc => {
                const Icon = SERVICE_ICONS[svc.icon] || Users;
                const selected = formData.service?.slug === svc.slug;
                return (
                  <button
                    key={svc.slug}
                    onClick={() => { set('service', svc); set('workerType', ''); clearErr('service'); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      selected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{svc.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{svc.description}</p>
                    </div>
                    {selected && <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Select worker type</h2>
            <p className="text-slate-500 text-sm mb-6">Choose the specific role for this task.</p>
            {errors.workerType && <p className="text-red-600 text-sm mb-3">{errors.workerType}</p>}
            <div className="space-y-2">
              {(formData.service?.roles?.length ? formData.service.roles : ['General Worker']).map(r => (
                <button
                  key={r}
                  onClick={() => { set('workerType', r); clearErr('workerType'); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    formData.workerType === r ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold text-slate-900 capitalize">{r.replace(/-/g, ' ')}</span>
                  {formData.workerType === r && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Where do you need the service?</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your address or area.</p>
            {errors.location && <p className="text-red-600 text-sm mb-3">{errors.location}</p>}
            <div className="relative mb-4">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Barrackpore, North 24 Parganas"
                value={formData.location}
                onChange={e => { set('location', e.target.value); clearErr('location'); }}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <button
              onClick={() => { set('location', 'Barrackpore, West Bengal (simulated GPS)'); clearErr('location'); }}
              className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" /> Use current location (simulated)
            </button>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">How many workers do you need?</h2>
            <p className="text-slate-500 text-sm mb-8">Select from 1 to 10.</p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => set('workers', Math.max(1, formData.workers - 1))}
                className="w-12 h-12 rounded-full border-2 border-slate-300 text-slate-700 text-2xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-5xl font-black text-slate-900 w-16 text-center">{formData.workers}</span>
              <button
                onClick={() => set('workers', Math.min(10, formData.workers + 1))}
                className="w-12 h-12 rounded-full border-2 border-slate-300 text-slate-700 text-2xl font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-8">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => set('workers', n)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${formData.workers === n ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 text-slate-600 hover:border-emerald-400'}`}>{n}</button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">How long do you need them?</h2>
            <p className="text-slate-500 text-sm mb-6">Select approximate duration.</p>
            <div className="space-y-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => set('duration', d)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    formData.duration === d ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="flex items-center gap-3 font-semibold text-slate-900">
                    <Clock className="w-4 h-4 text-slate-400" /> {d}
                  </span>
                  {formData.duration === d && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">When do you need them?</h2>
            <p className="text-slate-500 text-sm mb-6">Select urgency preference.</p>
            <div className="space-y-3 mb-6">
              {URGENCY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('urgency', opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                    formData.urgency === opt.value ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-900">{opt.label}</p>
                    <p className="text-slate-500 text-xs">{opt.desc}</p>
                  </div>
                  {formData.urgency === opt.value && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                </button>
              ))}
            </div>
            {formData.urgency === 'scheduled' && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                  {errors.scheduleDate && <p className="text-red-600 text-xs mb-1">{errors.scheduleDate}</p>}
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => { set('scheduleDate', e.target.value); clearErr('scheduleDate'); }}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Time (optional)</label>
                  <input
                    type="time"
                    value={formData.scheduleTime}
                    onChange={e => set('scheduleTime', e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Any special instructions?</h2>
            <p className="text-slate-500 text-sm mb-6">Optional — tell the worker what to expect.</p>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <textarea
                rows={5}
                placeholder="e.g. Ground floor flat, parking available. Need plumber for leaking kitchen tap and bathroom shower valve."
                value={formData.notes}
                onChange={e => set('notes', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{formData.notes.length} / 500 characters</p>
          </div>
        );

      case 8:
        return (
          <div className="text-center">
            <ClipboardList className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Review</h2>
            <p className="text-slate-500 text-sm mb-6">Click Next to review your request before submitting.</p>
            <div className="bg-slate-50 rounded-xl p-5 text-left space-y-2 text-sm">
              <p><span className="text-slate-500">Service:</span> <strong>{formData.service?.name}</strong></p>
              <p><span className="text-slate-500">Location:</span> <strong>{formData.location}</strong></p>
              <p><span className="text-slate-500">Workers:</span> <strong>{formData.workers}</strong></p>
              <p><span className="text-slate-500">Duration:</span> <strong>{formData.duration}</strong></p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isFirstStep = (preselectedService ? step === 2 : step === 1);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-emerald-600">Step {step} of {TOTAL_STEPS - 1}</p>
        <CancelButton onCancel={onClose || (() => {})} />
      </div>
      <StepIndicator current={step} total={TOTAL_STEPS - 1} />

      <div className="min-h-[280px]">
        {renderStep()}
      </div>

      <div className="flex gap-3 mt-8">
        {!isFirstStep && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
        >
          {step === 8 ? 'Review' : 'Next'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
