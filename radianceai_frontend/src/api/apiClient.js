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
 * Placeholder: fetchWeather from OpenWeatherMap or compatible API.
 */
export const fetchWeather = async (lat, lon) => {
  // Update with actual weather API integration
  return {};
};

/**
 * Placeholder: sendEmail (e.g., via EmailJS)
 */
export const sendEmail = async (payload) => {
  // EmailJS/email integrations would go here.
  return true;
};
