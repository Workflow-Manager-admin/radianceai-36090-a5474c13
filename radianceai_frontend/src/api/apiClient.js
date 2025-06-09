/**
 * PUBLIC_INTERFACE
 * apiClient: sets up fetch calls for APIs.
 */

/**
 * PUBLIC_INTERFACE
 * Fetch a list of recommended Indian skincare products (IN region, INR pricing)
 * Uses the Purplle API (India) via RapidAPI, or fallback to Indianized DummyJSON mock if unavailable.
 * Optionally filter based on quiz result mapping.
 * @param {Object} params (optional): e.g., { category, minRating, limit}
 * @returns {Promise<Array>} Product list with INR price and metadata
 */
export const fetchRecommendedProducts = async (params = {}) => {
  // Try Purplle API (demo endpoint); if fails fallback to local Indianized mock
  // If adapting to an actual API, replace endpoint/headers accordingly.
  const PURPLLE_API_URL =
    "https://apidojo-indiabestbuy-v1.p.rapidapi.com/skin-care/top?" +
    `limit=${params.limit || 12}` +
    (params.category ? `&cat=${encodeURIComponent(params.category)}` : "");

  const purplleHeaders = {
    "X-RapidAPI-Key": "demo_key_for_public", // <-- Replace with real key
    "X-RapidAPI-Host": "apidojo-indiabestbuy-v1.p.rapidapi.com"
  };

  try {
    // --- PRIMARY: Try Indian Purplle/RapidAPI endpoint (demo/for illustration) ---
    const resp = await fetch(PURPLLE_API_URL, { headers: purplleHeaders });
    if (resp.ok) {
      const data = await resp.json();
      // For Purplle: map fields to unified format
      if (Array.isArray(data.products)) {
        let products = data.products;
        if (params.minRating) {
          products = products.filter((p) => (p.rating || 4) >= params.minRating);
        }
        // Normalize to unified structure
        return products.map((p, idx) => ({
          id: p.id || p.product_id || idx,
          title: p.name || p.title || "",
          brand: p.brand || p.brand_name || "",
          price: p.price || p.price_inr || p.salePrice || p.display_price || 0,
          currency: "INR",
          description: p.description || (p.desc ? p.desc : ""),
          thumbnail: p.image_url || (p.images && p.images[0]) || p.thumbnail || "",
          rating: p.rating || p.stars || 4.2,
          stock: p.stock || 25,
          link: p.product_url || p.url || "",
          category: p.category || params.category || "skincare",
          keywords: p.keywords || [],
          isLocalIN: true
        }));
      }
    }
    // Fallback on error
    throw new Error("Primary Indian API unavailable");
  } catch (e) {
    // --- FALLBACK: "Indianize" DummyJSON/mock ---
    const DUMMYJSON_URL = "https://dummyjson.com/products";
    let url = `${DUMMYJSON_URL}?limit=${params.limit || 12}`;
    if (params.category) url += `&category=${encodeURIComponent(params.category)}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      let products = Array.isArray(data.products) ? data.products : [];
      if (params.minRating) {
        products = products.filter((p) => p.rating >= params.minRating);
      }
      // "Convert" price to INR, localize names/brands a bit for demo
      return products.map((p, idx) => ({
        ...p,
        price: Math.round((p.price || 10) * 80 + 59), // USD to rough INR
        currency: "INR",
        brand: (p.brand + " India"),
        title: p.title.replace(/[\s]*-.*$/, "") + " (IN)",
        description: p.description,
        link: p.link || p.url || "",
        rating: p.rating,
        stock: p.stock,
        thumbnail: p.thumbnail,
        keywords: p.keywords || [],
        category: p.category || params.category || "skincare",
        isLocalIN: false
      }));
    } catch (err) {
      // Could log error
      return [];
    }
  }
};

/**
 * PUBLIC_INTERFACE
 * Fetch weather data using OpenWeatherMap for provided latitude and longitude.
 * Returns object: { temp, humidity, weatherMain, weatherDesc, icon, ... }
 */
export const fetchWeather = async (lat, lon) => {
  // Note: In production, move the API key to env file. For demo, hardcoding OK.
  const apiKey = "9a2339e93797b5eadbb4356bf9cc1b70"; // public demo key (replace with real for prod)
  if (typeof lat !== "number" || typeof lon !== "number") {
    return { error: "Missing coordinates" };
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error("Failed to fetch weather");
    }
    const data = await resp.json();
    // Extract key properties
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
    };
  } catch (e) {
    return { error: "Weather fetch failed" };
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
