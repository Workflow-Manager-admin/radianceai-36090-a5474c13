//
// PUBLIC_INTERFACE
// geo.js: Fetches geolocation info for user based on IP address
//

// You may use https://ipapi.co/json/, https://ipinfo.io/json, http://ip-api.com/json/, or similar.
// The APIs are public, return region/country/city, and do not need keys for basic usage.

const GEO_API_URL = "https://ipapi.co/json/";


/**
 * Fetch geolocation data for current user based on their IP address.
 * Returns: { ip, city, region, country, country_code, latitude, longitude, ... }
 * Adds logs/status diagnostics for failure and fetch state.
 */
export async function fetchGeolocation() {
  const log = (...args) => { try { window && window.console && window.console.log && window.console.log("[GeoAPI]", ...args); } catch {} };
  try {
    log("Requesting geolocation from", GEO_API_URL);
    const resp = await fetch(GEO_API_URL);
    if (!resp.ok) {
      log("Geolocation fetch failed - HTTP Status:", resp.status);
      return { error: "Geolocation fetch failed (bad response)", diagnostic: { status: resp.status, url: GEO_API_URL } };
    }
    const data = await resp.json();
    log("Geolocation API response", data);

    // Validate must-have fields
    if (!data || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      log("Geolocation fetch: response missing coordinates", data);
      return { error: "Geolocation data incomplete", raw: data };
    }

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
      raw: data
    };
  } catch (e) {
    log("Geolocation fetch error", e);
    return {
      error: "Geolocation lookup failed",
      message: (e && e.message) ? e.message : String(e)
    };
  }
}

