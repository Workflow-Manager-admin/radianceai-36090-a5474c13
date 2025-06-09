 /**
  * PUBLIC_INTERFACE
  * apiClient: sets up fetch calls for APIs.
  */
 
 /**
  * PUBLIC_INTERFACE
  * Fetch a list of recommended Indian skincare products (IN region, INR pricing)
  * Supports querying for multiple popular Indian brands and brand-based filtering.
  * @param {Object} params: e.g., { category, minRating, limit, brands }
  * @returns {Promise<Array>} Product list with INR price and metadata
  */
 export const fetchRecommendedProducts = async (params = {}) => {
   // --- MULTI-BRAND: Simulate fetching from several brands by aggregating multiple demo APIs. ---
   // Params: {category, minRating, limit, brands: ['Brand1', ...]}
   // In production, replace these with real brand-specific endpoints.
 
   // Example: Popular Indian brands (User-supplied or default selection)
   const popularIndianBrands = [
     "Mamaearth",
     "Minimalist",
     "Himalaya",
     "The Derma Co",
     "Plum",
     "Forest Essentials",
     "WOW Skin Science"
   ];
   // Use supplied brand filter if any, else use all
   const requestedBrands = Array.isArray(params.brands) && params.brands.length > 0
     ? params.brands
     : popularIndianBrands;
 
   // Simulate parallel fetches for each brand (replace with real APIs in prod)
   async function fetchBrandProducts(brand) {
     // DEMO: Try to filter for brand in Purplle, then fallback to DummyJSON with Indianization.
     // Build Purplle params (illustrative, not real API filter unless supported)
     const PURPLLE_API_URL =
       "https://apidojo-indiabestbuy-v1.p.rapidapi.com/skin-care/top?" +
       `limit=${params.limit || 7}` +
       (params.category ? `&cat=${encodeURIComponent(params.category)}` : "") +
       (brand ? `&brand=${encodeURIComponent(brand)}` : "");
 
     const purplleHeaders = {
       "X-RapidAPI-Key": "demo_key_for_public",
       "X-RapidAPI-Host": "apidojo-indiabestbuy-v1.p.rapidapi.com"
     };
 
     try {
       const resp = await fetch(PURPLLE_API_URL, { headers: purplleHeaders });
       if (resp.ok) {
         const data = await resp.json();
         if (Array.isArray(data.products)) {
           let products = data.products;
           if (params.minRating) {
             products = products.filter((p) => (p.rating || 4) >= params.minRating);
           }
           // Only products matching brand (if possible)
           products = products.filter((p) =>
             (p.brand || p.brand_name || "").toLowerCase().includes(brand.toLowerCase())
           );
           return products.map((p, idx) => ({
             id: p.id || p.product_id || `${brand}-${idx}`,
             title: p.name || p.title || "",
             brand: p.brand || p.brand_name || brand,
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
       throw new Error("Brand API unavailable");
     } catch (e) {
       // --- FALLBACK: DummyJSON, filter/mock to desired brand.
       const DUMMYJSON_URL = "https://dummyjson.com/products";
       let url = `${DUMMYJSON_URL}?limit=${params.limit || 7}`;
       if (params.category) url += `&category=${encodeURIComponent(params.category)}`;
       try {
         const resp = await fetch(url);
         const data = await resp.json();
         let products = Array.isArray(data.products) ? data.products : [];
         if (params.minRating) {
           products = products.filter((p) => p.rating >= params.minRating);
         }
         // Simulate the brand by overwriting
         return products
           .map((p, idx) => ({
             ...p,
             id: `${brand}-${p.id || idx}`,
             price: Math.round((p.price || 10) * 80 + 59),
             currency: "INR",
             brand: brand,
             title: `[${brand}] ` + (p.title.replace(/[\\s]*-.*$/, "") + " (IN)"),
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
         return [];
       }
     }
   }
 
   // Fetch for each brand and aggregate
   let all = [];
   for (const brand of requestedBrands) {
     try {
       // eslint-disable-next-line no-await-in-loop
       const bResults = await fetchBrandProducts(brand);
       all = all.concat(bResults || []);
     } catch {
       // Continue if error for one brand
     }
   }
 
   // Dedupe products by id, favoring latest loaded brand
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
 
