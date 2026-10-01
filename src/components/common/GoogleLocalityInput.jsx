import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Search, Loader2, X, Check, ChevronDown, Sparkles } from 'lucide-react';
import { getCityLocalities } from '../../data/cityLocalities';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyCVzYU4LKVVVWpVip4QmPUQJv5VIwHiOJw';
const API_BASE = import.meta.env.VITE_API_URL || 'https://api.gomytruck.com/api/v1';

// Global script loader promise to prevent duplicate script tags
let googleMapsPromise = null;

function loadGoogleMapsPlacesSDK() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not defined'));
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google.maps);
  }
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google?.maps));
        existingScript.addEventListener('error', (err) => reject(err));
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps SDK loaded but maps object missing'));
        }
      };
      script.onerror = (err) => {
        console.warn('[GoogleLocalityInput] Google Maps SDK script failed to load:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  }
  return googleMapsPromise;
}

// In-memory cache to guarantee 0 API costs for repeated keystrokes / backspacing
const localityQueryCache = new Map();

/**
 * Clean Single Input Box with Searchable Dropdown for Locality / Work Area
 * - Only an input box rendered on the page (no cluttered buttons/grids below)
 * - Click/focus opens dropdown with all pre-loaded localities under the chosen city
 * - Typing in the same input box filters the city's localities instantly (₹0 cost)
 * - Live Google Maps Places search if user types specific colony/landmark
 * - Session token grouping to bundle all keystrokes + selection into 1 billing unit
 */
export default function GoogleLocalityInput({
  selectedCity = '',
  value = '',
  onChange,
  onLocalitySelect,
  className = '',
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [googlePredictions, setGooglePredictions] = useState([]);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const sessionTokenRef = useRef(null);

  // Load Google Maps Places SDK in background
  useEffect(() => {
    loadGoogleMapsPlacesSDK().catch(() => {});
  }, []);

  // Sync external value
  useEffect(() => {
    if (value !== searchTerm && !isOpen) {
      setSearchTerm(value || '');
    }
  }, [value, isOpen]);

  // When selectedCity changes: reset search and session
  useEffect(() => {
    sessionTokenRef.current = null;
    setGooglePredictions([]);
    if (!value) {
      setSearchTerm('');
    }
  }, [selectedCity]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        // If user didn't pick from dropdown, restore to selected value
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

  // Pre-loaded relevant localities for the selected city
  const cityLocalities = useMemo(() => {
    return getCityLocalities(selectedCity);
  }, [selectedCity]);

  // Filter city localities based on current input text
  const filteredLocalities = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return cityLocalities;
    return cityLocalities.filter((loc) =>
      loc.name.toLowerCase().includes(q)
    );
  }, [cityLocalities, searchTerm]);

  // Live Google Places autocomplete when user types something not in the list
  const fetchGooglePredictions = async (inputStr) => {
    const trimmed = inputStr.trim();
    if (!trimmed || trimmed.length < 2) {
      setGooglePredictions([]);
      setIsLoadingGoogle(false);
      return;
    }

    const cityContext = (selectedCity || '').trim();
    const cacheKey = `${cityContext.toLowerCase()}:${trimmed.toLowerCase()}`;

    // Check in-memory cache first (0ms, 0 cost)
    if (localityQueryCache.has(cacheKey)) {
      setGooglePredictions(localityQueryCache.get(cacheKey));
      setIsLoadingGoogle(false);
      return;
    }

    setIsLoadingGoogle(true);

    // Primary: Google Maps JS Places SDK with session token
    if (window.google?.maps?.places) {
      try {
        const maps = window.google.maps;
        const service = new maps.places.AutocompleteService();

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new maps.places.AutocompleteSessionToken();
        }

        const scopedInput = cityContext ? `${trimmed}, ${cityContext}` : trimmed;

        service.getPlacePredictions(
          {
            input: scopedInput,
            sessionToken: sessionTokenRef.current,
            componentRestrictions: { country: 'in' },
          },
          (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK && Array.isArray(results)) {
              const formatted = results.map((item) => ({
                placeId: item.place_id,
                mainText: item.structured_formatting?.main_text || item.description.split(',')[0].trim(),
                secondaryText: item.structured_formatting?.secondary_text || item.description,
                description: item.description,
                source: 'google',
              }));

              localityQueryCache.set(cacheKey, formatted);
              setGooglePredictions(formatted);
            } else {
              setGooglePredictions([]);
            }
            setIsLoadingGoogle(false);
          }
        );
        return;
      } catch (err) {
        console.warn('[GoogleLocalityInput] Client SDK prediction failed, using backend:', err);
      }
    }

    // Secondary fallback: backend Redis-cached localities endpoint
    try {
      const url = `${API_BASE}/maps/localities?city=${encodeURIComponent(cityContext)}&query=${encodeURIComponent(trimmed)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
          localityQueryCache.set(cacheKey, json.data);
          setGooglePredictions(json.data);
          setIsLoadingGoogle(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[GoogleLocalityInput] Backend fallback failed:', err);
    }

    setIsLoadingGoogle(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only fire Google Places if user types >= 2 chars and local matches are limited
    if (!val.trim() || val.trim().length < 2 || filteredLocalities.length >= 4) {
      setGooglePredictions([]);
      setIsLoadingGoogle(false);
      return;
    }

    setIsLoadingGoogle(true);
    debounceTimerRef.current = setTimeout(() => {
      fetchGooglePredictions(val);
    }, 350);
  };

  const handleSelect = (localityName, googlePlace = null) => {
    const cleanName = (localityName || '').trim();
    setSearchTerm(cleanName);
    if (onChange) onChange(cleanName);
    if (onLocalitySelect) {
      onLocalitySelect({
        name: cleanName,
        formattedAddress: googlePlace?.description || `${cleanName}, ${selectedCity || 'India'}`,
        placeId: googlePlace?.placeId || null,
      });
    }

    // Finalize Google Places session token if selected from Google
    if (googlePlace?.placeId && window.google?.maps?.places) {
      try {
        const maps = window.google.maps;
        const dummyDiv = document.createElement('div');
        const placesService = new maps.places.PlacesService(dummyDiv);
        placesService.getDetails(
          {
            placeId: googlePlace.placeId,
            fields: ['name', 'formatted_address'],
            sessionToken: sessionTokenRef.current,
          },
          () => {
            sessionTokenRef.current = null;
          }
        );
      } catch {
        sessionTokenRef.current = null;
      }
    } else {
      sessionTokenRef.current = null;
    }

    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
    if (onLocalitySelect) onLocalitySelect({ name: '', formattedAddress: '', placeId: null });
    setGooglePredictions([]);
    sessionTokenRef.current = null;
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Label with City Context Tag */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-semibold text-slate-800">
          Select Locality / Work Area
        </label>
        {selectedCity ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scoped to {selectedCity}</span>
          </span>
        ) : (
          <span className="text-xs font-medium text-amber-600">
            ⚠️ Select city above first
          </span>
        )}
      </div>

      {/* Single Searchable Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={
            selectedCity
              ? `Search or select area in ${selectedCity} (e.g. Talpukur, Salt Lake, Andheri)...`
              : 'Please choose a city above first'
          }
          disabled={!selectedCity}
          required={required}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl shadow-xs text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all cursor-pointer"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
          {isLoadingGoogle && (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          )}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Clear locality"
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

      {/* Searchable Dropdown with Localities & Live Places */}
      {isOpen && selectedCity && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* Header */}
          <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Areas in {selectedCity}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {filteredLocalities.length} {filteredLocalities.length === 1 ? 'locality' : 'localities'}
            </span>
          </div>

          {/* List of Localities */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {/* 1. Pre-loaded City Localities */}
            {filteredLocalities.length > 0 && (
              filteredLocalities.map((loc) => {
                const isSelected = value?.toLowerCase() === loc.name.toLowerCase();
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelect(loc.name)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold truncate">{loc.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />}
                  </button>
                );
              })
            )}

            {/* 2. Live Google Places Predictions (when searching for specific area) */}
            {googlePredictions.length > 0 && (
              <div>
                <div className="px-4 py-1.5 bg-slate-100/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Google Maps Places in {selectedCity}</span>
                </div>
                {googlePredictions.map((p, idx) => (
                  <button
                    key={p.placeId || idx}
                    type="button"
                    onClick={() => handleSelect(p.mainText, p)}
                    className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-emerald-50/60 transition-colors group cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 truncate">
                        {p.mainText}
                      </div>
                      {p.secondaryText && (
                        <div className="text-xs text-slate-500 truncate">
                          {p.secondaryText}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 3. Empty state & custom entry button */}
            {filteredLocalities.length === 0 && googlePredictions.length === 0 && !isLoadingGoogle && (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-600 mb-2">
                  No predefined locality matching "<span className="font-semibold text-slate-800">{searchTerm}</span>" in {selectedCity}.
                </p>
                {searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelect(searchTerm.trim())}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Use "{searchTerm.trim()}" as work area</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">
              Type to search or pick from dropdown
            </span>
            <span className="text-slate-400">
              Session Grouped · ₹0 Extra Cost
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
