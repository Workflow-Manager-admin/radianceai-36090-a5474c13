/**
 * PUBLIC_INTERFACE
 * apiClient: sets up fetch calls for APIs.
 */

const DUMMYJSON_URL = "https://dummyjson.com/products";

/**
 * PUBLIC_INTERFACE
 * Fetch a list of recommended products from DummyJSON API.
 * Optionally filter based on quiz result mapping.
 * @param {Object} params (optional): e.g., { category, minRating, limit}
 * @returns {Promise<Array>} Product list
 */
export const fetchRecommendedProducts = async (params = {}) => {
  let url = `${DUMMYJSON_URL}?limit=${params.limit || 12}`;
  if (params.category) url += `&category=${encodeURIComponent(params.category)}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    let products = Array.isArray(data.products) ? data.products : [];
    // Optionally filter by minRating
    if (params.minRating) {
      products = products.filter((p) => p.rating >= params.minRating);
    }
    return products;
  } catch (e) {
    // Could log error
    return [];
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
 * Placeholder: sendEmail (e.g., via EmailJS)
 */
export const sendEmail = async (payload) => {
  // EmailJS/email integrations would go here.
  return true;
};
