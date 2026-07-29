import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Plus, CheckCircle2, ChevronRight, MapPin, Calendar, Clock, Phone } from 'lucide-react';
import { workerSchemas } from '../../data/workerSchemas';
import { roles } from '../../data/roles';

export default function BookingFormModal({ isOpen, onClose, activeWorkers = [], onAddAnotherWorker }) {
  const [currentTabId, setCurrentTabId] = useState(null);
  const [formData, setFormData] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (activeWorkers.length > 0) {
      if (!currentTabId || !activeWorkers.includes(currentTabId)) {
        setCurrentTabId(activeWorkers[activeWorkers.length - 1]);
      }
    }
  }, [activeWorkers, currentTabId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (activeWorkers.length > 0) {
        setCurrentTabId(activeWorkers[activeWorkers.length - 1]);
      }
    } else {
      document.body.style.overflow = 'unset';
      setFormData({});
      setIsRecording(false);
      setRecordingTime(0);
      setCurrentTabId(null);
      clearInterval(timerRef.current);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      clearInterval(timerRef.current);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleInputChange = (workerId, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [workerId]: {
        ...(prev[workerId] || {}),
        [fieldName]: value
      }
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    alert('Booking Submitted Successfully!');
    onClose();
  };

  if (!isOpen || activeWorkers.length === 0) return null;

  const currentRole = roles.find(r => r.id === currentTabId);
  const currentSchema = workerSchemas[currentTabId] || [];
  const currentFormData = formData[currentTabId] || {};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Complete Your Booking</h2>
            <p className="text-sm text-slate-500 mt-1">Provide details for your requested workforce.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 overflow-x-auto custom-scrollbar shrink-0">
          {activeWorkers.map(id => {
            const role = roles.find(r => r.id === id);
            const isActive = currentTabId === id;
            return (
              <button
                key={id}
                onClick={() => setCurrentTabId(id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'border-action-green-500 text-action-green-600' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                {role?.icon && <img src={role.icon} alt={role.name} className="w-5 h-5 rounded-full object-cover" />}
                {role?.name || id}
                {isActive && <CheckCircle2 size={14} className="ml-1 opacity-50" />}
              </button>
            );
          })}
          <button
            onClick={onAddAnotherWorker}
            className="flex items-center gap-2 px-4 py-2 ml-2 text-xs font-bold text-trust-blue-600 bg-trust-blue-50 hover:bg-trust-blue-100 rounded-full transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Add Another Worker
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
            
            {/* Standard Fields Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-trust-blue-500" /> Date & Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date Needed</label>
                  <input
                    type="date"
                    required
                    value={currentFormData.date || ''}
                    onChange={(e) => handleInputChange(currentTabId, 'date', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time Slot</label>
                  <select
                    required
                    value={currentFormData.timeSlot || ''}
                    onChange={(e) => handleInputChange(currentTabId, 'timeSlot', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                  >
                    <option value="">Select Time</option>
                    <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                    <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                    <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Specialized Fields Section */}
            {currentSchema.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                   {currentRole?.icon && <img src={currentRole.icon} alt="" className="w-5 h-5 rounded-full object-cover" />} {currentRole?.name} Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSchema.map(field => (
                    <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          required
                          value={currentFormData[field.name] || ''}
                          onChange={(e) => handleInputChange(currentTabId, field.name, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                        >
                          <option value="">Select Option</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'boolean' ? (
                        <select
                          required
                          value={currentFormData[field.name] || ''}
                          onChange={(e) => handleInputChange(currentTabId, field.name, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                        >
                          <option value="">Select Option</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          min={field.min}
                          required
                          value={currentFormData[field.name] || ''}
                          onChange={(e) => handleInputChange(currentTabId, field.name, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Contact */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-trust-blue-500" /> Location & Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Location Address</label>
                  <input
                    type="text"
                    required
                    value={currentFormData.address || ''}
                    onChange={(e) => handleInputChange(currentTabId, 'address', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                    placeholder="Full address (e.g. 123 Main St, Apt 4B)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Phone size={12}/> Contact Phone</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    title="10 digit mobile number"
                    value={currentFormData.phone || ''}
                    onChange={(e) => handleInputChange(currentTabId, 'phone', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors"
                    placeholder="10 digit number"
                  />
                </div>
              </div>
            </div>

            {/* Voice & Special Instructions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
                <span>Special Instructions</span>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Optional</span>
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <textarea
                    rows="3"
                    value={currentFormData.notes || ''}
                    onChange={(e) => handleInputChange(currentTabId, 'notes', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-trust-blue-500 focus:bg-white outline-none transition-colors resize-none"
                    placeholder="Any specific tools needed or gate entry instructions?"
                  ></textarea>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center gap-2 bg-slate-50 rounded-xl p-4 border border-slate-200 w-full md:w-32">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-4 rounded-full transition-all ${
                      isRecording 
                        ? 'bg-red-100 text-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)] animate-pulse' 
                        : 'bg-white text-slate-400 hover:text-trust-blue-500 hover:shadow-md'
                    }`}
                  >
                    {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                  </button>
                  <span className={`text-xs font-bold ${isRecording ? 'text-red-500' : 'text-slate-400'}`}>
                    {isRecording ? formatTime(recordingTime) : 'Voice Note'}
                  </span>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            You are booking <strong>{activeWorkers.length}</strong> worker type{activeWorkers.length > 1 ? 's' : ''}.
          </p>
          <button type="submit" form="booking-form" className="btn-primary-green px-8 py-3 rounded-xl shadow-lg shadow-action-green-500/20">
            Submit Request <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
