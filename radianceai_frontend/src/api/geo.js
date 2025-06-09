//
// PUBLIC_INTERFACE
// geo.js: Fetches geolocation info for user based on IP address
//

// You may use https://ipapi.co/json/, https://ipinfo.io/json, http://ip-api.com/json/, or similar.
// The APIs are public, return region/country/city, and do not need keys for basic usage.

const GEO_API_URL = "https://ipapi.co/json/";


// PUBLIC_INTERFACE
/**
 * Fetch geolocation data for current user based on their IP address.
 * Returns: { ip, city, region, country, country_code, latitude, longitude, ... }
 */
export async function fetchGeolocation() {
  try {
    const resp = await fetch(GEO_API_URL);
    if (!resp.ok) throw new Error("Failed to fetch geolocation");
    const data = await resp.json();
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
    return { error: "Geolocation lookup failed" };
  }
}

