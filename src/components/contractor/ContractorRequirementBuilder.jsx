import React, { useState } from 'react';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import WorkforceRequirementSummary from './WorkforceRequirementSummary';

export default function ContractorRequirementBuilder() {
  const { roles, locations, services } = useWorkforce();
  const contractorServices = services.filter(s => s.audiences?.includes('contractor'));
  
  const [formState, setFormState] = useState('editing'); // editing, review, submitted-demo
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  
  // Normalized Prototype Model
  const [data, setData] = useState({
    requirementType: 'temporary-workforce',
    serviceCategory: '',
    roles: [], // { roleSlug, quantity, shift?: { preset, startTime, endTime, recurrence } }
    worksite: {
      locationSlug: '',
      notes: ''
    },
    // Global shift for the current UI implementation
    globalShift: {
      preset: '',
      startTime: '',
      endTime: '',
      recurrence: ''
    },
    duration: {
      type: '',
      startDate: '',
      endDate: ''
    },
    requirements: ''
  });

  const availableRoles = contractorServices.find(s => s.slug === data.serviceCategory)?.roles.map(rSlug => roles.find(r => r.slug === rSlug)).filter(Boolean) || [];

  const handleUpdate = (category, field, value) => {
    if (category) {
      setData(prev => ({ ...prev, [category]: { ...prev[category], [field]: value } }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleRoleSelection = (roleSlug) => {
    setData(prev => {
      const isSelected = prev.roles.some(r => r.roleSlug === roleSlug);
      if (isSelected) {
        return { ...prev, roles: prev.roles.filter(r => r.roleSlug !== roleSlug) };
      } else {
        return { 
          ...prev, 
          roles: [...prev.roles, { 
            roleSlug, 
            quantity: 1,
            // Future-proofing: roles can define their own shift overrides
            shift: undefined 
          }] 
        };
      }
    });
  };

  const handleRoleQuantity = (roleSlug, quantityStr) => {
    let quantity = parseInt(quantityStr, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    
    setData(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.roleSlug === roleSlug ? { ...r, quantity } : r)
    }));
  };
  
  const changeRoleQuantity = (roleSlug, delta) => {
    setData(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.roleSlug === roleSlug ? { ...r, quantity: Math.max(1, r.quantity + delta) } : r)
    }));
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else setFormState('review');
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!data.serviceCategory;
      case 2: return data.roles.length > 0;
      case 3: return data.roles.length > 0;
      case 4: return !!data.worksite.locationSlug;
      case 5: return !!data.globalShift.preset;
      case 6: return !!data.duration.type;
      case 7: return true;
      default: return false;
    }
  };

  if (formState === 'submitted-demo') {
    return (
      <div className="bg-white border rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm" role="alert">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black" aria-hidden="true">✓</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Requirement Submitted Successfully</h3>
        <p className="text-slate-600 mb-6 font-medium">Our workforce team will review your requirement and get back to you shortly.</p>
        <button onClick={() => { setFormState('editing'); setStep(1); setData({ requirementType: 'temporary-workforce', serviceCategory: '', roles: [], worksite: { locationSlug: '', notes: '' }, globalShift: { preset: '', startTime: '', endTime: '', recurrence: '' }, duration: { type: '', startDate: '', endDate: '' }, requirements: '' }); }} className="text-blue-600 font-bold hover:underline">Start New Requirement</button>
      </div>
    );
  }

  if (formState === 'review') {
    return (
      <div className="bg-white border rounded-xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Review Workforce Requirement</h3>
        <WorkforceRequirementSummary data={data} roles={roles} locations={locations} />
        <div className="mt-8 flex gap-4">
          <button onClick={() => setFormState('editing')} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 flex-1">Back to Edit</button>
          <button onClick={() => setFormState('submitted-demo')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex-[2]">Submit Requirement</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto" aria-live="polite">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Workforce Requirement Builder</h3>
        <span className="text-sm font-bold text-slate-500" aria-label={`Step ${step} of ${totalSteps}`}>Step {step} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax={totalSteps}>
        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div>
            <h4 className="text-lg font-bold mb-4">What category of workforce do you need?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
              {contractorServices.map(s => {
                const isSelected = data.serviceCategory === s.slug;
                return (
                  <button
                    key={s.slug}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate(null, 'serviceCategory', s.slug)}
                    className={`p-4 border rounded-xl text-left transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSelected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-blue-300'}`}
                  >
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{s.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Select Roles</h4>
            {availableRoles.length === 0 ? (
              <p className="text-slate-500">No specific roles defined for this category.</p>
            ) : (
              <div className="space-y-3">
                {availableRoles.map(r => {
                  const isSelected = data.roles.some(dr => dr.roleSlug === r.slug);
                  return (
                    <button
                      key={r.slug}
                      aria-pressed={isSelected}
                      onClick={() => toggleRoleSelection(r.slug)}
                      className={`w-full p-4 border rounded-xl text-left flex justify-between items-center transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSelected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'hover:border-blue-300'}`}
                    >
                      <span className="font-bold text-slate-900">{r.name}</span>
                      {isSelected && <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs" aria-hidden="true">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Specify Quantity</h4>
            <div className="space-y-4">
              {data.roles.map(r => {
                const roleObj = roles.find(ro => ro.slug === r.roleSlug);
                return (
                  <div key={r.roleSlug} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-slate-50 gap-4">
                    <label htmlFor={`qty-${r.roleSlug}`} className="font-bold text-slate-900">{roleObj?.name || r.roleSlug}</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => changeRoleQuantity(r.roleSlug, -1)} aria-label="Decrease quantity" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-blue-500">-</button>
                      <input 
                        id={`qty-${r.roleSlug}`}
                        type="number" 
                        min="1"
                        value={r.quantity}
                        onChange={(e) => handleRoleQuantity(r.roleSlug, e.target.value)}
                        className="w-16 text-center font-bold text-lg border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                        aria-label={`Quantity for ${roleObj?.name || r.roleSlug}`}
                      />
                      <button onClick={() => changeRoleQuantity(r.roleSlug, 1)} aria-label="Increase quantity" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-blue-500">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Worksite Location</h4>
            <label htmlFor="locationSlug" className="sr-only">Select Worksite</label>
            <select 
              id="locationSlug"
              value={data.worksite.locationSlug} 
              onChange={(e) => handleUpdate('worksite', 'locationSlug', e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 bg-white mb-4 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a deployment location...</option>
              {locations.map(loc => (
                <option key={loc.slug} value={loc.slug}>{loc.name}</option>
              ))}
            </select>
            <p className="text-sm text-slate-500">Where will this workforce be deployed?</p>
          </div>
        )}

        {step === 5 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Shift Requirements</h4>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {['Day Shift', 'Night Shift', 'Morning', 'Evening', 'Custom/Rotating'].map(s => {
                const isSelected = data.globalShift.preset === s;
                return (
                  <button
                    key={s}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate('globalShift', 'preset', s)}
                    className={`p-3 border rounded-lg text-center transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100' : 'text-slate-700 hover:border-blue-300'}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Expected Duration</h4>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {['One Day', 'Multiple Days', 'One Week', 'Multiple Weeks', 'Recurring / Ongoing', 'Custom'].map(d => {
                const isSelected = data.duration.type === d;
                return (
                  <button
                    key={d}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate('duration', 'type', d)}
                    className={`p-3 border rounded-lg text-center transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100' : 'text-slate-700 hover:border-blue-300'}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Additional Requirements (Optional)</h4>
            <label htmlFor="requirements" className="sr-only">Additional Requirements</label>
            <textarea 
              id="requirements"
              value={data.requirements}
              onChange={(e) => handleUpdate(null, 'requirements', e.target.value)}
              placeholder="E.g., Requires heavy lifting experience, need safety gear, specific reporting instructions..."
              className="w-full border border-slate-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          aria-disabled={step === 1}
          className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button 
          onClick={nextStep}
          disabled={!isStepValid()}
          aria-disabled={!isStepValid()}
          className="flex-1 bg-blue-600 text-white rounded-lg font-bold py-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {step === totalSteps ? 'Review Requirement' : 'Next'}
        </button>
      </div>
    </div>
  );
}
