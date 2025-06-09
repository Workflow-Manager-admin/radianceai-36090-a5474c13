import { useState, useEffect, useMemo } from "react";
import { fetchRecommendedProducts } from "../api/apiClient";

/**
 * PUBLIC_INTERFACE
 * useProducts - Fetches, stores, and filters products; supports brand-contextual data.
 *
 * @param {Object} params - The filter options:
 *   - category: (string) Filter products by category
 *   - minRating: (number) Minimum rating (default: 0)
 *   - limit: (number) Maximum number of products (default: 24)
 *   - brands: (string[]) List of brands to filter by (optional)
 * @returns {Object} {
 *   products: All fetched products (unfiltered by brands),
 *   filteredProducts: Products filtered by selected brands,
 *   loading: Boolean,
 *   error: String,
 *   availableBrands: [string],
 *   selectedBrands: [string],
 *   setSelectedBrands: fn,
 *   refresh: fn
 * }
 *
 * Usage:
 *  const { products, filteredProducts, availableBrands, selectedBrands, setSelectedBrands, loading, error, refresh } =
 *    useProducts({ category, minRating, limit, brands: [ ... ] });
 */
function useProducts(params = {}) {
  const {
    category,
    minRating = 0,
    limit = 24,
    brands = [],
  } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIdx, setRefreshIdx] = useState(0);

  // State for use in UI: brand selection for filtering
  const [selectedBrands, setSelectedBrands] = useState(brands);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRecommendedProducts({ category, minRating, limit })
      .then(results => {
        if (!cancelled) {
          setProducts(results || []);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    // When brands param changes (from outside), sync local state
    setSelectedBrands(brands);
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [category, minRating, limit, refreshIdx]);

  // List of unique brands from loaded products, for UI
  const availableBrands = useMemo(() => {
    const unique = {};
    products.forEach((p) => {
      if (p.brand) unique[p.brand] = true;
    });
    return Object.keys(unique).sort();
  }, [products]);

  // Products filtered by selectedBrands (if set)
  const filteredProducts = useMemo(() => {
    if (!selectedBrands || selectedBrands.length === 0) return products;
    return products.filter((p) => selectedBrands.includes(p.brand));
  }, [products, selectedBrands]);

  // PUBLIC_INTERFACE
  function refresh() {
    setRefreshIdx(idx => idx + 1);
  }

  return {
    products,
    filteredProducts,
    loading,
    error,
    availableBrands,
    selectedBrands,
    setSelectedBrands,
    refresh,
  };
}

export default useProducts;
