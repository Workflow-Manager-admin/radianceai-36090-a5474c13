import { useState, useEffect } from "react";
import { fetchGeolocation } from "../api/geo";

// PUBLIC_INTERFACE
/**
 * useGeo - Gets geolocation (IP API) and caches it.
 * Returns: { geo, loading, error, refresh }
 */
function useGeo() {
  const STORAGE_KEY = "userGeolocation";
  const [geo, setGeo] = useState(() => {
    try {
      const val = window.localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(!geo);
  const [error, setError] = useState("");
  const [refreshIdx, setRefreshIdx] = useState(0);

  useEffect(() => {
    if (geo && !geo.error) {
      setLoading(false);
      setError("");
      return;
    }
    setLoading(true);
    fetchGeolocation().then(g => {
      setGeo(g);
      setError(g?.error || "");
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setError("Geolocation failed");
    });
    // eslint-disable-next-line
  }, [refreshIdx]);

  // PUBLIC_INTERFACE
  function refresh() { setRefreshIdx(idx => idx + 1); }

  return { geo, loading, error, refresh };
}
export default useGeo;
