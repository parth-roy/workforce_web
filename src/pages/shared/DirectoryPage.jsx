import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ChevronRight, Building2 } from 'lucide-react';
import { mockLocations } from '../../data/mock/locations';
import Breadcrumbs from '../../components/shared/Breadcrumbs';
import SEO from '../../components/ui/SEO';
import DirectContactBanner from '../../components/common/DirectContactBanner';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Group locations by state and filter by search query
  const { citiesByState, sortedStates, totalMatchingCities } = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const grouped = {};
    let matchCount = 0;

    // Deduplicate by slug to ensure clean rendering
    const seen = new Set();
    const uniqueLocations = [];
    mockLocations.forEach((loc) => {
      if (loc && loc.slug && !seen.has(loc.slug)) {
        seen.add(loc.slug);
        uniqueLocations.push(loc);
      }
    });

    uniqueLocations.forEach((loc) => {
      const matchesCity = loc.name?.toLowerCase().includes(query);
      const matchesState = loc.state && loc.state.toLowerCase().includes(query);
      const matchesSlug = loc.slug?.toLowerCase().includes(query);

      if (!query || matchesCity || matchesState || matchesSlug) {
        const stateKey = loc.state || 'Other Regions';
        if (!grouped[stateKey]) {
          grouped[stateKey] = [];
        }
        grouped[stateKey].push(loc);
        matchCount++;
      }
    });

    // Sort cities inside each state alphabetically
    Object.keys(grouped).forEach((state) => {
      grouped[state].sort((a, b) => a.name.localeCompare(b.name));
    });

    const sorted = Object.keys(grouped).sort();

    return {
      citiesByState: grouped,
      sortedStates: sorted,
      totalMatchingCities: matchCount,
    };
  }, [searchQuery]);

  const breadcrumbs = [
    { label: 'Service Directory' }
  ];

  return (
    <>
      <SEO
        title="All India City Workforce & Home Services Directory | Metro Mitra"
        description={`Explore Metro Mitra's pan-India verified gig workforce and home services directory covering ${mockLocations.length}+ cities, operational hubs, and districts across all Indian states.`}
        canonicalPath="/directory"
        indexable={true}
      />

      <div className="bg-slate-50 min-h-screen pt-28 pb-20 sm:pt-32 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Users size={14} className="text-emerald-600" /> Pan-India Gig Workforce Network
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Metro Mitra Service Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Find verified doorstep technicians, daily wage gig workers, and on-demand home service professionals across {mockLocations.length}+ operational hubs and all Indian states.
            </p>

            {/* Interactive Search & Filter Bar */}
            <div className="relative max-w-xl mx-auto shadow-sm rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, or state (e.g. Jaipur, Pune, West Bengal)..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Stats Filter Summary */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>Showing <strong>{totalMatchingCities}</strong> operational hubs across <strong>{sortedStates.length}</strong> states/UTs</span>
            </div>
          </div>

          {/* Direct Worker Contact Banner */}
          <div className="mb-10 max-w-5xl mx-auto">
            <DirectContactBanner
              categoryName="Verified Gig Workers & Technicians"
              cityName="All Operational Hubs"
            />
          </div>

          {/* States Masonry Layout */}
          {sortedStates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No locations found</h3>
              <p className="text-xs text-slate-500 mb-4">No operational hubs match "{searchQuery}". Try searching for another city or state.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
              {sortedStates.map((state) => {
                const stateCities = citiesByState[state];
                return (
                  <div
                    key={state}
                    className="break-inside-avoid mb-6 bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden hover:shadow-md transition-all group"
                  >
                    {/* Consistent Card Header with Fixed Height & Badge */}
                    <div className="bg-gradient-to-r from-emerald-50/80 to-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between min-h-[56px]">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {state}
                      </h2>
                      <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200/60 shadow-2xs">
                        {stateCities.length}
                      </span>
                    </div>

                    {/* City List */}
                    <ul className="p-3.5 divide-y divide-slate-50">
                      {stateCities.map((city) => (
                        <li key={city.slug}>
                          <Link
                            to={`/jobs/location/${city.slug}`}
                            className="flex items-center justify-between py-2 px-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 text-[13px] font-medium transition-all group/link"
                          >
                            <span className="truncate">{city.name}</span>
                            <ChevronRight size={13} className="text-slate-300 group-hover/link:text-emerald-500 transition-colors shrink-0 ml-1" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
