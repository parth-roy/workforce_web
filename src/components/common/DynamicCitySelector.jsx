import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Building2, Search, Check, ChevronDown, X, Loader2, Sparkles, MapPin } from 'lucide-react';
import { mockLocations } from '../../data/mock/locations';
import { SEO_CITIES } from '../../data/cities';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

// Top popular Indian hub cities
export const POPULAR_CITIES = [
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Bengaluru', state: 'Karnataka' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi NCR', state: 'Delhi' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Patna', state: 'Bihar' },
  { name: 'Bhubaneswar', state: 'Odisha' },
];

// Unified static list of 550+ Indian cities for instant zero-cost search
const ALL_INDIAN_CITIES = (() => {
  const map = new Map();
  // Add SEO_CITIES first
  SEO_CITIES.forEach((c) => {
    if (c.name) {
      map.set(c.name.toLowerCase(), {
        name: c.name,
        state: c.state || 'India',
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  });
  // Add mockLocations
  mockLocations.forEach((m) => {
    if (m.name && !map.has(m.name.toLowerCase())) {
      map.set(m.name.toLowerCase(), {
        name: m.name,
        state: m.state || 'India',
        slug: m.slug || m.name.toLowerCase().replace(/\s+/g, '-'),
      });
    }
  });
  return Array.from(map.values());
})();

const citySearchCache = new Map();

/**
 * Clean Single Input Box with Searchable Dropdown for Cities
 * - Only an input box rendered on page
 * - Dropdown opens on focus/click with all cities (top hubs + 550+ Indian cities)
 * - Typing in the input filters in real-time
 * - Zero extra API cost for all pre-indexed cities, live Google Places fallback for unindexed
 */
export default function DynamicCitySelector({
  value = '',
  onChange,
  className = '',
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [liveResults, setLiveResults] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync when external value changes
  useEffect(() => {
    if (value !== searchTerm && !isOpen) {
      setSearchTerm(value || '');
    }
  }, [value, isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        // If user didn't pick from dropdown, revert search term to current selected value
        if (value) {
          setSearchTerm(value);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [value]);

  // Instant local filtering (0ms, 0 cost)
  const filteredCities = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return ALL_INDIAN_CITIES.slice(0, 40);
    }
    return ALL_INDIAN_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q))
    ).slice(0, 40);
  }, [searchTerm]);

  // Live Google Places fallback if local list has few matches and user typed >= 2 chars
  useEffect(() => {
    const q = searchTerm.trim();
    if (!isOpen || q.length < 2 || filteredCities.length >= 3) {
      setLiveResults([]);
      setIsLoadingLive(false);
      return;
    }

    const cacheKey = q.toLowerCase();
    if (citySearchCache.has(cacheKey)) {
      setLiveResults(citySearchCache.get(cacheKey));
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoadingLive(true);
      try {
        const res = await fetch(`${API_BASE}/maps/cities?query=${encodeURIComponent(q)}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.success && Array.isArray(json?.data)) {
            const parsed = json.data.map((item) => ({
              name: item.city || item.description.split(',')[0].trim(),
              state: item.state || 'India',
              isLive: true,
            }));
            citySearchCache.set(cacheKey, parsed);
            setLiveResults(parsed);
          }
        }
      } catch (err) {
        console.warn('[DynamicCitySelector] Live cities query failed:', err);
      } finally {
        setIsLoadingLive(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, isOpen, filteredCities.length]);

  const handleSelectCity = (cityName) => {
    const clean = cityName.trim();
    setSearchTerm(clean);
    if (onChange) onChange(clean);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <label className="block text-sm font-semibold text-slate-800 mb-1.5">
        Which city do you want to work in?
      </label>

      {/* Single Searchable Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Building2 className="w-4 h-4 text-emerald-600" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or select city (e.g. Kolkata, Bengaluru, Mumbai)..."
          required={required}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl shadow-xs text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {isLoadingLive && (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          )}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Clear city"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Searchable Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Section: Popular Hubs (shown when user hasn't typed much) */}
          {(!searchTerm || searchTerm.length < 2) && (
            <div className="p-3 bg-slate-50/80">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Popular Hiring Hubs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {POPULAR_CITIES.map((c) => {
                  const isSelected = value?.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelectCity(c.name)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/60'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-white shrink-0 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Full / Filtered Cities List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = value?.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={`${city.name}-${city.state}`}
                    type="button"
                    onClick={() => handleSelectCity(city.name)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-sm font-semibold">{city.name}</span>
                        {city.state && (
                          <span className="text-xs text-slate-400 ml-2 font-normal">({city.state})</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />}
                  </button>
                );
              })
            ) : liveResults.length > 0 ? (
              liveResults.map((city) => {
                const isSelected = value?.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={`${city.name}-${city.state}`}
                    type="button"
                    onClick={() => handleSelectCity(city.name)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-sm font-semibold">{city.name}</span>
                        {city.state && (
                          <span className="text-xs text-slate-400 ml-2 font-normal">({city.state})</span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center">
                {isLoadingLive ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Searching Google Places...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-slate-600">
                      No matching city found for "{searchTerm}".
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectCity(searchTerm.trim())}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <span>Use "{searchTerm.trim()}"</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer status bar */}
          <div className="px-3.5 py-2 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-medium text-slate-600">
              550+ Indian Cities Available
            </span>
            <span className="text-slate-400">
              Instant Search · ₹0 Cost
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
