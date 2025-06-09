import { useState, useEffect } from "react";
import { fetchWeather } from "../api/apiClient";

// PUBLIC_INTERFACE
/**
 * useWeather - Gets weather info for provided {lat, lon} or current geolocation.
 * Caches in localStorage["userWeather"] for 1h.
 * Returns: { weather, loading, error, refresh }
 */
function useWeather({ lat = null, lon = null, autoDetect = true } = {}) {
  const STORAGE_KEY = "userWeather";
  const [weather, setWeather] = useState(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      const { expires, value } = JSON.parse(item);
      if (expires > Date.now()) return value; // if not expired
    } catch { }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIdx, setRefreshIdx] = useState(0);

  useEffect(() => {
    let resolvedLat = lat, resolvedLon = lon;

    function getAndSetWeather(lat, lon) {
      setLoading(true);
      fetchWeather(lat, lon)
        .then(w => {
          setWeather(w);
          setError(w?.error || "");
          // Store in LS with expiry 1h
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            value: w,
            expires: Date.now() + 60 * 60 * 1000
          }));
        })
        .catch(() => setError("Failed to fetch weather"))
        .finally(() => setLoading(false));
    }

    // Use supplied or try geolocation
    if ((lat && lon) || !autoDetect) {
      if (lat && lon) getAndSetWeather(lat, lon);
      else setLoading(false);
    } else if (autoDetect && "geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        pos => getAndSetWeather(pos.coords.latitude, pos.coords.longitude),
        () => setError("Could not detect location"), { timeout: 8000 }
      );
    } else {
      setLoading(false);
      setError("No location available");
    }
    // eslint-disable-next-line
  }, [lat, lon, autoDetect, refreshIdx]);

  // PUBLIC_INTERFACE
  function refresh() {
    setRefreshIdx(idx => idx + 1);
  }

  return { weather, loading, error, refresh };
}
export default useWeather;
