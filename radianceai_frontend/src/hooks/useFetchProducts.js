import { useEffect, useState } from "react";
import supabase from "../api/supabaseClient";

// PUBLIC_INTERFACE
/**
 * React hook to fetch all products from Supabase and manage loading/error states.
 * @returns {Object} { products, loading, error }
 */
export function useFetchProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*");
      if (!isMounted) return;
      if (error) {
        setError(error.message || "Failed to fetch products.");
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return { products, loading, error };
}
