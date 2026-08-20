import React, { useState } from 'react';
import { useWorkforce } from '../../data/mock/WorkforceProvider';

function CorporateWorkforceSummary({ data, roles, locations }) {
  return (
    <div className="bg-slate-50 border rounded-lg p-6 space-y-6" aria-live="polite">
      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Organization Context</p>
        <p className="font-semibold text-slate-900">{data.organization || 'Unnamed Organization'}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Workforce Requirements</p>
        <div className="space-y-4">
          {data.locations.map((loc, idx) => {
            const locName = locations.find(l => l.slug === loc.locationSlug)?.name || 'Unknown Location';
            return (
              <div key={idx} className="bg-white border rounded p-4">
                <p className="font-bold text-slate-900 mb-2 border-b pb-2">{locName}</p>
                <ul className="space-y-2">
                  {loc.roles.map((r, i) => {
                    const roleObj = roles.find(ro => ro.slug === r.roleSlug);
                    return (
                      <li key={i} className="flex justify-between items-center text-sm">
                        <span className="font-semibold">{r.quantity}x {roleObj?.name || r.roleSlug}</span>
                        <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">{r.shift?.preset || 'Any Shift'}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</p>
          <p className="font-semibold text-slate-900 capitalize">{data.duration.type || 'Any'}</p>
        </div>
        {data.requirements && (
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Additional Requirements</p>
            <p className="text-slate-700 whitespace-pre-wrap text-sm">{data.requirements}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CorporateWorkforceRequirementBuilder() {
  const { roles, locations, services } = useWorkforce();
  const corporateServices = services.filter(s => s.audiences?.includes('corporate'));
  
  const [formState, setFormState] = useState('editing');
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  
  const [data, setData] = useState({
    organization: 'Acme Logistics Corp (Demo)',
    serviceCategory: '',
    locations: [], 
    duration: { type: '', startDate: '', endDate: '' },
    requirements: ''
  });

  const availableRoles = corporateServices.find(s => s.slug === data.serviceCategory)?.roles.map(rSlug => roles.find(r => r.slug === rSlug)).filter(Boolean) || [];

  const handleUpdate = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleDurationUpdate = (field, value) => {
    setData(prev => ({ ...prev, duration: { ...prev.duration, [field]: value } }));
  };

  const addLocation = (locationSlug) => {
    if (!data.locations.some(l => l.locationSlug === locationSlug)) {
      setData(prev => ({
        ...prev,
        locations: [...prev.locations, { locationSlug, roles: [] }]
      }));
    }
  };

  const removeLocation = (locationSlug) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.locationSlug !== locationSlug)
    }));
  };

  const toggleLocationRole = (locationSlug, roleSlug) => {
    setData(prev => {
      const newLocations = [...prev.locations];
      const locIndex = newLocations.findIndex(l => l.locationSlug === locationSlug);
      if (locIndex >= 0) {
        const roles = newLocations[locIndex].roles;
        const exists = roles.some(r => r.roleSlug === roleSlug);
        if (exists) {
          newLocations[locIndex].roles = roles.filter(r => r.roleSlug !== roleSlug);
        } else {
          newLocations[locIndex].roles = [...roles, { roleSlug, quantity: 1, shift: { preset: 'Day Shift' } }];
        }
      }
      return { ...prev, locations: newLocations };
    });
  };

  const changeRoleQuantity = (locationSlug, roleSlug, delta) => {
    setData(prev => {
      const newLocations = [...prev.locations];
      const locIndex = newLocations.findIndex(l => l.locationSlug === locationSlug);
      if (locIndex >= 0) {
        const roles = [...newLocations[locIndex].roles];
        const rIndex = roles.findIndex(r => r.roleSlug === roleSlug);
        if (rIndex >= 0) {
          roles[rIndex].quantity = Math.max(1, roles[rIndex].quantity + delta);
          newLocations[locIndex].roles = roles;
        }
      }
      return { ...prev, locations: newLocations };
    });
  };

  const changeRoleShift = (locationSlug, roleSlug, preset) => {
    setData(prev => {
      const newLocations = [...prev.locations];
      const locIndex = newLocations.findIndex(l => l.locationSlug === locationSlug);
      if (locIndex >= 0) {
        const roles = [...newLocations[locIndex].roles];
        const rIndex = roles.findIndex(r => r.roleSlug === roleSlug);
        if (rIndex >= 0) {
          roles[rIndex].shift = { ...roles[rIndex].shift, preset };
          newLocations[locIndex].roles = roles;
        }
      }
      return { ...prev, locations: newLocations };
    });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else setFormState('review');
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return !!data.organization;
      case 2: return !!data.serviceCategory;
      case 3: return data.locations.length > 0;
      case 4: return data.locations.every(l => l.roles.length > 0);
      case 5: return data.locations.every(l => l.roles.every(r => r.shift?.preset));
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
        <p className="text-slate-600 mb-6 font-medium">Our enterprise team will review your structured workforce requirement and get back to you shortly.</p>
        <button onClick={() => { setFormState('editing'); setStep(1); setData({ organization: 'Acme Logistics Corp (Demo)', serviceCategory: '', locations: [], duration: { type: '', startDate: '', endDate: '' }, requirements: '' }); }} className="text-blue-600 font-bold hover:underline">Start New Requirement</button>
      </div>
    );
  }

  if (formState === 'review') {
    return (
      <div className="bg-white border rounded-xl p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
        <h3 className="text-2xl font-bold mb-6">Review Workforce Requirement</h3>
        <CorporateWorkforceSummary data={data} roles={roles} locations={locations} />
        <div className="mt-8 flex gap-4">
          <button onClick={() => setFormState('editing')} className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 flex-1">Back to Edit</button>
          <button onClick={() => setFormState('submitted-demo')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex-[2]">Submit Requirement</button>
        </div>
      </div>
    );
  }

  return (
    <div id="requirement-builder" className="bg-white border rounded-xl shadow-sm p-6 md:p-8 max-w-3xl mx-auto" aria-live="polite">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Corporate Requirement Builder</h3>
          <p className="text-sm text-slate-500 font-semibold">{data.organization}</p>
        </div>
        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full" aria-label={`Step ${step} of ${totalSteps}`}>Step {step} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax={totalSteps}>
        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
      </div>

      <div className="min-h-[350px]">
        {step === 1 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Organization Context</h4>
            <label htmlFor="organization" className="sr-only">Organization Name</label>
            <input 
              id="organization"
              type="text" 
              value={data.organization} 
              onChange={(e) => handleUpdate('organization', e.target.value)}
              placeholder="Organization Name"
              className="w-full border border-slate-300 rounded-lg p-3 bg-white mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-slate-500">In a live system, this would be tied to your authenticated workspace.</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Workforce Solution Category</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
              {corporateServices.map(s => {
                const isSelected = data.serviceCategory === s.slug;
                return (
                  <button
                    key={s.slug}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleUpdate('serviceCategory', s.slug)}
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

        {step === 3 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Multi-Location Planning</h4>
            <p className="text-sm text-slate-600 mb-4">Select all operational sites that require workforce for this request.</p>
            
            <div className="flex gap-2 mb-6">
              <select 
                id="locationSelect"
                className="flex-1 border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    addLocation(e.target.value);
                    e.target.value = ""; // reset
                  }
                }}
              >
                <option value="">Add a location...</option>
                {locations.filter(loc => !data.locations.some(l => l.locationSlug === loc.slug)).map(loc => (
                  <option key={loc.slug} value={loc.slug}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {data.locations.length === 0 && (
                <p className="text-slate-500 italic p-4 border border-dashed rounded-lg text-center bg-slate-50">No locations added yet.</p>
              )}
              {data.locations.map(loc => {
                const locObj = locations.find(l => l.slug === loc.locationSlug);
                return (
                  <div key={loc.locationSlug} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm">
                    <span className="font-bold text-slate-900">{locObj?.name}</span>
                    <button onClick={() => removeLocation(loc.locationSlug)} className="text-red-500 font-bold hover:underline text-sm focus:ring-2 focus:ring-red-500 rounded px-2">Remove</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Roles & Quantities per Location</h4>
            {availableRoles.length === 0 ? (
              <p className="text-slate-500">No roles defined for this category.</p>
            ) : (
              <div className="space-y-8">
                {data.locations.map(loc => {
                  const locObj = locations.find(l => l.slug === loc.locationSlug);
                  return (
                    <div key={loc.locationSlug} className="border rounded-xl p-4 sm:p-6 bg-slate-50">
                      <h5 className="font-bold text-slate-900 mb-4 text-lg border-b pb-2">{locObj?.name}</h5>
                      <div className="space-y-3">
                        {availableRoles.map(r => {
                          const isSelected = loc.roles.some(dr => dr.roleSlug === r.slug);
                          const currentQty = loc.roles.find(dr => dr.roleSlug === r.slug)?.quantity || 1;
                          
                          return (
                            <div key={r.slug} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white transition-all ${isSelected ? 'border-blue-300 ring-1 ring-blue-100' : ''}`}>
                              <button
                                aria-pressed={isSelected}
                                onClick={() => toggleLocationRole(loc.locationSlug, r.slug)}
                                className="flex items-center gap-3 font-bold text-slate-900 focus:outline-none mb-3 sm:mb-0"
                              >
                                <div className={`w-6 h-6 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                                  {isSelected && <span aria-hidden="true" className="text-xs">✓</span>}
                                </div>
                                {r.name}
                              </button>
                              
                              {isSelected && (
                                <div className="flex items-center gap-3">
                                  <button onClick={() => changeRoleQuantity(loc.locationSlug, r.slug, -1)} aria-label="Decrease quantity" className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200">-</button>
                                  <span className="w-8 text-center font-bold">{currentQty}</span>
                                  <button onClick={() => changeRoleQuantity(loc.locationSlug, r.slug, 1)} aria-label="Increase quantity" className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200">+</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Shift Strategy</h4>
            <p className="text-sm text-slate-600 mb-6">Assign shift structures to your required roles across locations.</p>
            
            <div className="space-y-6">
              {data.locations.map(loc => {
                const locObj = locations.find(l => l.slug === loc.locationSlug);
                if (loc.roles.length === 0) return null;
                
                return (
                  <div key={loc.locationSlug} className="border rounded-xl p-4 sm:p-6 bg-white shadow-sm">
                    <h5 className="font-bold text-slate-900 mb-4">{locObj?.name}</h5>
                    <div className="space-y-4">
                      {loc.roles.map(r => {
                        const roleObj = roles.find(ro => ro.slug === r.roleSlug);
                        return (
                          <div key={r.roleSlug} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-slate-50 rounded-lg border">
                            <span className="font-semibold text-sm">{r.quantity}x {roleObj?.name}</span>
                            <select 
                              value={r.shift?.preset || ''}
                              onChange={(e) => changeRoleShift(loc.locationSlug, r.roleSlug, e.target.value)}
                              className="border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                              aria-label={`Shift for ${roleObj?.name} at ${locObj?.name}`}
                            >
                              <option value="Day Shift">Day Shift</option>
                              <option value="Night Shift">Night Shift</option>
                              <option value="Morning">Morning</option>
                              <option value="Evening">Evening</option>
                              <option value="Custom/Rotating">Custom/Rotating</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h4 className="text-lg font-bold mb-4">Duration & Recurrence</h4>
            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {['One-time', 'Temporary', 'Recurring', 'Ongoing'].map(d => {
                const isSelected = data.duration.type === d;
                return (
                  <button
                    key={d}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleDurationUpdate('type', d)}
                    className={`p-4 border rounded-lg text-center transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100' : 'text-slate-700 hover:border-blue-300'}`}
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
              onChange={(e) => handleUpdate('requirements', e.target.value)}
              placeholder="E.g., Safety compliances, onboarding structures, reporting managers..."
              className="w-full border border-slate-300 rounded-lg p-4 h-40 resize-none focus:ring-2 focus:ring-blue-500"
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
          {step === totalSteps ? 'Review Requirements' : 'Next'}
        </button>
      </div>
    </div>
  );
}
