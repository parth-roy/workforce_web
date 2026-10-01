import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { Check, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import DynamicCitySelector from '../../components/common/DynamicCitySelector';
import GoogleLocalityInput from '../../components/common/GoogleLocalityInput';

const ROLES = [
  { id: 'electrician', name: 'Electrician', icon: '⚡', iconImg: '/electrician-icon.webp' },
  { id: 'plumber', name: 'Plumber', icon: '🔧', iconImg: '/plumber-icon.webp' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', iconImg: '/carpenter-icon.webp' },
  { id: 'painter', name: 'Painter', icon: '🎨', iconImg: '/painter-icon.webp' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹', iconImg: '/cleaning-icon.webp' },
  { id: 'ac_repair', name: 'AC Repair', icon: '❄️', iconImg: '/ac-repair-icon.webp' },
  { id: 'appliance_repair', name: 'Appliance Repair', icon: '🔨', iconImg: '/appliance-repair-icon.webp' },
  { id: 'security', name: 'Security Guard', icon: '🛡️', iconImg: '/security-icon.webp' },
  { id: 'loading', name: 'Loading/Unloading', icon: '📦', iconImg: '/loading-unloading-icon.webp', scale: 'scale-[1.75]' },
  { id: 'helper', name: 'General Helper', icon: '🙋', iconImg: '/general-helper-icon.webp' },
  { id: 'furniture', name: 'Furniture Moving', icon: '🛋️', iconImg: '/furniture-moving-icon.webp' },
  { id: 'packer', name: 'Packer', icon: '📫', iconImg: '/packer-icon.webp' },
  { id: 'telesales', name: 'Telesales', icon: '📞' },
  { id: 'warehouse', name: 'Warehouse / Logistics', icon: '🏭' },
  { id: 'driver', name: 'Driver / Delivery', icon: '🚗' },
  { id: 'technician', name: 'Technician', icon: '🛠️' }
];

const LEFT_DECORATIVE_ICONS = [
  { name: 'Electrician', icon: '/electrician-icon.webp' },
  { name: 'Plumber', icon: '/plumber-icon.webp' },
  { name: 'Cleaning', icon: '/cleaning-icon.webp' },
  { name: 'Loading', icon: '/loading-unloading-icon.webp', scale: 'scale-[1.85]' },
  { name: 'AC Repair', icon: '/ac-repair-icon.webp' },
];

const RIGHT_DECORATIVE_ICONS = [
  { name: 'Security', icon: '/security-icon.webp' },
  { name: 'Painter', icon: '/painter-icon.webp' },
  { name: 'Carpenter', icon: '/carpenter-icon.webp' },
  { name: 'Furniture Moving', icon: '/furniture-moving-icon.webp' },
  { name: 'General Helper', icon: '/general-helper-icon.webp' },
];

const EXPERIENCE_LEVELS = [
  'Fresher', '1-6 months', '1 year', '2 years', '3 years', '4 years', '5+ years'
];

const COMMON_ASSETS = ['Bike', 'Smartphone', 'Laptop/Desktop', 'None of these'];

const HOME_SERVICE_ROLES = ['electrician', 'plumber', 'carpenter', 'painter', 'ac_repair', 'appliance_repair'];

const HOME_SERVICE_DOCS = [
  'ITI', 'PAN Card', 'Aadhar Card', '2-Wheeler Driving Licence', 
  '3-Wheeler Driving Licence', '4-Wheeler Driving Licence', 'Bank Account', 'None of these'
];

const SKILL_MAP = {
  electrician: ['Repairing', 'Servicing', 'Installation', 'None of these'],
  plumber: ['Pipe Fitting', 'Leak Repair', 'Bathroom Installation', 'None of these'],
  warehouse: ['Order Picking & Packing', 'Order Processing', 'Stock Taking and Maintaining', 'Loading & Unloading', 'Scanning & Sorting', 'Forklift Operation', 'None of these'],
  telesales: ['Computer Knowledge', 'Domestic Calling', 'International Calling', 'Lead Generation', 'MS Excel', 'Outbound/Cold Calling', 'Convincing Skills', 'Communication Skill', 'None of these'],
  default: ['Customer Service', 'Time Management', 'Physical Stamina', 'None of these']
};

const formatCapitalize = (val) => {
  if (!val) return '';
  return val.replace(/\b([a-zA-Z])([a-zA-Z]*)/g, (_, first, rest) => {
    return first.toUpperCase() + rest.toLowerCase();
  });
};

const DRAFT_KEY = 'metromitra_onboarding_draft';

const loadDraft = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY) || localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function GetAJobPage() {
  const navigate = useNavigate();
  const { user, role, openAuthModal } = useAuth();
  const { currentCity, cities } = useCity();

  // The onboarding form only unlocks AFTER worker mobile number authorization is completed
  const [isWorkerVerified, setIsWorkerVerified] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const storedUser = localStorage.getItem('user');
      const u = user || (storedUser ? JSON.parse(storedUser) : null);
      const r = role || localStorage.getItem('role') || u?.role;
      const session = sessionStorage.getItem('metromitra_worker_session_verified');
      return Boolean(u && (r === 'WORKER' || session === 'true'));
    } catch {
      return false;
    }
  });

  const savedDraft = loadDraft();

  const [step, setStep] = useState(() => {
    if (savedDraft?.step && savedDraft.step >= 1 && savedDraft.step <= 6) {
      return savedDraft.step;
    }
    return 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State restored from draft across reloads
  const [selectedRole, setSelectedRole] = useState(() => savedDraft?.selectedRole || null);
  const [selectedExperience, setSelectedExperience] = useState(() => savedDraft?.selectedExperience || '');
  
  const [selectedAssets, setSelectedAssets] = useState(() => savedDraft?.selectedAssets || []);
  const [selectedDocs, setSelectedDocs] = useState(() => savedDraft?.selectedDocs || []);
  const [selectedSkills, setSelectedSkills] = useState(() => savedDraft?.selectedSkills || []);

  const [profile, setProfile] = useState(() => ({
    firstName: savedDraft?.profile?.firstName || '',
    lastName: savedDraft?.profile?.lastName || '',
    gender: savedDraft?.profile?.gender || '',
    education: savedDraft?.profile?.education || '',
    profileExperience: savedDraft?.profile?.profileExperience || '',
    currentSalary: savedDraft?.profile?.currentSalary || '',
    city: savedDraft?.profile?.city || currentCity?.name || '',
    locality: savedDraft?.profile?.locality || '',
    phone: savedDraft?.profile?.phone || user?.phone || '',
    whatsappOptIn: savedDraft?.profile?.whatsappOptIn ?? true
  }));

  // Auto-save onboarding progress so page refresh never loses progress
  useEffect(() => {
    if (typeof window !== 'undefined' && step < 6) {
      const dataToSave = {
        step,
        selectedRole,
        selectedExperience,
        selectedAssets,
        selectedDocs,
        selectedSkills,
        profile,
        lastUpdated: new Date().toISOString()
      };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
    }
  }, [step, selectedRole, selectedExperience, selectedAssets, selectedDocs, selectedSkills, profile]);

  // If user is already an active/onboarded worker in DB, route straight to dashboard
  useEffect(() => {
    const isAlreadyWorker = (user && (role === 'WORKER' || user?.role === 'WORKER' || user?.profileComplete)) ||
      (typeof window !== 'undefined' && localStorage.getItem('role') === 'WORKER');

    if (isAlreadyWorker) {
      navigate('/worker/dashboard', { replace: true });
      return;
    }

    // Check backend to see if this phone number already completed onboarding lead in PostgreSQL
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (user && token) {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';
      fetch(`${API_BASE}/form-gig-leads/my-lead`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(resData => {
          if (resData?.data?.id && (resData.data.name || resData.data.jobType)) {
            // Already onboarded in DB!
            navigate('/worker/dashboard', { replace: true });
          }
        })
        .catch(() => {});
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const handleVerified = (e) => {
      setIsWorkerVerified(true);
      if (e?.detail?.phone) {
        setProfile(prev => ({ ...prev, phone: e.detail.phone }));
      }
      // If the verified user is ALREADY an existing worker in DB, redirect to dashboard immediately!
      if (e?.detail?.role === 'WORKER' || e?.detail?.profileComplete) {
        navigate('/worker/dashboard', { replace: true });
      }
    };
    window.addEventListener('metromitra:worker_verified', handleVerified);
    return () => window.removeEventListener('metromitra:worker_verified', handleVerified);
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      setIsWorkerVerified(false);
      hasAutoOpenedModal.current = false;
    } else {
      const session = typeof window !== 'undefined' ? sessionStorage.getItem('metromitra_worker_session_verified') : null;
      if (role === 'WORKER' || user?.role === 'WORKER' || session === 'true') {
        setIsWorkerVerified(true);
      }
    }
  }, [role, user]);

  const hasAutoOpenedModal = useRef(false);

  useEffect(() => {
    if (user && user.phone && !profile.phone) {
      setProfile(prev => ({ ...prev, phone: user.phone }));
    }
  }, [user]);

  useEffect(() => {
    if (currentCity?.name && !profile.city) {
      setProfile(prev => ({ ...prev, city: currentCity.name }));
    }
  }, [currentCity]);

  useEffect(() => {
    if (!profile.profileExperience && selectedExperience) {
      if (selectedExperience === 'Fresher') {
        setProfile(prev => ({ ...prev, profileExperience: 'Fresher' }));
      } else {
        setProfile(prev => ({ ...prev, profileExperience: 'I have experience' }));
      }
    }
  }, [selectedExperience]);

  // When visiting /get-a-job: if worker mobile authorization is not done yet,
  // automatically pop up the login modal on top of the background card once.
  // If user closes via (X), modal stays closed and background card remains visible.
  useEffect(() => {
    if (!isWorkerVerified && !hasAutoOpenedModal.current && openAuthModal) {
      hasAutoOpenedModal.current = true;
      openAuthModal('WORKER');
    }
  }, [isWorkerVerified, openAuthModal]);


  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const toggleArrayItem = (array, setArray, item) => {
    if (item === 'None of these') {
      setArray(['None of these']);
      return;
    }
    
    if (array.includes('None of these')) {
      setArray([item]);
      return;
    }

    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const getRoleSkills = () => {
    if (!selectedRole) return SKILL_MAP.default;
    return SKILL_MAP[selectedRole.id] || SKILL_MAP.default;
  };

  const isHomeService = selectedRole && HOME_SERVICE_ROLES.includes(selectedRole.id);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('phone', profile.phone);
      formData.append('jobType', selectedRole?.name || '');
      formData.append('experience', selectedExperience);
      formData.append('assets', selectedAssets.join(','));
      formData.append('documents', selectedDocs.join(','));
      formData.append('skills', selectedSkills.join(','));
      formData.append('gender', profile.gender);
      formData.append('education', profile.education);
      formData.append('currentSalary', profile.currentSalary);
      formData.append('city', profile.city);
      formData.append('area', profile.locality);
      formData.append('whatsappOptIn', profile.whatsappOptIn);
      formData.append('sourcePlatform', 'WORKFORCE_WEB');
      formData.append('sourceUrl', window.location.href);

      const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_BASE}/form-gig-leads`, {
        method: 'POST',
        headers,
        body: formData
      });
      const resJson = await res.json().catch(() => null);

      // Google Sheets append is handled server-side via appendToSheet() after createLead()
      // No browser-side webhook call needed (Apps Script expects JSON, not FormData)

      // Persist complete submitted onboarding state
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      const completedData = {
        name: fullName,
        fullName: fullName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email || '',
        city: profile.city,
        locality: profile.locality,
        area: profile.locality,
        jobType: selectedRole?.name || selectedRole?.id || '',
        experience: selectedExperience || profile.profileExperience || '',
        education: profile.education || '',
        gender: profile.gender || '',
        currentSalary: profile.currentSalary || '',
        skills: selectedSkills || [],
        assets: selectedAssets || [],
        documents: selectedDocs || [],
        selectedRole,
        selectedExperience,
        selectedAssets,
        selectedDocs,
        selectedSkills,
        profile: {
          ...profile,
          name: fullName,
          fullName: fullName,
        },
        leadId: resJson?.data?.id,
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem('metromitra_onboarding_submitted', JSON.stringify(completedData));

      // Synchronize local user session with worker role & full name
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        try {
          const parsedUser = JSON.parse(rawUser);
          const updatedUser = {
            ...parsedUser,
            name: fullName || parsedUser.name,
            firstName: profile.firstName || parsedUser.firstName,
            lastName: profile.lastName || parsedUser.lastName,
            email: profile.email || parsedUser.email,
            phone: profile.phone || parsedUser.phone,
            role: 'WORKER',
            city: profile.city || parsedUser.city,
            locality: profile.locality || parsedUser.locality,
            profileComplete: true,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('role', 'WORKER');
          window.dispatchEvent(new Event('storage'));
        } catch (e) {}
      }

      // Persist name and profileComplete to database if authenticated
      if (token && fullName) {
        fetch(`${API_BASE}/users/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: fullName,
            profileComplete: true,
            whatsappOptIn: profile.whatsappOptIn,
          })
        }).catch(() => {});
      }

      sessionStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_KEY);
      setStep(6);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isWorkerVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center px-4 pt-28 pb-16 relative overflow-hidden">

        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-100 rounded-full opacity-40 blur-3xl" />
        </div>

        {/* Card — matches reference image layout */}
        <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex items-stretch">

            {/* Left decorative worker icon strip */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-3.5 bg-gradient-to-b from-emerald-600 to-teal-700 px-4 py-8 flex-shrink-0">
              {LEFT_DECORATIVE_ICONS.map((item, i) => (
                <div
                  key={item.name}
                  className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 transition-transform hover:scale-110 overflow-hidden"
                  style={{ transform: `translateX(${i % 2 === 0 ? 0 : 4}px)` }}
                  title={item.name}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`w-full h-full object-contain filter drop-shadow-xs transition-transform ${item.scale || ''}`}
                  />
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 px-8 py-10 flex flex-col items-center text-center justify-center">
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                MetroMitra — Daily Gig Jobs
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-3">
                Find local jobs with<br />
                <span className="text-emerald-600">better salary!</span>
              </h1>

              <div className="flex flex-wrap gap-3 justify-center my-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">✅ 0% Commission</span>
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">📍 Jobs near you</span>
                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">💰 Daily pay</span>
              </div>

              {/* CTA Button — solid emerald, no glow, no dot */}
              <button
                onClick={() => openAuthModal && openAuthModal('WORKER')}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base px-10 py-3.5 rounded-2xl transition-colors cursor-pointer shadow-md"
              >
                Login to Continue
              </button>

              <p className="mt-4 text-xs text-slate-400">
                New here? We'll create your account automatically.
              </p>
            </div>

            {/* Right decorative worker icon strip */}
            <div className="hidden sm:flex flex-col items-center justify-center gap-3.5 bg-gradient-to-b from-teal-700 to-emerald-600 px-4 py-8 flex-shrink-0">
              {RIGHT_DECORATIVE_ICONS.map((item, i) => (
                <div
                  key={item.name}
                  className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 transition-transform hover:scale-110 overflow-hidden"
                  style={{ transform: `translateX(${i % 2 === 0 ? 0 : -4}px)` }}
                  title={item.name}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`w-full h-full object-contain filter drop-shadow-xs transition-transform ${item.scale || ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust line below card */}
        <p className="relative z-10 mt-6 text-xs text-slate-400 font-medium text-center">
          Trusted by <span className="font-bold text-slate-600">40,000+</span> workers across West Bengal
        </p>
      </div>
    );
  }


  const renderProgress = () => {
    return (
      <div className="w-full bg-slate-100 h-2.5 mb-8 rounded-full overflow-hidden border border-slate-200">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
        
        {step < 6 && renderProgress()}

        <div className="transition-all duration-300">
          {/* Step 1: Role */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Role</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {ROLES.map(role => (
                  <div 
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all ${
                      selectedRole?.id === role.id 
                        ? 'border-emerald-500 bg-emerald-50 relative' 
                        : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    {selectedRole?.id === role.id && (
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="h-10 flex items-center justify-center mb-2 overflow-hidden">
                      {role.iconImg ? (
                        <img 
                          src={role.iconImg} 
                          alt={role.name} 
                          className={`w-9 h-9 object-contain transition-transform ${role.scale || ''}`} 
                        />
                      ) : (
                        <span className="text-3xl">{role.icon}</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{role.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              {selectedRole && (
                <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  {selectedRole.iconImg ? (
                    <img 
                      src={selectedRole.iconImg} 
                      alt={selectedRole.name} 
                      className={`w-10 h-10 object-contain ${selectedRole.scale || ''}`} 
                    />
                  ) : (
                    <span className="text-3xl">{selectedRole.icon}</span>
                  )}
                  <span className="font-bold text-emerald-900 text-lg">{selectedRole.name}</span>
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What is your work experience?</h2>
              <div className="flex flex-wrap gap-3">
                {EXPERIENCE_LEVELS.map(exp => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExperience(exp)}
                    className={`px-5 py-3 rounded-full text-sm font-medium border-2 transition-all ${
                      selectedExperience === exp 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Skills & Assets */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Which of these do you have?</h3>
                <div className="flex flex-wrap gap-3">
                  {COMMON_ASSETS.map(asset => (
                    <button
                      key={asset}
                      onClick={() => toggleArrayItem(selectedAssets, setSelectedAssets, asset)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                        selectedAssets.includes(asset)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                      }`}
                    >
                      {selectedAssets.includes(asset) && <Check className="w-4 h-4" />}
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              {isHomeService && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Which of these IDs/documents do you have?</h3>
                  <div className="flex flex-wrap gap-3">
                    {HOME_SERVICE_DOCS.map(doc => (
                      <button
                        key={doc}
                        onClick={() => toggleArrayItem(selectedDocs, setSelectedDocs, doc)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                          selectedDocs.includes(doc)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                        }`}
                      >
                        {selectedDocs.includes(doc) && <Check className="w-4 h-4" />}
                        {doc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Which of these do you know?</h3>
                <div className="flex flex-wrap gap-3">
                  {getRoleSkills().map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleArrayItem(selectedSkills, setSelectedSkills, skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                        selectedSkills.includes(skill)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                      }`}
                    >
                      {selectedSkills.includes(skill) && <Check className="w-4 h-4" />}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Profile */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Build Your Profile</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={profile.firstName}
                    onChange={e => setProfile(prev => ({ ...prev, firstName: formatCapitalize(e.target.value) }))}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border capitalize text-sm text-slate-800"
                    placeholder="Enter first name"
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={profile.lastName}
                    onChange={e => setProfile(prev => ({ ...prev, lastName: formatCapitalize(e.target.value) }))}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border capitalize text-sm text-slate-800"
                    placeholder="Enter last name"
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setProfile({...profile, gender: g})}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        profile.gender === g
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                <div className="flex flex-wrap gap-3">
                  {['No Schooling', '10th Pass', '12th Pass', 'Graduate', 'Post-Graduate'].map(edu => (
                    <button
                      key={edu}
                      onClick={() => setProfile({...profile, education: edu})}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        profile.education === edu
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                      }`}
                    >
                      {edu}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                <div className="flex flex-wrap gap-3">
                  {['Fresher', 'I have experience', '1+ year'].map(exp => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => {
                        if (exp === 'Fresher') {
                          setProfile(prev => ({ ...prev, profileExperience: exp, currentSalary: '' }));
                        } else {
                          setProfile(prev => ({ ...prev, profileExperience: exp }));
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
                        profile.profileExperience === exp
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs' 
                          : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Current/Last Salary box with smooth polished animation */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  profile.profileExperience && profile.profileExperience !== 'Fresher'
                    ? 'max-h-44 opacity-100 translate-y-0 mt-4'
                    : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none mt-0'
                }`}
              >
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-slate-800">
                      Current/Last Salary per month
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">Monthly in-hand</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-sm">₹</span>
                    <input 
                      type="number" 
                      min="0"
                      value={profile.currentSalary}
                      onChange={e => setProfile(prev => ({ ...prev, currentSalary: e.target.value }))}
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-800 text-sm font-medium transition-all"
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Step 5: Contact & Location */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Contact & Work Location</h2>
                <p className="text-sm text-slate-500">
                  Select your preferred city and local area to receive verified job offers and direct interview calls.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Phone Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    value={profile.phone}
                    onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border-slate-300 rounded-xl shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 p-2.5 border text-sm font-medium text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="10-digit mobile number"
                    disabled={!!(user && user.phone)}
                  />
                </div>
                {user && user.phone && (
                  <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified mobile number linked to your account.
                  </p>
                )}
              </div>

              {/* Dynamic City Selector with Top Metro Hubs and Live Search */}
              <DynamicCitySelector
                value={profile.city}
                onChange={(newCity) => {
                  setProfile(prev => ({
                    ...prev,
                    city: newCity,
                    // Auto-clear locality when city changes to prevent mismatched localities across cities
                    locality: prev.city !== newCity ? '' : prev.locality
                  }));
                }}
              />

              {/* Dynamic Locality / Area with Google Maps Places Autocomplete & Session Token */}
              <GoogleLocalityInput
                selectedCity={profile.city}
                value={profile.locality}
                onChange={(loc) => setProfile(prev => ({ ...prev, locality: loc }))}
                onLocalitySelect={(locData) => {
                  setProfile(prev => ({
                    ...prev,
                    locality: locData.name || locData.formattedAddress || ''
                  }));
                }}
              />

              <div className="flex items-start mt-4 p-3 bg-emerald-50/50 border border-emerald-100/80 rounded-xl">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="whatsapp"
                    type="checkbox"
                    checked={profile.whatsappOptIn}
                    onChange={e => setProfile(prev => ({ ...prev, whatsappOptIn: e.target.checked }))}
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="whatsapp" className="font-semibold text-slate-800 cursor-pointer">
                    Get updates on WhatsApp
                  </label>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Receive direct interview calls, salary offers, and local job alerts instantly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="text-center animate-in zoom-in duration-500 py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Submitted! 🎉</h2>
              <p className="text-lg text-gray-600 mb-8">
                We'll match you with jobs in {profile.city || 'your city'} soon.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Browse Jobs Near You
                </button>
                <button
                  onClick={() => navigate('/worker/dashboard')}
                  className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                >
                  View My Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 6 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                step === 1 
                  ? 'text-gray-400 cursor-not-allowed opacity-50' 
                  : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !selectedRole) ||
                  (step === 2 && !selectedExperience)
                }
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-colors ${
                  ((step === 1 && !selectedRole) || (step === 2 && !selectedExperience))
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !profile.firstName || !profile.phone || !profile.city}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-medium text-white transition-colors ${
                  isSubmitting || !profile.firstName || !profile.phone || !profile.city
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                {!isSubmitting && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
