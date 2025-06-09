import React, { useEffect, useState } from "react";
import { fetchGeolocation } from "../../api/geo";
import { AppleFadeTransition, MotionWrapper } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * Geolocation-based customization feature.
 * - Fetches location from IP geolocation API on mount
 * - Displays detected location
 * - Persists geolocation to localStorage for other features (recommendations, store links, etc)
 * - Handles error and loading states
 */
const GEO_STORAGE_KEY = "userGeolocation";

// Helper hook: get/set localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setVal = (v) => {
    setValue(v);
    try {
      window.localStorage.setItem(key, JSON.stringify(v));
    } catch { }
  };
  return [value, setVal];
}

const Geolocation = () => {
  const [geo, setGeo] = useLocalStorage(GEO_STORAGE_KEY, null);
  const [loading, setLoading] = useState(!geo);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    // Only auto-fetch if not already fetched/valid
    if (!geo || typeof geo !== "object" || geo.error) {
      setLoading(true);
      fetchGeolocation().then((g) => {
        if (!mounted) return;
        if (g.error) {
          setError("Could not determine your location automatically.");
        } else {
          setGeo(g); // Save to LS for universal use
        }
        setLoading(false);
      });
    }
    return () => { mounted = false; };
    // eslint-disable-next-line
  }, []);

  const userRegion = geo?.country
    ? [geo.city, geo.region, geo.country].filter(Boolean).join(", ")
    : null;

  return (
    <section className="container" style={{ maxWidth: 490, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h2 style={{
          color: "#fadadd",
          fontWeight: 700,
          fontSize: "1.44rem",
          margin: "24px 0 8px 0",
          textAlign: "center"
        }}>
          Geolocation-based Customization
        </h2>
        <div style={{ color: "#e7b3ff", textAlign: "center", fontSize: 16.1, marginBottom: 15 }}>
          {loading
            ? "Detecting your region from IP address…"
            : error
              ? <span style={{ color: "#f339db" }}>{error}</span>
              : userRegion
                ? `We've detected your region as:`
                : "No location info detected."}
        </div>
        <MotionWrapper>
          {loading ? (
            <div style={{
              color: "#fadadd",
              fontWeight: 600,
              textAlign: "center",
              margin: "45px 0",
              fontSize: 22,
            }}>
              Loading geolocation…
            </div>
          ) : error ? (
            <div style={{
              color: "#f339db",
              textAlign: "center",
              margin: "30px 0"
            }}>{error}</div>
          ) : geo && (geo.country || geo.region) ? (
            <div style={{
              background: "linear-gradient(100deg,#faf0ff55 40%,#e7b3ff22 100%)",
              borderRadius: 16,
              padding: "18px 10px 22px 10px",
              margin: "0 0 22px 0",
              boxShadow: "0 2px 13px 0 #fadadd22",
              textAlign: "center"
            }}>
              <div style={{
                color: "#f339db",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 10
              }}>
                {userRegion}
              </div>
              <div style={{
                color: "#e7b3ff",
                fontWeight: 500,
                fontSize: 15.1,
                marginBottom: 6
              }}>
                {geo.country && <>Country: <b>{geo.country}</b><br /></>}
                {geo.region && <>Region: <b>{geo.region}</b><br /></>}
                {geo.city && <>City: <b>{geo.city}</b><br /></>}
                {geo.countryCode && <>Country Code: <b>{geo.countryCode}</b></>}
              </div>
              {(geo.latitude && geo.longitude) &&
                <div style={{ color: "#fadadd", fontSize: 13.2, marginTop: 12 }}>
                  Coordinates: <span style={{color:"#fff"}}>{geo.latitude},{geo.longitude}</span>
                </div>
              }
              {geo.ip &&
                <div style={{ color: "#e7b3ff", fontSize: 13.1, marginTop: 3 }}>
                  IP: <span style={{ color: "#fff" }}>{geo.ip}</span>
                </div>
              }
              <div style={{
                marginTop: 16,
                textAlign: "center",
                color: "#f339db",
                fontSize: 13,
                opacity: 0.84
              }}>
                This info is used to personalize recommendations and store links.
              </div>
            </div>
          ) : (
            <div style={{
              color: "#fadadd",
              fontWeight: 600,
              textAlign: "center",
              margin: "32px 0"
            }}>
              No region info found.
            </div>
          )}
        </MotionWrapper>
      </AppleFadeTransition>
      <div style={{
        color: "#e7b3ff",
        fontSize: 14.5,
        textAlign: "center",
        margin: "19px 0 0 0",
        opacity: 0.86
      }}>
        <span>
          Tip: Your region is auto-detected for <b>localized product recommendations</b> and finding <b>nearby stores</b>.
        </span>
      </div>
    </section>
  );
};

export default Geolocation;
