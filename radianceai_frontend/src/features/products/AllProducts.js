import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ProductCard from "./ProductCard";
import "./ProductList.css"; // reuse layout styles

// PUBLIC_INTERFACE
/**
 * AllProducts
 * Fetches and displays all products from Supabase 'products' table.
 */
function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products when component mounts
  useEffect(() => {
    // IIFE for async fetch
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Query all products from 'products' table in Supabase
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="all-products-list container">
      <h2 className="title" style={{ marginBottom: 28 }}>All Products</h2>
      {loading && (
        <div className="subtitle" style={{ color: "#888", margin: "2rem 0" }}>
          Loading products...
        </div>
      )}
      {error && (
        <div
          style={{
            color: "#e74c3c",
            background: "#fff2f2",
            border: "1px solid #ffeaea",
            padding: "1rem",
            borderRadius: 10,
            margin: "1.5rem 0",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="subtitle" style={{ margin: "2rem 0", color: "#555" }}>
          No products found.
        </div>
      )}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id || product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

export default AllProducts;
