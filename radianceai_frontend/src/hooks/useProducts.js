import { useState, useEffect } from "react";
import { fetchRecommendedProducts } from "../api/apiClient";

/**
 * PUBLIC_INTERFACE
 * useProducts: fetches, filters, and returns a list of recommended skincare products.
 * Restricts to brands: DermaCo, Kiehl's (handles spelling/variant), Minimalist, Plum, Wow, FoxTale.
 * All flows/screens requiring product lists should use this hook for consistency.
 * @param {Object} opts - Options for fetching/filtering/skipping/limits, see apiClient.
 * @returns {Object} { recommended, loading }
 */
export function useProducts(opts = {}) {
  return useProductsImpl(opts);
}

function useProductsImpl(opts = {}) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  // Strictly allowed brands (across the app)
  const allowedBrands = [
    "DermaCo",
    "Kiehl's",
    "Minimalist",
    "Plum",
    "Wow",
    "FoxTale"
  ];

  // Kiehl's/FoxTale normalizer — catches spelling and apostrophe/case variations
  function normalizeBrand(brand) {
    if (!brand) return "";
    const str = ("" + brand).trim().toLowerCase().replace(/[’‘`´]/g, "'");
    if (
      str === "kiehl's" ||
      str === "kiehls" ||
      str === "kiehl’s" ||
      str === "kiehls'" ||
      str === "kiels"
    ) return "Kiehl's";
    if (str === "foxtale" || str === "fox tale") return "FoxTale";
    if (str === "the derma co" || str === "dermaco") return "DermaCo";
    if (str === "minimalist") return "Minimalist";
    if (str === "plum") return "Plum";
    if (str === "wow skin science" || str === "wow") return "Wow";
    return brand;
  }

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetchRecommendedProducts(opts)
      .then((arr) => {
        if (ignore) return;
        let out = Array.isArray(arr) ? arr : [];
        if (opts.minRating)
          out = out.filter((p) => Number(p.rating) >= opts.minRating);
        // Filter by allowed brands with normalization
        out = out.filter((p) =>
          allowedBrands.includes(normalizeBrand(p.brand))
        );
        // Optionally deduplicate by normalized title-brand combination
        if (opts.deduplicate) {
          const seen = new Set();
          out = out.filter((p) => {
            const key =
              (p.title || "") + "-" + (normalizeBrand(p.brand) || "");
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
        setRecommended(out);
        setLoading(false);
      })
      .catch(() => {
        setRecommended([]);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line
  }, [JSON.stringify(opts)]);

  return { recommended, loading };
}

export default useProductsImpl;
