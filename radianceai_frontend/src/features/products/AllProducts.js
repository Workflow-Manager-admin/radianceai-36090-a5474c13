import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import "./ProductCard.css";

/**
 * AllProducts Component
 * Fetches all products from the Supabase 'products' table
 * and displays them in a modern, responsive grid.
 * - Shows loading and error states.
 * - Does NOT reference or modify productlist.js.
 * - Uses modern React practices (hooks, async/await).
 */

// PUBLIC_INTERFACE
function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch products from Supabase table 'products'
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(
          err?.message ||
            "Failed to load products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Render product cards
  const renderProductCard = (product, idx) => {
    // Use field keys for placeholder UI if table schema is unknown
    // Common assumed fields: id, name, price, image, description, brand, rating, etc.
    return (
      <div className="product-card" key={product.id || idx}>
        <div className="product-image-wrapper">
          <img
            className="product-image"
            src={product.image || "https://via.placeholder.com/240x240?text=No+Image"}
            alt={product.name || "Product"}
          />
        </div>
        <div className="product-details">
          <h3 className="product-title">{product.name || "Unnamed Product"}</h3>
          <div className="product-brand">
            {product.brand ? (
              <span>{product.brand}</span>
            ) : (
              <span className="product-placeholder">Brand unknown</span>
            )}
          </div>
          <div className="product-desc">
            {product.description || ""}
          </div>
          <div className="product-meta-row">
            <span className="product-price">
              {product.price !== undefined && product.price !== null
                ? `$${product.price}`
                : "No price"}
            </span>
            {product.rating && (
              <span className="product-rating">
                ★ {Number(product.rating).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="all-products-section" style={{padding: "32px 0 24px 0", minHeight: "60vh"}}>
      <h2 className="section-title" style={{marginBottom: "1.5rem", textAlign: "center"}}>All Products</h2>
      {loading && (
        <div className="products-loading" style={{textAlign: "center", padding: "2rem"}}>
          <span>Loading products…</span>
        </div>
      )}
      {error && (
        <div className="products-error" style={{color: "#c44", textAlign: "center", marginBottom: "1.5rem"}}>
          <strong>Error:</strong> {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="products-empty" style={{textAlign: "center", padding: "1rem"}}>
          No products found.
        </div>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="all-products-grid">
          {products.map(renderProductCard)}
        </div>
      )}
    </section>
  );
}

export default AllProducts;
