import { useEffect, useState } from "react";
import { fetchRecommendedProducts } from "../api/apiClient";

// PUBLIC_INTERFACE
/**
 * React hook for fetching recommended products (now powered by Supabase).
 * Provides { recommended, loading } for use in UI, accepts options.
 */
export default function useProducts(options) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchRecommendedProducts(options || {})
      .then((products) => {
        if (!ignore) setRecommended(products);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [JSON.stringify(options)]);

  return { recommended, loading };
}
