import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '../../components/ui/SEO';
import { WorkerOnboardingSEO } from '../../seo/pageMetadata';
import { mockRoles } from '../../data/mock/roles';
import LocationPicker from '../../components/shared/LocationPicker';
import { User, FileText, MapPin, Truck, CheckCircle2, Briefcase, ShieldCheck } from 'lucide-react';

export default function WorkerOnboardingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobType: '',
    city: '',
    area: '',
    vehicleType: '',
    vehicleMake: '',
    aadharNumber: '',
    panNumber: '',
    dlNumber: '',
    rcNumber: '',
    insuranceDetails: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && mockRoles.some(r => r.slug === roleParam)) {
      setFormData(prev => ({ ...prev, jobType: roleParam }));
    }
  }, [location.search]);

  const handleInput = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isDriverRole = ['delivery-associate', 'driver'].includes(formData.jobType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Live Submission
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      });
      const apiUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/form-gig-leads' : 'https://api.gomytruck.com/api/v1/form-gig-leads';
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: payload
      });
      if (response.ok) {
        setSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting application. Check your connection.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16 flex items-center justify-center px-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Application Submitted!</h2>
          <p className="text-slate-600 mb-8">
            Thank you for applying to join Metro Mitra. Our verification team will review your details and contact you shortly at <strong>{formData.phone}</strong>.
          </p>
          <button onClick={() => navigate('/jobs')} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors w-full">
            Browse Jobs Meanwhile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...WorkerOnboardingSEO()} />
      <div className="bg-slate-900 text-white pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Worker Onboarding</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Join Metro Mitra Network</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Complete your profile below to start accepting gig jobs across West Bengal.
          </p>
        </div>
      </div>
      
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 mb-8 text-emerald-800">
          <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Secure Onboarding:</strong> Your documents are encrypted and securely verified. Aadhar and PAN are mandatory for payment processing. Vehicle documents are only required if you are applying for driving roles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Job Type */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Job Profile</h2>
                <p className="text-sm text-slate-500">Select the primary gig role you are applying for</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type (Required)</label>
              <select 
                name="jobType" 
                value={formData.jobType} 
                onChange={handleInput}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select Job Type --</option>
                {mockRoles.map(r => (
                  <option key={r.slug} value={r.slug}>{r.name} - {r.category}</option>
                ))}
              </select>
            </div>
          </section>

          {/* 2. Personal Info */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">Your basic contact details</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name (Required)</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Rahul" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name (Required)</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Sharma" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. rahul@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number (Required)</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="+91 9876543210" />
              </div>
            </div>
          </section>

          {/* 3. Location */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Work Location</h2>
                <p className="text-sm text-slate-500">Where you prefer to take jobs</p>
              </div>
            </div>
            <div className="w-full">
              <LocationPicker 
                onLocationChange={(loc) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    city: loc.district || loc.state || '', 
                    area: loc.address || loc.street || loc.pincode || '',
                    givenAddress: loc.address || '',
                    givenStreet: loc.street || '',
                    givenDistrict: loc.district || '',
                    givenState: loc.state || '',
                    givenPincode: loc.pincode || '',
                    givenLat: loc.lat || '',
                    givenLng: loc.lng || ''
                  }));
                }} 
              />
              {formData.city && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">Selected Location:</p>
                    <p className="text-sm text-emerald-700">{formData.area}, {formData.city}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 4. Vehicle Details (Optional) */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Vehicle Details</h2>
                  <p className="text-sm text-slate-500">Required only for drivers & riders</p>
                </div>
              </div>
              {!isDriverRole && <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">Optional</span>}
              {isDriverRole && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Required</span>}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleInput} required={isDriverRole} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">-- Select --</option>
                  <option value="bike">Two Wheeler / Bike</option>
                  <option value="toto">Toto / E-Rickshaw</option>
                  <option value="pickup">Pickup Truck / Tata Ace</option>
                  <option value="none">No Vehicle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Number / Make</label>
                <input type="text" name="vehicleMake" value={formData.vehicleMake} onChange={handleInput} required={isDriverRole && formData.vehicleType !== 'none'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. WB-00-XXXX" />
              </div>
            </div>
          </section>

          {/* 5. Documents */}
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verification Documents</h2>
                <p className="text-sm text-slate-500">Identity and background checks</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Aadhaar Card (Required)</label>
                <input required type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Aadhaar Number (XXXX XXXX XXXX)" />
                <div className="flex gap-2">
                  <input required type="file" name="aadharFront" onChange={handleInput} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">PAN Card (Required)</label>
                <input required type="text" name="panNumber" value={formData.panNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="PAN Number (XXXXX0000X)" />
                <input required type="file" name="panFront" onChange={handleInput} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-6 mt-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Driving License
                  {isDriverRole ? <span className="text-red-500">*</span> : <span className="text-slate-400 text-xs font-normal">(Optional)</span>}
                </label>
                <input required={isDriverRole} type="text" name="dlNumber" value={formData.dlNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="DL Number" />
                <input required={isDriverRole} type="file" name="dlFront" onChange={handleInput} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  Vehicle RC
                  {isDriverRole ? <span className="text-red-500">*</span> : <span className="text-slate-400 text-xs font-normal">(Optional)</span>}
                </label>
                <input required={isDriverRole} type="text" name="rcNumber" value={formData.rcNumber} onChange={handleInput} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="RC Number" />
                <input required={isDriverRole} type="file" name="rcBook" onChange={handleInput} accept="image/*,.pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
            </div>
          </section>

          <button type="submit" className="w-full bg-emerald-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
            Submit Application
          </button>
        </form>
      </main>
    </>
  );
}
