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

  // Simulate parallel fetches for each brand (replace with real APIs in prod)
  async function fetchBrandProducts(brand) {
    // For demo: always return only things with one of the allowed brand names
    const minRating = typeof params.minRating === "number" ? params.minRating : 0;
    const limit = typeof params.limit === "number" ? params.limit : 7;
    // Use DummyJSON as backend for fallback. No real 3rd party API at present.
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
        .map((p, idx) => ({
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
          thumbnail: p.thumbnail,
          keywords: p.keywords || [],
          category: p.category || params.category || "skincare",
          isLocalIN: true
        }))
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
