import { useState, useEffect } from "react";
import { fetchRecommendedProducts } from "../api/apiClient";

// PUBLIC_INTERFACE
/**
 * useProducts - Fetches and stores products with filters/caching.
 * Usage:
 *   const { products, loading, error, refresh } = useProducts({ category, minRating });
 */
function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIdx, setRefreshIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRecommendedProducts(params)
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
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [JSON.stringify(params), refreshIdx]);

  // PUBLIC_INTERFACE
  function refresh() {
    setRefreshIdx(idx => idx + 1);
  }

  return { products, loading, error, refresh };
}

export default useProducts;
