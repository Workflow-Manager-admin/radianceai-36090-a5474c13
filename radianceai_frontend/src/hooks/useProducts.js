import { useEffect, useState } from "react";

/**
 * Fetches all products from DummyJSON or RapidAPI, supports filters and recommendations.
 * Also, deduplicates product results and filters by rating/concerns/categories.
 *
 * Usage example:
 *   const { products, recommended } = useProducts({ concerns: [], categories: [], limit: 10, minRating: 4, deduplicate: true })
 */

// PUBLIC_INTERFACE
export function useProducts(options = {}) {
  // === Configurable options ===
  const {
    api = "dummyjson", // "dummyjson" | "rapidapi"
    concerns = [],
    categories = [],
    limit,
    minRating,
    deduplicate,
    region,
    filterBy,
    sortBy // e.g. "rating", "price", "category"
  } = options || {};

  // === State ===
  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Fetching logic ===
  // Dummy fetch function - in real app, replace with API/axios call
  async function fetchDummyProducts() {
    // This is a static local file, e.g. from /public or src/assets
    // In production use fetch("https://dummyjson.com/products") or RapidAPI endpoint
    try {
      let resp = await fetch("https://dummyjson.com/products?limit=100");
      let data = await resp.json();
      if (!data || !data.products) return [];
      return data.products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        brand: p.brand,
        category: p.category,
        rating: p.rating || 4.2,
        thumbnail: p.thumbnail,
        images: p.images,
        currency: p.currency || "USD",
        isLocalIN: region === "IN", // Demo: mark as local for Indian region
        link: p.link,
      }));
    } catch (e) {
      setError(e);
      return [];
    }
  }

  // PUBLIC_INTERFACE
  async function fetchProducts() {
    setLoading(true);
    setError(null);

    let list = [];
    if (api === "dummyjson") {
      list = await fetchDummyProducts();
    }
    // Future: add RapidAPI or other API logic
    // else if (api === "rapidapi") { ... }

    setProducts(list);
    setLoading(false);
    return list;
  }

  // Load products on first mount or if API/region changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [api, region]);

  // === Filtering & recommendation ===
  useEffect(() => {
    // No filtering? Just set all
    if (!Array.isArray(products)) return;
    let results = products.slice();

    // Filter by categories
    if (categories && categories.length > 0) {
      results = results.filter(p =>
        categories.some(cat =>
          (p.category || "").toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Filter by concerns (naive, should map concerns to ingredients/categories for real mapping)
    if (concerns && concerns.length > 0) {
      results = results.filter(p =>
        concerns.some(c =>
          (p.title || "").toLowerCase().includes(c.toLowerCase()) ||
          (p.description || "").toLowerCase().includes(c.toLowerCase())
        )
      );
    }

    if (minRating) {
      results = results.filter(p => Number(p.rating) >= minRating);
    }

    // Remove duplicates (by id or title+brand)
    if (deduplicate) {
      const seen = new Set();
      results = results.filter((p) => {
        const key = p.id || (p.title + p.brand);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // Sort
    if (sortBy) {
      if (sortBy === "rating") {
        results = results.sort((a, b) => b.rating - a.rating);
      }
      if (sortBy === "price") {
        results = results.sort((a, b) => a.price - b.price);
      }
    }

    // Apply any external filter callback
    if (typeof filterBy === "function") {
      results = results.filter(p => filterBy(p));
    }

    // Limit
    if (limit && results.length > limit) {
      results = results.slice(0, limit);
    }

    setRecommended(results);
  }, [products, concerns, categories, limit, minRating, deduplicate, filterBy, sortBy]);

  // PUBLIC_INTERFACE
  return {
    products,
    recommended,
    fetchProducts,
    loading,
    error
  };
}

// Support both named and default import for compatibility
export default useProducts;
