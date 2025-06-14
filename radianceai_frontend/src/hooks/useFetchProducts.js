import { useEffect, useState } from "react";
import supabase from "../api/supabaseClient";

/**
 * PUBLIC_INTERFACE
 * React hook to fetch all products from Supabase.
 * 
 * Returns:
 * { products, loading, error }
 */
export default function useFetchProducts() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("products")
        .select("*");
      if (isMounted) {
        if (error) {
          setError(error);
          setProducts(null);
        } else {
          setProducts(data || []);
        }
        setLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return { products, loading, error };
}
