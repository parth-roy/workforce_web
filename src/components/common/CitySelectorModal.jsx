import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, LocateFixed, Check } from 'lucide-react';
import { mockLocations } from '../../data/mock/locations';
import { useCity } from '../../context/CityContext';

export const TOP_CITIES = [
  { name: "Mumbai", slug: "mumbai", image: "/cities/mumbai.webp", state: "Maharashtra" },
  { name: "Delhi NCR", slug: "new-delhi", image: "/cities/delhi.webp", state: "Delhi" },
  { name: "Bengaluru", slug: "bengaluru", image: "/cities/bengaluru.webp", state: "Karnataka" },
  { name: "Hyderabad", slug: "hyderabad", image: "/cities/hyderabad.webp", state: "Telangana" },
  { name: "Chennai", slug: "chennai", image: "/cities/chennai-icon.webp", state: "Tamil Nadu" },
  { name: "Ahmedabad", slug: "ahmedabad", image: "/cities/ahmedabad.webp", state: "Gujarat" },
  { name: "Pune", slug: "pune", image: "/cities/pune.webp", state: "Maharashtra" },
  { name: "Surat", slug: "surat", image: "/cities/surat.webp", state: "Gujarat" },
  { name: "Jaipur", slug: "jaipur", image: "/cities/jaipur-icon.webp", state: "Rajasthan" },
  { name: "Kolkata", slug: "kolkata", image: "/cities/kolkata.webp", state: "West Bengal" },
  { name: "Lucknow", slug: "lucknow", image: "/cities/lucknow.webp", state: "Uttar Pradesh" },
  { name: "Coimbatore", slug: "coimbatore", image: "/cities/coimbatore-icon.webp", state: "Tamil Nadu" },
  { name: "Indore", slug: "indore", image: "/cities/indore.webp", state: "Madhya Pradesh" },
  { name: "Chandigarh", slug: "chandigarh", image: "/cities/chandigarh-icon.webp", state: "Punjab" },
  { name: "Kochi", slug: "kochi", image: "/cities/kochi-icon.webp", state: "Kerala" },
];

export function detectNearestCity(lat, lng) {
  let nearest = mockLocations[0];
  let minDistance = Infinity;

  mockLocations.forEach((loc) => {
    if (loc.latitude && loc.longitude) {
      const dLat = loc.latitude - lat;
      const dLng = loc.longitude - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = loc;
      }
    }
  });

  return nearest;
}

export default function CitySelectorModal({ isOpen, onClose, onCitySelect, currentCitySlug }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCity, setCity, detectLocation } = useCity();

  const activeSlug = currentCitySlug || currentCity?.slug || 'kolkata';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCitySelect = (citySlug, cityName) => {
    const locObj = mockLocations.find(l => l.slug === citySlug) || {
      slug: citySlug,
      name: cityName || citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      state: 'India'
    };
    
    // Update global CityContext
    setCity(locObj, true);

    if (onCitySelect) {
      onCitySelect(locObj);
      onClose();
      return;
    }

    // Smart route adaptation
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'jobs' && pathParts[1] === 'location') {
      navigate(`/jobs/location/${citySlug}`);
    } else if (pathParts[0] === 'services' && pathParts.length >= 2) {
      navigate(`/services/${pathParts[1]}/${citySlug}`);
    } else if (pathParts[0] === 'hire-workers' && pathParts.length >= 2) {
      navigate(`/hire-workers/${pathParts[1]}/${citySlug}`);
    } else if (pathParts[0] === 'jobs' && pathParts.length >= 2 && pathParts[1] !== 'location') {
      navigate(`/jobs/${pathParts[1]}/${citySlug}`);
    } else if (pathParts[0] === 'direct-contact') {
      const params = new URLSearchParams(location.search);
      params.set('city', citySlug);
      navigate(`/direct-contact?${params.toString()}`, { replace: true });
    } else if (pathParts[0] === 'join-as-worker' && location.search) {
      const params = new URLSearchParams(location.search);
      if (params.has('location')) {
        params.set('location', citySlug);
        navigate(`/join-as-worker?${params.toString()}`, { replace: true });
      }
    }
    onClose();
  };

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      const detected = await detectLocation(true);
      if (detected && detected.slug) {
        handleCitySelect(detected.slug, detected.name);
      }
    } catch (e) {
      console.warn('Auto-detect failed:', e);
    } finally {
      setIsDetecting(false);
    }
  };

  const filteredCities = mockLocations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200 z-10 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Choose your city</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Find verified local workers and home services in your area</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="overflow-y-auto p-5 sm:p-7 custom-scrollbar space-y-7">
          
          {/* Auto-detect button & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search your city or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white transition-all text-slate-800 text-sm placeholder:text-slate-400 font-medium"
                autoFocus
              />
            </div>
            <button
              onClick={handleAutoDetect}
              disabled={isDetecting}
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-50 border border-emerald-200/90 text-emerald-700 hover:bg-emerald-100/80 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0"
            >
              <LocateFixed size={16} className={isDetecting ? "animate-spin text-emerald-600" : "text-emerald-600"} />
              <span>{isDetecting ? "Detecting..." : "Auto Detect City"}</span>
            </button>
          </div>

          {/* Top Cities Grid (Only when not actively searching) */}
          {!searchQuery && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Cities</h3>
                <span className="text-xs font-semibold text-emerald-600">60+ Cities Available</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                {TOP_CITIES.map((city) => {
                  const isSelected = activeSlug === city.slug;
                  return (
                    <button
                      key={city.slug}
                      onClick={() => handleCitySelect(city.slug, city.name)}
                      className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all border ${
                        isSelected 
                          ? "bg-emerald-50/70 border-emerald-400 shadow-sm" 
                          : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50/80 hover:shadow-xs"
                      }`}
                    >
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-xs border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={city.image} 
                          alt={city.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                            <Check size={18} className="text-white drop-shadow-sm font-bold" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs font-bold truncate max-w-full ${
                        isSelected ? "text-emerald-700 font-extrabold" : "text-slate-700 group-hover:text-emerald-700"
                      }`}>
                        {city.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Cities List */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {searchQuery ? `Matching Cities (${filteredCities.length})` : "All Operational Locations"}
            </h3>
            {filteredCities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCities.map((city) => {
                  const isSelected = activeSlug === city.slug;
                  return (
                    <button
                      key={city.slug}
                      onClick={() => handleCitySelect(city.slug, city.name)}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all group ${
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
                          : "hover:bg-slate-50 text-slate-700 hover:text-emerald-700 border border-transparent"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-emerald-200/70 text-emerald-800" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                      }`}>
                        <img src="/google-maps-icon.webp" alt="City" width={16} height={16} className="w-4 h-4 object-contain" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-sm font-semibold truncate leading-tight">{city.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{city.state}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <img src="/google-maps-icon.webp" alt="Location" width={32} height={32} className="w-8 h-8 object-contain mx-auto mb-2 opacity-40 grayscale" />
                <p className="text-slate-600 font-semibold text-sm">No cities found matching "{searchQuery}"</p>
                <p className="text-slate-400 text-xs mt-1">Try searching by state name or choosing from the top cities list.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
