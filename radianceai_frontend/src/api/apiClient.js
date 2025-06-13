 /*
  * PRODUCT API CLIENT for RadianceAI – fetches skincare products
  * — Now powered by Supabase REST API endpoint
  * 
  * SECURITY WARNING: Never hardcode API keys in production or public repos!
  * This is for demo/dev/testing only per instructions.
  */

// Supabase config — provided in task context
const SUPABASE_URL = "https://mwynbysbqrjrkmjptpcr.supabase.co/rest/v1";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eW5ieXNicXJqcmttanB0cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzA5MzMsImV4cCI6MjA2NTM0NjkzM30.x01aA5UU_xkxBAEf3Q7XLRb-6o5BkwZl_tWYdISGDbo";
const SUPABASE_PRODUCTS_TABLE = "products"; // Assumed table name for products

// PUBLIC_INTERFACE
/**
 * Fetch products from Supabase REST endpoint, with API key authentication.
 * Applies optional sorting, limiting, rating filtering, and deduplication.
 * @param {Object} options 
 * @returns {Promise<Array>} Array of product objects (may be empty on error).
 */
export async function fetchRecommendedProducts({
  sortBy = "rating",
  limit = 15,
  minRating = 3.4,
  deduplicate = false,
} = {}) {
  // Construct Supabase REST endpoint with filters
  let url = `${SUPABASE_URL}/${SUPABASE_PRODUCTS_TABLE}?select=*&limit=${limit}`;
  if (sortBy) url += `&order=${encodeURIComponent(sortBy)}.desc.nullslast`;
  if (typeof minRating === "number") url += `&rating=gte.${encodeURIComponent(minRating)}`;

  const headers = {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`,
  };

  let products = [];
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      // More verbose error logging for devs (helps diagnose 502)
      if (typeof window !== "undefined" && window.console) {
        window.console.error(
          "[Supabase fetch] Error:",
          resp.status,
          resp.statusText,
          "URL:", url
        );
      }
      throw new Error(`Supabase fetch failed: ${resp.status}`);
    }
    products = await resp.json();

    // Harmonize with local usage
    products = products.map((p) => ({
      ...p,
      isLocalIN: ["Wow", "Plum", "Minimalist", "DermaCo"].includes(p.brand),
    }));

  } catch (e) {
    products = [];
    // Log error in console for debug
    if (typeof window !== "undefined" && window.console) {
      window.console.error("[Supabase] fetch error:", e && e.message, e);
    }
  }

  // Optional deduplicate by title/brand
  if (deduplicate && Array.isArray(products)) {
    const set = new Set();
    products = products.filter((p) => {
      const key = (p.title || "") + "|" + (p.brand || "");
      if (set.has(key)) return false;
      set.add(key);
      return true;
    });
  }

  // Client-side sort fallback (if needed)
  if (products && sortBy && products.length > 1) {
    products = products.slice().sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
  }

  // Hard limit
  return Array.isArray(products) ? products.slice(0, limit) : [];
}

/**
 * PUBLIC_INTERFACE
 * Fetch mock weather data (stub method to fix missing export error).
 * Replace with real weather fetch logic as needed.
 */
export async function fetchWeather(/* options */) {
  // Basic placeholder (will always fail)
  return Promise.reject(new Error("fetchWeather is not implemented in this environment."));
}

// PUBLIC_INTERFACE
export async function sendEmail(payload) {
  // See EmailFeatures.js for usage (no change for Supabase)
  return false;
}
