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
    "Wow",
    "FoxTale"
  ];

  // Normalize/correct user-supplied brand params and common API misspellings
  const normalizeBrand = (b) => {
    if (!b) return "";
    const str = ("" + b).trim().toLowerCase()
      .replace(/[’‘`´]/g, "'"); // Normalize apostrophes
    if (str === "the derma co" || str === "dermaco") return "DermaCo";
    if (str === "minimalist") return "Minimalist";
    if (str === "plum") return "Plum";
    if (str === "wow skin science" || str === "wow") return "Wow";
    // Normalize various spellings of Kiehl's
    if (
      str === "kiehl's" ||
      str === "kiehls" ||
      str === "kiehl’s" ||
      str === "kiehls'" ||
      str === "kiels" // plus a common misspelling
    ) return "Kiehl's";
    if (str === "foxtale" || str === "fox tale") return "FoxTale";
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
    "Wow": "https://cdn01.wowsts.com/pub/media/catalog/product/w/o/wow_skin_science_vitamin_c_face_wash_with_built_in_brush_100ml_front.jpg",
    "FoxTale": "https://cdn.shopify.com/s/files/1/0553/0937/1178/products/foxtale-vitamin-c-serum-30ml.jpg" // Example FoxTale product image
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
  const apiKey = "1545b3a636a95548e533bcdca59dde0f"; // Updated OpenWeatherMap API key (see task requirements)
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
  /*
    Enforces REAL EmailJS config.
    Attempts to load EmailJS credentials from:
      - payload (preferred, passed in from UI/effective config)
      - window.EMAILJS_* (for legacy/demo)
      - process.env (for real deployments, if exposed via env/webpack)
    Throws clear errors if placeholders or missing values are present.
  */
  try {
    // emailjs import logic (same as before)
    let emailjs;
    if (typeof window !== "undefined" && window.emailjs) {
      emailjs = window.emailjs;
    } else {
      try {
        emailjs = (await import("emailjs-com")).default;
      } catch (err) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        emailjs = window.emailjs;
      }
    }

    // Get config from payload OR env
    const fromEnv = typeof process !== "undefined" && process.env ? process.env : {};
    // Try to get config from payload, window, or injected env variables
    const serviceId = (
      payload.serviceId ||
      window.EMAILJS_SERVICE_ID ||
      (fromEnv.REACT_APP_EMAILJS_SERVICE_ID || fromEnv.EMAILJS_SERVICE_ID) ||
      ""
    );
    const userId = (
      payload.userId ||
      window.EMAILJS_USER_ID ||
      (fromEnv.REACT_APP_EMAILJS_USER_ID || fromEnv.EMAILJS_USER_ID) ||
      ""
    );
    // Map type to template
    const { toEmail, toName, type, data } = payload;
    let templateId = "";
    if (type === "reminder")
      templateId =
        payload.reminderTemplateId ||
        window.EMAILJS_REMINDER_TEMPLATE_ID ||
        (fromEnv.REACT_APP_EMAILJS_REMINDER_TEMPLATE_ID || fromEnv.EMAILJS_REMINDER_TEMPLATE_ID) ||
        "";
    else if (type === "summary")
      templateId =
        payload.summaryTemplateId ||
        window.EMAILJS_SUMMARY_TEMPLATE_ID ||
        (fromEnv.REACT_APP_EMAILJS_SUMMARY_TEMPLATE_ID || fromEnv.EMAILJS_SUMMARY_TEMPLATE_ID) ||
        "";
    else
      templateId =
        payload.templateId ||
        window.EMAILJS_TEMPLATE_ID ||
        (fromEnv.REACT_APP_EMAILJS_TEMPLATE_ID || fromEnv.EMAILJS_TEMPLATE_ID) ||
        "";

    // Validate for placeholders/missing
    const MISSING_KEYS = [];
    if (!serviceId || /YOUR_SERVICE_ID/i.test(serviceId)) MISSING_KEYS.push("Service ID");
    if (!userId || /YOUR_EMAILJS_USER_ID|YOUR_PUBLIC_KEY/i.test(userId)) MISSING_KEYS.push("User/Public Key");
    if (!templateId || /routine_(reminder|summary)_template|YOUR_TEMPLATE_ID/i.test(templateId)) MISSING_KEYS.push("Template ID");
    // Do NOT allow emails if any credential is missing or is a known placeholder
    if (MISSING_KEYS.length > 0) {
      throw new Error(
        "EmailJS is not fully configured. The following keys must be set with your real values in the app's environment/config (not placeholders): " +
        MISSING_KEYS.join(", ") +
        ".\nSee documentation: https://www.emailjs.com/docs/examples/reactjs/"
      );
    }

    // Only initialize if necessary; ensure idempotent
    if (!emailjs.___init) {
      emailjs.init(userId);
      emailjs.___init = true;
    }
    let templateParams = { to_email: toEmail, to_name: toName, ...data };

    let result;
    try {
      result = await emailjs.send(serviceId, templateId, templateParams, userId);
    } catch (err) {
      let detailMsg = err?.message || String(err);
      if (err?.status === 404) {
        detailMsg +=
          " (EmailJS: Service ID, Template ID, or User ID was not found. Double-check all IDs at https://dashboard.emailjs.com/)";
      }
      if (err?.status === 401) {
        detailMsg +=
          " (EmailJS: User/Public Key is missing, malformed, or invalid.)";
      }
      if (err?.status === 400) {
        detailMsg +=
          " (EmailJS: Bad request—check required template params and payload formatting.)";
      }
      throw new Error(detailMsg);
    }
    return result?.status === 200 ? true : false;
  } catch (e) {
    // Guidance returned for UI
    let msg =
      "Email send failed: " +
      (e && e.message ? e.message : String(e)) +
      "\nTo enable email sending, set up EmailJS credentials in your environment. See https://dashboard.emailjs.com/admin and https://www.emailjs.com/docs/examples/reactjs/";
    if (typeof window !== "undefined" && window.console && window.console.error)
      window.console.error(msg);
    return { error: msg };
  }
};
