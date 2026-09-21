import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase, MapPin, Clock, Users, Phone, MessageCircle,
  ChevronRight, Plus, CheckCircle2, AlertCircle, RefreshCw,
  Star, Loader2, ArrowLeft, Zap
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

const STATUS_CONFIG = {
  PENDING:     { label: 'Finding Workers',  color: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500' },
  ASSIGNED:    { label: 'Worker Assigned',  color: 'bg-blue-100 text-blue-800',     dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress',      color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  COMPLETED:   { label: 'Completed',        color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  CANCELLED:   { label: 'Cancelled',        color: 'bg-red-100 text-red-800',       dot: 'bg-red-500' },
};

const ASSIGN_STATUS = {
  PENDING_ACCEPTANCE: { label: 'Interested', color: 'bg-amber-100 text-amber-700' },
  ACCEPTED:           { label: 'Confirmed',  color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS:        { label: 'On the way', color: 'bg-purple-100 text-purple-700' },
  COMPLETED:          { label: 'Done',       color: 'bg-emerald-100 text-emerald-700' },
  REJECTED:           { label: 'Declined',   color: 'bg-red-100 text-red-700' },
};

const SKILL_LABELS = {
  ELECTRICIAN: '⚡ Electrician', PLUMBER: '🔧 Plumber', CARPENTER: '🪚 Carpenter',
  PAINTER: '🎨 Painter', CLEANER: '🧹 Cleaning', AC_REPAIR: '❄️ AC Repair',
  APPLIANCE_REPAIR: '🔨 Appliance Repair', SECURITY_GUARD: '🛡️ Security',
  LOADER: '📦 Loading/Unloading', GENERAL_HELPER: '🙋 General Helper',
  FURNITURE_MOVER: '🛋️ Furniture Moving', PACKER: '📫 Packer',
  HELPER: '🙋 Helper', HEAVY_LOADER: '🏋️ Heavy Loader', RIGGER: '⚙️ Rigger',
  LAST_MILE_DELIVERY: '🛵 Delivery', PAINTER: '🎨 Painter',
};

export default function UserPostedJobsPage() {
  const { user, token, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);
  const showSuccess = location.state?.success;

  useEffect(() => {
    if (!user || !token) {
      openAuthModal('CUSTOMER');
      return;
    }
    fetchGigs();
  }, [user, token]);

  const fetchGigs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/gig/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setGigs(data.data || data || []);
    } catch (err) {
      setError('Could not load your jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
        <Briefcase size={48} className="text-purple-300" />
        <p className="text-slate-600 font-semibold">Please log in to see your posted jobs.</p>
        <button
          onClick={() => openAuthModal('CUSTOMER')}
          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white pt-8 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-purple-200 text-sm mb-4 hover:text-white transition-colors">
            <ArrowLeft size={15} />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black mb-1">My Posted Jobs</h1>
              <p className="text-purple-200 text-sm">{gigs.length} job{gigs.length !== 1 ? 's' : ''} posted</p>
            </div>
            <Link
              to="/post-job"
              className="flex items-center gap-1.5 bg-white text-purple-700 font-bold text-sm px-4 py-2 rounded-xl shadow-md hover:bg-purple-50 transition-all"
            >
              <Plus size={15} />
              New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-16">
        {/* Success Banner */}
        {showSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 shadow-sm">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Job Posted Successfully!</p>
              <p className="text-xs text-emerald-600">Workers nearby have been notified and will respond soon.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-16 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm font-medium">Loading your jobs...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">{error}</p>
              <button onClick={fetchGigs} className="text-xs text-red-600 underline mt-1">Try again</button>
            </div>
          </div>
        )}

        {!loading && !error && gigs.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center">
              <Briefcase size={36} className="text-purple-300" />
            </div>
            <div>
              <p className="font-black text-slate-700 text-lg mb-1">No jobs posted yet</p>
              <p className="text-slate-500 text-sm">Post your first job and get skilled workers in minutes.</p>
            </div>
            <Link
              to="/post-job"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Zap size={16} />
              Post a Job
            </Link>
          </div>
        )}

        {/* Job Cards */}
        {!loading && gigs.map(gig => {
          const statusConf = STATUS_CONFIG[gig.status] || STATUS_CONFIG.PENDING;
          const isExpanded = expandedJob === gig.id;
          const label = SKILL_LABELS[gig.gigCategory] || gig.gigCategory;
          const pendingWorkers = (gig.assignments || []).filter(a => a.status !== 'REJECTED');

          return (
            <div key={gig.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
              {/* Job Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedJob(isExpanded ? null : gig.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-slate-900 text-sm">{label}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${statusConf.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                        {statusConf.label}
                      </span>
                      {gig.source === 'WEB' && (
                        <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                          Web Posted
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={11} />
                      <span className="truncate">{gig.locationAddress}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={11} />{gig.durationHours}h</span>
                      <span className="flex items-center gap-1"><Users size={11} />{gig.workersNeeded} worker{gig.workersNeeded > 1 ? 's' : ''}</span>
                      <span className="font-bold text-slate-600">#{gig.jobNumber}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-slate-900">₹{Math.round(gig.totalFare).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">{new Date(gig.createdAt).toLocaleDateString('en-IN')}</div>
                    <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${pendingWorkers.length > 0 ? 'text-purple-600' : 'text-slate-400'}`}>
                      <Users size={11} />
                      {pendingWorkers.length} interested
                    </div>
                  </div>
                </div>

                {/* Expand toggle */}
                <div className="flex items-center justify-end mt-2">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    {isExpanded ? 'Hide' : 'View'} Workers
                    <ChevronRight size={13} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </span>
                </div>
              </div>

              {/* Expanded Worker List */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50">
                  {pendingWorkers.length === 0 ? (
                    <div className="flex items-center gap-2 p-4 text-slate-500 text-sm">
                      <RefreshCw size={15} className="animate-spin" />
                      Looking for workers... This usually takes a few minutes.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {pendingWorkers.map(assignment => {
                        const worker = assignment.worker;
                        const workerUser = worker?.user;
                        const name = workerUser?.name || 'Worker';
                        const phone = workerUser?.phone;
                        const assignStatus = ASSIGN_STATUS[assignment.status] || ASSIGN_STATUS.PENDING_ACCEPTANCE;

                        return (
                          <div key={assignment.id} className="flex items-center gap-3 p-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {name[0]?.toUpperCase() || 'W'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-slate-900">{name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${assignStatus.color}`}>
                                  {assignStatus.label}
                                </span>
                              </div>
                              {worker?.skills && (
                                <div className="text-xs text-slate-500 mt-0.5">{worker.skills.slice(0, 2).join(', ')}</div>
                              )}
                              <div className="text-xs text-emerald-700 font-bold mt-0.5">
                                Payout: ₹{Math.round(assignment.payoutAmount).toLocaleString('en-IN')}
                              </div>
                            </div>

                            {/* Contact buttons */}
                            {phone && (
                              <div className="flex gap-2 shrink-0">
                                <a
                                  href={`tel:${phone}`}
                                  className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 hover:bg-emerald-200 transition-colors"
                                  title="Call"
                                >
                                  <Phone size={14} />
                                </a>
                                <a
                                  href={`https://wa.me/91${phone}?text=Hi, I posted a job on MetroMitra (${gig.jobNumber}) and wanted to connect.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                                  title="WhatsApp"
                                >
                                  <MessageCircle size={14} />
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Refresh button */}
        {!loading && gigs.length > 0 && (
          <button
            onClick={fetchGigs}
            className="flex items-center gap-2 mx-auto text-sm font-bold text-slate-500 hover:text-purple-600 transition-colors mt-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
