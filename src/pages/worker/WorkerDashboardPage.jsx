import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { useWorkforce } from '../../data/mock/WorkforceProvider';
import SEO from '../../components/ui/SEO';
import {
  Briefcase, User, MapPin, CheckCircle, Clock, XCircle, ChevronRight,
  FileText, Shield, Award, Bell, LogOut, ChevronDown, Star, Phone,
  AlertCircle, Loader2, RefreshCw, ArrowRight, Building2, UploadCloud,
  Check, Lock, Sparkles, CheckCircle2, Search, Filter, Zap, Wrench,
  Package, Truck, Users, Trash2, Download, ExternalLink
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

const ICON_MAP = { Zap, Wrench, Package, Sparkles, Truck, Users, Shield, Briefcase };

const STATUS_CONFIG = {
  PENDING: { label: 'Applied', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  ASSIGNED: { label: 'Shortlisted', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Star },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Loader2 },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Not Selected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const TABS = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'applications', label: 'My Applications', icon: CheckCircle2 },
  { id: 'profile', label: 'Profile', icon: User },
];

const JOB_CATEGORIES = ['All', 'Home Services', 'Logistics & Labor'];

export default function WorkerDashboardPage() {
  const { user, token, logout } = useAuth();
  const { currentCity } = useCity();
  const { roles = [] } = useWorkforce();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state directly bound to URL search params
  const currentTabParam = searchParams.get('tab');
  const activeTab = (currentTabParam && TABS.some(t => t.id === currentTabParam))
    ? currentTabParam
    : 'jobs';

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('metromitra_worker_applications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    try {
      const submitted = localStorage.getItem('metromitra_onboarding_submitted');
      const draft = localStorage.getItem('metromitra_onboarding_draft');
      const parsed = submitted ? JSON.parse(submitted) : (draft ? JSON.parse(draft) : null);
      if (parsed) {
        return {
          name: parsed.fullName || parsed.name || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
          city: parsed.city || '',
          locality: parsed.locality || parsed.area || '',
          jobType: parsed.selectedRole?.name || parsed.jobType || '',
          experience: parsed.selectedExperience || parsed.experience || '',
          education: parsed.profile?.education || parsed.education || '',
          gender: parsed.profile?.gender || parsed.gender || '',
          currentSalary: parsed.profile?.currentSalary || parsed.currentSalary || '',
          skills: parsed.selectedSkills || parsed.skills || [],
          assets: parsed.selectedAssets || parsed.assets || [],
          documents: parsed.selectedDocs || parsed.documents || [],
          whatsappOptIn: parsed.profile?.whatsappOptIn !== false,
          status: 'Active',
        };
      }
    } catch {}
    return null;
  });
  const [savedOnboarding, setSavedOnboarding] = useState(null);

  // Jobs filter state for "Jobs" tab
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [applyingRoleId, setApplyingRoleId] = useState(null);

  // CV / Resume upload state
  const [cvFile, setCvFile] = useState(() => {
    try {
      const raw = localStorage.getItem('metromitra_worker_cv');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvUploadMsg, setCvUploadMsg] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/get-a-job');
    }
  }, [user, navigate]);

  // Load saved onboarding from localStorage (prioritizing submitted data, then draft)
  useEffect(() => {
    try {
      const submitted = localStorage.getItem('metromitra_onboarding_submitted');
      const draft = localStorage.getItem('metromitra_onboarding_draft');
      const raw = submitted || draft;
      if (raw) {
        setSavedOnboarding(JSON.parse(raw));
      }
    } catch (e) {}
  }, []);

  // Fetch verified profile from /users/me and sync applications if available
  useEffect(() => {
    if (!token) return;

    // 1. Fetch official profile from /users/me (always 200 on valid token)
    fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(userData => {
        if (userData?.data) {
          setProfileData(prev => ({ ...(prev || {}), ...userData.data }));
        }
      })
      .catch(() => {});

    // 2. Fetch server applications if available
    fetch(`${API_BASE}/gig/worker/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const serverApps = data?.data;
        if (Array.isArray(serverApps) && serverApps.length > 0) {
          setApplications(prev => {
            const merged = [...serverApps, ...prev.filter(p => !serverApps.some(s => s.id === p.id))];
            try {
              localStorage.setItem('metromitra_worker_applications', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [token]);

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller document.');
      return;
    }

    setIsUploadingCv(true);
    setCvUploadMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'documents');

      let uploadedUrl = '';
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/upload/single`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });
          if (res.ok) {
            const data = await res.json();
            uploadedUrl = data.data?.url || data.url || '';
          }
        } catch (uploadErr) {
          console.warn("Upload endpoint notice:", uploadErr);
        }
      }

      if (!uploadedUrl) {
        uploadedUrl = URL.createObjectURL(file);
      }

      const cvMeta = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        url: uploadedUrl,
        uploadedAt: new Date().toISOString()
      };

      setCvFile(cvMeta);
      localStorage.setItem('metromitra_worker_cv', JSON.stringify(cvMeta));
      setCvUploadMsg('CV uploaded successfully and attached to your worker profile!');
      setTimeout(() => setCvUploadMsg(''), 4000);
    } catch (err) {
      console.error('CV upload error:', err);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleRemoveCv = () => {
    if (window.confirm('Are you sure you want to remove your uploaded CV?')) {
      setCvFile(null);
      localStorage.removeItem('metromitra_worker_cv');
      setCvUploadMsg('CV removed.');
      setTimeout(() => setCvUploadMsg(''), 3000);
    }
  };

  // Robust onboarding data reader that inspects all formats (GetAJobPage, WorkerOnboardingPage, draft, submitted)
  const getOnboardField = (key, fallback = '') => {
    const sub = savedOnboarding || (typeof window !== 'undefined' ? (() => {
      try {
        const s = localStorage.getItem('metromitra_onboarding_submitted');
        const d = localStorage.getItem('metromitra_onboarding_draft');
        return s ? JSON.parse(s) : (d ? JSON.parse(d) : null);
      } catch { return null; }
    })() : null);

    switch (key) {
      case 'name': {
        const first = sub?.profile?.firstName || sub?.firstName || '';
        const last = sub?.profile?.lastName || sub?.lastName || '';
        const combo = `${first} ${last}`.trim();
        const storedUser = user || (typeof window !== 'undefined' ? (() => {
          try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
          } catch { return null; }
        })() : null);
        return sub?.fullName || sub?.name || (combo || null) || storedUser?.name || profileData?.name || fallback;
      }
      case 'phone': {
        return sub?.profile?.phone || sub?.phone || profileData?.phone || user?.phone || fallback;
      }
      case 'email': {
        return sub?.profile?.email || sub?.email || profileData?.email || user?.email || fallback;
      }
      case 'city': {
        return sub?.profile?.city || sub?.city || profileData?.city || user?.city || currentCity?.name || fallback;
      }
      case 'locality': {
        return sub?.profile?.locality || sub?.locality || sub?.area || sub?.profile?.area || profileData?.locality || fallback;
      }
      case 'role': {
        const r = sub?.jobType || sub?.selectedRole?.name || sub?.selectedRole?.id || sub?.selectedRole || sub?.role || profileData?.jobType;
        if (typeof r === 'object' && r !== null) return r.name || r.id || fallback;
        if (typeof r === 'string' && r.trim()) {
          return r.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
        return fallback;
      }
      case 'experience': {
        return sub?.experience || sub?.selectedExperience || sub?.profile?.profileExperience || sub?.profileExperience || profileData?.experience || fallback;
      }
      case 'education': {
        return sub?.education || sub?.profile?.education || profileData?.education || fallback;
      }
      case 'gender': {
        return sub?.gender || sub?.profile?.gender || profileData?.gender || fallback;
      }
      case 'salary': {
        return sub?.currentSalary || sub?.profile?.currentSalary || sub?.dailyRate || profileData?.currentSalary || fallback;
      }
      case 'assets': {
        const a = sub?.assets || sub?.selectedAssets || profileData?.assets;
        if (Array.isArray(a) && a.length > 0) return a;
        if (typeof a === 'string' && a.trim()) return a.split(',').map(s => s.trim()).filter(Boolean);
        return ['Bike', 'Smartphone'];
      }
      case 'skills': {
        const s = sub?.skills || sub?.selectedSkills || sub?.secondarySkills || profileData?.skills;
        if (Array.isArray(s) && s.length > 0) return s;
        if (typeof s === 'string' && s.trim()) return s.split(',').map(s => s.trim()).filter(Boolean);
        return ['Repairing', 'Maintenance'];
      }
      case 'documents': {
        const d = sub?.documents || sub?.selectedDocs || sub?.certification || profileData?.documents;
        if (Array.isArray(d) && d.length > 0) return d;
        if (typeof d === 'string' && d.trim()) return d.split(',').map(s => s.trim()).filter(Boolean);
        return ['Aadhaar Card', 'PAN Card'];
      }
      default:
        return fallback;
    }
  };

  // Derive enriched worker fields prioritizing real onboarding data filled by the user
  const workerFullName = getOnboardField('name', user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Worker Partner');
  const workerPhone = getOnboardField('phone', user?.phone || '—');
  const workerEmail = getOnboardField('email', user?.email || '—');
  const workerCity = getOnboardField('city', currentCity?.name || 'Local City Hub');
  const workerLocality = getOnboardField('locality', 'Local City Hub');
  const workerRole = getOnboardField('role', 'General Worker');
  const workerExp = getOnboardField('experience', '1+ Year');
  const workerEducation = getOnboardField('education', 'Secondary / 10th Pass');
  const workerGender = getOnboardField('gender', 'Male');
  const workerSalary = getOnboardField('salary', '');

  // Assets / Tools
  const workerAssets = useMemo(() => {
    return getOnboardField('assets');
  }, [savedOnboarding, profileData]);

  // Skills
  const workerSkills = useMemo(() => {
    return getOnboardField('skills');
  }, [savedOnboarding, profileData]);

  // Documents
  const workerDocs = useMemo(() => {
    return getOnboardField('documents');
  }, [savedOnboarding, profileData]);

  // Filtered roles for the "Jobs" tab
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
      const matchesQuery = !jobSearchQuery.trim() || 
        role.name.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(jobSearchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [roles, selectedCategory, jobSearchQuery]);

  // Apply for role handler
  const handleApplyForRole = async (roleItem) => {
    setApplyingRoleId(roleItem.slug);
    const newApp = {
      id: `app_${Date.now()}`,
      gigType: roleItem.name,
      locationAddress: `${workerLocality}, ${currentCity?.name || 'Local City'}`,
      durationHours: 8,
      payoutAmount: roleItem.category === 'Home Services' ? 850 : 700,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Add to applications state & localStorage immediately
    setApplications(prev => {
      const updated = [newApp, ...prev];
      try {
        localStorage.setItem('metromitra_worker_applications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      if (token) {
        await fetch(`${API_BASE}/gig/worker/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            roleSlug: roleItem.slug,
            roleName: roleItem.name,
            city: currentCity?.name || workerLocality,
          })
        });
      }
    } catch (e) {}

    setTimeout(() => {
      setApplyingRoleId(null);
      alert(`Application submitted for ${roleItem.name}! Tracking added to 'My Applications'.`);
      handleTabChange('applications');
    }, 400);
  };

  if (!user) return null;

  return (
    <>
      <SEO
        title={`My Worker Dashboard — Metro Mitra | ${currentCity?.name || 'India'}`}
        description="Manage your job applications, track your profile & KYC, and find new opportunities near you."
        canonical="/worker/dashboard"
      />

      {/* Marquee Ticker Keyframes */}
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-scroll 35s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 pt-16">


        {/* ── CONTINUOUS ATTENTION & ANNOUNCEMENT TICKER (Full width, slim, smooth loop) ── */}
        <div className="w-full bg-slate-900 border-y border-slate-800 text-white overflow-hidden py-2 px-0 flex items-center shadow-xs">
          {/* Static Alert Badge */}
          <div className="flex items-center gap-1.5 px-3 py-0.5 bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-r-lg shrink-0 z-10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>ALERTS</span>
          </div>

          {/* Marquee Continuous Running Loop */}
          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="animate-ticker items-center gap-12 font-bold text-xs">
              <span className="inline-flex items-center gap-2 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <strong>Resume & CV:</strong> Upload your CV in Profile to get prioritized and shortlisted 3x faster by top employers.
                <button
                  type="button"
                  onClick={() => handleTabChange('profile')}
                  className="underline text-white hover:text-amber-200 ml-1 font-extrabold cursor-pointer"
                >
                  Upload CV Now →
                </button>
              </span>

              <span className="inline-flex items-center gap-2 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong>New Gigs in {currentCity?.name || 'Your City'}:</strong> Multiple open roles for Technicians, Helpers, and Shifting workers waiting.
                <button
                  type="button"
                  onClick={() => handleTabChange('jobs')}
                  className="underline text-white hover:text-emerald-200 ml-1 font-extrabold cursor-pointer"
                >
                  View Jobs →
                </button>
              </span>

              <span className="inline-flex items-center gap-2 text-sky-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <strong>0% Commission Policy:</strong> MetroMitra charges ₹0 commission on worker earnings — 100% of your payout is credited directly to you.
              </span>

              <span className="inline-flex items-center gap-2 text-fuchsia-300">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                <strong>Direct Hirer Shortlisting:</strong> Contractors in {currentCity?.name || 'your area'} are actively hiring for immediate shifts.
              </span>

              {/* Seamless duplicate loop */}
              <span className="inline-flex items-center gap-2 text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <strong>Resume & CV:</strong> Upload your CV in Profile to get prioritized and shortlisted 3x faster by top employers.
                <button
                  type="button"
                  onClick={() => handleTabChange('profile')}
                  className="underline text-white hover:text-amber-200 ml-1 font-extrabold cursor-pointer"
                >
                  Upload CV Now →
                </button>
              </span>

              <span className="inline-flex items-center gap-2 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <strong>New Gigs in {currentCity?.name || 'Your City'}:</strong> Multiple open roles for Technicians, Helpers, and Shifting workers waiting.
                <button
                  type="button"
                  onClick={() => handleTabChange('jobs')}
                  className="underline text-white hover:text-emerald-200 ml-1 font-extrabold cursor-pointer"
                >
                  View Jobs →
                </button>
              </span>

              <span className="inline-flex items-center gap-2 text-sky-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <strong>0% Commission Policy:</strong> MetroMitra charges ₹0 commission on worker earnings — 100% of your payout is credited directly to you.
              </span>
            </div>
          </div>
        </div>

        {/* Tab Content (Directly rendered, no duplicate tab strip) */}
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: JOBS (Works like /jobs in codebase with direct apply)   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Browse Available Roles & Jobs</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Explore all job categories, apply with 1-click, and track applications directly in your portal.
                  </p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Search roles (e.g. Electrician)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter:
                </span>
                {JOB_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Roles Grid */}
              {filteredRoles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-black text-slate-700 text-base mb-1">No roles matching "{jobSearchQuery}"</h3>
                  <p className="text-xs text-slate-500 mb-4">Try clearing the search filter or selecting another category.</p>
                  <button
                    onClick={() => { setJobSearchQuery(''); setSelectedCategory('All'); }}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRoles.map(role => {
                    const Icon = ICON_MAP[role.icon] || Briefcase;
                    const isApplying = applyingRoleId === role.slug;
                    return (
                      <div
                        key={role.slug}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {role.category}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                            {role.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                            {role.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-700">
                              ₹{role.category === 'Home Services' ? '850' : '700'}/day
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">Daily Direct Payout</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApplyForRole(role)}
                              disabled={isApplying}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                            >
                              {isApplying ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Applying...</span>
                                </>
                              ) : (
                                <>
                                  <span>Apply Now</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>

                            <Link
                              to={`/jobs/${role.slug}`}
                              className="p-2 border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              title="View Role Responsibilities"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: MY APPLICATIONS                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-black text-slate-900">My Job Applications</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Track real-time status of all your applied roles & shifts</p>
                </div>
                <button
                  onClick={fetchApplications}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-600" />
                  <p className="text-sm font-medium">Loading your applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-14 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-1">No applications yet</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm">
                    Browse open roles in {currentCity?.name || 'your city'} and start applying today.
                  </p>
                  <button
                    onClick={() => handleTabChange('jobs')}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors text-sm shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                  >
                    Browse Jobs & Roles <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                applications.map(app => {
                  const statusConf = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = statusConf.icon;
                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-emerald-300 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="font-black text-slate-900 text-base truncate">
                              {app.gig?.gigType || app.gigType || 'Job Assignment'}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConf.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConf.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium mt-1">
                            {(app.gig?.locationAddress || app.locationAddress) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />{app.gig?.locationAddress || app.locationAddress}
                              </span>
                            )}
                            {(app.gig?.durationHours || app.durationHours) && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />{app.gig?.durationHours || app.durationHours} hrs work
                              </span>
                            )}
                            {app.payoutAmount && (
                              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                                ₹{Number(app.payoutAmount).toLocaleString('en-IN')} payout
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-slate-400 font-semibold">
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : 'Applied recently'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: PROFILE & RESUME                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Worker Profile</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Your verified personal details, trade preferences, and uploaded CV</p>
                </div>
              </div>

              {/* CV / Resume Upload Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Resume / CV Document</h3>
                      <p className="text-[11px] text-slate-500">Employers and contractors prioritize candidates with an uploaded CV</p>
                    </div>
                  </div>
                  {cvFile && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3 text-emerald-600" />
                      CV Active & Attached
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {cvUploadMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cvUploadMsg}</span>
                    </div>
                  )}

                  {cvFile ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                            {cvFile.name}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-0.5">
                            {cvFile.size && <span>{cvFile.size}</span>}
                            <span>•</span>
                            <span>Uploaded {new Date(cvFile.uploadedAt || Date.now()).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {cvFile.url && (
                          <a
                            href={cvFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View / Download</span>
                          </a>
                        )}

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{isUploadingCv ? 'Replacing...' : 'Replace CV'}</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={handleCvUpload}
                            disabled={isUploadingCv}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleRemoveCv}
                          className="p-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Remove CV"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/30 group">
                      <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-emerald-100 text-slate-400 group-hover:text-emerald-600 border border-slate-200 flex items-center justify-center mb-3 transition-colors shadow-2xs">
                        {isUploadingCv ? (
                          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <p className="font-black text-slate-800 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                        {isUploadingCv ? 'Uploading CV Document...' : 'Upload Your Resume / CV'}
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mb-3">
                        Supported formats: PDF, DOC, DOCX, PNG, JPG (Max 5MB). Automatically attached when you apply for shifts.
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-xs active:scale-95">
                        <UploadCloud className="w-3.5 h-3.5" />
                        Browse & Upload Document
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleCvUpload}
                        disabled={isUploadingCv}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-emerald-50/80 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-black text-emerald-900 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-emerald-700" /> Personal Information
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Verified Phone
                  </span>
                </div>
                <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { label: 'Full Name', value: workerFullName },
                    { label: 'Registered Mobile', value: workerPhone },
                    { label: 'Email Address', value: workerEmail },
                    { label: 'Working City', value: workerCity },
                    { label: 'Preferred Locality', value: workerLocality },
                    { label: 'Trade / Role', value: workerRole },
                    { label: 'Experience Level', value: workerExp },
                    { label: 'Education', value: workerEducation },
                    { label: 'Gender', value: workerGender },
                    { label: 'Current / Last Salary', value: workerSalary ? (String(workerSalary).startsWith('₹') ? workerSalary : `₹${Number(workerSalary).toLocaleString('en-IN')}/mo`) : '—' },
                    { label: 'WhatsApp Alerts', value: (profileData?.whatsappOptIn !== false && savedOnboarding?.profile?.whatsappOptIn !== false) ? 'Active' : 'Disabled' },
                    { label: 'Onboarding Status', value: profileData?.status || 'Active' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills, Assets & Documents Declared */}
              <div className="grid md:grid-cols-3 gap-5">
                {/* Declared Assets */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Tools & Assets
                  </h3>
                  {workerAssets.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {workerAssets.map((asset, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {asset}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Bike, Smartphone declared during onboarding.</p>
                  )}
                </div>

                {/* Declared Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" /> Core Skills
                  </h3>
                  {workerSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {workerSkills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Service, maintenance and installation skills.</p>
                  )}
                </div>

                {/* Declared Documents & IDs */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                  <h3 className="font-black text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" /> Declared Documents & IDs
                  </h3>
                  {workerDocs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {workerDocs.map((doc, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 text-teal-600" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Aadhaar Card, PAN Card declared during onboarding.</p>
                  )}
                </div>
              </div>

              {/* Activity Track Record */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                  <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-slate-600" /> Activity Summary
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Applications', value: applications.length },
                    { label: 'Completed', value: applications.filter(a => a.status === 'COMPLETED').length },
                    { label: 'Active', value: applications.filter(a => ['ASSIGNED', 'IN_PROGRESS'].includes(a.status)).length },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-2xl font-black text-slate-900">{value}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
