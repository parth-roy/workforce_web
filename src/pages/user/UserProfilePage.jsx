import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUCCart } from '../../context/UCCartContext';
import { User, Phone, Mail, Package, LogOut, FileText } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function UserProfilePage() {
  const { user, role, logout } = useAuth();
  const { clearAllData } = useUCCart();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    if (clearAllData) clearAllData();
    logout();
  };

  // If not logged in, redirect to home
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">My Account</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <User size={18} />
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'bookings' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <Package size={18} />
              My Bookings
            </button>
            {role === 'WORKER' && (
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'documents' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                <FileText size={18} />
                Documents
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-white text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-black border-4 border-emerald-50">
                      {user.firstName?.[0] || user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{user.firstName || user.name || 'User'} {user.lastName || ''}</h3>
                      <p className="text-emerald-600 font-bold bg-emerald-50 inline-block px-3 py-1 rounded-full text-sm mt-2">{role}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Mobile Number</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium border border-slate-200">
                        <Phone size={18} className="text-slate-400" />
                        +91 {user.phone}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2">Email Address</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium border border-slate-200">
                        <Mail size={18} className="text-slate-400" />
                        {user.email || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-500 mb-2">Saved Address</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium border border-slate-200">
                        <img src="/google-maps-icon.webp" alt="Address" width={18} height={18} className="w-[18px] h-[18px] object-contain" />
                        {user.address || 'No address saved yet'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Booking History</h2>
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">No bookings yet</h3>
                    <p className="text-slate-500 mt-2">When you book a service, it will appear here.</p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && role === 'WORKER' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">My Documents</h2>
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-700">Documents Under Review</h3>
                    <p className="text-slate-500 mt-2">We are currently verifying your submitted documents.</p>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
