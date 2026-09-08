import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { mockLocations } from "../data/mock/locations";

const CityContext = createContext(null);

export const DEFAULT_CITY = {
  name: "Kolkata",
  slug: "kolkata",
  state: "West Bengal",
  region: "Eastern India",
};

const SESSION_CITY_KEY = "metromitra_session_city";
const STORAGE_CITY_KEY = "metromitra_user_city";

/**
 * Match a raw city name or state against our 556+ locations registry
 */
export function resolveCityConfig(rawCityName, rawStateName) {
  if (!rawCityName) return null;
  const clean = rawCityName.trim().toLowerCase();

  // 1. Try exact slug or name match in mockLocations
  const matched = mockLocations.find(
    (c) =>
      c.name.toLowerCase() === clean ||
      c.slug.toLowerCase() === clean ||
      c.name.toLowerCase().includes(clean) ||
      clean.includes(c.name.toLowerCase())
  );

  if (matched) {
    return {
      name: matched.name,
      slug: matched.slug,
      state: matched.state || rawStateName || "India",
      region: matched.region || matched.state || "India",
    };
  }

  // 2. If outside known list, construct a clean city object
  const formattedName =
    rawCityName.charAt(0).toUpperCase() + rawCityName.slice(1).trim();
  const slug = rawCityName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    name: formattedName,
    slug: slug || "kolkata",
    state: rawStateName || "India",
    region: rawStateName || "India",
  };
}

/**
 * Calculate nearest city by GPS coordinates
 */
export function findNearestLocation(lat, lng) {
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

  return nearest ? {
    name: nearest.name,
    slug: nearest.slug,
    state: nearest.state || "India",
    region: nearest.region || nearest.state || "India",
  } : DEFAULT_CITY;
}

export function CityProvider({ children }) {
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasDetected, setHasDetected] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const currentCityRef = useRef(DEFAULT_CITY);
  currentCityRef.current = currentCity;

  // Set city with optional manual session persistence
  const setCity = useCallback((cityInput, isManual = true) => {
    if (!cityInput) return;

    let cityObj;
    if (typeof cityInput === "string") {
      cityObj = resolveCityConfig(cityInput) || {
        name: cityInput,
        slug: cityInput.toLowerCase().replace(/\s+/g, "-"),
        state: "India",
        region: "India",
      };
    } else {
      cityObj = {
        name: cityInput.name || "Kolkata",
        slug: cityInput.slug || "kolkata",
        state: cityInput.state || "West Bengal",
        region: cityInput.region || cityInput.state || "India",
      };
    }

    // Guard against redundant state updates
    if (
      currentCityRef.current &&
      currentCityRef.current.slug === cityObj.slug &&
      currentCityRef.current.name.toLowerCase() === cityObj.name.toLowerCase()
    ) {
      return;
    }

    currentCityRef.current = cityObj;
    setCurrentCity(cityObj);

    if (typeof window !== "undefined") {
      try {
        if (isManual) {
          sessionStorage.setItem(SESSION_CITY_KEY, JSON.stringify(cityObj));
        }
        localStorage.setItem(STORAGE_CITY_KEY, JSON.stringify(cityObj));
        window.dispatchEvent(
          new CustomEvent("metromitra:city_change", { detail: cityObj })
        );
      } catch {
        // Storage disabled/restricted
      }
    }
  }, []);

  // Perform live auto-detection
  const detectLocation = useCallback(
    async (forceFresh = false) => {
      if (typeof window === "undefined") return DEFAULT_CITY;

      // Check session storage first (instantaneous intra-session restore within the same browsing session)
      if (!forceFresh) {
        try {
          const sessionRaw = sessionStorage.getItem(SESSION_CITY_KEY);
          if (sessionRaw) {
            const parsed = JSON.parse(sessionRaw);
            if (parsed?.name && parsed?.slug) {
              setCity(parsed, true);
              setHasDetected(true);
              return parsed;
            }
          }
        } catch {
          // ignore storage read errors
        }
      }

      setIsDetecting(true);

      // Strategy 1: Prompt for browser location permission (HTML5 Geolocation)
      const detectViaBrowserGeo = async () => {
        if (!navigator.geolocation) return null;
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(null), 5000);
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              clearTimeout(timeout);
              const nearest = findNearestLocation(coords.latitude, coords.longitude);
              resolve(nearest);
            },
            (err) => {
              clearTimeout(timeout);
              console.log("Browser geolocation not granted or failed:", err.message);
              resolve(null);
            },
            { timeout: 5000, maximumAge: 0, enableHighAccuracy: true }
          );
        });
      };

      // Strategy 2: Seamless fallback to IP lookup if user blocks/dismisses GPS
      const detectViaIp = async () => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 3500);
          const res = await fetch("https://ipwho.is/", {
            signal: controller.signal,
          });
          clearTimeout(timer);
          if (!res.ok) return null;
          const data = await res.json();
          if (data && data.success && data.city) {
            return resolveCityConfig(data.city, data.region);
          }
        } catch {
          // IP fallback failed
        }
        return null;
      };

      try {
        // 1. Ask for location permission first
        const geoCity = await detectViaBrowserGeo();
        if (geoCity) {
          setCity(geoCity, true);
          return geoCity;
        }

        // 2. Fallback to IP detection if GPS is blocked or timed out
        const ipCity = await detectViaIp();
        if (ipCity) {
          setCity(ipCity, false);
          return ipCity;
        }
      } catch (err) {
        console.warn("Location auto-detection encountered an error:", err);
      } finally {
        setIsDetecting(false);
        setHasDetected(true);
      }

      return DEFAULT_CITY;
    },
    [setCity]
  );

  // On initial mount: run auto-detection
  useEffect(() => {
    detectLocation(false);

    const handleCustomChange = (e) => {
      if (
        e?.detail?.slug &&
        e.detail.slug !== currentCityRef.current?.slug
      ) {
        setCity(e.detail, false);
      }
    };

    window.addEventListener("metromitra:city_change", handleCustomChange);
    return () =>
      window.removeEventListener("metromitra:city_change", handleCustomChange);
  }, [detectLocation, setCity]);

  return (
    <CityContext.Provider
      value={{
        currentCity,
        isDetecting,
        hasDetected,
        setCity,
        detectLocation,
        isCityModalOpen,
        setIsCityModalOpen,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    return {
      currentCity: DEFAULT_CITY,
      isDetecting: false,
      hasDetected: true,
      setCity: () => {},
      detectLocation: async () => DEFAULT_CITY,
      isCityModalOpen: false,
      setIsCityModalOpen: () => {},
    };
  }
  return context;
}
