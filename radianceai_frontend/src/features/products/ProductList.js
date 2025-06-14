import React from "react";
import "./ProductList.css";
import ProductCard from "./ProductCard";
import useFetchProducts from "../../hooks/useFetchProducts";

/**
 * All Products Page at "/products".
 * Fetches ALL products from Supabase using the shared client
 * and displays product cards in a responsive grid. Handles loading and error states.
 *
 * This is the PUBLIC_INTERFACE for the full products page.
 */
// PUBLIC_INTERFACE
function ProductList() {
  const { products, loading, error } = useFetchProducts();

  if (loading) {
    return (
      <section className="product-list-section">
        <div className="products-loading-state" role="status" aria-live="polite">
          <span className="spinner" /> Loading products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-list-section">
        <div className="products-error-state" role="alert">
          <span style={{color: "#e04f8b", fontWeight:600}}>Failed to load products:</span>
          <pre style={{color:"#f339db", margin:0, fontSize:"90%"}}>
            {typeof error === "string" ? error : (error?.message || "Unknown error")}
          </pre>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="product-list-section">
        <div className="products-empty-state">
          <p>No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="product-list-section" aria-labelledby="all-products-heading">
      <h1 id="all-products-heading" className="products-title">All Products</h1>
      <div className="product-list-grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
