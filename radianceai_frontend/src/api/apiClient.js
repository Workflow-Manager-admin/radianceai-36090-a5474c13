 /**
  * PUBLIC_INTERFACE
  * apiClient: sets up fetch calls for APIs.
  */

 /**
  * PUBLIC_INTERFACE
  * Fetch a list of recommended skincare products (IN region, INR pricing)
  * Supports querying for multiple allowed Indian brands and brand-based filtering.
  * Restricts to: DermaCo, Kiehl's, Minimalist, Plum, Wow
  * @param {Object} params: e.g., { category, minRating, limit, brands }
  * @returns {Promise<Array>} Product list with INR price and metadata
  */
export const fetchRecommendedProducts = async (params = {}) => {
  // --- ALLOWED BRANDS: These are the only brands ever returned ---
  const allowedBrands = [
    "DermaCo",
    "Kiehl's",
    "Minimalist",
    "Plum",
    "Wow"
  ];

  // Normalize/correct user-supplied brand params
  const normalizeBrand = (b) => {
    if (!b) return "";
    const str = ("" + b).trim().toLowerCase();
    if (str === "the derma co" || str === "dermaco") return "DermaCo";
    if (str === "minimalist") return "Minimalist";
    if (str === "plum") return "Plum";
    if (str === "wow skin science" || str === "wow") return "Wow";
    if (str === "kiehl's" || str === "kiehls") return "Kiehl's";
    return "";
  };

  // Use only allowed brands, whatever param says
  let requestedBrands = Array.isArray(params.brands) && params.brands.length > 0
    ? params.brands.map(normalizeBrand).filter((b) => allowedBrands.includes(b))
    : allowedBrands.slice(); // all if missing

  if (!requestedBrands.length) requestedBrands = allowedBrands.slice();

  // Static official image URLs for brand priority
  const brandImageMap = {
    "DermaCo": "https://cdn.shopify.com/s/files/1/0283/0165/2747/products/the-dermaco-face-serum-niacinamide-10-percent-30-ml-44516721406142.jpg",
    "Kiehl's": "https://www.kiehls.com.sg/dw/image/v2/BDTJ_PRD/on/demandware.static/-/Sites-masterCatalog_Kiehls/default/dwc9f5beec/2020/Products/Face/Serums/Ultra_Pure_Hyaluronic_Acid_Serum_30ml_ProductPageZoom.jpg",
    "Minimalist": "https://beminimalist.co/cdn/shop/files/Salicylic_Acid_2_percent_Face_Serum-minimalist-skincare-1_600x.jpg",
    "Plum": "https://cdn.plumgoodness.com/products/Green-Tea-Face-Wash-1_800x.jpg",
    "Wow": "https://cdn01.wowsts.com/pub/media/catalog/product/w/o/wow_skin_science_vitamin_c_face_wash_with_built_in_brush_100ml_front.jpg"
  };

  // Simulate parallel fetches for each brand (replace with real APIs in prod)
  async function fetchBrandProducts(brand) {
    const minRating = typeof params.minRating === "number" ? params.minRating : 0;
    const limit = typeof params.limit === "number" ? params.limit : 7;
    const DUMMYJSON_URL = "https://dummyjson.com/products";
    let url = `${DUMMYJSON_URL}?limit=${limit}`;
    if (params.category) url += `&category=${encodeURIComponent(params.category)}`;

    try {
      const resp = await fetch(url);
      const data = await resp.json();
      let products = Array.isArray(data.products) ? data.products : [];
      if (minRating) {
        products = products.filter((p) => Number(p.rating) >= minRating);
      }
      // Force the mapping to allowed brands only
      if (!allowedBrands.includes(brand)) return [];
      return products
        .map((p, idx) => {
          // Always associate official brand image if available
          const thumbnail = brandImageMap[brand] || p.thumbnail;
          return {
            ...p,
            id: `${brand}-${p.id || idx}`,
            price: Math.round((p.price || 10) * 80 + 59),
            currency: "INR",
            brand: brand,
            title: `[${brand}] ${(p.title?.replace(/[\s]*-.*$/, "") || "")} (IN)`,
            description: p.description,
            link: p.link || p.url || "",
            rating: p.rating,
            stock: p.stock,
            thumbnail: thumbnail,
            keywords: p.keywords || [],
            category: p.category || params.category || "skincare",
            isLocalIN: true
          };
        })
        .filter((prod) => allowedBrands.includes(prod.brand));
    } catch (err) {
      return [];
    }
  }

  // Fetch for each allowed/requested brand and aggregate
  let all = [];
  for (const brand of requestedBrands) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const bResults = await fetchBrandProducts(brand);
      all = all.concat(bResults || []);
    } catch {
      // skip erroring brand
    }
  }

  // Remove accidental duplicates just in case
  const deduped = [];
  const seen = new Set();
  for (let i = all.length - 1; i >= 0; i--) {
    const prod = all[i];
    if (!seen.has(prod.id)) {
      deduped.unshift(prod);
      seen.add(prod.id);
    }
  }
  return deduped;
};

 /**
  * PUBLIC_INTERFACE
  * Fetch weather data using OpenWeatherMap for provided latitude and longitude.
  * Returns object: { temp, humidity, weatherMain, weatherDesc, icon, ... }
  * Enhanced: Adds explicit diagnostics, logs, and more granular error reporting for weather feature.
  */
export const fetchWeather = async (lat, lon) => {
  // Note: In production, move the API key to env file. For demo, hardcoding OK.
  const apiKey = "06b55fc63b0c2836f40b43e784b68df0"; // Updated OpenWeatherMap API key (see task requirements)
  // Diagnostic log helper
  const log = (...args) => { try { window && window.console && window.console.log && window.console.log("[WeatherAPI]", ...args); } catch {} };

  // Validate coordinates before API call
  if (typeof lat !== "number" || typeof lon !== "number") {
    log("Weather fetch failed: Missing coordinates. Input lat/lon:", lat, lon);
    return { error: "Missing coordinates", diagnostic: { lat, lon } };
  }

  // Validate (dummy public) API key (check length, should be 32 characters for OpenWeatherMap, but demo key is 32)
  if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 24) {
    log("Weather fetch failed: API key missing/invalid.", { apiKey });
    return { error: "OpenWeatherMap API key missing or invalid", diagnostic: { apiKey } };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  log("Weather API request", { url, lat, lon, apiKey: apiKey.slice(0,8)+"...(hidden)" });

  try {
    const resp = await fetch(url);
    log("Weather API response - status:", resp.status);

    let data;
    try { data = await resp.json(); } catch (err) {
      log("Weather API response JSON parse error", err, resp);
      return {
        error: "Invalid weather API response (could not parse JSON).",
        code: resp.status,
        diagnostic: { url, status: resp.status, err: (err && err.message) || String(err) }
      };
    }

    log("Weather API response data", data);

    // Detect standard OpenWeatherMap error codes
    if (
      !resp.ok ||
      !data ||
      data.cod === 401 ||
      data.cod === 429 ||
      data.cod === "401" ||
      data.cod === "429"
    ) {
      // Detailed error for diagnostics
      const msg = data && typeof data === "object" && data.message ? data.message : null;
      log("Weather fetch failed: API error response", { url, status: resp.status, data });
      // List common reasons for 401/429
      let reason = undefined;
      if (data.cod === 401 || data.cod === "401") reason = "Invalid API key or unauthorized.";
      if (data.cod === 429 || data.cod === "429") reason = "API rate limit exceeded (Too Many Requests).";
      return {
        error: "Weather fetch failed: API error",
        code: data && data.cod,
        reason,
        message: msg,
        request: url,
        response: data
      };
    }
    // Extract key properties; still validate
    if (!data.main || typeof data.main.temp !== "number") {
      log("Weather fetch incomplete data", { url, data });
      return {
        error: "Weather fetch failed: incomplete API data",
        code: data && data.cod,
        response: data
      };
    }
    return {
      temp: data.main?.temp,
      humidity: data.main?.humidity,
      weatherMain: data.weather?.[0]?.main,
      weatherDesc: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
      windSpeed: data.wind?.speed,
      city: data.name,
      country: data.sys?.country,
      raw: data,
      _diagnostic: { url, status: resp.status }
    };
  } catch (e) {
    log("Weather fetch failed: Network or fetch error", e);
    return {
      error: "Weather fetch failed: network or CORS error",
      message: (e && e.message) ? e.message : String(e)
    };
  }
};

 /**
  * PUBLIC_INTERFACE
  * sendEmail: Send email via EmailJS, for reminders/routine summaries.
  * This requires configuration in EmailJS dashboard.
  * @param {Object} payload { toEmail, toName, type: "reminder"|"summary", data: {...} }
  */
export const sendEmail = async (payload) => {
  // Import emailjs if present, otherwise fallback
  try {
    if (!window.emailjs) {
      // Optionally: Load EmailJS from CDN dynamically.
      // NOTE: For production, install and import EmailJS:
      // import emailjs from '@emailjs/browser'
      // But here we load from CDN for demo.
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }
    // Init if not already
    if (!window.emailjs.___init) {
      window.emailjs.init("YOUR_EMAILJS_USER_ID"); // <-- Set in EmailFeatures config
      window.emailjs.___init = true;
    }

    // Map type to template
    const { toEmail, toName, type, data } = payload;
    // Map EmailJS template (you should define these in your account)
    let templateParams = {
      to_email: toEmail,
      to_name: toName,
      ...data,
    };
    let templateId = "routine_summary_template"; // fallback
    if (type === "reminder") templateId = "routine_reminder_template";
    if (type === "summary") templateId = "routine_summary_template";

    // Must be configured at https://dashboard.emailjs.com/
    // service_id and template_id must match those defined in the dashboard
    const serviceId = payload.serviceId || "YOUR_SERVICE_ID"; // e.g., 'service_xxxx'
    const res = await window.emailjs.send(serviceId, templateId, templateParams);

    return res?.status === 200 ? true : false;
  } catch (e) {
    // Optionally log or pass up error
    return false;
  }
};
