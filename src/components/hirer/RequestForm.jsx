import React, { useState } from 'react';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import RequestSummary from './RequestSummary';

export default function RequestForm({ service, initialLocationSlug }) {
  const { locations } = useWorkforce();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: initialLocationSlug || '',
    requirement: '',
    timing: '',
    notes: ''
  });

  const [formState, setFormState] = useState('editing'); // editing, review, submitted-demo, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(2);
  const handleBack = () => {
    setStep(1);
    setFormState('editing');
  };
  
  const handleReview = () => {
    if (!formData.location || !formData.requirement) return;
    setFormState('review');
  };

  const handleSubmit = () => {
    setFormState('submitted-demo');
  };

  if (service.status !== 'active') {
    return (
      <div className="bg-slate-50 border rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Service Unavailable</h3>
        <p className="text-slate-600">This service is currently not accepting new requests in your area.</p>
      </div>
    );
  }

  if (formState === 'submitted-demo') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black">✓</div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Request Prototype Submitted</h3>
        <p className="text-green-800 mb-4 font-bold">This is a frontend prototype. No live request or booking has been created.</p>
        <button onClick={handleBack} className="text-green-700 font-bold hover:underline">Start another request</button>
      </div>
    );
  }

  if (formState === 'review') {
    return (
      <div className="bg-white border rounded-xl p-6 md:p-8">
        <h3 className="text-2xl font-bold mb-6">Review your request</h3>
        <RequestSummary service={service} data={formData} locations={locations} />
        <div className="mt-8 flex gap-4">
          <button onClick={handleBack} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 flex-1">Back</button>
          <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex-[2]">Confirm & Request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6">Request {service.name}</h3>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Service Area / Location *</label>
          <select 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 bg-white"
            required
          >
            <option value="">Select a location...</option>
            {locations.map(loc => (
              <option key={loc.slug} value={loc.slug}>{loc.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">What do you need help with? *</label>
          <textarea 
            name="requirement"
            value={formData.requirement}
            onChange={handleChange}
            placeholder="E.g., I need to fix a leaking pipe under the sink."
            className="w-full border border-slate-300 rounded-lg p-3 h-24 resize-none"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Time (Optional)</label>
          <select 
            name="timing" 
            value={formData.timing} 
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 bg-white"
          >
            <option value="">Anytime</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="weekend">This Weekend</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleReview}
        disabled={!formData.location || !formData.requirement}
        className="w-full bg-blue-600 text-white rounded-lg font-bold py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Review Request
      </button>
    </div>
  );
}
